export default {
  formatProxy: arr => {
    const formattedProxies = new Array();
    if (arr !== null) {
      const splitText = arr.split('\r\n');
      for (let i = 0; i < splitText.length; i++) {
        const splitProxy = splitText[i].split(':');
        // user - pass
        if (splitProxy.length > 3) {
          formattedProxies.push(
            'http://' +
              splitthing[2] +
              ':' +
              splitthing[3] +
              '@' +
              splitthing[0] +
              ':' +
              splitthing[1]
          );
        } else {
          formattedProxies.push('http://' + splitthing[0] + ':' + splitthing[1]);
        }
      }
    }
  },
  getRandomProxy: arr => {
    if (arr.length !== 0) {
      return arr[Math.floor(Math.random() * arr.length)];
    } else {
      return null;
    }
  }
};
