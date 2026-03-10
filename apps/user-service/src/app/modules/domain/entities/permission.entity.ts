export type PermissionParams = {
  readonly id: string;
  name: string;
  description?: string;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class Permission {
  constructor(private params: PermissionParams) {}

  get id(): string {
    return this.params.id;
  }

  get name(): string {
    return this.params.name;
  }

  get description(): string | undefined {
    return this.params.description;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }

  updateName(name: string) {
    this.params.name = name;
    this.setUpdatedAt();
  }

  updateDescription(description?: string) {
    this.params.description = description;
    this.setUpdatedAt();
  }

  equals(permission: Permission): boolean {
    return this.params.id === permission.id;
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }
}
