export abstract class ISlugService {
  abstract generate(name: string): Promise<string>;
}
