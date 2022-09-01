import { writeFileSync } from 'fs';
import { join } from 'path';
import { ConcurrentTaskQueue } from './ConcurrentTaskQueue';
const cliProgress = require('cli-progress');

export class Utils {
  static concurrentTaskQueue(taskPromisesFunc?: any[], batchSize?: number) {
    return new ConcurrentTaskQueue(taskPromisesFunc, batchSize);
  }

  static splitToBatches<T>(records: T[], batchSize?: number): T[][] {
    var batches: T[][] = [];
    while (records.length > 0) batches.push(records.splice(0, batchSize || 300));
    return batches;
  }

  static sleep = (milliseconds: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };

  static execute = async <T>(
    values: T[],
    method: Function,
    params: any,
    options: { parallel: Boolean; size: number; concurrency: number; waitMills: number; showProgress: Boolean; flushToFile?: string }
  ): Promise<T[]> => {
    const progressBar = options.showProgress ? new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic) : undefined;
    let data = [];
    if (options.parallel) {
      // *** parallel: up to N parallel executions in batches of M rows
      const tasks = [];
      const batches = Utils.splitToBatches(Array.from(values), options.size);
      progressBar?.start(batches.length, 0);
      try {
        for (const [index, batch] of batches.entries()) {
          tasks.push(async () => {
            const res = await method(batch, params);
            await Utils.sleep(options.waitMills);
            progressBar?.increment();
            if (options.flushToFile) {
              writeFileSync(join(process.cwd(), options.flushToFile.replace('{batchNo}', index.toString())), JSON.stringify(res, null, 2));
            }
            return res;
          });
        }
        const taskQueue = Utils.concurrentTaskQueue(tasks, options.concurrency);
        data = ((await taskQueue.runTasks()) as any[]).flat();
      } finally {
        progressBar?.stop();
      }
    } else {
      // *** sequential: good for debugging (!)
      data = await method(values, params);
    }
    return data;
  };
}
