# stationery-be

Nx 22 monorepo · NestJS 11 · pnpm · TypeScript 5.9 · Node 20

BFF là **cổng HTTP public duy nhất**. Tất cả microservice phía sau nói chuyện bằng gRPC (đồng bộ) và Kafka (bất đồng bộ).

> Repo song song: `../stationery-fe`. Chỉ mở nó khi đổi hợp đồng API — xem `../.claude/rules/cross-repo-workflow.md`.

---

## Bản đồ workspace

```
apps/
  bff/                  :3400  — API gateway, Swagger, Stripe webhook
  auth-service/         :3401  gRPC :5001  — login/register/refresh
  user-service/         :3402  gRPC :5002  — profile, danh sách user
  product-service/      :3403  gRPC :5003  — sản phẩm, tồn kho (mẫu chuẩn nhất)
  cart-service/         :3404  gRPC :5004  — giỏ hàng (guest + user)
  order-service/        :3405  gRPC :5005  — đơn hàng, saga
  notification-service/ :3406  gRPC :5006  — thông báo + WebSocket
  analytics-service/    :3407  gRPC :5007  — báo cáo doanh thu
  upload-service/       :3408         — upload S3 (FE gọi thẳng)
  payment-service/      :3409  gRPC :5009  — Stripe
  ai-service/           :3413         — RAG chatbot (LangChain + OpenRouter, vector store Qdrant)

libs/                   # dùng chung, import qua alias @common/*
  configuration constants databases decorators filters
  guards interceptors interfaces kafka middlewares utils
```

`libs/interfaces/src/lib/proto/` chứa **toàn bộ file `.proto`** — nguồn sự thật cho hợp đồng gRPC.

---

## Lệnh

```powershell
pnpm install                 # ⚠️ node_modules hiện CHƯA được cài
pnpm docker:up:provider      # Postgres + Mongo + Kafka + Qdrant + Ollama + pgAdmin
pnpm dev                     # nx run-many -t serve — tất cả service
pnpm dev-lite                # bff,auth,user,cart,product,order,payment
pnpm dev-user                # bff,auth,user
pnpm dev-product             # product,upload
pnpm dev-order               # cart,order,payment
pnpm dev-system              # notification,analytics,ai

nx serve bff                 # một service
nx lint bff                  # lint phạm vi hẹp
nx test product-service
nx build bff
nx run product-service:seed  # seed brand/category/attribute từ src/seeds/
nx run user-service:seed
pnpm nx:reset                # xoá cache Nx khi build lỗi lạ
```

Swagger: `http://localhost:3400/api/v1/docs` · pgAdmin: `http://localhost:5050`

---

## Kiến trúc — hai khuôn mẫu khác nhau

### BFF: Hexagonal, **không** CQRS, **không** chạm DB

```
apps/bff/src/app/modules/<domain>/
  <domain>.module.ts
  application/
    <action>.usecase.ts          # 1 hành động = 1 use case
    ports/<domain>.port.ts       # abstract class
    ports/dtos/<domain>.dto.ts
  infrastructure/
    <domain>-infra.module.ts
    grpc/<domain>-grpc.adapter.ts     # implements port
    grpc/<domain>-grpc.interface.ts
  presentation/
    controllers/<domain>.controller.ts
    dtos/<action>.dto.ts              # class-validator + @ApiProperty
```

BFF chỉ làm: validate DTO → gọi use case → use case gọi port → adapter gọi gRPC → map về DTO response.

### Microservice: Hexagonal + CQRS (`@nestjs/cqrs`)

Copy cấu trúc từ `apps/product-service` khi tạo module mới.

```
src/app/modules/
  domain/          entities/ enum/ errors/     # thuần TS, KHÔNG NestJS/TypeORM
  application/
    commands/<aggregate>/<action>/<action>.command.ts + .handler.ts
    queries/<action>/<action>.query.ts + .handler.ts
    read-models/<x>.read-model.ts
    ports/repositories/<x>-query.repo.ts | <x>-command.repo.ts
    ports/services/<x>.port.ts
  infrastructure/
    entities/typeorm-<x>.entity.ts             # schema DB
    repositories/typeorm-<x>-*.repo.ts
    services/*.service.ts
  presentation/
    controllers/<domain>.controller.ts         # @GrpcMethod / @EventPattern
    dtos/ filters/
```

