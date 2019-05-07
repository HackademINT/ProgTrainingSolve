// ==UserScript==
// @name         Prog HackademINT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Solving a prog challenge of HackademINT using an UserScript
// @author       zTeeed le 10E
// @match        https://prog.hackademint.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var alpha = '}_{0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&()*+,-./:;<=>?@[\\]^_`|';
    function sha256(ascii) {
        function rightRotate(value, amount) {
            return (value>>>amount) | (value<<(32 - amount));
        };

        var mathPow = Math.pow;
        var maxWord = mathPow(2, 32);
        var lengthProperty = 'length'
        var i, j; // Used as a counter across the whole file
        var result = ''

        var words = [];
        var asciiBitLength = ascii[lengthProperty]*8;
        var hash = sha256.h = sha256.h || [];
        var k = sha256.k = sha256.k || [];
        var primeCounter = k[lengthProperty];
        var isComposite = {};
        for (var candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
                k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
            }
        }

        ascii += '\x80' // Append Ƈ' bit (plus zero padding)
        while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j>>8) return; // ASCII check: only accept characters in range 0-255
            words[i>>2] |= j << ((3 - i)%4)*8;
        }
        words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
        words[words[lengthProperty]] = (asciiBitLength)
        for (j = 0; j < words[lengthProperty];) {
            var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
            var oldHash = hash;
            hash = hash.slice(0, 8);

            for (i = 0; i < 64; i++) {
                var i2 = i + j;
                var w15 = w[i - 15], w2 = w[i - 2];
                var a = hash[0], e = hash[4];
                var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                )|0
                  );
                var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj

                hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
                hash[4] = (hash[4] + temp1)|0;
            }

            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i])|0;
            }
        }
        for (i = 0; i < 8; i++) {
            for (j = 3; j + 1; j--) {
                var b = (hash[i]>>(j*8))&255;
                result += ((b < 16) ? 0 : '') + b.toString(16);
            }
        }
        return result;
    };
    var flag = window.location.search.substring(1).split('=')[1];
    if( typeof flag === 'undefined' || flag === null ){flag = '';}
    var hash = '';
    var dict = new Object();
    for (var i = 0; i < alpha.length; i++) {dict[sha256(alpha.charAt(i))] = i;}
    var url = 'https://prog.hackademint.org/';
    var data = document.getElementsByTagName("P")[0].innerHTML
    var regex = /[0-9a-f]{64}/g;
    var found = data.match(regex);
    if (found) {
        var hash_found = found[0];
        flag = flag + alpha.charAt(dict[hash_found])
        window.location.href = url + hash_found + "?flag=" + flag;
    }
})();
