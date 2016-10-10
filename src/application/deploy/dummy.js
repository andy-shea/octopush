process.on('message', data => {
  const fetch = require('isomorphic-fetch');
  const {hosts} = JSON.parse(data);
  let i = 0;

  function dummy() {
    i++;
    if (i === 9) {
      process.send(JSON.stringify({
        key: '{{{octopush}}}',
        data: hosts.map(host => {
          host.revisionFrom = 'z99hfa5';
          host.revisionTo = 'v631y05';
          return host;
        })
      }));
      setTimeout(dummy, 1000);
    }
    else if (i === 10) process.exit();
    else {
      fetch('//baconipsum.com/api/?type=meat-and-filler').then(response => response.json()).then(lines => {
        process.send(`${lines.join('\n')}\n\n`);
        setTimeout(dummy, 1000);
        return null;
      });
    }
  }

  setTimeout(dummy, 1000);
});
