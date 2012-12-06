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
  var ignoreWords = /\d\.\d|e\.g\.|i\.e\.|.\.\.\./;
  var correspondURL = /^http(s)?:\/\/((ieeexplore\.ieee\.org))\/.*/;
  var googleTransUrl = 'http://translate.google.com/translate_a/t?client=t&text={0}&hl={1}&sl=auto&tl={2}&multires=1&prev=btn&ssel=0&tsel=4&uptl={2}&alttl={1}&sc=1';

  this.getLines = function(str) {
    if (typeof str != 'string') return undefined;
    
    var ret = new Array();
    
    str = str.replace(/[\n\r]/gm, ' ');  // remove all newline
    str = str.replace(/([^-])- /g, '$1');
    str = str.replace(/ {2,}/g, ' ');
    
    var searchIndex = 0;
    while (str.length != 0) {
      //console.log('------');
      var sstr = str.substring(searchIndex);
      var ignore = sstr.search(ignoreWords) + 1;
      var i = sstr.search(/[.!?]/);
      /*
      console.log('searchIndex: '+searchIndex);
      console.log('igonre: '+ignore);
      console.log('i: '+i);
      console.log('sstr: '+sstr);
      */
      if (i == -1) {
        ret.push(str);
        break;
      } else if (i == ignore) {
        var mstr = sstr.match(ignoreWords);
        //console.log('match: '+mstr[0]);
        searchIndex += ignore+mstr[0].length-1;
        continue;
      }
      
      //console.log('substring: '+str.substring(0, searchIndex) + sstr.substring(0, i+1));
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
    window.open('http://translate.google.co.jp/#en|ja|'+encodeURI(str), 'Google 翻訳', 'width=900,height=500');
  };
  
  this.googleTranslate = function(str, from, to, callback) {
    var reqUrl = googleTransUrl.format(encodeURI(str), from, to);
    $.ajax({
      type: "GET",
      url: reqUrl,
      dataType: 'text',
      success: function(ret) {
        var m = ret.match(/\[\[\[\"(.+?)\",/);
        callback(m[1]);
      },
      error: function(req, st, er) {
        callback(null);
      }
    });
  };
  
  this.microsoftTranslate = function(apikey, str) {
    return '';
  };
  
  this.getAbstractFromURL = function(url, callback) {
    if (!correspondURL.test(url)) {
      callback(undefined);
      return;
    }
    
    $.ajax({
      type: 'GET',
      url: 'ba-simple-proxy.php?url=' + encodeURIComponent(url) + '&mode=native',
      dataType: 'text',
      success: function(h) {
        var abst = h.replace(/[\n\r]/gm, '').match(/<a name="Abstract">.+?<p>(.+?)<\/p>/m);
        if (abst != null) {
          abst = abst[1];
        }
        callback(abst);
      },
      error: function(req, st, er) {
        console.log(er);
        callback(null);
      }
    });
  };
}}).apply(nr);
