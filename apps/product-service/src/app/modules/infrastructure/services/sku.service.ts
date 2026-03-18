import { randomBytes } from 'crypto';
import { ISkuService } from '../../application/ports/services/sku.port';

export class SkuService implements ISkuService {
  async generateVariantSku(input: {
    productSlug: string;
    attributeValueSlugs?: string[];
  }): Promise<string> {
    const productCode = input.productSlug.replace(/-/g, '').slice(0, 3).toUpperCase();

    const attrCode = (input.attributeValueSlugs || [])
      .map((s) => s.replace(/-/g, '').slice(0, 2).toUpperCase())
      .join('');

    const random = randomBytes(3).toString('hex').toUpperCase();

    return attrCode ? `${productCode}-${attrCode}-VAR-${random}` : `${productCode}-VAR-${random}`;
  }
}
