export enum GoalTrackingAction {
  ORDER_PAID = 'ORDER_PAID',

  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
}

export class GoalTrackingCommand {
  constructor(
    public readonly type: GoalTrackingAction,

    public readonly bucketMonth: string,

    public readonly revenue?: number,

    public readonly orders?: number,
  ) {}
}
