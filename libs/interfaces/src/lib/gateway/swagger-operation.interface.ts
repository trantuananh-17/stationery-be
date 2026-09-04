/**
 * Shape của operation mà swagger-ui truyền vào `operationsSorter`.
 * swagger-ui dùng immutable.js nên chỉ đọc được qua `get(key)`.
 */
export interface SwaggerOperation {
  get(key: string): string;
}
