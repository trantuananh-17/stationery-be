# Công thức: thêm một endpoint mới

Ví dụ xuyên suốt: thêm `GET /api/v1/products/:id/reviews`.

Một endpoint đi qua **9 file** ở 2 app. Thiếu file nào cũng chỉ lỗi lúc runtime, không lỗi lúc compile — vì gRPC không type-check chéo app.

---

## Bước 1 — Proto (hợp đồng)

`libs/interfaces/src/lib/proto/product/product.proto`

```proto
service GRPC_PRODUCT_SERVICE {
  rpc GetProductReviews (GetProductReviewsRequest) returns (GetProductReviewsResponse);
}

message GetProductReviewsRequest {
  string id = 1;
  int32 page = 2;
  int32 limit = 3;
}
```

Tên `service` phải trùng giá trị enum trong `libs/configuration/src/lib/grpc.config.ts` (`GRPC_SERVICES.PRODUCT_SERVICE = 'GRPC_PRODUCT_SERVICE'`).

`.proto` được webpack copy vào `dist/apps/<app>/proto/` — nếu đổi vị trí file phải kiểm tra `webpack.config.js` của app.

---

## Bước 2-5 — Microservice (`apps/product-service`)

**2. Port** — `application/ports/repositories/product-query.repo.ts`
```ts
abstract findReviews(id: string, page: number, limit: number): Promise<ReviewReadModel[]>;
```

**3. Read-model** — `application/read-models/review.read-model.ts`

**4. Query + handler** — `application/queries/get-reviews/`
```ts
// get-reviews.query.ts
export class GetReviewsQuery {
  constructor(readonly id: string, readonly page: number, readonly limit: number) {}
}

// get-reviews.handler.ts
@QueryHandler(GetReviewsQuery)
export class GetReviewsHandler implements IQueryHandler<GetReviewsQuery> {
  constructor(private readonly repo: ProductQueryRepository) {}
  execute(q: GetReviewsQuery) { return this.repo.findReviews(q.id, q.page, q.limit); }
}
```
→ Đăng ký handler vào `providers` của `product.module.ts`.

**5. Adapter repo** — `infrastructure/repositories/typeorm-product-query.repo.ts`: implement `findReviews`.

**6. Controller gRPC** — `presentation/controllers/product.controller.ts`
```ts
@GrpcMethod('GRPC_PRODUCT_SERVICE', 'GetProductReviews')
getReviews(data: GetProductReviewsRequest) {
  return this.queryBus.execute(new GetReviewsQuery(data.id, data.page, data.limit));
}
```
Chuỗi `'GetProductReviews'` phải khớp **chính xác** tên rpc trong proto (PascalCase).

---

## Bước 7-9 — BFF (`apps/bff`)

**7. gRPC interface + adapter** — `modules/products/infrastructure/grpc/`
```ts
// product-grpc.interface.ts
getProductReviews(data: { id: string; page: number; limit: number }): Observable<...>;

// product-grpc.adapter.ts — implements ProductPort
getReviews(input: GetReviewsInput) {
  return firstValueFrom(this.client.getProductReviews(input));
}
```
Tên method trên client là **camelCase** của rpc (`GetProductReviews` → `getProductReviews`). Sai chỗ này là lỗi hay gặp nhất.

**8. Port + use case** — `modules/products/application/`
- `ports/product.port.ts`: thêm `abstract getReviews(...)`
- `get-product-reviews.usecase.ts`: gọi port, map DTO

**9. DTO + controller** — `modules/products/presentation/`
```ts
// dtos/get-reviews.dto.ts
export class GetReviewsQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;
}

// controllers/product.controller.ts
@Get(':id/reviews')
@ApiOperation({ summary: 'Get product reviews' })
@ApiOkResponse({ type: ResponseDto<ReviewsResponseDto> })
@HttpCode(HttpStatus.OK)
getReviews(@Param('id') id: string, @Query() query: GetReviewsQueryDto) {
  return this.getProductReviews.execute({ id, ...query });
}
```

Trả payload **trần** — `ExceptionInterceptor` tự bọc envelope.

Route cần quyền thì thêm guard (không có global guard):
```ts
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles([ROLE.ADMIN])
@ApiBearerAuth()
```

---

## Bước 10 — Frontend (nếu FE sẽ dùng)

Sang `../stationery-fe`, xem `.claude/rules/recipes.md` ở repo đó: thêm type → service → hook/component.

---

## Bẫy hay gặp

| Triệu chứng | Nguyên nhân |
|---|---|
| `Cannot find handler for query` | quên đăng ký handler vào `providers` của module |
| `client.xxx is not a function` | tên method adapter không phải camelCase của rpc trong proto |
| `12 UNIMPLEMENTED` | tên rpc trong `@GrpcMethod` không khớp proto, hoặc service name sai |
| `14 UNAVAILABLE` | sai `<SERVICE>_HOST` / `<SERVICE>_PORT` trong `.env` (xem lỗi payment 5008/5009) |
| Query param luôn `undefined` | thiếu `@Type(() => Number)` — `ValidationPipe({ transform: true })` cần nó để ép kiểu |
| Response thiếu field | quên khai field trong `.proto` — gRPC im lặng bỏ field không khai |
| Build lỗi lạ sau khi sửa proto | `pnpm nx:reset` rồi build lại |

---

## Route mới cần guard gì?

| Đối tượng | Guard |
|---|---|
| Ai cũng xem được (danh sách/chi tiết sản phẩm) | không guard |
| Guest lẫn user đều dùng (giỏ hàng) | `OptionalJwtAuthGuard` |
| Bắt buộc đăng nhập | `JwtAuthGuard` |
| Chỉ admin | `JwtAuthGuard, RoleGuard` + `@Roles([ROLE.ADMIN])` |
| Chỉ chủ sở hữu tài nguyên | `JwtAuthGuard, OwnerGuard` |
| Theo permission chi tiết | `PermissionGuard` + `@Permission(...)` |

Mặc định cho route admin mới là **`JwtAuthGuard, RoleGuard` + `@Roles([ROLE.ADMIN])`**. Nếu thấy route admin cũ không có guard thì đó là bug đã ghi nhận, không phải quy ước — xem `../.claude/rules/known-issues.md` mục A.
