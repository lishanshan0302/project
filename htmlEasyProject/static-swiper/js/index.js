window.onload=function(){
    //获取变量
    var navItems = document.getElementById("nav").getElementsByTagName("a"),//导航列表
        index = 0,
        main = document.getElementById("main"),
        imgArr = ["img/1.jpg", "img/2.jpg", "img/3.jpg", "img/4.jpg"],//图片数组
        timer = null,
        len = navItems.length,
        bannerItems = document.getElementById("banner").getElementsByClassName("banner-img");
//封装事件函数
    function addHandler(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, true);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
// 封装图片改变函数
    function changeImage() {
        for (var i = 0; i < len; i++) {
            navItems[i].className = "";
            bannerItems[i].style.display = "none";
        }
        navItems[index].className = "active";
        bannerItems[index].style.display = "block";
    }
//定时器
    function startAutoplay() {
        timer = setInterval(function () {
            index++;
            if (index >= len){
                index = 0;
            }
            console.log(index);
            changeImage();},1000);
    }
//清除定时器
    function stopAutoplay() {
        if(timer){
            clearInterval(timer);
        }
    }
    //自动播放
    startAutoplay();
    //鼠标进入nav停止播放
    addHandler(main,"mouseover",function () {
        stopAutoplay();
    })
    //鼠标离开nav停止播放
    addHandler(main,"mouseout",function () {
        startAutoplay();
    })
    //导航栏点击事件
    for (var i = 0; i < len; i++) {
        //设置banner图片
        bannerItems[i].style.background = "url(" + imgArr[i] + ")";
        //为导航菜单添加点击事件
        navItems[i].setAttribute("data-index", i);
        addHandler(navItems[i], "click", function () {
            index = this.getAttribute("data-index");
            changeImage();
        })
    }
}


