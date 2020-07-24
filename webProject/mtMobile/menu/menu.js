(function () {
    var menuTmpl = ' <div class="order-item">' +
                        '<div class="order-item-hd">' +
                            '<div class="order-item-img"><img src=$poi_pic alt=""></div>' +
                             '<div class="order-item-detail">' +
                                '<div class="order-header">' +
                                    ' <div class="order-title text-ellipsis">$poi_name</div>' +
                                    '<i class="iconfont">&#xe74e;</i>' +
                                    '<div class="order-status">$status_description</div>' +
                                ' </div>' +
                                '<div class="order-card">' +
                                    '$getCount'+
                                '<p class="order-total">' +
                                    '<span>...</span>' +
                                    '<span class="flex-rt">总计$product_count1个菜，实付 <strong>￥$total</strong></span>' +
                                ' </p>'+
                                '</div>' +
                             '</div>' +
                        '</div>' +
                        ' <div class="order-item-btn">' +
                            ' <a href="###" class="comment">立即评价</a>' +
                        '</div>' +
                    '</div>';
    /**
     * @Description: 生成订单内菜品信息
     * @param:{}
     * @author Shanshan Li  2020/6/22
    */
    function getCount(list) {
        var orderCarTmpl = '<p class="order-card-item">' +
                                ' <span>$product_name</span>' +
                                ' <span class="flex-rt">X$product_count</span>' +
                            ' </p>' ;
        var str = '';
        list.forEach(function (item) {
            str +=orderCarTmpl.replace('$product_name',item.product_name)
                .replace('$product_count',item.product_count);
        });
        return str;
    }
    /**
     * @Description: 生成订单列表
     * @param:
     * @author Shanshan Li  2020/6/22
    */
    function getCommentList() {
        $.get('../json/orders.json',function (data) {
           var list = data.data.digestlist;
           var str='';
           list.forEach(function (item) {
               str = menuTmpl.replace('$poi_pic', item.poi_pic)
                   .replace('$poi_name', item.poi_name)
                   .replace('$status_description', item.status_description)
                   .replace('$product_count1', item.product_count)
                   .replace('$total', item.total)
                   .replace('$getCount', getCount(item.product_list));
               $('.order').append(str);
           })
        })
    }
    function init() {
        getCommentList();
    }
    init()
})();