import { Cart } from '../../../domain/entities/cart.entity';

export abstract class ICartCommandRepository {
  abstract save(cart: Cart): Promise<void>;
}
