export class GetAddressesDto {
  userId: string;
}

export class CreateAddressDto {
  userId: string;
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export class UpdateAddressDto extends CreateAddressDto {
  addressId: string;
}

export class GetWishlistDto {
  userId: string;
}

export class AddWishlistItemDto {
  userId: string;
  productId: string;
  productName: string;
  productSlug: string;
  thumbnail: string;
  price: number;
}

export class RemoveWishlistItemDto {
  userId: string;
  productId: string;
}

export class AddressActionDto {
  userId: string;
  addressId: string;
}
