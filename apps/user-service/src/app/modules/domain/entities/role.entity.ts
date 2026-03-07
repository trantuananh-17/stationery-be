import { Permission } from '../enums/permission.enum';
import { RoleName } from '../enums/role.enum';

export type RoleParams = {
  readonly id: string;
  name: RoleName;
  description?: string;
  permissions: Permission[];
  readonly createdAt: Date;
  updatedAt: Date;
};

export class Role {
  constructor(private params: RoleParams) {}

  get id(): string {
    return this.params.id;
  }

  get name(): string {
    return this.params.name;
  }

  get description(): string | undefined {
    return this.params.description;
  }

  get permissions(): Permission[] {
    return this.params.permissions;
  }

  updateDescription(description?: string) {
    this.params.description = description;
    this.setUpdatedAt();
  }

  addPermission(permission: Permission) {
    if (!this.params.permissions.includes(permission)) {
      this.params.permissions.push(permission);
      this.setUpdatedAt();
    }
  }

  removePermission(permission: Permission) {
    this.params.permissions = this.params.permissions.filter((p) => p !== permission);

    this.setUpdatedAt();
  }

  hasPermission(permission: Permission): boolean {
    return this.params.permissions.includes(permission);
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }
}
