$('div.gs_ri').each(function(){
  var title = $(this).children('h3');
  var abst  = $(this).children('.gs_rs');

  with ({title : title}) {
    chrome.extension.sendMessage({
      "translation_request": true,
      "text": title.children('a').text().replace(/[\n\r]+/, '')
    }, function(j){
      $('<blockquote />').text(j).insertAfter(title);
    });
  }
  with ({abst : abst}) {
    chrome.extension.sendMessage({
      "translation_request": true,
      "text": abst.text().replace(/[\n\r]+/, '')
    }, function(j){
      $('<blockquote />').text(j).insertAfter(abst);
    });
  }
});

