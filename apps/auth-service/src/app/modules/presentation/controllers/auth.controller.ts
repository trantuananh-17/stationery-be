import { CommandBus, QueryBus } from '@nestjs/cqrs';

export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
}
