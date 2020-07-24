// //判断浏览器是否支持transition方法
// console.log(document.body.style.transition)//空字符串
// console.log(document.body.style.transitions)//undefined
// //判断浏览器支持属性写法
// console.log(document.body.style)//undefined

// 构建不同浏览器transition完成方法


(function () {
    var transitionEndEventName={
        transition:"transitionend",
        MozTransition:"transitionend",
        WebkitTransition:"webkitTransitionEnd",
        OTransition:"0TransitionEnd otransitionend",
    };
    var isSurport  =false,
        transitonEnd = "";
    for (var name in transitionEndEventName){
        // console.log(transitionEndEventName[name]);
        //中括号中传入变量
        if (document.body.style[name]!==undefined){
            transitonEnd=transitionEndEventName[name];
            isSurport=true;
            break;
        }
    }
    // 将部分变量暴露给全局
    window.mt=window.mt||{};
    window.mt.transition = {
        end:transitonEnd,
        isSurport:isSurport
    };
})()