/*!
 * NewLine Remover Library v2.9.0
 * http://labs.tokcs.com/
 *
 * Copyright 2012 Atsushi OHNO
 * Released under the MIT license
 *  http://opensource.org/licenses/MIT
 */
if (!('console' in window)) {
  window.console = {};
  window.console.log = function(str) { return str; };
}
String.prototype.htmlEscape = function() {
  var obj = document.createElement('div');
  if (typeof obj.textContent != 'undefined') {
    obj.textContent = this;
  } else {
    obj.innerText = this;
  }
  return obj.innerHTML;
};
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/\{(\d)\}/g, function(m, c) { return args[parseInt(c)] });
};
window.location.parseQuery = function(key) {
  if (this.search.indexOf(key+'=')!= -1) {
    reg = new RegExp(key + '=(.*?)(\&|$)', 'i');
    return decodeURIComponent(this.search.match(reg)[1]);
  }
  return undefined;
};

var nr = {};
(function(){with(this){
  var ignoreWords = /\d(\.\d)+|e\.g\.|i\.e\.|\.\.\.|et al\.|cf\.|( |^)[A-Z]\.|[Ff]ig\./;
  var correspondURL = /^http(s)?:\/\/((ieeexplore\.ieee\.org))\/.*/;
  var googleTransUrl = 'http://translate.google.com/translate_a/t?client=t&text={0}&hl={1}&sl=auto&tl={2}&multires=1&prev=btn&ssel=0&tsel=4&uptl={2}&alttl={1}&sc=1';
  var proxyPath = 'ba-simple-proxy.php?url={0}&mode=native';
  var createHttpRequest = function() {
    if(window.ActiveXObject){
      try {
        return new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e2) {
          return null;
        }
      }
    } else if(window.XMLHttpRequest){
      return new XMLHttpRequest();
    } else {
      return null;
    }
  };

  this.getLines = function(str) {
    if (typeof str != 'string') return undefined;
    
    var ret = new Array();
    
    str = str.replace(/[\n\r]/gm, ' ');  // remove all newline
    str = str.replace(/([^-])- /g, '$1');
    str = str.replace(/ {2,}/g, ' ');
    
    var searchIndex = 0;
    while (str.length != 0) {
      console.log('------');
      var sstr = str.substring(searchIndex);
      var ignore = sstr.search(ignoreWords);
      var mstr = '';
      if (ignore != -1) {
        mstr = sstr.match(ignoreWords);
        if (typeof mstr != 'string') {
          mstr = mstr[0];
        }
      }
      var i = sstr.search(/[.!?]/);
      
      console.log('searchIndex: '+searchIndex);
      console.log('igonre: '+ignore);
      console.log('i: '+i);
      console.log('sstr: '+sstr);
      
      if (i == -1) {
        console.log('substring: '+str);
        ret.push(str);
        break;
      } else if (i >= ignore && i <= ignore + mstr.length) {
        console.log('match: {0} ({1})'.format(mstr, mstr.length));
        searchIndex += ignore + mstr.length;
        continue;
      }
      
      console.log('substring: '+str.substring(0, searchIndex) + sstr.substring(0, i+1));
      ret.push(str.substring(0, searchIndex) + sstr.substring(0, i+1));
      str = sstr.substring(i+1).replace(/^\s+/, '');
      searchIndex = 0;
    }
    
    return ret;
  };
  
  this.nullOrMatch = function(str, match) {
    if (str != null) {
      if (str != match) return false;
    }
    return true;
  }
  
  this.googleTranslateWithNewWindow = function(str) {
    window.open('http://translate.google.co.jp/#en|ja|'+encodeURI(str), '', 'width=900,height=500');
  };
  
  this.googleTranslate = function(str, from, to, callback) {
    var reqUrl = googleTransUrl.format(encodeURIComponent(str), from, to);
    var ajax = createHttpRequest();
    ajax.onreadystatechange = function(){
      if (ajax.readyState == 4) {
        if (ajax.status == 200 && ajax.responseText != null) {
          var rstr = '';
          var m = ajax.responseText.match(/\[\[(\[\"(.+?)\",.+?\"\],?)+\]/);
          m = m[0].split('],');
          for (var i = 0; i < m.length; i++) {
            try {
              rstr += m[i].match(/\[\"(.+?[^\\])\",/)[1].replace(/\\/g, '');
            } catch (e) {}
          }
          callback(rstr);
        } else {
          console.log('error: '+ajax.statusText);
          callback(null);
        }
      }
    };
    ajax.open('GET', proxyPath.format(encodeURIComponent(reqUrl)), true);
    ajax.send();
  };
  
  this.microsoftTranslate = function(apikey, str) {
    return '';
  };
  
  this.getAbstractFromURL = function(url, callback) {
    if (!correspondURL.test(url)) {
      callback(undefined);
      return;
    }
    
    var ajax = createHttpRequest();
    ajax.onreadystatechange = function(){
      if (ajax.readyState == 4) {
        if (ajax.status == 200 && ajax.responseText != null) {
          var abst = ajax.responseText.replace(/[\n\r]/gm, '').match(/<a name="Abstract">.+?<p>(.+?)<\/p>/m);
          if (abst != null) {
            abst = abst[1];
          }
          callback(abst);
        } else {
          console.log('error: '+ajax.statusText);
          callback(null);
        }
      }
    };
    ajax.open('GET', proxyPath.format(encodeURIComponent(url)), true);
    ajax.send();
  };
}}).apply(nr);
