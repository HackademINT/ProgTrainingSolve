function get_dict() {
  var sha256 = require('./sha256');
  var dict = new Object();
  for (var i = 0; i < alpha.length; i++) {
    dict[sha256.sha256(alpha.charAt(i))] = i;
  }
  return dict
}

function update_flag(challenge) {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url+challenge.hash, false); xhr.send(null);
  var data = xhr.responseText;
  var found = data.match(regex);
  if (found) { 
    challenge.hash = found[0];
    challenge.new = alpha.charAt(dict[challenge.hash]);
    challenge.flag = challenge.flag + challenge.new;
    return challenge
  }
  challenge.stop = true;
  return challenge
}

function create_challenge() {
  var challenge = new Object();
  challenge.flag = '';
  challenge.hash = '';
  challenge.new = '';
  challenge.stop = false;
  return challenge
}

function main() {
  var challenge = create_challenge();
  while (! update_flag(challenge).stop) {
    process.stdout.write(challenge.new);
  }
  process.stdout.write('\n');
  return challenge.flag
}

(function() {
  alpha = '}_{0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&()*+,-./:;<=>?@[]^_`|';
  url = 'https://prog.hackademint.org/';
  dict = get_dict();
  regex = /[0-9a-f]{64}/g;
  solve = main();
})();
