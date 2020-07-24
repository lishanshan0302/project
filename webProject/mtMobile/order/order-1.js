(function () {
    //aside
    var asideTmpl = '<div class="order-aside-item">'+
                        '$icon'+'$name</div>';
    //detail
    var detailTmpl =
                      '<div class="order-detail-item" id-data="$id">'+
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

    var cartTmpl = '<div className="bottom-cart-selected-item">'+
                        '<div class="title">$name</div>'+
                        '<div class = "price">￥$price</div>'+
                        '<div class="select-count">'+
                            '<div class="minus iconfont">&#xe60b;</div>'+
                            '<span class="count">$count</span>'+
                            '<div class="plus iconfont">&#xe621;</div>'+
                        '</div>'+
                    '</div>';
    function getCartSelect(name,count) {
        var str = cartTmpl.replace('$name',name).replace('$count',count)
        $('.bottom-cart-selected').append(str);
    }
    function refreshCount($el,count) {
        $el.parent().find($('.count')).html(count);
    }
    function counts() {
        var arrCount=[];
        var countItems = document.getElementsByClassName('count');
        for (var i = 0;i<countItems.length;i++){
            countItems[i].setAttribute('data-index',i);
        }
        $('.count').each(function () {
            if($(this).data('count')!==0){
                arrCount.push($(this).data('index'));
            }
        });
        arrCount.forEach(function (item) {
            getCartSelect()
        })
    }
    function selectAddClick(list) {
        $('.plus').on('click', function (e) {
            var count = Number($(e.currentTarget).parent().find('.count').html());
            count++;
            refreshCount( $(this),count);

            var $item = $(e.currentTarget).parents('.order-detail-item');
            var currentId = $item.attr("id-data");
            var localUserData=JSON.parse(localStorage.getItem("userData"));
            if(!localUserData){
                localUserData = new Object();
            }
            localUserData[currentId] = count;
            localStorage.setItem("userData",JSON.stringify(localUserData));

            var currentCai = {};
            for(i in currentData.spus){
                if(currentData.spus[i].id==currentId){
                    currentCai = currentData.spus[i];
                    break;
                }
            }
            console.log(currentCai);
            //addShop(currentCai);
            console.log(localStorage.getItem("userData"));
        });
        $('.minus').on('click', function () {
            var count = Number($(this).parent().find($('.count')).data('count'));
            if (count <= 0) return;
            count--;
            refreshCount( $(this),count);
        });
    }
    function getTitle(str) {
        var Str= '<div class="order-detail-title">'+str+'</div>';
        $('.order-detail').append($(Str));
    }
    /**
     * @Description: 渲染detal列表
     * @param:{}i
     * @author Shanshan Li  2020/6/23
    */
    function getDetailList(data,index) {
        var list = data[index].spus;
        $('.order-detail').empty();
        getTitle(data[index].name);
        list.forEach(function (item) {
            if (!item.count){
                item.count=0;
            }
            var str=detailTmpl.replace('$src',item.picture)
                .replace('$name',item.name)
                .replace('$description',item.description)
                .replace('$min_price',item.min_price)
                .replace('$unit',item.unit)
                .replace('$praise_num',item.praise_num)
                .replace('$count',item.count)
                .replace('$id',item.id);
            $(str).attr('counts',item.count);
            $('.order-detail').append(str);
        });
    }
    /**
     * @Description: 为侧面栏绑定click事件更新菜单详情
     * @param:[}
     * @author Shanshan Li  2020/6/23
    */
    function addAsideEvent(data) {

        $('.order-aside').on('click','.order-aside-item',function (e) {
            var $current = $(e.currentTarget);
            //切换状态栏
            $current.addClass('active').siblings().removeClass('active');
            var index =$current.data('index');
            currentData = data[index];
            console.log(currentData);
            getDetailList(data,index);
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
             // $target =$('.order-aside-item').eq(index);//尝试
            // console.log($('.order-aside-item'));//不可以这样绑定会导致多次绑定因为获取到的不是一个值
            $target.data('index',index);
            $('.order-aside').append($target);
        });
    }
    allData=[];
    currentData={};
    function getList() {
        $.get('../json/food.json',function (data) {
            allData = data.data.food_spu_tags;
            console.log(allData);
            var localUserData=JSON.parse(localStorage.getItem("userData"));
            for(i in allData){
                var indexData = allData[i];
                for(j in indexData.spus){
                    var cai = indexData.spus[j];
                    var id = cai.id;
                    for (k in localUserData){
                        if(k == id){
                            cai.count = localUserData[k];
                        }
                    }
                }
            }
            console.log(allData);
            getAsideList(allData);
            addAsideEvent(allData);
            selectAddClick(allData);
        });
    }
    function init() {
        getList();
    }
    init();

})();