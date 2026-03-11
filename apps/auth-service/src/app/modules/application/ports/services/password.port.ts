export abstract class IPasswordService {
  abstract hash(password: string): Promise<string>;
  abstract compare(password: string, hashed: string): Promise<boolean>;
}
