export class BaseConfiguration {
  NODE_ENV: string;

  IS_DEVELOPMENT: boolean;

  GLOBAL_PREFIX: string;

  constructor() {
    this.NODE_ENV = process.env['NODE_ENV'] || 'development';
    this.IS_DEVELOPMENT = this.NODE_ENV === 'development';
    this.GLOBAL_PREFIX = process.env['GLOBAL_PREFIX'] || 'api/v1';
  }
}
