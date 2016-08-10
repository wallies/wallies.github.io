$(function() {
  // Add class to blockquotes with citations.
  $('blockquote cite').each(function() {
    $(this).closest('blockquote').addClass('has-cite');
  });

  // Extract pull quotes from body - see https://css-tricks.com/better-pull-quotes/
  $('span.pullquote').each(function() {
    var $parentParagraph = $(this).closest('p');
    $parentParagraph.addClass('pulledquoteparent');
    $(this).clone()
      .addClass('pulledquote')
      .prependTo($parentParagraph)
  });
  $('span.pulledquote').each(function(i) {
    var row = i % 2 == 1 ? 'even' : 'odd';
    
    $(this).replaceWith('<div class="pulledquote ' + row + '"><blockquote>' + $(this).text() + '</blockquote></div>');
  });
});
