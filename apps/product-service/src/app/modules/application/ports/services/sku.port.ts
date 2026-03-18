export abstract class ISkuService {
  abstract generateVariantSku(input: {
    productSlug: string;
    attributeValueSlugs?: string[];
  }): Promise<string>;
}
