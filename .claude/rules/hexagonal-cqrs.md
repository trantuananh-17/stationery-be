# Hexagonal + CQRS — quy tắc tầng

Đọc khi viết code trong `apps/*/src/app/modules/`.

---

## Chiều phụ thuộc — không được vi phạm

```
presentation  →  application  →  domain
                      ↑
              infrastructure
```

- `domain/` **không import gì cả** ngoài TypeScript thuần. Không NestJS, không TypeORM, không gRPC, không class-validator.
- `application/` chỉ import `domain/` và các **port** của chính nó. Không import `infrastructure/`.
- `infrastructure/` implement port của `application/`. Là nơi duy nhất biết TypeORM, S3, Stripe, Kafka.
- `presentation/` chỉ gọi vào `application/` (qua CommandBus/QueryBus hoặc use case). Không gọi thẳng repository.

Nếu phải import ngược chiều ⇒ đang thiếu một port.

---

## Port và adapter

Port là **abstract class**, không phải interface — để dùng làm DI token của Nest.

```ts
// application/ports/repositories/product-query.repo.ts
export abstract class ProductQueryRepository {
  abstract findBySlug(slug: string): Promise<ProductReadModel | null>;
}
```

```ts
// infrastructure/product-infra.module.ts
providers: [
  { provide: ProductQueryRepository, useClass: TypeormProductQueryRepository },
]
```

Handler inject bằng chính abstract class:
```ts
constructor(private readonly repo: ProductQueryRepository) {}
```

Đọc port có sẵn trước khi tạo mới — `application/ports/` thường đã có cái cần dùng.

---

## Command vs Query — không trộn

| | Command | Query |
|---|---|---|
| Thư mục | `application/commands/<aggregate>/<action>/` | `application/queries/<action>/` |
| File | `<action>.command.ts` + `<action>.handler.ts` | `<action>.query.ts` + `<action>.handler.ts` |
| Decorator | `@CommandHandler(XCommand)` | `@QueryHandler(XQuery)` |
| Repository | `*-command.repo.ts` | `*-query.repo.ts` |
| Trả về | id / void / kết quả tối thiểu | **read-model** (`application/read-models/`) |
| Transaction | qua `UnitOfWork` port | không |

Command handler **không** được trả về read-model. Query handler **không** được ghi.

Read-model là type phẳng phục vụ đúng một màn hình — không phải domain entity. Xem `application/read-models/product.read-model.ts`, `product-info.read-model.ts`, `product-item.read.model.ts`.

---

## Transaction

Ghi nhiều bảng ⇒ bọc bằng `UnitOfWork` (`application/ports/services/unit-of-work.port.ts`, impl `infrastructure/services/unit-of-work.service.ts`).

Repository trong transaction lấy `EntityManager` qua `infrastructure/helpers/get-manager.helper.ts` (hoặc `@common/utils/get-manager.util`), không tự `getRepository()`.

---

## Hai loại entity

```
domain/entities/product.entity.ts               # quy tắc nghiệp vụ, không decorator
infrastructure/entities/typeorm-product.entity.ts  # @Entity(), @Column(), quan hệ DB
```

Repository là nơi map giữa hai loại. **Đừng cho typeorm entity rò lên application/ hay presentation/.**

TypeORM entity kế thừa `BaseEntity` từ `@common/databases/base.entity`.

---

## Domain error

Ném lỗi từ `domain/errors/` (kế thừa `base.error.ts`), không ném `HttpException` trong domain/application.

`presentation/filters/<domain>.filter.ts` map domain error → gRPC status. Thêm loại lỗi mới ⇒ nhớ thêm case vào filter, nếu không client chỉ nhận `INTERNAL`.

---

## Đăng ký module

Command/query handler phải có mặt trong `providers` của module, nếu không CQRS bus không tìm ra handler và lỗi chỉ xuất hiện lúc **runtime**:

```ts
// <domain>.module.ts
@Module({
  imports: [CqrsModule, ProductInfraModule],
  controllers: [ProductController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
```

Đây là lỗi hay quên nhất khi thêm handler mới.

---

## Checklist trước khi coi là xong

- [ ] `domain/` không import framework
- [ ] Port mới có adapter tương ứng và đã `provide` trong infra module
- [ ] Handler mới đã nằm trong `providers` của module
- [ ] Command không trả read-model, query không ghi
- [ ] Ghi nhiều bảng đã bọc `UnitOfWork`
- [ ] Domain error mới đã map trong filter
- [ ] Nếu thay đổi hình dạng dữ liệu ra ngoài: đã cập nhật `.proto` + adapter BFF + `../stationery-fe`
