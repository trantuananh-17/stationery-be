export abstract class IEventPublisher {
  abstract emitCustomerSummarySync(payload: {
    eventId: string;
    userId: string;
    email: string;
    isActive?: boolean;
    isVerified?: boolean;
  }): Promise<void>;
}
