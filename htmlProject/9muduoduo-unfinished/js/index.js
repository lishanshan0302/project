(function ($) {
    //menu
    $('.menu').dropdown({
        css3: true,
        js: false,
        animation: "fade",
        delay: 0,
        active: "menu"
    })
    var dropdown = {};
    //category
    $('#banner-category').find(".dropdown")
        .on('dropdown-show', function (e) {
            dropdown.loadOnce($(this), dropdown.bulidCategoryDetails);
        })
        .dropdown({
            css3: true,
            js: false,
            animation: "slideLeftRight",
        })
    dropdown.loadOnce = function ($elem, success) {
        var dataLoaded = $elem.data('load');
        if (!dataLoaded) return;
        if (!$elem.data('loaded')) {
            $elem.data('loaded', true);
            $.getJSON(dataLoaded).done(function (data) {
                if (typeof success === "function") success($elem, data);
            }).fail(function () {
                //标记未加载
                $elem.data('loaded', false);
            })
        }
    }
    dropdown.bulidCategoryDetails = function ($elem, data) {
        var html = '';
        if (data.length===0)return;
        for (var i=0;i<data.length;i++){
            html+='<dl class="category-detail cf">'+
                    '<dt class="category-detail-title fl">'+
                        '<a href="###" target="_blank" class="category-detail-title-link">'+data[i].title+'</a>'+
                    '</dt>'+'<dd class="category-detail-item fl">'
             for (var j=0;j<data[i].items.length;j++){
                 html+= '<a href="##" target="_blank" class="link">'+data[i].items[j]+'</a>';
             }
             html+='</dd></dl>'
        }
       $elem.find('.dropdown-layer').html(html);
    }
    //search
    var search = {};
    search.$headerSearch = $("#logo-search");
    search.$headerSearch.html = "";
    //最大显示数量
    search.$headerSearch.maxNum = 10;
    search.$headerSearch.on("search-getData", function (e, data) {
        var $this = $(this);
        search.$headerSearch.html = search.$headerSearch.creatHeaderSearchLayer(data, search.$headerSearch.maxNum);
        //渲染页面
        $this.search("appendLayer", search.$headerSearch.html)
        // $layer.html(html);
        if (search.$headerSearch.html) {
            $this.search("showLayer")
        } else {
            $this.search("hideLayer")
        }
    }).on("search-noData", function (e) {
        //先隐藏再清空
        $(this).search("hideLayer").search("appendLayer", "");
    }).on("click", ".search-layer-item", function () {
        search.$headerSearch.search("setInputVal", $(this).html());
        search.$headerSearch.search("submit");
    })
    search.$headerSearch.search({
        // url:"",
        autocomplete: true,
        css3: false,
        js: false,
        animation: "fade",
        getDataInterval: 0
    })
    search.$headerSearch.creatHeaderSearchLayer = function (data, maxNum) {
        var dataNum = data["result"].length,
            html = "";
        if (dataNum === 0) {
            return "";
        } else {
            for (var i = 0; i < dataNum; i++) {
                if (i > maxNum) break;
                html += '<li class="search-layer-item text-ellipsis">' + data["result"][i][0] + '</li>';
            }
            return html;
        }
    };

    // lazyLoad
    var lazyLoad = {};
    lazyLoad.lazyUntil = function (options) {
        //用于标记加载过与否
        var items = {},
            //用于标记加载次数
            loadedItemNum = 0,
            $elem = options.$container,
            id = options.id,
            //待加载总数量
            loadItemFn = null;
        $elem.on(options.triggerEvent, loadItemFn = function (e, index, elem) {
            if (items[index] !== 'loaded') {
                $elem.trigger(id + '-loadItems', [index, elem, function () {
                    //按需加载
                    items[index] = 'loaded';
                    loadedItemNum++;
                    // console.log(index + ":loaded");
                    if (loadedItemNum === options.totalItemNum) {
                        //清除事件
                        $elem.trigger(id + '-itemsLoaded');
                        //
                    }
                }]);
            }
        })
        $elem.on(id + '-itemsLoaded', function (e) {
            console.log(id + '-itemsLoaded');
            //清除事件
            $elem.off(options.triggerEvent, loadItemFn);
            // $win.off('scroll resize',timeToShow);
        })
    }
    lazyLoad.isVisible = function (floorData) {
        //页面可视区域的高度加页面滚动高度大于元素上边沿距离顶部高度时，元素位于可视区域之外---下边界
        //页面滚动高度小于元素自身高度以及页面滚动高度之和----上边界
        return (floor.$win.height() + floor.$win.scrollTop() > floorData.offsetTop) && (floor.$win.scrollTop() < floorData.offsetTop + floorData.height);
    }
    lazyLoad.lazyLoad = function ($elem) {
        //用于标记加载过与否
        $elem.items = [];
        //用于标记加载次数
        $elem.loadedItemNum = 0;
        //待加载总数量
        $elem.totalItemNum = $elem.find(".slider-img").length;
        $elem.on("slider-show", $elem.loadItem = function (e, index, elem) {
            if ($elem.items[index] !== 'loaded') {
                $elem.trigger('slider-loadItem', [index, elem]);
            }
        })
        $elem.on('slider-loadItem', function (e, index, elem) {
            //按需加载
            var $imgs = $(elem).find(".slider-img");
            //由于默认只加载一次 所以需要循环一下
            //_ 表明该参数不用，只是为了引出下一个参数；
            $imgs.each(function (_, el) {
                var $img = $(el);
                imgLoader.loadImg($img.data('src'), function (url) {
                    $img.attr('src', url);
                    $elem.items[index] = 'loaded';
                    $elem.loadedItemNum++;
                    // console.log(index + ":loaded");
                    if ($elem.loadedItemNum === $elem.totalItemNum) {
                        //清除事件
                        $elem.trigger('slider-itemsLoaded');
                        //
                    }
                }, function (url) {
                    console.log("从" + url + '加载图片失败');
                    //多加载一次
                    //显示备用图片
                    $img.attr('src', 'img/focus-slider/placeholder.png')
                })
            })
        })
        $elem.on('slider-itemsLoaded', function (e) {
            console.log('itemsLoaded');
            //清除事件
            $elem.off("slider-show", $elem.loadItem);
        })
    }

    // imgLoader
    var imgLoader = {}
    imgLoader.loadImgs = function ($imgs, success, fail) {
        $imgs.each(function (_, el) {
            var $img = $(el);
            imgLoader.loadImg($img.data('src'), function (url) {
                $img.attr('src', url);
                success();
            }, function (url) {
                console.log("从" + url + '加载图片失败');
                //多加载一次
                //显示备用图片
                fail($img, url);
            })
        })
    }
    imgLoader.loadImg = function (url, imgLoaded, imgFailed) {
        var image = new Image();
        image.onerror = function () {
            if (typeof imgFailed === 'function') imgFailed(url);
        }
        image.onload = function () {
            if (typeof imgLoaded === 'function') imgLoaded(url);
        };
        // image.src=url;
        setTimeout(function () {
            image.src = url;
        }, 1000);
    };


    //slider
    //轮播图
    var slider={};
    slider.$bannerSlider=$('#banner-slider');
    slider.$todaySlider=$('#today-slider');
    //延迟加载
    slider.$bannerSlider.on('banner-loadItems', function (e, index, elem, success) {
        console.log(1)
        imgLoader.loadImgs($(elem).find('.slider-img'), success, function ($img, url) {
            $img.attr('src', 'img/focus-slider/placeholder.png')
        })
    })
    //调用
    lazyLoad.lazyUntil({
        $container: slider.$bannerSlider,
        totalItemNum: slider.$bannerSlider.find('.slider-img').length,
        triggerEvent: 'slider-show',
        id: 'banner'
    })
    slider.$bannerSlider.slider({
        css3: true,
        js: false,
        animation: 'fade', //slider
        activeIndex: 0,//默认显示第几张
        Interval: 0//自动切换功能
    })

    //today-slider
    //延迟加载
    slider.$todaySlider.on('today-loadItems', function (e, index, elem, success) {
        // console.log(1)
        imgLoader.loadImgs($(elem).find('.slider-img'), success, function ($img, url) {
            $img.attr('src', 'img/todays-slider/placeholder.png')
        })
    })
    //调用
    lazyLoad.lazyUntil({
        $container: slider.$todaySlider,
        totalItemNum: slider.$todaySlider.find('.slider-img').length,
        triggerEvent: 'slider-show',
        id: 'today'
    })
    slider.$todaySlider.slider({
        css3: true,
        js: false,
        animation: 'fade', //slider
        activeIndex: 0,//默认显示第几张
        Interval: 0//自动切换功能
    })
})(jQuery)