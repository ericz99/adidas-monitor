import request from 'request-promise';

export default async ({ webhook_url }, metadata) => {
  const options = {
    uri: webhook_url,
    method: 'POST',
    json: true,
    body: {
      username: `Adidas${metadata.region.toUpperCase()}`,
      embeds: [
        {
          author: {
            name: `Adidas${metadata.region.toUpperCase()}`,
            url: `https://www.adidas.${domain}/`
          },
          title: metadata.name.toUpperCase(),
          url: `https://www.adidas.${metadata.domain}/${metadata.region}/${metadata.pid}.html`,
          color: 15258703,
          fields: [
            {
              name: 'PRICE',
              value: metadata.price
            },
            {
              name: 'STOCK',
              value: `${metadata.totalStock}+`,
              inline: true
            },
            {
              name: 'SKU',
              value: metadata.pid
            },
            {
              name: 'AVAILABLE SIZES',
              value: `${metadata.sizes.size}[${metadata.sizes.availability}]`,
              inline: true
            }
          ],
          thumbnail: {
            url: metadata.image
          },
          footer: {
            text: 'Adidas Monitor | developed by god#1213'
          }
        }
      ]
    }
  };

  await request(options);
};
