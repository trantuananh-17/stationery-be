export abstract class IMailSender {
  abstract sendPasswordReset(input: {
    email: string;
    resetUrl: string;
    expiresInMinutes: number;
  }): Promise<void>;
}
