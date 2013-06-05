$(function() {
  // Selectors
  var $window = $(window);
  var $document = $(document);
  var $sections = $('.section');
  var $players_wraps = $sections.find('.player-wrap');
  var $players = $players_wraps.find('.player');
  var $nav_prev = $('.nav-prev');
  var $nav_next = $('.nav-next');
  var $first_section = $sections.first();
  var $last_section = $sections.last();

  // Params
  var section_height = $first_section.height();
  var first_section_offset = 0;
  var last_section_offset = $last_section.offset().top;
  var player_height = $players.height();

  // Methods
  function rescaleSections() {
    // Recalc params
    section_height = $first_section.outerHeight();
    first_section_offset = 0;
    last_section_offset = $last_section.offset().top;
    player_height = $players.height();
  }

  function getCurrentSection(viewport_offset) {
    var offset = $window.scrollTop() + (viewport_offset ? viewport_offset : 0);
    var section;
    $sections.each(function() {
      var $this = $(this);
      if($this.offset().top > offset) {
        return false;
      }
      section = $this;
    });
    return section;
  }

  function scrollSpy() {
    var offset = $window.scrollTop();

    // Top nav element
    var nav_prev_offset = section_height > offset ? section_height - offset : 0;
    $nav_prev.css('top', nav_prev_offset + 'px');

    var nav_prev_opacity = section_height > offset ? offset/section_height : 1;
    if(nav_prev_opacity >= 1) {
      $nav_prev.addClass('fixed');
      $nav_prev.css('opacity', '');
    } else {
      $nav_prev.removeClass('fixed');
      $nav_prev.css('opacity', nav_prev_opacity);
    }

    // Bottom nav element
    var nav_next_offset = last_section_offset - section_height - offset;
    if(nav_next_offset >= 0) {
      $nav_next.css('bottom', '0');
    } else {
      $nav_next.css('bottom', -1 * nav_next_offset + 'px');
    }

    var nav_next_opacity = 1 + nav_next_offset / section_height;
    if(nav_next_opacity >= 1) {
      $nav_next.addClass('fixed');
      $nav_next.css('opacity', '');
    } else if(nav_next_opacity >= 0) {
      $nav_next.removeClass('fixed');
      $nav_next.css('opacity', nav_next_opacity);
    } else {
      $nav_next.removeClass('fixed');
      $nav_next.css('opacity', 0);
    }
  }

  // Fix widths
  rescaleSections();
  $window.resize(rescaleSections);
  $window.load(rescaleSections);

  // Navigation
  (function() {
    $nav_prev.find('.nav-pill').click(function() {
      var prev_section = getCurrentSection($window.height()/2).prev('.section');
      var prev_section_offset = prev_section.length > 0 ? prev_section.offset().top : first_section_offset;
      $('body,html').animate({scrollTop: prev_section_offset + 'px'}, 800);
    });

    $nav_next.find('.nav-pill').click(function() {
      var next_section = getCurrentSection().next('.section');
      var last_section_offset = next_section.length > 0 ? next_section.offset().top : last_section_offset;
      $('body,html').animate({'scrollTop': last_section_offset + 'px'}, 800);
    });
  })();

  // Scroll spy
  (function() {
    $nav_prev.css({
      'top': section_height + 'px',
      'opacity': 0
    });

    scrollSpy();
    $window.scroll(scrollSpy);
    $document.on('touchstart touchmove', scrollSpy);
    $window.load(scrollSpy);
    $window.resize(scrollSpy);
  })();
});
