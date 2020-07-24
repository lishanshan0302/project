//获取元素
var getEle = function (cls) {
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
var setCls = function (element, cls) {
    element.setAttribute("class", cls);
}
//为当前元素增加class
var addCls = function (element, cls) {
    //获取当前class属性值
    var baseCls = getCls(element);
    if (baseCls.indexOf(cls) === -1) {
        element.setAttribute("class", baseCls + " " + cls);
    }
}
//为当前元素移除class值
var removeCls = function (element, cls) {
    var baseCls = getCls(element);
    if (baseCls.indexOf(cls) != -1) {
        setCls(element, baseCls.split(cls).join(" ").replace(/\s+/g, " "));
    }
}
//当前document设置动画元素
var screenAnimateElements = {
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
    ".screen-3": [
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
    ".screen-5": [
        ".screen-5__heading",
        ".screen-5__hr",
        ".screen-5__subheading",
        ".screen-5__photo"
    ]
}

//获取头部
var header = getEle(".header");
//获取导航
var nav = getAllEle("header__nav");
//获取导航列表
var navTems = getAllEle(".header__nav-item");
//获取侧面导航
var outLine = getEle(".outline");
//获取侧面导航列表
var outLineItem = getAllEle(".outline__item");
//获取底部线条
var bottomLine = getEle(".header__bottomLine");
//获取呼吸灯元素
var intruduce =getAllEle(".screen-3-class-item");
//设置索引
var avtiveIndex=0;

//初始化页面元素动画函数
var setScreenAnimateInit = function (screenCls) {
    var screenAnimate = screenAnimateElements[screenCls];//获取当前屏幕动画元素
    //元素初始化
    for (var i = 0; i < screenAnimate.length; i++) {
        addCls(getEle(screenAnimate[i]), " " + screenAnimate[i].substr(1) + "-animate-init");
    }
    //获取屏幕滚动高度

}

//设置页面动画函数
var setScreenAnimateDone = function (screenCls) {
    var screenAnimate = screenAnimateElements[screenCls];//获取当前屏幕动画元素
    for (var i = 0; i < screenAnimate.length; i++) {
        var baseCls = getCls(getEle(screenAnimate[i]));
        var screenElement = getEle(screenAnimate[i]);
        // screenElement.setAttribute("class",baseCls.replace("-animate-init","-animate-done"))
        setCls(screenElement, baseCls.replace("-animate-init", "-animate-done"));
    }
}

//navITems状态切换函数
var switchNavItemsActive = function (index) {
    for (var i = 0;i<navTems.length;i++){
        removeCls(navTems[i],"header__nav-item--status-active")
    }
    addCls(navTems[index],"header__nav-item--status-active")

}
//outlineITem状态切换
var switchOutlineItemsActive = function (index) {
        for (var i = 0;i<outLineItem.length;i++){
            removeCls(outLineItem[i],"outline__item-active")
        }
        addCls(outLineItem[index],"outline__item-active")
}
//封装导航跳转函数
var setJump = function (ele, i) {
    ele.onclick = function () {
        document.documentElement.scrollTop = i * 640;
    }
}
//为导航绑定跳转
for (i = 0; i < navTems.length; i++) {
    setJump(navTems[i], i);
}
//为侧面导航绑定跳转
for (i = 0; i < outLineItem.length; i++) {
    setJump(outLineItem[i], i);

}

//页面加载所有动画元素初始化
window.onload = function () {
    for (k in screenAnimateElements) {
        if (k==".screen-1"){
            continue;
        }
        setScreenAnimateInit(k);
    }
}
//页面滚动当前屏幕动画元素播放
window.onscroll = function () {
    var top = document.documentElement.scrollTop;
    //设置滚动时导航条样式
    if (top > 0) {
        addCls(header,"header-status-scroll");
        for (var i = 0; i < navTems.length; i++) {
            addCls(navTems[i], "header__nav-item--status-scroll");
        }
    } else {
        removeCls(header,"header-status-scroll");
        for (var i = 0; i < navTems.length; i++) {
            removeCls(navTems[i], "header__nav-item--status-scroll");
        }
    }
    //为侧边导航添加属性
    if (top > 400) {
        addCls(outLine, "outline-active");
    } else {
        removeCls(outLine, "outline-active");
    }

    //为每一屏添加动画
    for (var j = 0; j < 5; j++) {
        if (top > j * 640 - 120) {//老师为什么这一行的条件设置成top>j*i  就直接不执行这个循环了？难道是因为=0的时候跟上面条件一样？
            setScreenAnimateDone('.screen-' + (j + 1));
            //当前屏幕导航索引绑定状态
            switchNavItemsActive(j);
            //当前屏幕侧面导航索引绑定状态
            switchOutlineItemsActive(j);
            bottomLine.style.left=96*j+"px";
        }
        //呼吸灯效果
        if(j==2){
            for(var i = 0;i<intruduce.length;i++){
                addCls(intruduce[i],"screen-3-class-animate-duration")
            }
        }
    }
}
//导航条设置底部跳转

//封装函数
var setJumpActive = function (ele ,index) {
    navTems[index].onmouseover= function () {
        bottomLine.style.left=index*96+"px";
    }
    navTems[i].onmouseout=function () {
        for (var i = 0;i<navTems.length;i++){
            console.log(getCls(navTems[index]));
            if (getCls(navTems[index]).indexOf("header__nav-item--status-active")!=-1) {
                avtiveIndex = index;
                console.log(avtiveIndex)
                break;
            }
        }
        bottomLine.style.left=avtiveIndex*96+"px";
    }
}

//为每一个导航条注册事件
for (var i = 0;i<navTems.length;i++){
    setJumpActive(navTems[i],i);
}
//为侧边导航条注册点击事件
for (var i = 0;i<outLineItem.length;i++){
    //为每一个侧面导航添加属性
    outLineItem[i].setAttribute("Data-index",i);
    outLineItem[i].addEventListener('click',function () {
        avtiveIndex=this.getAttribute("Data-index");
        console.log(avtiveIndex)
        bottomLine.style.left=avtiveIndex*96+"px";
    })
}
//页面加载播放第一屏动画
setTimeout(function () {
    setScreenAnimateDone(".screen-1")
},100)
//呼吸灯效果
// if(top>500){
//     for(var i = 0;i<intruduce.length;i++){
//         addCls(intruduce[i],"screen-3-class-animate-duration")
//     }
// }


