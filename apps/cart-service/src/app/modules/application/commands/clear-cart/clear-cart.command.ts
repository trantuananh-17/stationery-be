export class ClearCartCommand {
  constructor(
    public readonly userId?: string,
    public readonly sessionId?: string,
  ) {}
}
