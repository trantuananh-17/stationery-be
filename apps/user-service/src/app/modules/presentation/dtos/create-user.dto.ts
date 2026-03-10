import { IsEnum } from 'class-validator';
import { RoleName } from '../../domain/enums/role.enum';

export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;

  @IsEnum(RoleName)
  roleName: RoleName;
}
