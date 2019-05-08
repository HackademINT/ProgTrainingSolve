// ==UserScript==
// @name         Prog
// @version      0.1
// @description  Solve the challenge
// @author       Cyxo
// @match        https://prog.hackademint.org/*
// @grant        GM_xmlhttpRequest
// @connect      https://md5decrypt.net/Api/*
// ==/UserScript==

(function() {
    'use strict';

    var txt = document.getElementsByTagName("p")[0].innerText.match(/\w{64}/g);

    if (window.location == "https://prog.hackademint.org/") document.cookie = "code="
    if (txt) {
        var hash = txt[0];
        var code = "5276e419049a0896";
        var email = "paulolol@yopmail.com";
        var url = "https://md5decrypt.net/Api/api.php?hash=" + hash + "&hash_type=sha256&email=" + email + "&code=" + code;
        var http = new XMLHttpRequest();
        http.open("GET", url);
        http.send();

        http.onreadystatechange=(e)=>{
            if (http.readyState == 4){
                document.cookie += http.responseText;
                console.log(document.cookie);
                setTimeout(function(){ window.location = "https://prog.hackademint.org/" + hash; }, 300);
            }
        }
    } else {
        alert("it might be the end");
        console.log(document.cookie);
    }
})();