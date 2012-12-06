(function(undefined) {
  function open_window(t) {
    var url = 'http://labs.tokcs.com/nr/?t='+encodeURIComponent(t);
    chrome.windows.create({
      url: url,
      height: 850,
      width: 980,
      type: 'popup'
    });
  }
  function active_Action(info, tab) {
    if (info.selectionText != null) {
      open_window(info.selectionText);
    }
  }

  try {
    chrome.contextMenus.removeAll();
  }catch(e) {}

  chrome.contextMenus.create(
    {
      "title": "\u9078\u629e\u3055\u308c\u305f\u6587\u7ae0\u3092\u6574\u5f62\u3057\u3066\u7ffb\u8a33",
      "contexts":["selection"],
      "onclick": active_Action
    }
  );

  chrome.extension.onMessage.addListener(function(req, s, res) {
    if (req.pinit_keyboard_shortcut) {
      open_window(req.text);
    }
  });
})();
