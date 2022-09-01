import * as dotenv from 'dotenv';
dotenv.config();
import { CrmClient } from '.';
import { Configuration } from '../../config/IConfiguration';

describe('CRM Client', () => {
  beforeAll: {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  }

  it('Fetch Invitation Code', async () => {
    const crmClient = new CrmClient(Configuration);
    const contactId = 'b7784340-9227-ed11-9db1-00224818a973';
    const res = await crmClient.fetchInvitationCode(contactId);
    expect(res.contactId).toBe(contactId);
    expect(res.invitationCode).toBeDefined();
    expect(res.expiryDate).toBeDefined();
  }, 10000);

  it('Fetch Invalid Invitation Code', async () => {
    const crmClient = new CrmClient(Configuration);
    const contactId = 'd23f97e8-8ad8-43fa-9a78-000c3b2133e4';
    const res = await crmClient.fetchInvitationCode(contactId);
    expect(res.error).toBeDefined();
    expect(res.error.code).toBe('0x80040265');
  }, 10000);
});
