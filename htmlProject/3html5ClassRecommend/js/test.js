//获取元素
var getEle= function (cls) {
    return document.querySelector(cls);
}
//获取所有元素
var getAllEle = function (cls) {
    return document.querySelectorAll(cls)
}
//获取元素class
var getCls = function (element) {
    return element.getAttribute("class");
}
//设置元素class
var setCls = function (element,cls) {
    element.setAttribute("class",cls);
}
//为当前元素增加class
var addCls = function (element,cls) {
    //获取当前class属性值
    var baseCls = getCls(element);
    if (baseCls.indexOf(cls)===-1){
        element.setAttribute("class",baseCls+" "+cls);
    }
}
//为当前元素移除class值
var removeCls = function (element,cls) {
    var baseCls = getCls(element);
    console.log(baseCls);
    console.log(baseCls.indexOf(cls));
    if (baseCls.indexOf(cls) !=-1){
        console.log(element,baseCls.split(cls));
        setCls(element,baseCls.split(cls).join(" ").replace(/\s+/g," "));
    }
}
//当前document设置动画元素
var screenAnimateElements={
    ".screen-1": [
        ".header",
        ".screen-1__heading",
        ".screen-1__subheading"
            ],
    ".screen-2": [
        ".screen-2__heading",
        ".screen-2__hr",
        ".screen-2__subheading",
        ".screen-2__photo-i-2",
        ".screen-2__photo-i-3"
    ],
    ".screen-3":[
        ".screen-3__photo",
        ".screen-3__heading",
        ".screen-3__hr",
        ".screen-3__subheading",
        ".screen-3-class"
    ],
    ".screen-4": [
        ".screen-4__heading",
        ".screen-4__hr",
        ".screen-4__subheading",
        ".screen-4__introduce-item-i-1",
        ".screen-4__introduce-item-i-2",
        ".screen-4__introduce-item-i-3",
        ".screen-4__introduce-item-i-4"
    ],
    ".screen-5":[
        ".screen-5__heading",
        ".screen-5__hr",
        ".screen-5__subheading",
        ".screen-5__photo"
    ]
}
//设置当前屏幕点击事件
var setScreenAnimate=function (screenCls) {
    var screen = getEle(screenCls);//获取当前屏幕
    var screenAnimate = screenAnimateElements[screenCls];//获取当前屏幕动画元素
    //设置初始化，只执行一次
    var isAnimateInit = false;
    //动画是否设置
    var isAnimateDone = false;
    //为当前屏幕注册点击事件
    screen.onclick=function () {
        //初始化 所有元素
        if (isAnimateInit===false){
            for (var i= 0;i<screenAnimate.length;i++){
                addCls(getEle(screenAnimate[i])," "+screenAnimate[i].substr(1)+"-animate-init");
            }
            isAnimateInit=true;
        }
        //为当前屏幕元素设置动画
        if (!isAnimateDone){
            for (var i= 0;i<screenAnimate.length;i++){
                var baseCls= getCls(getEle(screenAnimate[i]));
                var screenElement = getEle(screenAnimate[i]);
                console.log(baseCls);
                // screenElement.setAttribute("class",baseCls.replace("-animate-init","-animate-done"))
                setCls(screenElement,baseCls.replace("-animate-init","-animate-done"));
            }
            isAnimateDone=true;
            return//一定要加return；否则函数一直会是初始化状态
        }
        if (isAnimateDone){
            for (var i= 0;i<screenAnimate.length;i++){
                var baseCls= getCls(getEle(screenAnimate[i]));
                var screenElement = getEle(screenAnimate[i]);
                console.log(baseCls);
                // screenElement.setAttribute("class",baseCls.replace("-animate-done","-animate-init"))
                setCls(screenElement,baseCls.replace("-animate-done","-animate-init"));
            }
            isAnimateDone=false;
            return;
        }
    }
}
for (k in screenAnimateElements){

    setScreenAnimate(k);
}