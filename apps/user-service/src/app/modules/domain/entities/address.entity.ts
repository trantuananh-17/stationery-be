export type AddressParams = {
  readonly id: string;
  readonly userId: string;
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
};

export type AddressInput = {
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
};

export class Address {
  constructor(private params: AddressParams) {}

  static create(userId: string, input: AddressInput) {
    const now = new Date();

    return new Address({
      id: crypto.randomUUID(),
      userId,
      ...input,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(params: AddressParams) {
    return new Address(params);
  }

  update(input: AddressInput) {
    this.params.fullName = input.fullName;
    this.params.phone = input.phone;
    this.params.address1 = input.address1;
    this.params.address2 = input.address2;
    this.params.ward = input.ward;
    this.params.district = input.district;
    this.params.city = input.city;
    this.params.isDefault = input.isDefault;
    this.params.updatedAt = new Date();
  }

  markAsDefault() {
    this.params.isDefault = true;
    this.params.updatedAt = new Date();
  }

  get id(): string {
    return this.params.id;
  }

  get userId(): string {
    return this.params.userId;
  }

  get fullName(): string {
    return this.params.fullName;
  }

  get phone(): string {
    return this.params.phone;
  }

  get address1(): string {
    return this.params.address1;
  }

  get address2(): string | undefined {
    return this.params.address2;
  }

  get ward(): string {
    return this.params.ward;
  }

  get district(): string {
    return this.params.district;
  }

  get city(): string {
    return this.params.city;
  }

  get isDefault(): boolean {
    return this.params.isDefault;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
