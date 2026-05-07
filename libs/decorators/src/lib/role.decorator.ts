import { ROLE } from '@common/constants/enums/role.enum';

import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<ROLE[]>();
