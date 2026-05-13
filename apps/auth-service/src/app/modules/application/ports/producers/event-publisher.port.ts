export abstract class IEventPublisher {
  abstract emitCustomerSummarySync(payload: {
    eventId: string;
    userId: string;
    email: string;
    isActive?: boolean;
    isVerified?: boolean;
  }): Promise<void>;

  abstract emitCustomerCreated(payload: {
    eventId: string;
    customerId: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  }): Promise<void>;
}
