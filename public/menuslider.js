$(document).ready(function() {
    var $toggleButton = $('.toggle-button'),
        $menuWrap = $('.menu-wrap'),
        $closeMask = $('.close-mask');
    $toggleButton.on('click', function() {
        $menuWrap.toggleClass('menu-show');
        $closeMask.css({'width':'100%','height':'100%'});
    });
    $closeMask.on('click', function() {
        $menuWrap.removeClass('menu-show');
        $closeMask.css({'width':'0px','height':'0px'});
    });
});
