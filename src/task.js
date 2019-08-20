import request from 'request-promise';
import { logger, notify } from '../libs';

class Task {
  constructor({ region, domain }, pid, webhooks, pollMS, proxies) {
    this._region = region;
    this._domain = domain;
    this._pid = pid;
    this._webhooks = webhooks;
    this._pollMS = pollMS;
    this._proxies = proxies;
    this._intv = null;
    this._counter = 0;
    this._latest_status = null;
    this._sizes = [];
    this._log = logger(`Adidas${region.toUpperCase()}`, pid);

    this._jar = request.jar();
    this._request = request.defaults({ jar: this._jar });
  }

  async start() {
    this._log.green('Starting task!');

    let t;

    this._intv = setInterval(
      (t = async () => {
        const randomProxy =
          this._proxies.length > 0
            ? this._proxies[Math.floor(Math.random() * this._proxies.length)]
            : null;

        // get stock url + json data
        const { body: data } = await this.getStockData(randomProxy);
        const productData = await this.getProductData(randomProxy);
        const status = data['availability_status'];
        const variantSize = data['variation_list'];

        if (status) {
          // logic to watch for changes
          let updatedSizes = variantSize.filter(newSize =>
            this._sizes.some(
              oldSize =>
                newSize.size === oldSize.size &&
                (newSize['availability_status'] !== oldSize['availability_status'] &&
                  newSize['availability_status'] === 'IN_STOCK')
            )
          );

          // if product wasn't initally loaded, we want to add all the sizes in updatedSizes
          if (this._sizes.length === 0 && updatedSizes.length === 0) updatedSizes = variantSize;

          // update old sizes => new sizes
          this._sizes = variantSize;

          /** TODO: add remaining sizes and append it into updatedSizes
           *
           */
          //   const copyOld = [...oldSizes].filter(oldSize => oldSize['availability_status'] === 'IN_STOCK')
          //   .concat(updatedSizes).sort((a, b) => a.size - b.size);

          if (status !== this._latest_status || updatedSizes.length > 0) {
            this._latest_status = status;
            if (this._counter > 0) {
              // send hook
              this._log.green('New sizes detected!');
              await this.sendHook(productData, updatedSizes);
            } else {
              this._log.yellow('Loaded initial status as ' + this._latest_status);
            }
          } else {
            this._log.normal('No update detected, current status is ' + this._latest_status);
          }
        } else {
          // not found == not loaded
          if (!status || data['message'] === 'not found') {
            this._log.yellow('Product is currently not yet loaded!');
          } else {
            this._log.normal('No update detected');
          }
        }

        this._counter++;
      }),
      this._pollMS
    );

    t();
  }

  async restart() {
    this._log.red('Possible proxy timeout.');
    this._log.yellow('Restarting task.');
    clearInterval(this._intv);
    let that = this;
    await this.sleep(5000);
    await that.start();
  }

  async getStockData(proxy) {
    const uri = `https://www.adidas.${this._domain}/api/products/${this._pid}/availability`;
    return await this._makeRequest({ uri, method: 'GET', proxy });
  }

  async getProductData(proxy) {
    const uri = `https://www.adidas.${this._domain}/api/products/${this._pid}`;
    return await this._makeRequest({ uri, method: 'GET', proxy });
  }

  async sendHook(data, sizes) {
    const name = data['name'];
    const price = data['pricing_information']['currentPrice'];
    const image = data['view_list'][0]['image_url'];
    const getCorrectHook = this._webhooks.filter(webhook => webhook.region == this._region);
    const totalStock = sizes.reduce((a, b) => ({ availability: a.availability + b.availability }))
      .availability;

    let metadata = {
      region: this._region,
      domain: this._domain,
      pid: this._pid,
      name,
      price,
      image,
      totalStock,
      sizes
    };

    // send webhook
    await notify(getCorrectHook, metadata);
    this._log.green('Sent to discord!');
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async _makeRequest(options) {
    options.method = options.method || 'GET';

    let headers = {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'upgrade-insecure-requests': '1',
      Connection: 'keep-alive',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
    };

    if (options.headers) {
      for (const key of Object.keys(options.headers)) {
        headers[key] = options.headers[key];
      }
    }

    let settings = {
      ...options,
      uri: options.uri,
      proxy: options.proxy,
      json: true,
      resolveWithFullResponse: true,
      simple: false,
      gzip: true,
      method: options.method,
      headers
    };

    return await this._request(settings);
  }
}

export default Task;
