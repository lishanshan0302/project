(function () {
    //通过一个对象接部分全局变量，以免暴露过多的全局变量
    var dropdown = {}
    //menu
    $(".menu").on("dropdown-show", function (e) {
        dropdown.loadOnce($(this), dropdown.bulidMenuItem);
    })
        .dropdown({
            css3: true,
            js: false,
            delay: 0,
        })
    dropdown.bulidMenuItem = function ($elem, data) {
        var html = "";
        if (data.length === 0) return;
        for (var i = 0; i < data.length; i++) {
            html += '<li><a href="' + data[i].url + '" target="_blank" class="menu-item">' + data[i].name + '</a></li>'
        }
        $elem.find(".dropdown-layer").html(html);
    };

    //cart
    $(".cart").on("dropdown-show", function (e) {
        dropdown.loadOnce($(this), dropdown.bulidCartItem);
    })
        .dropdown({
            css3: true,
            js: false,
            delay: 0,
        })
    dropdown.bulidCartItem = function ($elem, data) {
        var $cartCountTotal = $elem.find(".cart-count-total"),
            total = 0,
            html = "";
        if (data.length !== 0) {
            setTimeout(function () {
                var dataLength = data.length;
                for (var i = 0; i < dataLength; i++) {
                    total += data[i]['count'] * data[i]['price'];
                    html += '<li class="cart-item">' +
                        '<div class="cart-img fl">' +
                        '<a href="###" target="_blank">' +
                        '<img src="' + data[i].url + '" alt="' + data[i].detail + '">' +
                        '</a>' +
                        '</div>' +
                        '<div class="cart-detail fl">' +
                        '<div class="cart-detail-title word-nowrap fl">' + data[i].detail + '</div>' +
                        '<div class="cart-detail-price fl">￥' +
                        '<strong class="price">' + data[i]['price'] + '</strong>&nbsp;x' +
                        '<strong class="cart-detail-count">' + data[i]['count'] + '</strong>' +
                        '</div>' +
                        '</div>' +
                        '<div class="cart-delete fr">' + '<i class="icon">' + '&#xe60a;' + '</i></div>' +
                        '</li>'
                }
                total = dropdown.keepTwoDecimalFull(total);
                $elem.find(".dropdown-layer").html('<div class="cart-bd">' + '<strong>' + '最新加入的宝贝' + '</strong></div>' +
                    '<ul class="cart-content">' + html + '</ul>' + '<div class="cart-ft ">' + '共 ' + '<strong>' + dataLength + '</strong>' + ' 件商品' + '&nbsp;&nbsp;共计<strong class="cart-ft-price">' + total + '</strong>' + ' <a href="###"' + 'class="cart-ft-linkCart fr">' + '去购物车' + '</a>' + ' </div>');
                $cartCountTotal.text(dataLength)
            }, 1000)
        } else {
            html = '<div class="cart-empty">' +
                '<div class="icon fl"> &#xe608;</div>' +
                '<div class="fl">' + '<i> 购物车还没有商品<br/>赶紧去选购吧！</i>' + '</div>' +
                '</div>'
            $elem.find(".dropdown-layer").html(html);
        }
    };
    //ajax只加载一次
    dropdown.loadOnce = function ($elem, success) {
        //从元素data-load自定义属性内获取加载地址
        var dataLoad = $elem.data("load");
        //无地址直接返回
        if (!dataLoad) return;
        //如果未加载过
        if (!$elem.data("loaded")) {
            //标记加载
            $elem.data('loaded', true);
            //确保异步请求只调用一次，以免重复渲染页面，请求数据，如果成功时执行
            $.getJSON(dataLoad).done(function (data) {
                //如果传入的回调函数类型为函数时执行，传入jq对象以及ajax返回data数据
                if (typeof success === "function") success($elem, data);
            }).fail(function () {
                //标记未加载
                $elem.data('loaded', false);
            });
        }
    };

    //search
    var search = {};
    search.$headerSearch = $("#header-search");
    search.$headerSearch.html = "";
    //最大显示数量
    search.$headerSearch.maxNum = 10;
    search.$headerSearch.on("search-getData", function (e, data) {
        var $this = $(this);
        // console.log(e.type)
        // console.log(data);
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

    // category
    $("#focus-category").find(".dropdown").on("dropdown-show", function (e) {
        dropdown.loadOnce($(this), dropdown.bulidCategoryDetails);
    })
        .dropdown({
            css3: true,
            js: true,
            animation: "fadeSlideLeftRight"
        })
    dropdown.bulidCategoryDetails = function ($elem, data) {
        var html = "";
        if (data.length === 0) return;
        for (var i = 0; i < data.length; i++) {
            html += '<dl class="category-detail cf">' + '<dt class="category-detail-title fl">' +
                '<a href="##"' + 'target="_blank" ' + 'class="category-detail-title-link">' + data[i]['title'] + '</a>' +
                ' </dt>' + '<dd class="category-detail-item fl">';
            for (var j = 0; j < data[i]['items'].length; j++) {
                html += '<a href="###"' + 'target="_blank"' + 'class="link">' + data[i]['items'][j] + '</a>';

            }
            html = html + '</dd></dl>';
        }
        $elem.find(".dropdown-layer").html(html);
    };
    //四舍五入保留2位小数（不够位数，则用0替补）
    dropdown.keepTwoDecimalFull = function (num) {
        var result = parseFloat(num);
        if (isNaN(result)) {
            alert('传递参数错误，请检查！');
            return false;
        }
        result = Math.round(num * 100) / 100;
        var s_x = result.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    }


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

    //focus-slider
    var slider = {};
    slider.$focusSlider = $('#focus-slider');
    slider.$focusSlider.on('focus-loadItems', function (e, index, elem, success) {
        imgLoader.loadImgs($(elem).find('.slider-img'), success, function ($img, url) {
            $img.attr('src', 'img/focus-slider/placeholder.png')
        })
    })
    lazyLoad.lazyUntil({
        $container: slider.$focusSlider,
        totalItemNum: slider.$focusSlider.find('.slider-img').length,
        triggerEvent: 'slider-show',
        id: 'focus'
    })
    slider.$focusSlider.slider({
        css3: true,
        js: false,
        animation: 'fade', //slide
        activeIndex: 0,
        Interval: 0//自动播放间隔
    })
    //today-slider
    slider.$todaysSlider = $('#todays-slider');
    slider.$todaysSlider.on('todays-loadItems', function (e, index, elem, success) {
        imgLoader.loadImgs($(elem).find('.slider-img'), success, function ($img, url) {
            $img.attr('src', 'img/todays-slider/placeholder.png')
        })
    })
    lazyLoad.lazyUntil({
        $container: slider.$todaysSlider,
        totalItemNum: slider.$todaysSlider.find('.slider-img').length,
        triggerEvent: 'slider-show',
        id: 'todays'
    })
    slider.$todaysSlider.slider({
        css3: true,
        js: false,
        animation: 'slide', //slide
        activeIndex: 0,
        Interval: 0//自动播放间隔
    })

    //floor
    var floor = {};
    floor.$floor = $(".floor");
    floor.floorData = [{
        num: '1',
        text: '服装鞋包',
        tabs: ['大牌', '男装', '女装'],
        offsetTop: floor.$floor.eq(0).offset().top,
        height: floor.$floor.eq(0).height(),
        items: [
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }],
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }],
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }]
        ]
    }, {
        num: '2',
        text: '个护美妆',
        tabs: ['热门', '国际大牌', '国际名品'],
        offsetTop: floor.$floor.eq(1).offset().top,
        height: floor.$floor.eq(1).height(),
        items: [
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }],
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }],
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }]
        ]
    },
        {
            num: '3',
            text: '手机通讯',
            tabs: ['热门', '品质优选', '新机尝鲜'],
            offsetTop: floor.$floor.eq(2).offset().top,
            height: floor.$floor.eq(2).height(),
            items: [
                [{
                    name: '摩托罗拉 Moto Z Play',
                    price: 3999
                }, {
                    name: 'Apple iPhone 7 (A1660)',
                    price: 6188
                }, {
                    name: '小米 Note 全网通 白色',
                    price: 999
                }, {
                    name: '小米5 全网通 标准版 3GB内存',
                    price: 1999
                }, {
                    name: '荣耀7i 海岛蓝 移动联通4G手机',
                    price: 1099
                }, {
                    name: '乐视（Le）乐2（X620）32GB',
                    price: 1099
                }, {
                    name: 'OPPO R9 4GB+64GB内存版',
                    price: 2499
                }, {
                    name: '魅蓝note3 全网通公开版',
                    price: 899
                }, {
                    name: '飞利浦 X818 香槟金 全网通4G',
                    price: 1998
                }, {
                    name: '三星 Galaxy S7（G9300）',
                    price: 4088
                }, {
                    name: '华为 荣耀7 双卡双待双通',
                    price: 1128
                }, {
                    name: '努比亚(nubia)Z7Max(NX505J)',
                    price: 728
                }],
                [{
                    name: '摩托罗拉 Moto Z Play',
                    price: 3999
                }, {
                    name: 'Apple iPhone 7 (A1660)',
                    price: 6188
                }, {
                    name: '小米 Note 全网通 白色',
                    price: 999
                }, {
                    name: '小米5 全网通 标准版 3GB内存',
                    price: 1999
                }, {
                    name: '荣耀7i 海岛蓝 移动联通4G手机',
                    price: 1099
                }, {
                    name: '乐视（Le）乐2（X620）32GB',
                    price: 1099
                }, {
                    name: 'OPPO R9 4GB+64GB内存版',
                    price: 2499
                }, {
                    name: '魅蓝note3 全网通公开版',
                    price: 899
                }, {
                    name: '飞利浦 X818 香槟金 全网通4G',
                    price: 1998
                }, {
                    name: '三星 Galaxy S7（G9300）',
                    price: 4088
                }, {
                    name: '华为 荣耀7 双卡双待双通',
                    price: 1128
                }, {
                    name: '努比亚(nubia)Z7Max(NX505J)',
                    price: 728
                }],
                [{
                    name: '摩托罗拉 Moto Z Play',
                    price: 3999
                }, {
                    name: 'Apple iPhone 7 (A1660)',
                    price: 6188
                }, {
                    name: '小米 Note 全网通 白色',
                    price: 999
                }, {
                    name: '小米5 全网通 标准版 3GB内存',
                    price: 1999
                }, {
                    name: '荣耀7i 海岛蓝 移动联通4G手机',
                    price: 1099
                }, {
                    name: '乐视（Le）乐2（X620）32GB',
                    price: 1099
                }, {
                    name: 'OPPO R9 4GB+64GB内存版',
                    price: 2499
                }, {
                    name: '魅蓝note3 全网通公开版',
                    price: 899
                }, {
                    name: '飞利浦 X818 香槟金 全网通4G',
                    price: 1998
                }, {
                    name: '三星 Galaxy S7（G9300）',
                    price: 4088
                }, {
                    name: '华为 荣耀7 双卡双待双通',
                    price: 1128
                }, {
                    name: '努比亚(nubia)Z7Max(NX505J)',
                    price: 728
                }]
            ]
        }, {
            num: '4',
            text: '家用电器',
            tabs: ['热门', '大家电', '生活电器'],
            offsetTop: floor.$floor.eq(3).offset().top,
            height: floor.$floor.eq(3).height(),
            items: [
                [{
                    name: '暴风TV 超体电视 40X 40英寸',
                    price: 1299
                }, {
                    name: '小米（MI）L55M5-AA 55英寸',
                    price: 3699
                }, {
                    name: '飞利浦HTD5580/93 音响',
                    price: 2999
                }, {
                    name: '金门子H108 5.1套装音响组合',
                    price: 1198
                }, {
                    name: '方太ENJOY云魔方抽油烟机',
                    price: 4390
                }, {
                    name: '美的60升预约洗浴电热水器',
                    price: 1099
                }, {
                    name: '九阳电饭煲多功能智能电饭锅',
                    price: 159
                }, {
                    name: '美的电烤箱家用大容量',
                    price: 329
                }, {
                    name: '奥克斯(AUX)936破壁料理机',
                    price: 1599
                }, {
                    name: '飞利浦面条机 HR2356/31',
                    price: 665
                }, {
                    name: '松下NU-JA100W 家用蒸烤箱',
                    price: 1799
                }, {
                    name: '飞利浦咖啡机 HD7751/00',
                    price: 1299
                }],
                [{
                    name: '暴风TV 超体电视 40X 40英寸',
                    price: 1299
                }, {
                    name: '小米（MI）L55M5-AA 55英寸',
                    price: 3699
                }, {
                    name: '飞利浦HTD5580/93 音响',
                    price: 2999
                }, {
                    name: '金门子H108 5.1套装音响组合',
                    price: 1198
                }, {
                    name: '方太ENJOY云魔方抽油烟机',
                    price: 4390
                }, {
                    name: '美的60升预约洗浴电热水器',
                    price: 1099
                }, {
                    name: '九阳电饭煲多功能智能电饭锅',
                    price: 159
                }, {
                    name: '美的电烤箱家用大容量',
                    price: 329
                }, {
                    name: '奥克斯(AUX)936破壁料理机',
                    price: 1599
                }, {
                    name: '飞利浦面条机 HR2356/31',
                    price: 665
                }, {
                    name: '松下NU-JA100W 家用蒸烤箱',
                    price: 1799
                }, {
                    name: '飞利浦咖啡机 HD7751/00',
                    price: 1299
                }],
                [{
                    name: '暴风TV 超体电视 40X 40英寸',
                    price: 1299
                }, {
                    name: '小米（MI）L55M5-AA 55英寸',
                    price: 3699
                }, {
                    name: '飞利浦HTD5580/93 音响',
                    price: 2999
                }, {
                    name: '金门子H108 5.1套装音响组合',
                    price: 1198
                }, {
                    name: '方太ENJOY云魔方抽油烟机',
                    price: 4390
                }, {
                    name: '美的60升预约洗浴电热水器',
                    price: 1099
                }, {
                    name: '九阳电饭煲多功能智能电饭锅',
                    price: 159
                }, {
                    name: '美的电烤箱家用大容量',
                    price: 329
                }, {
                    name: '奥克斯(AUX)936破壁料理机',
                    price: 1599
                }, {
                    name: '飞利浦面条机 HR2356/31',
                    price: 665
                }, {
                    name: '松下NU-JA100W 家用蒸烤箱',
                    price: 1799
                }, {
                    name: '飞利浦咖啡机 HD7751/00',
                    price: 1299
                }]
            ]
        }, {
            num: '5',
            text: '电脑数码',
            tabs: ['热门', '电脑/平板', '潮流影音'],
            offsetTop: floor.$floor.eq(4).offset().top,
            height: floor.$floor.eq(4).height(),
            items: [
                [{
                    name: '戴尔成就Vostro 3800-R6308',
                    price: 2999
                }, {
                    name: '联想IdeaCentre C560',
                    price: 5399
                }, {
                    name: '惠普260-p039cn台式电脑',
                    price: 3099
                }, {
                    name: '华硕飞行堡垒旗舰版FX-PRO',
                    price: 6599
                }, {
                    name: '惠普(HP)暗影精灵II代PLUS',
                    price: 12999
                }, {
                    name: '联想(Lenovo)小新700电竞版',
                    price: 5999
                }, {
                    name: '游戏背光牧马人机械手感键盘',
                    price: 499
                }, {
                    name: '罗技iK1200背光键盘保护套',
                    price: 799
                }, {
                    name: '西部数据2.5英寸移动硬盘1TB',
                    price: 419
                }, {
                    name: '新睿翼3TB 2.5英寸 移动硬盘',
                    price: 849
                }, {
                    name: 'Rii mini i28无线迷你键盘鼠标',
                    price: 349
                }, {
                    name: '罗技G29 力反馈游戏方向盘',
                    price: 2999
                }],
                [{
                    name: '戴尔成就Vostro 3800-R6308',
                    price: 2999
                }, {
                    name: '联想IdeaCentre C560',
                    price: 5399
                }, {
                    name: '惠普260-p039cn台式电脑',
                    price: 3099
                }, {
                    name: '华硕飞行堡垒旗舰版FX-PRO',
                    price: 6599
                }, {
                    name: '惠普(HP)暗影精灵II代PLUS',
                    price: 12999
                }, {
                    name: '联想(Lenovo)小新700电竞版',
                    price: 5999
                }, {
                    name: '游戏背光牧马人机械手感键盘',
                    price: 499
                }, {
                    name: '罗技iK1200背光键盘保护套',
                    price: 799
                }, {
                    name: '西部数据2.5英寸移动硬盘1TB',
                    price: 419
                }, {
                    name: '新睿翼3TB 2.5英寸 移动硬盘',
                    price: 849
                }, {
                    name: 'Rii mini i28无线迷你键盘鼠标',
                    price: 349
                }, {
                    name: '罗技G29 力反馈游戏方向盘',
                    price: 2999
                }],
                [{
                    name: '戴尔成就Vostro 3800-R6308',
                    price: 2999
                }, {
                    name: '联想IdeaCentre C560',
                    price: 5399
                }, {
                    name: '惠普260-p039cn台式电脑',
                    price: 3099
                }, {
                    name: '华硕飞行堡垒旗舰版FX-PRO',
                    price: 6599
                }, {
                    name: '惠普(HP)暗影精灵II代PLUS',
                    price: 12999
                }, {
                    name: '联想(Lenovo)小新700电竞版',
                    price: 5999
                }, {
                    name: '游戏背光牧马人机械手感键盘',
                    price: 499
                }, {
                    name: '罗技iK1200背光键盘保护套',
                    price: 799
                }, {
                    name: '西部数据2.5英寸移动硬盘1TB',
                    price: 419
                }, {
                    name: '新睿翼3TB 2.5英寸 移动硬盘',
                    price: 849
                }, {
                    name: 'Rii mini i28无线迷你键盘鼠标',
                    price: 349
                }, {
                    name: '罗技G29 力反馈游戏方向盘',
                    price: 2999
                }]
            ]
        }];
    floor.bulidFloor = function (floorData) {
        var html = '';
        html += '<div class="container">';
        html += floor.bulidFloorHead(floorData)
        html += floor.bulidFloorBody(floorData)
        html += '</div>'
        return html;
    }
    floor.bulidFloorHead = function (floorData) {
        var html = "";
        html += '<div class="floor-head">'
        html += '<h2 class="floor-title fl">' +
            '<span class="floor-title-num">' + floorData.num + 'F</span>' +
            '<span class="floor-title-text">' + floorData.text + '</span>' +
            '</h2>' +
            ' <ul class="tab-item-wrap fr">';
        for (var i = 0; i < floorData.tabs.length; i++) {
            html += '<li class="fl"><a href="javascript:;" class="tab-item">' + floorData.tabs[i] + '</a></li>';
            if (i !== floorData.tabs.length - 1) {
                html += '<li class="floor-divider fl text-hidden">分隔线</li>'
            }
        }
        html += '</ul></div>';
        return html;
    }
    floor.bulidFloorBody = function (floorData) {
        var html = '';
        html += '<div class="floor-body">';
        for (var i = 0; i < floorData.items.length; i++) {
            html += '<ul class="tab-panel">';
            for (var j = 0; j < floorData.items[i].length; j++) {
                html += '<li class="floor-item fl">' +
                    '<p class="floor-item-pic">' +
                    '<a href="###" target="_blank">' +
                    '<img src="img/floor/loading.gif" class="floor-img" data-src="img/floor/' + floorData.num + '/' + (i + 1) + '/' + (j + 1) + '.png" alt="" />' +
                    '</a>' +
                    '</p>' +
                    '<p class="floor-item-name">' +
                    '<a href="###" target="_blank" class="link">' + floorData.items[i][j].name + '</a>' +
                    '</p>' +
                    '<p class="floor-item-price">' + floorData.items[i][j].price + '</p>' +
                    ' </li>';
            }
            html += '</ul>';
        }
        html += '</div>'
        return html;
    }
    // function lazyLoadFloorImgs($elem) {
    //     //用于标记加载过与否
    //     var items = {},
    //     //用于标记加载次数
    //         loadedItemNum = 0,
    //     //待加载总数量
    //         totalItemNum = $elem.find(".floor-img").length,
    //         loadItemFn=null;
    //     $elem.on("tab-show",loadItemFn = function (e, index, elem) {
    //         if (items[index] !== 'loaded') {
    //             $elem.trigger('tab-loadItem', [index, elem]);
    //         }
    //     })
    //     $elem.on('tab-loadItem', function (e, index, elem) {
    //         //按需加载
    //         var $imgs = $(elem).find('.floor-img');
    //         //由于默认只加载一次 所以需要循环一下
    //         //_ 表明该参数不用，只是为了引出下一个参数；
    //         $imgs.each(function (_, el) {
    //             var $img = $(el);
    //             slider.loadImg($img.data('src'), function (url) {
    //                 $img.attr('src', url);
    //                 items[index] = 'loaded';
    //                 loadedItemNum++;
    //                 console.log(index + ":loaded");
    //                 if (loadedItemNum === totalItemNum) {
    //                     //清除事件
    //                     $elem.trigger('tab-itemsLoaded');
    //                     //
    //                 }
    //             }, function (url) {
    //                 console.log("从" + url + '加载图片失败');
    //                 //多加载一次
    //                 //显示备用图片
    //                 $img.attr('src', 'img/floor/placeholder.png')
    //             })
    //         })
    //     })
    //     $elem.on('tab-itemsLoaded', function (e) {
    //         console.log('tab-itemsLoaded');
    //         //清除事件
    //         $elem.off("tab-show", loadItemFn);
    //     })
    // }
    //判断是否出现在可视区域
    floor.$win = $(window);
    floor.$doc = $(document);
    // function lazyLoadFloor() {
    //     //用于标记加载过与否
    //     var items = {},
    //     //用于标记加载次数
    //         loadedItemNum = 0,
    //     //待加载总数量
    //         totalItemNum = $floor.length,
    //         loadItemFn=null;
    //     $doc.on("floor-show",loadItemFn = function (e, index, elem) {
    //         if (items[index] !== 'loaded') {
    //             $doc.trigger('floors-loadItem', [index, elem]);
    //         }
    //     })
    //     $doc.on('floors-loadItem', function (e, index, elem) {
    //         //按需加载
    //             var html = bulidFloor(floorData[index]),
    //                 $elem = $(elem);
    //             items[index] = 'loaded';
    //             loadedItemNum++;
    //             console.log(index + ":loaded");
    //             if (loadedItemNum === totalItemNum) {
    //                 //清除事件
    //                 $doc.trigger('floors-itemsLoaded');
    //                 //
    //             }
    //             setTimeout(function () {
    //                 $elem.html(html);
    //                 lazyLoadFloorImgs($elem);
    //                 $elem.tab({
    //                     event:"mouseenter",//click
    //                     css3:false,
    //                     js:false,
    //                     animation:'fade',
    //                     activeIndex:0,
    //                     interval:0,
    //                     delay:0
    //                 })
    //             }, 1000)
    //         })
    //     $doc.on('floors-itemsLoaded', function (e) {
    //         console.log('floors-itemsLoaded');
    //         //清除事件
    //         $doc.off("floor-show", loadItemFn);
    //         $win.off('scroll resize',timeToShow);
    //     })
    // }
    floor.timeToShow = function () {
        floor.$floor.each(function (index, ele) {
            if (lazyLoad.isVisible(floor.floorData[index])) {
                // console.log(1)
                floor.$doc.trigger("floor-show", [index, ele]);
            }
        })
    }
    //页面滚动以及改变可视区域范围均会触发该事件
    floor.$win.on('scroll resize', floor.showFloor = function () {
        //每次滑动之后先清理定时器
        clearTimeout(floor.floorTimer);
        //执行定时器
        floor.floorTimer = setTimeout(floor.timeToShow, 250);
    });
    floor.$floor.on('floor-loadItems', function (e, index, elem, success) {
        imgLoader.loadImgs($(elem).find('.floor-img'), success, function ($img, url) {
            $img.attr('src', 'img/floor/placeholder.png')
        })
    })
    floor.$doc.on('floors-loadItems', function (e, index, elem, success) {
        //按需加载
        var html = floor.bulidFloor(floor.floorData[index]),
            $elem = $(elem);
        success();
        setTimeout(function () {
            $elem.html(html);
            // lazyLoadFloorImgs($elem);
            lazyLoad.lazyUntil({
                $container: $elem,
                totalItemNum: $elem.find(".floor-img").length,
                triggerEvent: 'tab-show',
                id: 'floor'
            })
            $elem.tab({
                event: "mouseenter",//click
                css3: false,
                js: false,
                animation: 'fade',
                activeIndex: 0,
                interval: 0,
                delay: 0
            })
        }, 1000)
    })
    floor.$doc.on('floors-itemsLoaded', function () {
        floor.$win.off('scroll resize', floor.showFloor);
    })
    //调用
    lazyLoad.lazyUntil({
        $container: floor.$doc,
        totalItemNum: floor.$floor.length,
        triggerEvent: 'floor-show',
        id: 'floors'
    })
    floor.timeToShow()

    //elevator
    //计算标识层
    floor.whichFloor = function () {
        //当前楼层
        var num = -1;
        floor.$floor.each(function (index, elem) {
            var floorData = floor.floorData[index];
            num = index;
            //页面滚动高度与可视区一半相加小于索引楼层距离顶部距离则当前楼层为索引值减一
            if (floor.$win.scrollTop() + floor.$win.height() / 2 < floorData.offsetTop) {
                num = index - 1;
                return false;
            }
        })
        return num;
    }
    //设置电梯
    floor.$elevator = $('#elevator');
    floor.$elevator.$items = floor.$elevator.find('.elevator-item');
    floor.setElevator = function () {
        var num = floor.whichFloor();
        if (num === -1) {
            floor.$elevator.fadeOut();
        } else {
            floor.$elevator.fadeIn();
            floor.$elevator.$items.removeClass("elevator-active");
            floor.$elevator.$items.eq(num).addClass("elevator-active");
        }
    }
    floor.$win.on('scroll resize', function () {
        //每次滑动之后先清理定时器
        clearTimeout(floor.elevatorTimer);
        //执行定时器
        floor.elevatorTimer = setTimeout(floor.setElevator, 250);
    });
    floor.$elevator.on('click', ".elevator-item", function () {
        $('html,body').animate({
            scrollTop: floor.floorData[$(this).index()].offsetTop
        })
    })
    // console.log(floor.whichFloor())

    //consumer
    var consumer = {};
    consumer.Data = [{
        title: '消费者保障',
        items: [
            '保障范围',
            '退货退款流程',
            '服务中心',
            '更多特色服务'
        ]
    }, {
        title: '新手上路',
        items: [
            '新手专区',
            '消费警示',
            '交易安全',
            '24小时在线帮助',
            '免费开店'
        ]
    }, {
        title: '付款方式',
        items: [
            '快捷支付',
            '信用卡',
            '余额包',
            '蜜蜂花啊',
            '货到付款'
        ]
    }, {
        title: '慕淘特色',
        items: [
            '手机慕淘',
            '慕淘信',
            '大众评审',
            'B格指南'
        ]
    }];
    consumer.$consumer = $(".consumer");
    //是否出现在可视区域
    consumer.isVisible = function ($elem) {
        //页面可视区域的高度加页面滚动高度大于元素上边沿距离顶部高度时，元素位于可视区域之外---下边界 底部只需判断一次
        return (floor.$win.height() + floor.$win.scrollTop() > $elem.offset().top);
    }
    consumer.timeToShow = function () {
        consumer.$consumer.each(function (index, ele) {
            if (consumer.isVisible($(ele))) {
                floor.$doc.trigger("consumer-show", [index, ele]);
            }
        })
    }
    consumer.bulidConsumer = function (data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<div class="consumer-group">' +
                '<span class="consumer-group-title">' + data[i].title + '</span>' +
                '<div class="consumer-group-detail">';
            for (var j = 0; j < data[i].items.length; j++) {
                html += '<a href="###" target="_blank" class="link">' + data[i].items[j] + '</a>'
            }
            html += '</div></div>'
        }
        html = '<div class="container">' + html + '</div>'
        return html;
    }
    // 页面滚动以及改变可视区域范围均会触发该事件
    floor.$win.on('scroll resize', consumer.showFloor = function () {
        //每次滑动之后先清理定时器
        clearTimeout(consumer.consumerTimer);
        //执行定时器
        consumer.consumerTimer = setTimeout(consumer.timeToShow, 250);
    });
    floor.$doc.on('consumer-loadItems', function (e, index, elem, success) {
        //按需加载
        var html = consumer.bulidConsumer(consumer.Data),
            $elem = $(elem);
        success();
        setTimeout(function () {
            console.log(1)
            $elem.html(html);
        }, 1000)
    })
    floor.$doc.on('consumer-itemsLoaded', function () {
        floor.$win.off('scroll resize', consumer.showFloor);
    })
    //调用
    lazyLoad.lazyUntil({
        $container: floor.$doc,
        totalItemNum: consumer.$consumer.length,
        triggerEvent: 'consumer-show',
        id: 'consumer'
    })
    consumer.timeToShow(consumer.$consumer);
    //help
    var help = {};
    help.$help = $('.help');
    help.Data = {
        "group": ['关于慕淘', '合作伙伴', '营销中心', '廉正举报', '联系客服', '开放平台', '诚征英才', '联系我们'],
        "copyright": '@2014 imooc.com All Right Reserved'
    }
    help.timeToShow = function () {
        help.$help.each(function (index, ele) {
            if (consumer.isVisible($(ele))) {
                floor.$doc.trigger("help-show", [index, ele]);
            }
        })
    }
    help.bulidHelp= function (data) {
        var html = '';
        for (var i = 0; i < data['group'].length; i++) {
            html += '<a href="###" target="_blank" class="link">' + data.group[i] + '</a>';
        }
        html='<p class="help-group">'+html+'</p><p class="help-copyright">'+data.copyright+'</p>';
        return html;
    }
    // 页面滚动以及改变可视区域范围均会触发该事件
    floor.$win.on('scroll resize', help.showFloor = function () {
        //每次滑动之后先清理定时器
        clearTimeout(help.helpTimer);
        //执行定时器
        help.helpTimer = setTimeout(help.timeToShow, 250);
    });
    floor.$doc.on('help-loadItems', function (e, index, elem, success) {
        //按需加载
        var html = help.bulidHelp(help.Data),
            $elem = $(elem);
        success();
        setTimeout(function () {
            $elem.html(html);
        }, 1000)
    })
    floor.$doc.on('help-itemsLoaded', function () {
        floor.$win.off('scroll resize', help.showFloor);
    })
    //调用
    lazyLoad.lazyUntil({
        $container: floor.$doc,
        totalItemNum: help.$help.length,
        triggerEvent: 'help-show',
        id: 'help'
    })
    consumer.timeToShow(help.$help);
    //回到顶部
    $('#backToTop').on('click',function () {
        $('html,body').animate({
            scrollTop:0
        })
    })
})(jQuery)
