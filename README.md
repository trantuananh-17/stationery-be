# Dự án Microservices Monorepo

## Giới thiệu dự án

Dự án được tổ chức theo mô hình **Nx monorepo**, trong đó mỗi service được đặt trong thư mục `apps/`, còn các module dùng chung được tách riêng trong `libs/`.

Cách tổ chức này giúp hệ thống dễ mở rộng, dễ bảo trì và phù hợp với kiến trúc microservices.

## Công nghệ sử dụng

- **Nx Monorepo**: Quản lý nhiều ứng dụng và thư viện trong cùng một repository.
- **pnpm**: Quản lý package và workspace.
- **Docker / Docker Compose**: Hỗ trợ khởi chạy các service hạ tầng.
- **Kafka**: Xử lý giao tiếp bất đồng bộ giữa các service.
- **PostgreSQL**: Cơ sở dữ liệu chính.
- **pgAdmin**: Công cụ quản trị PostgreSQL.

## Chức năng chính

- Xác thực người dùng: đăng ký, đăng nhập, quản lý token.
- Quản lý người dùng.
- Quản lý sản phẩm, danh mục và tồn kho.
- Quản lý giỏ hàng.
- Quản lý đơn hàng.
- Xử lý thanh toán.
- Gửi và quản lý thông báo.
- Thống kê, phân tích dữ liệu.
- Upload và lưu trữ tệp.
- Hỗ trợ AI, chatbot và tư vấn sản phẩm.

## Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone https://github.com/trantuananh-17/stationery-be.git
cd stationery-be
```

### 2. Cấu hình biến môi trường

Tạo các file `.env` theo mẫu `.env.example` cho root project và các service cần thiết.

Ví dụ:

```bash
cp .env.example .env
```

Với từng service, tạo file `.env` tương ứng dựa trên file `.env.example` nếu có.

### 3. Cài đặt thư viện

```bash
pnpm install
```

## Cách chạy project

### Cách 1: Chạy hạ tầng bằng Docker, sau đó chạy các service bằng Nx

Khởi chạy các service hạ tầng:

```bash
docker compose -f docker/docker-compose.provider.yaml up -d kafka postgresql pgadmin
```

Sau khi Kafka, PostgreSQL và pgAdmin đã chạy, khởi chạy các service trong project:

```bash
pnpm nx:run-many
```

### Cách 2: Chạy bằng Docker

Sau khi cấu hình đầy đủ các file `.env`, chạy lệnh:

```bash
pnpm docker:up:provider
```

## Cấu trúc thư mục

```bash
.
├── apps/                         # Chứa các ứng dụng và microservices chính
│   ├── bff/                      # Backend For Frontend, xử lý API trung gian cho frontend
│   ├── auth-service/             # Dịch vụ xác thực, đăng nhập, đăng ký, token
│   ├── user-service/             # Dịch vụ quản lý thông tin người dùng
│   ├── product-service/          # Dịch vụ quản lý sản phẩm, danh mục, tồn kho
│   ├── cart-service/             # Dịch vụ quản lý giỏ hàng
│   ├── order-service/            # Dịch vụ quản lý đơn hàng
│   ├── payment-service/          # Dịch vụ xử lý thanh toán
│   ├── notification-service/     # Dịch vụ thông báo
│   ├── analytics-service/        # Dịch vụ thống kê và phân tích dữ liệu
│   ├── upload-service/           # Dịch vụ upload và lưu trữ tệp
│   └── ai-service/               # Dịch vụ AI, chatbot và tư vấn sản phẩm
│
├── libs/                         # Các thư viện dùng chung trong toàn hệ thống
│   ├── configuration/            # Cấu hình dùng chung
│   ├── databases/                # Cấu hình và kết nối cơ sở dữ liệu
│   ├── guards/                   # Guard bảo vệ route/API
│   ├── filters/                  # Bộ lọc xử lý exception
│   ├── interceptors/             # Interceptor dùng chung
│   ├── kafka/                    # Cấu hình và xử lý Kafka
│   ├── constants/                # Hằng số dùng chung
│   ├── interfaces/               # Interface dùng chung
│   └── utils/                    # Các hàm tiện ích
│
├── docker/                       # Cấu hình Docker và docker-compose
├── uploads/                      # Thư mục lưu trữ tệp upload
├── .github/workflows/            # Cấu hình CI/CD
├── .husky/                       # Git hooks kiểm tra commit
├── package.json                  # Thông tin package và scripts
├── pnpm-workspace.yaml           # Cấu hình workspace cho pnpm
├── nx.json                       # Cấu hình Nx monorepo
└── tsconfig.base.json            # Cấu hình TypeScript dùng chung
```
