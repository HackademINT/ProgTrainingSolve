var htmlparser = require("htmlparser2");
var select = require('soupselect').select;

function parse_md5decrypt_website(xhr) {
  var handler = new htmlparser.DomHandler(function (error, dom) {
    if (error) { console.log('error:', error); }
    else { 
      try { unhash = select(dom, 'b')[0].children[0].data;}
      catch (e) { console.log(xhr.responseText); }
    }
  });
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(xhr.responseText);
  return unhash
}

function sha256_decrypt(hash) {
  var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://md5decrypt.net/en/Sha256/', false);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("hash="+hash+"&decrypt=Decrypt");
  return parse_md5decrypt_website(xhr);
}

function update_flag(challenge) {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url+challenge.hash, false); xhr.send(null);
  var data = xhr.responseText;
  var found = data.match(regex);
  if (found) { 
    challenge.hash = found[0];
    challenge.new = sha256_decrypt(challenge.hash);
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
  unhash = ''; // global var is needed to catch callback output in var
  url = 'https://prog.hackademint.org/';
  regex = /[0-9a-f]{64}/g;
  solve = main();
})();
