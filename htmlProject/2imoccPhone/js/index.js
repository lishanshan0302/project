//获取元素
var getEle = function (select) {
    return document.querySelector(select);
}
//获取all元素
var getAllEle = function (select) {
    return document.querySelectorAll(select);
}
//获取属性
var getCls= function (element) {
    return element.getAttribute("class");
}
//设置属性
var setCls = function (element,cls) {
    element.setAttribute("class",cls);
}
//增加属性
var addCls = function (element,cls) {
    var baseCls = element.getAttribute("class");
    if (baseCls.indexOf(cls)===-1){
        element.setAttribute("class",baseCls+" "+cls);
    }
}
//删除属性
var removeCls = function (element,cls) {
    var baseCls = element.getAttribute("class");
    if (baseCls.indexOf(cls)!= -1){
        //匹配所有空白字符将其替换为一个空格
        element.setAttribute("class",baseCls.split(cls).join(" ").replace(/\s+/g," "));
    }
}
//获得页面向左、向上卷动的距离
function getScroll(){
    return {
        left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
        top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    };
}
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
        ".screen-3__features__item"
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
var navItems=getAllEle(".header__nav-item");//导航栏菜单
var outlineItems=getAllEle(".outline__item");//固定栏菜单
//初始化所有元素动画
var setScreenAnimateInit=function(screenCls){
    var screen = document.querySelector(screenCls);//获取当前屏元素
    var animateElements = screenAnimateElements[screenCls];//需要设置动画的元素
    for (var i = 0; i < animateElements.length; i++) {
        var element = document.querySelector(animateElements[i]);
        var baseCls = element.getAttribute("class");
        element.setAttribute("class", baseCls + " " + animateElements[i].substr(1) + '-animate-init');
    }
}
//设置屏内的动画播放
var playCreenAnimateDone = function (screenCls) {
    var screen = document.querySelector(screenCls);//获取当前屏元素
    var animateElements = screenAnimateElements[screenCls];//需要设置动画的元素
    for (var i = 0; i < animateElements.length; i++) {
        element = document.querySelector(animateElements[i]);
        baseCls = element.getAttribute("class");
        element.setAttribute("class", baseCls.replace('-animate-init', '-animate-done'));
    }
}
//页面加载完成初始化所有元素动画
window.onload=function () {
    for ( k in screenAnimateElements) {
        //跳过第一屏
        if (k === ".screen-1"){//注意是三个等于 如果写一个=会导致bug
            continue;
        }
        setScreenAnimateInit(k);
    }
}

//页面滚动到一定高度之后动画完成
window.onscroll=function () {
    // playCreenAnimateDone('.screen-1');
    var top =document.documentElement.scrollTop;//获取页面滚动高度
    if (top>80){
       addCls(getEle('.header'),'header-status-black');
       addCls(getEle('.outline'),'outline-status-in');
    }else {
        removeCls(getEle('.header'),'header-status-black')
        removeCls(getEle('.outline'),'outline-status-in')
    }
    if (top>1){

        switchNavItemsActive(0);
        switchOutlineItems(0);
    }
    for(var i= 0;i<5;i++){
        if (top>i*800-80){
            playCreenAnimateDone('.screen-'+(i+1));
            switchNavItemsActive(i);
            switchOutlineItems(i);
        }
    }

}
// // 导航条固定导航双向绑定
//
// //直接绑定事件无法生效
// // for(var i = 0;i<items.length;i++) {
// //     items[i].onclick=function () {
// //         alert(i);
// //         // document.documentElement.scrollTop=i*800;
// //     }
// // }
//
//切换装填
var switchNavItemsActive=function (index) {
    for (var i = 0;i<navItems.length;i++){
        removeCls(navItems[i],"header__nav-item-status-active");
    }
    addCls(navItems[index],'header__nav-item-status-active');
}
var switchOutlineItems=function (index) {
    for (var i = 0;i<outlineItems.length;i++){
        removeCls(outlineItems[i],"outline__item__status-active");
    }
    addCls(outlineItems[index],'outline__item__status-active');
}
//闭包
//setNavJump作为一个函数，里面有变量i，然后onclick作为其内部函数，也使用了变量i，
// 每一个onclick函数都具有自己的变量作用域，在不用的变量作用域之内有不同的i
var setNavJump=function (i,ele) {
    ele[i].onclick=function () {
        document.documentElement.scrollTop=i*800;
    }
}
for(var i = 0;i<navItems.length;i++){
    setNavJump(i,navItems);
}
for(var i = 0;i<outlineItems.length;i++){
    setNavJump(i,outlineItems);
}
//设置导航条的滑动效果
var navTip = getEle(".header__nav-tip");//获取下方滑动条
var setTip = function (index,lib) {//设置下方滑动条效果
    //当前索引滑动
    lib[index].onmouseover=function () {
        navTip.style.left=(index*70)+"px";
    }
    var activeIndex=0;
    //每次离开返回当前页面导航下方
    lib[index].onmouseout=function () {
        for (var i = 0;i<lib.length;i++){
            //找到当前页面索引下标
            if (getCls(lib[i]).indexOf("header__nav-item-status-active")!=-1){
                activeIndex=i;
                break;
            }
        }
        //设置导航滑动条位置
        navTip.style.left=(activeIndex*70)+"px";
    }
}
//为每一个导航条设置滑动函数
for(i=0;i<navItems.length;i++){
    setTip(i,navItems)
}
//为第一屏设置自动播放
setInterval(function () {
    playCreenAnimateDone('.screen-1');
},200);