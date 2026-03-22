import { Injectable } from '@nestjs/common';
import { ISlugService } from '../../application/ports/services/slug.port';
import { IProductCommandRepository } from '../../application/ports/repositories/product-command.repo';

@Injectable()
export class SlugService implements ISlugService {
  constructor(private readonly repo: IProductCommandRepository) {}

  async generate(name: string): Promise<string> {
    const baseSlug = this.slugify(name);

    const maxSlug = await this.repo.findMaxSlug(baseSlug);

    if (!maxSlug) return baseSlug;

    if (maxSlug === baseSlug) {
      return `${baseSlug}-1`;
    }

    const match = maxSlug.match(/-(\d+)$/);
    const next = match ? parseInt(match[1], 10) + 1 : 1;

    return `${baseSlug}-${next}`;
  }

  private slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
