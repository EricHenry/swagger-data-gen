const test = require('ava');
const { binary } = require('../../dist/src/formatters/');

test('random binary string of 4 octets', t => {
  const fourOctets = /[0-1]{1,8}\s[0-1]{1,8}\s[0-1]{1,8}\s[0-1]{1,8}/;

  t.true(fourOctets.test(binary.callback()));
});

