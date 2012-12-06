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

var nr = {};
(function(){with(this){
  var googleTransUrl = 'http://translate.google.com/translate_a/t?client=t&text={0}&hl={1}&sl=auto&tl={2}&multires=1&prev=btn&ssel=0&tsel=4&uptl={2}&alttl={1}&sc=1';

  this.nullOrMatch = function(str, match) {
    if (str != null) {
      if (str != match) return false;
    }
    return true;
  }

  this.googleTranslate = function(str, from, to, callback) {
    var reqUrl = googleTransUrl.format(encodeURI(str), from, to);
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4) {
        if (ajax.status == 200 && ajax.responseText != null) {
          var ret = '';
          var m = ajax.responseText.match(/\[\[(\[\"(.+?)\",.+?\"\],?)+\]/);
          m = m[0].split('],');
          for (var i = 0; i < m.length; i++) {
            try {
              ret += m[i].match(/\[\"(.+?[^\\])\",/)[1];
            } catch (e) {}
          }
          callback(ret);
        } else {
          callback(null);
        }
      }
    };
    ajax.open('GET', reqUrl, true);
    ajax.send();
  };
}}).apply(nr);
