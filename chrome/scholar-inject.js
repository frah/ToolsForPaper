(function(undefined) {
  var ps = document.getElementsByClassName('gs_ri');

  function update(elem, text) {
    chrome.extension.sendMessage({
      "translation_request": true,
      "text": text.replace(/[\n\r]+/, '')
    }, function(j) {
      elem.addEventListener('mouseover', function(event){
        tooltip.show(j);
        return false;
      }, false);
      elem.addEventListener('mouseout', tooltip.hide, false);
    });
  };

  for (var i = 0; i < ps.length; i++) {
    with ({title : ps[i].getElementsByTagName('h3')[0]}) {
    with ({abst : ps[i].getElementsByClassName('gs_rs')[0]}) {
      try {
        var ttext = title.innerHTML.replace(/<span.*<\/span>/g, '');
        var ttext = ttext.replace(/<\/?.+?>/g, '');
        update(title, ttext);
      } catch (e) {}
      try {
        var atext = abst.innerHTML.replace(/<\/?.+?>/g, '');
        update(abst, atext);
      } catch (e) {}
    }
    }
  }
})();
