export class AppConfiguration {
  PORT: number;

  constructor() {
    this.PORT = Number(process.env['PORT']) || 3300;
  }
}
