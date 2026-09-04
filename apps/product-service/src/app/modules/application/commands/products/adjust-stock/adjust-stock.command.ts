import { ICommand } from '@nestjs/cqrs';

export class AdjustStockCommand implements ICommand {
  constructor(
    public readonly variantId: string,
    /** Số tồn kho mới (tuyệt đối), không phải mức chênh lệch. */
    public readonly stock: number,
  ) {}
}
