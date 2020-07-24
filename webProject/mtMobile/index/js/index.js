(function () {
    //疑问：这个点击事件，虽然a包裹i,但如果只点击的时候只触发a？
    var $nav = $('nav');
    $nav.find('a').data('link', './index.html');
    var hammertime = new Hammer($nav[0]);
    //监听单击事件跳转界面
    hammertime.on('tap', function (ev) {
        if (ev.target.nodeName === 'A') {
            $(ev.target).attr('href', $(ev.target).data('link'));
        }
        if (ev.target.nodeName === 'I') {
            $(ev.target).parent().attr('href', $(ev.target).parent().data('link'));
        }
    });
    var strTmpl = '<div class="restaurant-item">' +
        '<div class="restaurant-img"><img src=$src>$grand</div>' +
        '<div class="restaurant-detail">' +
        ' <div class="title text-ellipsis">$name</div>' +
        ' <div class="detail">' +
        '<div class="star">$star</div>' +
        '<div class="month-count">月售$setMonthCount</div>' +
        '<div class="distance">$avg_delivery_time分钟&nbsp;|&nbsp;$distance</div>' +
        ' </div>' +
        '<p class="start-price">$min_price_tip</p>'
        + '$promotion' +
        '</div>' +
        '</div>';

    /**
     * @Description: 渲染店铺评分
     * @param: string
     * @author Shanshan Li  2020/6/22
     */
    function getStar(item) {
        var arr = item.toString().split('.');
        var fullNum = arr[0];
        var halfNum = arr[0] >= 5 ? 0 : 1;
        var nullNum = 5 - fullNum - halfNum;
        var starStr = '';
        for (var i = 0; i < fullNum; i++) {
            starStr += '<span class="full"></span>';
        }
        for (var j = 0; j < halfNum; j++) {
            starStr += '<span class="half"></span>';
        }
        for (var k = 0; k < nullNum; k++) {
            starStr += '<span class="null"></span>';
        }
        return starStr;
    }

    function getGrand(boolean) {
        if (boolean) {
            return '<div class="grand sign">品牌</div>';
        } else return '<div class="xin sign">新到</div>'
    }

    function getMonthCount(item) {
        item = Number(item) > 999 ? '999+' : item;
        return item;
    }

    /**
     * @Description: 渲染商家活动
     * @param: {}
     * @author Shanshan Li  2020/6/22
     */
    function getPromotion(list) {
        var pTmpl = '<p class="promotion text-ellipsis"><img src =$icon_url class="promotion-logo">$info</p>';
        var str = '';
        list.forEach(function (item) {
            str += pTmpl.replace('$icon_url', item.icon_url).replace('$info', item.info);
        });
        return str;
    }

    /**
     * @Description: 渲染餐厅列表
     * @param:
     * @author Shanshan Li  2020/6/22
     */
    var page = 0;
    var isLoading = false;

    function getRestaurantList() {
        //模拟Lazyload
        setTimeout(function () {
            isLoading = true;
            page++;
            $.ajax({
                type: 'get',
                url: '../json/homelist.json',
                success: function (data) {
                    var list = data.data.poilist;
                    if (isLoading && page !== 0) {
                        list.forEach(function (item, index) {
                            var str = strTmpl.replace('$name', item.name)
                                .replace('$src', item.pic_url)
                                .replace('$avg_delivery_time', item.avg_delivery_time)
                                .replace('$distance', item.distance)
                                .replace('$min_price_tip', item.min_price_tip)
                                .replace('$star', getStar(item.wm_poi_score))
                                .replace('$setMonthCount', getMonthCount(item.month_sale_num))
                                .replace('$grand', getGrand(item.brand_type))
                                .replace('$promotion', getPromotion(item.discounts2))
                            ;
                            $('.restaurant-wrap').append(str);
                        })
                    }
                    isLoading = false;
                    addJumpLocation();
                },
                error: function () {
                    $('.loading').html('加载失败。')
                }
            })
        }, 500)
    }
    /**
     * @Description: 监听是否到达底部，再次刷新数据
     * @param:
     * @author Shanshan Li  2020/6/22
    */
    function addScroll() {
        var timer = null;
        window.addEventListener('scroll', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var clientHeight = document.documentElement.clientHeight;
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                var scrollHeight = document.body.scrollHeight;
                var preDis = 30;
                if ((scrollTop + clientHeight) >= (scrollHeight - preDis)) {
                    if (page < 3) {
                        if (isLoading) {
                            return;
                        }
                        getRestaurantList()
                    }else {
                        $('.loading').html('已经到底啦')
                    }
                }
            },200)
        })
    }
    function addJumpLocation() {
        $('.restaurant-item').on('click',function () {
            window.location='../order/order.html';
        })
    }
    //初始化
    function init() {
        getRestaurantList();
        addScroll();

    }

    init()
})();