window.onload = function () {
    var screenAnimateElements = {
        ".screen-1": [
            ".screen-1__heading",
            ".screen-1__phone",
            ".screen-1__shadow",
        ],
        ".screen-2": [
            ".screen-2__heading",
            ".screen-2__subheading",
            ".screen-2__phone",
            ".screen-2__point",
            ".screen-2__point__custom",
            ".screen-2__point-i-3"
        ],
        ".screen-3": [
            ".screen-3__heading",
            ".screen-3__subheading",
            ".screen-3__phone",
            ".screen-3__features",
            ".screen-3__features__item-i-1"
        ],
        ".screen-4": [
            ".screen-4__heading",
            ".screen-4__subheading",
            ".screen-4__type__item-i-1",
            ".screen-4__type__item-i-2",
            ".screen-4__type__item-i-3",
            ".screen-4__type__item-i-4"
        ],
        ".screen-5":[
            ".screen-5__heading",
            ".screen-5__subheading",
            ".screen-5__bg"
        ]
    }

    function setScreenAnimate(screenCls) {
        var screen = document.querySelector(screenCls);//获取当前屏元素
        var animateElements = screenAnimateElements[screenCls];//需要设置动画的元素
        var isSetAnimateClass = true;//是否有初始化元素样式
        var isAnimateDone = true;
        screen.onclick = function () {
            //初始化
            if (isSetAnimateClass) {
                for (var i = 0; i < animateElements.length; i++) {
                    var element = document.querySelector(animateElements[i]);
                    var baseCls = element.getAttribute("class");
                    element.setAttribute("class", baseCls + " " + animateElements[i].substr(1) + '-animate-init');
                }
                isSetAnimateClass = false;
                return;
            }
            //设置动画
            if (isAnimateDone) {
                for (var i = 0; i < animateElements.length; i++) {
                    element = document.querySelector(animateElements[i]);
                    baseCls = element.getAttribute("class");
                    console.log(i+element)
                    element.setAttribute("class", baseCls.replace('-animate-init', '-animate-done'));
                }
                isAnimateDone = false;
                return;
            }
            //动画完成初始化
            if (!isAnimateDone) {
                for (var i = 0; i < animateElements.length; i++) {
                    element = document.querySelector(animateElements[i]);
                    baseCls = element.getAttribute("class");
                    element.setAttribute("class", baseCls.replace('-animate-done', '-animate-init'));
                }
                isAnimateDone = true;
                return;
            }
            console.log(isAnimateDone);
        }

    }

    for (k in screenAnimateElements) {
        console.log(k);
        setScreenAnimate(k);
    }
}
