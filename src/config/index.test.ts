import * as dotenv from 'dotenv';
dotenv.config();
import { Configuration } from './IConfiguration';

describe('Configuration', () => {
  beforeAll: {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  }

  it('valid DataHubDatalake settings', async () => {
    const config = Configuration;
    expect(config.Datalake).toBeDefined();
  });

  it('valid CRM settings', async () => {
    const config = Configuration;
    expect(config.Crm.baseUrl).toBeDefined();
    expect(config.Crm.key).toBeDefined();
  });
});
