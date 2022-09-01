import * as dotenv from 'dotenv';
dotenv.config();
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Configuration } from './config/IConfiguration';
import { CrmClient } from './connectors/crm';
import { Utils } from './helpers';

const runBatch = async (values: string[], params: {}) => {
  const crmClient = new CrmClient(Configuration);
  const res = [];
  for (const [index, contactId] of values.entries()) {
    const data = await crmClient.fetchInvitationCode(contactId);
    // const data = { a: 1 };
    // Utils.sleep(1000);
    res.push({ ...{ contactId }, ...data });
  }
  return res;
};

const run = async (options: { parallel: Boolean; size: number; concurrency: number; waitMills: number; showProgress: Boolean; flushToFile: string }) => {
  const raw = readFileSync(join(process.cwd(), '.data/contacts.json'), 'utf8');
  const contactList: string[] = JSON.parse(raw)
    .map((v) => v.contactId)
    .slice(0, 50);

  const res = await Utils.execute(contactList, runBatch, {}, options);
  writeFileSync(join(process.cwd(), '.data/contacts.out.json'), JSON.stringify(res, null, 2));
};

run({ parallel: true, size: 10, concurrency: 10, waitMills: 1000, showProgress: true, flushToFile: `.data/out/contacts.{batchNo}.json` }).then().catch(console.error);
