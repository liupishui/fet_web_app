/*
* @Author: anchen
* @Date:   2018-09-20 22:20:17
* @Last Modified by:   anchen
* @Last Modified time: 2018-09-20 22:20:47
*/
var throttle = function (method, delay, duration) {
    var timer = null, begin = new Date();
    return function () {
        var context = this, args = arguments, current = new Date();;
        clearTimeout(timer);
        if (current - begin >= duration) {
            method.apply(context, args);
            begin = current;
        } else {
            timer = setTimeout(function () {
                method.apply(context, args);
            }, delay);
        }
    }
}

$.fn.visualization = function (enter, leave) {
    var _self = this, timmer = null;
    var visualizationFun = function () {
        var wScrollTop = $(window).scrollTop()
        var wHeight = $(window).height();
        $(_self).each(function () {
            if (($(this).offset().top < wScrollTop + wHeight) && ($(this).offset().top + $(this).height() > wScrollTop)) {
                if (typeof ($(this).attr('data-visualization')) == 'undefined' || ($(this).attr('data-visualization') == 'false')) {
                    $(this).attr('data-visualization', 'true');
                    enter.call(this);
                }
            }
        });
    }
    var visualizationFunLeave = function () {
        var wScrollTop = $(window).scrollTop()
        var wHeight = $(window).height();
        $(_self).each(function () {
            if ((typeof ($(this).attr('data-visualization')) != 'undefined') && ($(this).attr('data-visualization') == 'true')) {
                if (!(($(this).offset().top < wScrollTop + wHeight) && ($(this).offset().top + $(this).height() > wScrollTop))) {
                    $(this).attr('data-visualization', 'false');
                    leave.call(this);
                }
            }
        });
    }
    visualizationFun();
    var resizeFun = throttle(function () {
        visualizationFunLeave();
        visualizationFun()
    }, 400, 200);
    $(window).on('scroll.visualization', function () {
        resizeFun();
    });
}