import { PERMISSION } from '@common/constants/enums/permissions.enum';
import { Reflector } from '@nestjs/core';

export const Permissions = Reflector.createDecorator<PERMISSION[]>();
