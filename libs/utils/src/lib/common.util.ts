import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export const toTimestamp = (date?: Date | string | null): GrpcTimestamp | undefined => {
  if (!date) return undefined;

  const value = date instanceof Date ? date : new Date(date);
  const time = value.getTime();

  if (Number.isNaN(time)) return undefined;

  return {
    seconds: Math.floor(time / 1000),
    nanos: (time % 1000) * 1_000_000,
  };
};
