(function (doc, win) {
    var de = doc.documentElement, re = 'orientationchange' in window ? 'orientationchange' : 'resize', recalc = function () {
        var cw = de.clientWidth || window.screen.width;
        if (!cw) return;
        cw = parseInt(Math.min.apply('', [window.screen.width, cw]));
        cx = win.innerWidth || cw;
        cw = parseInt(Math.max.apply('', [cx, cw]));
        var fontSizeSet = cw >= 750 ? 100 : cw / 750 * 100;
        de.clientWidth && (de.style.fontSize = fontSizeSet + 'px');
        fontSizeSetFinal = parseInt(getComputedStyle(document.documentElement, null).getPropertyValue('font-size')) == parseInt(fontSizeSet) ? fontSizeSet : fontSizeSet / 0.9;
        de.clientWidth && (de.style.fontSize = fontSizeSetFinal + 'px');
    };
    recalc();
    if (!doc.addEventListener) return;
    win.addEventListener(re, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
