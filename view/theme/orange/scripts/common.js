$(function () {
    $("body").addClass('fadeIn');
    setTimeout(function(){
        $(".header .hd_c").css('display','block');
    },1);
    $(".animated").each(function () {
        $(this).visualization(function () {
            var effect = $(this).attr('data-effect');
            $(this).addClass(effect);
        }, function () {
            var effect = $(this).attr('data-effect');
            $(this).removeClass(effect);
        });
    });
    //nav toggle
    $(".mobile-menu").click(function () {
        $('html').toggleClass('showNav');
    });
    $(".header").delegate('div', 'click', function (e) {
        if ($(e.target).hasClass('hd_c')) {
            $('html').removeClass('showNav');
        }
    });
    $(".mod-common_problem .item").click(function () {
        $(this).siblings().each(function () {
            var _self = $(this);
            $(this).find('.bd').stop(false, true).slideUp(100, function () {
                _self.removeClass('curr');
            })
        });
        $(this).find('.bd').slideDown(100, function () {
            $(this).parent().addClass('curr');
        })
    });
    $(".mod-common_problem .item").eq(0).trigger('click');
    //返回顶部
    $(".toolbox .item-gotop").click(function (e) {
        e.preventDefault();
        $("html,body").animate({ scrollTop: 0 }, 200);
    });
});
