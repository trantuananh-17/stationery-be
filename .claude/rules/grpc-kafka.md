# gRPC · Kafka · WebSocket

---

## gRPC

### Cấu hình sinh tự động

`libs/configuration/src/lib/grpc.config.ts` là nơi duy nhất khai địa chỉ service:

```ts
export enum GRPC_SERVICES {
  AUTH_SERVICE = 'GRPC_AUTH_SERVICE',
  // ... USER, ORDER, CART, PRODUCT, PAYMENT, NOTIFICATION, ANALYTICS
}

const GRPC_SERVICE_CONFIG = {
  PRODUCT_SERVICE: {
    proto: './proto/product.proto',
    hostEnv: 'PRODUCT_SERVICE_HOST',
    portEnv: 'PRODUCT_SERVICE_PORT',
  },
};
```

Constructor duyệt map này và dựng `url = ${env[hostEnv] ?? 'localhost'}:${env[portEnv]}`, `package = ` giá trị enum.

**Hệ quả quan trọng:** cùng một tên biến env (`PRODUCT_SERVICE_PORT`) được đọc ở *cả* app gọi lẫn app bị gọi. Hai `.env` khai lệch nhau ⇒ connect refused. Đây chính là lỗi payment `5008` vs `5009`.

Thêm service mới cần sửa 3 chỗ trong file này: enum `GRPC_SERVICES`, map `GRPC_SERVICE_CONFIG`, và property của `class GrpcConfiguration` (class hiện thiếu 3 property `PAYMENT`/`NOTIFICATION`/`ANALYTICS` — vẫn chạy vì gán động, nhưng nên bổ sung khi đụng tới).

### Phía server (microservice) — `main.ts`

```ts
const grpcPackage  = configService.get<string>('GRPC_SERV.GRPC_PRODUCT_SERVICE.name');
const grpcProtoPath = configService.get<string>('GRPC_SERV.GRPC_PRODUCT_SERVICE.options.protoPath');
const grpcUrl      = configService.get<string>('GRPC_SERV.GRPC_PRODUCT_SERVICE.options.url');

app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.GRPC,
  options: { package: grpcPackage, protoPath: grpcProtoPath, url: grpcUrl },
});
await app.startAllMicroservices();
await app.listen(port);       // service vẫn có HTTP server riêng (Swagger + health)
```

Prefix config luôn là `GRPC_SERV.` — do `src/configuration/index.ts` của mỗi app gắn key đó.

### Phía client (BFF)

```ts
// <domain>-infra.module.ts
ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.PRODUCT_SERVICE)])
```

```ts
// <domain>-grpc.adapter.ts
@Injectable()
export class ProductGrpcAdapter implements ProductPort, OnModuleInit {
  private client: ProductGrpcInterface;
  constructor(@Inject(GRPC_SERVICES.PRODUCT_SERVICE) private readonly grpc: ClientGrpc) {}
  onModuleInit() {
    this.client = this.grpc.getService<ProductGrpcInterface>('GRPC_PRODUCT_SERVICE');
  }
}
```

Method trên client là **camelCase** của rpc trong proto. `getService<T>()` nhận **tên service trong proto**.

gRPC trả `Observable` — dùng `firstValueFrom()` để chuyển sang Promise.

### Quy tắc proto

- Một file mỗi domain: `libs/interfaces/src/lib/proto/<domain>/<domain>.proto`
- Field number **không bao giờ tái sử dụng** khi xoá field
- Field không khai trong message sẽ bị **bỏ im lặng** — response thiếu field thường là do quên khai proto, không phải lỗi mapping
- proto3: mọi field đều optional, không phân biệt "không gửi" với "gửi giá trị zero" (`0`, `""`, `false`). Cần phân biệt thì bọc `google.protobuf.*Value` hoặc dùng field `has_*`

---

## Kafka

Dùng cho việc bất đồng bộ: saga đặt hàng, thông báo, ghi nhận analytics.

### Đăng ký consumer — `main.ts`

```ts
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.KAFKA,
  options: {
    client: { clientId: 'product-service', brokers: [configService.getOrThrow('KAFKA_CONFIG.URL')] },
    consumer: { groupId: QUEUE_GROUPS.PRODUCT, allowAutoTopicCreation: true },
  },
});
```

`groupId` lấy từ `@common/constants/enums/queue.enum` → `QUEUE_GROUPS` (`MAIL`, `ORDER`, `PRODUCT`, `USER`, `NOTIFICATION`, `ANALYTICS`, `CART`). **Không hardcode chuỗi** — hai service trùng groupId sẽ chia nhau message và mỗi bên chỉ nhận một nửa.

### Consume

```ts
@EventPattern('order.created')
async handleOrderCreated(@Payload() payload: OrderCreatedEvent) {
  await this.commandBus.execute(new ReserveStockCommand(payload));
}
```

`@EventPattern` = fire-and-forget (không phản hồi). `@MessagePattern` = request/response — trong repo này hầu như chỉ dùng `@EventPattern`; đồng bộ thì đã có gRPC.

### Publish

Publisher đi qua port, xem mẫu: `apps/bff/.../webhook/application/port/event-publisher.port.ts` + `infrastructure/kafka/kafka-order-event-publisher.ts`.

### Idempotency — bắt buộc

Kafka đảm bảo **at-least-once**: handler sẽ bị gọi lại. `product-service` xử lý bằng bảng process-event:
- `application/ports/repositories/process-event.repo.ts`
- `infrastructure/entities/typeorm-process-event.entity.ts`

Handler event mới **phải** kiểm tra event đã xử lý chưa trước khi tác động tồn kho. Xem `commands/products/reserve-stock/reserve-stock.handler.ts` và các handler `confirm-stock-event`, `cancel-stock-event`, `return-stock-event`.

### Saga tồn kho

```
order.created  → reserve-stock   (giữ hàng)
payment ok     → confirm-stock   (trừ thật)
payment fail   → cancel-stock    (nhả giữ)
order returned → return-stock    (hoàn kho)
```
Thêm bước mới vào saga phải bổ sung cả nhánh bù trừ, nếu không tồn kho sẽ lệch vĩnh viễn.

---

## WebSocket

Chỉ có ở `notification-service`:
`src/app/modules/infrastructure/websocket/gateways/notification.gateway.ts`

```ts
@WebSocketGateway({ namespace: '/notifications', cors: { origin: '*' } })
```

- Gắn vào HTTP server của service ⇒ port **3406**
- Client emit `notification.join` với `{ receiverId }` → server `client.join(receiverId)`
- Server phát `notification.created` vào room `receiverId`

⚠️ FE đang trỏ `localhost:3411` và service không được expose trong docker-compose — xem `../.claude/rules/known-issues.md` mục D.
