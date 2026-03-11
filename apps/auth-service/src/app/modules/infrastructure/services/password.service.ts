import { Injectable } from '@nestjs/common';
import { IPasswordService } from '../../application/ports/services/password.port';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly SALT_ROUNDS = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
