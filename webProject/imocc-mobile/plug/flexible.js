/**
 * @Description: 通用适配移动端
 * @author Shanshan Li  2020/6/12
 */
(function () {
    var docEl = document.documentElement,
        viewPortEl = document.querySelector('meta[name="viewport"]'),
        dpr = window.devicePixelRatio || 1,
        maxWidth = 540,
        minWidth = 320;
    dpr = dpr >= 3 ? 3 : (dpr >= 2 ? 2 : 1);
    docEl.setAttribute('data-dpr', dpr);
    docEl.setAttribute('data-minWidth', minWidth);
    docEl.setAttribute('data-maxWidth', maxWidth);
    var scale = 1 / dpr,
        content = 'width=device-width,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no';
    if (viewPortEl) {
        viewPortEl.setAttribute('content', content);
    } else {
        viewPortEl = document.createElement('meta');
        viewPortEl.setAttribute('name', 'viewport');
        viewPortEl.setAttribute('content', content);
        document.head.appendChild(viewPortEl);
    }
    setRemUnit();
    window.addEventListener('resize', setRemUnit);
    function setRemUnit() {
        var ratio =98;
        var viewPortWidth = docEl.getBoundingClientRect().width || window.innerWidth;
        if (maxWidth && (viewPortWidth / dpr > maxWidth)) {
            viewPortWidth = maxWidth * dpr;
        } else if (minWidth && (viewPortWidth / dpr < minWidth)) {
            viewPortWidth = minWidth * dpr;
        }
        docEl.style.fontSize = viewPortWidth / ratio + 'px';
    }
})()