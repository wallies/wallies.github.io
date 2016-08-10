(function ($) {
  // Set up lightbox functionality on any images within articles.
  var imageCount = 0;
  $('.article-body img').not('.notepad-post-author-avatar').each(function() {
    var $image = $(this);
    imageCount++;
    var imageUrl = $image.attr('src');
    var imageAlt = $image.attr('alt');
    var lightboxLink = '<a href="'+ imageUrl + '" data-lightbox="image-' + imageCount + '" data-title="' + imageAlt + '"></a>';
    
    $image.wrap(lightboxLink);
  });
})(jQuery);