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

  abstract emitNotificationCreated(payload: {
    eventId: string;
    receiverId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, any>;
    createdAt: string;
  }): Promise<void>;
}
