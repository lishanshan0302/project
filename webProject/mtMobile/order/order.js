(function () {
    //aside
    var asideTmpl = '<div class="order-aside-item">'+
                        '$icon'+'$name</div>';
    //detail
    var detailTmpl =
                      '<div class="order-detail-item">'+
                        '<div class="order-detail-img"><img src=$src></div>'+
                        '<div class="order-detail-desc">'+
                           ' <div class="desc-title">$name</div>'+
                           ' <div class="desc-subtitle multiline-ellipsis">$description</div>'+
                           ' <div class="zan">赞$praise_num</div>'+
                            '<div class="select">'+
                                '<div class="price"><span>￥$min_price</span>/$unit</div>'+
                                '<div class="select-count">'+
                                    '<div class="minus iconfont">&#xe60b;</div>'+
                                    '<span class="count">$count</span>'+
                                    '<div class="plus iconfont">&#xe621;</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
    //cart
    var cartTmpl = '<div class="bottom-cart-selected-item">'+
                        '<div class="title">$name</div>'+
                        '<div class = "price">￥$price</div>'+
                        '<div class="select-count">'+
                            '<div class="minus iconfont">&#xe60b;</div>'+
                            '<span class="count">$count</span>'+
                            '<div class="plus iconfont">&#xe621;</div>'+
                        '</div>'+
                    '</div>';
    /**
     * @Description: 改变圆点
     * @param:
     * @author Shanshan Li  2020/6/24
    */
    function changeDot() {
        //找到所有的数量
        var $counts = $('.bottom-cart-selected-item').find('.count');
        var total = 0;
        //遍历每个count相加
        for(var i =0;i<$counts.length;i++){
            total+=parseInt($($counts[i]).text());
        }
        if (total>0){
            $('.bottom-cart-icon-num').show().text(total);
        }else {
            $('.bottom-cart-icon-num').hide();
        }
    }
    /**
     * @Description:改变总数
     * @param:string
     * @author Shanshan Li  2020/6/24
    */
    function changeTotalPrice(str) {
        $('.bottom-cart').find('.bottom-cart-count-total').text(str)
    }
    function dotAddclick() {
        $('.bottom-cart-icon').on('click',function () {
            if ($('.bottom-cart-icon-num').text()>0){
                $('.car-hd').toggleClass('hide');
                $('.mask').toggleClass('hide');
            }
        })
    }

    /**
     * @Description: 渲染购物车
     * @param: {}
     * @author Shanshan Li  2020/6/24
    */
    function getCartSelect() {
        var data=window.allData||[];
        var totalPrice=0;
        $('.bottom-cart-selected').empty();
        data.forEach(function (item) {
            item.spus.forEach(function (items) {
                if (items.chooseCount>0){
                    var price =items.min_price*items.chooseCount;
                    var str = cartTmpl.replace('$name',items.name)
                        .replace('$count',items.chooseCount)
                        .replace('$price',items.min_price)
                    ;
                    totalPrice+=price;
                    var $target =$(str);
                    $target.data('itemData',items);
                    // console.log($target.data('itemData'));
                    $('.bottom-cart-selected').append($target);
                }
            })
        });
        //渲染购物车并隐藏
        var $cart = $('.car-hd');
        if ($cart.find('.bottom-cart-selected-item').length==0){
            $cart.addClass('hide');
            $('.mask').addClass('hide');
        }
        //更新总价
        changeTotalPrice(totalPrice);
        //更新数量
        changeDot();
        //为购物车添加点击事件
        cartAddClick();

    }
    /**
     * @Description: 更新购物车以及菜单
     * @param: i--number
     * @author Shanshan Li  2020/6/24
    */
    function renderCart($ele,i) {
        var $item = $ele.parents('.bottom-cart-selected-item').first();
        var itemData =$item.data('itemData');
        var $itemLeft = $ele.parents('body').find('.active').eq(1);
        itemData.chooseCount+=i;
        var datas = $itemLeft.data('itemData');
        //更新右侧菜单
        getDetailList(datas);
        //更新购物车
        getCartSelect();
    }
    /**
     * @Description: 购物车点击事件
     * @param:
     * @author Shanshan Li  2020/6/24
    */
    function cartAddClick() {
        $('.bottom-cart-selected-item').on('click','.plus', function (e) {
            var count = Number($(e.currentTarget).parent().find('.count').html());
            count++;
            //更新count
            refreshCount( $(this),count);
            //刷新购物车以及菜单
            renderCart($(e.currentTarget),1);
        });
        $('.bottom-cart-selected-item').on('click','.minus', function (e) {
            var count = Number($(e.currentTarget).parent().find('.count').html());
            if (count <= 0) {
                return;
            }
            count--;
            refreshCount( $(this),count);
            renderCart($(e.currentTarget),-1);
        });
    }
    /**
     * @Description: 更新菜单count
     * @param:
     * @author Shanshan Li  2020/6/24
    */
    function refreshCount($el,count) {
        $el.parent().find($('.count')).html(count);
    }
   /**
    * @Description: 右侧上方菜单点击事件
    * @param:
    * @author Shanshan Li  2020/6/24
   */
    function selectAddClick() {
        $('.order-detail-item').on('click','.plus', function (e) {
            var count = Number($(e.currentTarget).parent().find('.count').html());
            count++;
            refreshCount( $(this),count);
            var $item = $(e.currentTarget).parents('.order-detail-item').first();
            var itemData =$item.data('itemData');
            itemData.chooseCount+=1;
            getCartSelect();
        });
        $('.order-detail-item').on('click','.minus', function (e) {
            var count = Number($(e.currentTarget).parent().find('.count').html());
            if (count <= 0) return;
            count--;
            refreshCount( $(this),count);
            var $item = $(e.currentTarget).parents('.order-detail-item').first();
            var itemData =$item.data('itemData');
            itemData.chooseCount-=1;
            getCartSelect();
        });
    }
    /**
     * @Description: 更新右侧上方标题
     * @param: str
     * @author Shanshan Li  2020/6/24
    */
    function getTitle(str) {
        var Str= '<div class="order-detail-title">'+str+'</div>';
        $('.order-detail').append($(Str));
    }
    /**
     * @Description: 渲染detal列表
     * @param:{}i
     * @author Shanshan Li  2020/6/23
    */
    function getDetailList(data) {
        var list = data.spus;
        $('.order-detail').empty();
        getTitle(data.name);
        list.forEach(function (item) {
            if (!item.chooseCount){
                item.chooseCount=0;
            }
            var strItem=detailTmpl.replace('$src',item.picture)
                .replace('$name',item.name)
                .replace('$description',item.description)
                .replace('$min_price',item.min_price)
                .replace('$unit',item.unit)
                .replace('$praise_num',item.praise_num)
                .replace('$count',item.chooseCount);
            var $target = $(strItem);
            $target.data("itemData", item);
            $('.order-detail').append($target);
        });
        selectAddClick();
    }
    /**
     * @Description: 为左侧绑定click事件更新右侧菜单详情
     * @param:[}
     * @author Shanshan Li  2020/6/23
    */
    function addAsideEvent() {

        $('.order-aside').on('click','.order-aside-item',function (e) {
            var $current = $(e.currentTarget);
            var data =$current.data('itemData');
            //切换状态栏
            $current.addClass('active').siblings().removeClass('active');
            getDetailList(data);

        });
        //第一个item触发事件
        $('.order-aside-item').eq(0).trigger('click').addClass('active');
    }
    /**
     * @Description: 渲染侧边栏单项目图标
     * @param:  string
     * @author Shanshan Li  2020/6/23
    */
    function getIcon(item) {
        var iconTmpl ='<div class="order-aside-item-icon"><img src=$src ></div>';
        var str='';
        if (item){
            str=iconTmpl.replace('$src',item);
        }else str = '';
        return str;
    }
    /**
     * @Description: 渲染aside 并绑定数据
     * @param:{}
     * @author Shanshan Li  2020/6/23
    */
    function getAsideList(list) {
        list.forEach(function (item,index) {
            var str =asideTmpl.replace('$icon',getIcon(item.icon)).replace('$name',item.name);
            var $target =$(str);//转换成js对象才可以调用js方法
            $target.data('itemData',item);
            $('.order-aside').append($target);
        });
    }
    function getList() {
        $.get('../json/food.json',function (data) {
            window.allData = data.data.food_spu_tags;
            console.log(allData);
            getAsideList(window.allData);
            addAsideEvent(window.allData);
        });
    }
    function init() {
        getList();
        dotAddclick();
    }
    init();

})();