**Bất biến của tầng:**
- `domain/` không import gì từ NestJS, TypeORM, gRPC
- Ghi đi qua `commands/` + `*-command.repo.ts` + `UnitOfWork`; đọc đi qua `queries/` + `*-query.repo.ts` và trả **read-model**
- `domain/entities/*.entity.ts` ≠ `infrastructure/entities/typeorm-*.entity.ts` — hai thứ khác nhau, đừng gộp
- Handler không tự khởi tạo repository — inject qua port token

Chi tiết + hướng dẫn thêm endpoint: đọc `.claude/rules/` trong repo này.

---

## Quy ước bắt buộc

**Import lib dùng chung** qua alias, không dùng đường dẫn tương đối ra ngoài app:
```ts
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { ROLE } from '@common/constants/enums/role.enum';
```
Alias khai ở `tsconfig.base.json`. Thêm lib mới ⇒ thêm path ở đó.

**Response**: controller/use case trả payload **trần**. `ExceptionInterceptor` (đăng ký `APP_INTERCEPTOR` ở `apps/bff/src/app/app.module.ts`) tự bọc thành `{ message, statusCode, data, processID, duration }`. Không tự `new ResponseDto()` để trả về.

**Guard** — không có global guard, phải khai từng route:
```ts
@UseGuards(JwtAuthGuard)                      // cần đăng nhập
@UseGuards(OptionalJwtAuthGuard)              // guest vẫn dùng được (giỏ hàng)
@UseGuards(JwtAuthGuard, RoleGuard)           // + @Roles([ROLE.ADMIN])
@Roles([ROLE.ADMIN])
```
Mẫu đúng: `modules/orders/presentation/controllers/order.controller.ts:103`.

**Swagger**: mọi route public đều cần `@ApiTags`, `@ApiOperation`, `@ApiOkResponse`; route cần token thêm `@ApiBearerAuth()`.

**Config**: đọc qua `ConfigService`, không dùng `process.env` trực tiếp trong business code. Mỗi app có `src/configuration/index.ts` gom config; `ConfigModule.forRoot({ envFilePath: ['apps/<app>/.env'] })`.

**Đặt tên file**: `*.controller.ts` `*.module.ts` `*.usecase.ts` `*.port.ts` `*.adapter.ts` `*.command.ts` `*.query.ts` `*.handler.ts` `*.entity.ts` `*.repo.ts` `*.dto.ts` — kebab-case.

**TypeScript**: không `any`. Bật `emitDecoratorMetadata` + `experimentalDecorators`; DTO phải là `class` (không phải `interface`) để `class-validator` chạy được.

Prettier: `singleQuote`, `trailingComma: "all"`, `printWidth: 100`, `tabWidth: 2`.

---

## Cảnh báo

- **Không sửa `apps/*/.env` và `.env`** trừ khi được yêu cầu — đều bị gitignore và chứa secret thật.
- **Không đổi tên file sai chính tả** (`notifcation-grpc.adapter.ts`, `typorm-category-query.repo.ts`, `typeorm-specification.enity.ts`, `get-fetured.dto.ts`) — import đang trỏ đúng tên đó.
- **BFF không có tầng repository.** Nếu định viết SQL trong BFF thì đang sai chỗ.
- Sửa `.proto` là đổi hợp đồng ⇒ phải sửa **cả** adapter phía BFF lẫn controller phía service, và kiểm tra `../stationery-fe/services/`.
- Trước khi debug, đọc `../.claude/rules/known-issues.md` — có sẵn danh sách lỗi đã biết (thiếu guard admin, lệch cổng payment 5008/5009, WebSocket sai cổng).
