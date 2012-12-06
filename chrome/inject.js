window.addEventListener("keydown", function(e) {
  var mod = e.ctrlKey || e.metaKey;
  if (mod && e.altKey && e.keyCode == 78) {
    try {
      var t = window.getSelection().toString();
      if (t != null && t != '') {
        chrome.extension.sendRequest({
          "pinit_keyboard_shortcut": true,
          "text": t
        }, function(res) {});
      }
    } catch (ex) {}
  }
}, false);

