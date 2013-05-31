function redraw() {
  $('.section').width($(window).width());
  $('.section').height($(window).height());

  var $sections = $('.section');
  var $nav_prev = $('.nav-prev');
  var $nav_next = $('.nav-next');
  var section_height = $sections.first().height();
  var last_section_offset = $sections.last().offset().top;

  var getCurrentSection = function(viewport_offser) {
    var offset = $(window).scrollTop() + (viewport_offser ? viewport_offser : 0);
    var section;
    $sections.each(function() {
      var $this = $(this);
      if($this.offset().top > offset) {
        return false;
      }
      section = $this;
    });
    return section;
  };

  $nav_prev.off().click(function() {
    var prev_section = getCurrentSection($(window).height()/2).prev('.section');
    var prev_section_offset = prev_section.length > 0 ? prev_section.offset().top : 0;
    $('body,html').animate({scrollTop: prev_section_offset + 'px'}, 800);
  });

  $nav_next.off().click(function() {
    var next_section = getCurrentSection().next('.section');
    var last_section_offset = next_section.length > 0 ? next_section.offset().top : $sections.last().offset().top;
    $('body,html').animate({'scrollTop': last_section_offset + 'px'}, 800);
  });

  $nav_prev.css({
    'top': (section_height + 5) + 'px',
    'opacity': 0
  });

  $(window).off().scroll(function() {
    var offset = $(window).scrollTop();
    var nav_prev_offset = section_height > offset ? section_height - offset : 0;
    var nav_prev_opacity = section_height > offset ? offset/section_height : 1;

    $nav_prev.css('top', (nav_prev_offset + 5) + 'px');

    if(nav_prev_opacity >= 1) {
      $nav_prev.addClass('fixed');
      $nav_prev.css('opacity', '');
    } else {
      $nav_prev.removeClass('fixed');
      $nav_prev.css('opacity', nav_prev_opacity*0.5);
    }

    var nav_next_offset = last_section_offset - offset - 5;
    var nav_next_opacity = nav_next_offset / section_height;
    nav_next_offset -= section_height;

    if(nav_next_offset > 0) {
      $nav_next.css('bottom', '5px');
    } else {
      $nav_next.css('bottom', -1 * nav_next_offset + 5 + 'px');
    }

    if(nav_next_opacity >= 1) {
      $nav_next.addClass('fixed');
      $nav_next.css('opacity', '');
    } else {
      $nav_next.removeClass('fixed');
      $nav_next.css('opacity', nav_next_opacity*0.5);
    }
  });

  $.stellar({
    horizontalScrolling: false,
    verticalOffset: 7,
    scrollProperty: 'transform'
  });
}

$(window).resize(redraw);
$(redraw);
