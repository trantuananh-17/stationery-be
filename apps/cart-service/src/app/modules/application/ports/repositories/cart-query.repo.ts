import { Cart } from '../../../domain/entities/cart.entity';

export abstract class ICartQueryRepository {
  abstract findById(id: string): Promise<Cart | null>;
  abstract findByUserId(userId: string): Promise<Cart | null>;
  abstract findBySessionId(sessionId: string): Promise<Cart | null>;
}
