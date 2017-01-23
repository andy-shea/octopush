process.on('message', data => {
  // dummy script to mimic flow of data from Capistrano deploy to Octopush
  // replace with code to perform Capistrano deploy ensuring output is sent back to parent process

  const fetch = require('isomorphic-fetch');
  const {expandedTargets} = JSON.parse(data);
  let i = 0;

  function dummy() {
    i++;
    if (i === 9) {
      process.send(JSON.stringify({
        key: '{{{octopush}}}',
        data: expandedTargets.map(name => ({
          name,
          revisionFrom: 'z99hfa5',
          revisionTo: 'v631y05'
        }))
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
