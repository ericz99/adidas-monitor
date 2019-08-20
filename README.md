## Adidas Monitor

I haven't fully tested this for other region yet, but it should work? Probably will work depending if other region stock endpoint is blocked then it won't work.
This monitor will filter webhook and post accordingly depending what region you are trying to monitor. For example, let say you want an US, UK, CA monitor, you can do that, simply follow those format below. In addition, this will only monitor for pid(s), monitoring for pid is very useful, for example, they might restock and etc. Please enter the right pid for each region, if you're planning to monitor a lot of pid.

### Installation

Adidas Monitor requires the following...

- [Node.js (LTS Version)](http://nodejs.org/)
- [YarnPKG](https://yarnpkg.com/lang/en/docs/install/#windows-stable)

![monitor](https://i.imgur.com/j3UJ18P.png)

Quick start:

```bash

# Install dependencies
yarn install

# Run application
yarn run start

# Add stuff in your config.json
{
  "webhooks": [
    {
      "region": "us",
      "webhook_url": ""
    },
    {
      "region": "uk",
      "webhook_url": ""
    },
    {
      "region": "ca",
      "webhook_url": ""
    }
  ],
  "pollMS": 2000,
  "products": [
    {
      "region": "us",
      "domain": "com",
      "pid": "B28128"
    },
    {
      "region": "uk",
      "domain": "co.uk",
      "pid": "B28128"
    },
    {
      "region": "ca",
      "domain": "ca",
      "pid": "B28128"
    },
  ]
}

```

## Features:

```bash

# Restock Monitor - Monitor by PIDs ✅
# Proxy Support ✅
# Supports any available region ✅

```

## Todo

- [ ] Add size differences and accumulate them altogether

## Tips

- PLEASE USE PROXIES, what this monitor will do is simply rotate between task, so simply each task or pid will have a different proxy per request.
- USING MORE PROXIES, you can simply lower your delay.
- MONITOR WILL AUTOMATIC RESTART TASK if your proxy is dead and will move to a different one.
- if you like to add other region, simply follow format above.

## Bugs?

Feel free to make an issue about any particular errors or bugs because I haven't fully tested this yet that's why.

## DISCLAIMER

Please do not abuse this script, any abused from this script will result in banned by adidas. This is meant for only to be used for educational purpose.

## App Info

### Author

Eric Zhang

### Version

1.0.0

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
