export abstract class IProcessedEventRepository {
  /**
   * Try insert eventId
   * @returns true nếu lần đầu, false nếu duplicate
   */
  abstract tryInsert(eventId: string, eventType: string): Promise<boolean>;
}
