import fs from 'fs';
import { proxy as proxyUtils } from './libs';
import config from './config.json';
import Task from './src/task';

const tasks = [];

(async () => {
  const products = config.products;
  const webhooks = config.webhooks;
  const pollMS = config.pollMS;
  // check if products length === 0
  if (products.length === 0) throw new Error('Please add some pids!');
  // read proxies file
  const text = fs.readFileSync('./proxy.txt', 'utf-8');
  const proxies =
    text == ''
      ? []
      : proxyUtils.formatProxy(
          text
            .replace(/\r/g, '')
            .trim()
            .split('\n')
        );

  for (let i = 0; i < products.length; i++) {
    const region = products[i].region;
    const domain = products[i].domain;
    const pid = products[i].pid;

    // add product task
    tasks.push(new Task({ region, domain }, pid, webhooks, pollMS, proxies));
    // start product task
    tasks[i].start();
  }
})();
