import { Cart } from '../../../domain/entities/cart.entity';

export abstract class ICartCommandRepository {
  abstract save(cart: Cart): Promise<void>;
  abstract findByUserId(userId: string): Promise<Cart | null>;
  abstract findBySessionId(sessionId: string): Promise<Cart | null>;
  abstract delete(cartId: string): Promise<void>;
}
