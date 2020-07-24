//ui-search定义
$.fn.UiSearch = function () {
    var ui = $(this);
    $(".ui-search-selected", ui).on("click", function () {
        $(".ui-search-select-list").show();
        return false//阻止事件冒泡
    })
    $(".ui-search-select-list a", ui).on("click", function () {
        $(".ui-search-selected").text($(this).text());
        $(".ui-search-select-list").hide();
        return false;
    })
    $("body").on("click", function () {
        $(".ui-search-select-list").hide();
    })
}
//ui-table定义
/**
 * @param {string} header TAB组件，头部区域 item 点击
 * @param {string} content TAB组件，内容区域 item 切换
 * @param {string} focus_prefix 选项卡高亮前缀 可选
 */
$.fn.UiTab = function (header, content, focus_prefix) {
    var ui = $(this);
    var tabs = $(header, ui);
    var cons = $(content, ui);
    var focus_prefix = focus_prefix || "item_focus";
    tabs.on("click", function () {
        var index = $(this).index();
        tabs.removeClass(focus_prefix).eq(index).addClass(focus_prefix);
        cons.hide().eq(index).show();
        return false;
    })

    // cons.on("click",function () {
    //     var index = $(this).index();
    //     cons.removeClass("block-caption-item_focus").eq(index).addClass("block-caption-item_focus");
    // })
}
// 回到顶部
$.fn.UiBackTop = function () {
    var ui = $(this);
    var el = $("<a href='#1' class='ui-backTop'></a>");
    ui.append(el);
    // var windowHeight = $(window).height();
    // console.log(windowHeight);
    $(window).on("scroll", function () {
        var top = $("html,body").scrollTop();
        // console.log(top > 500px);
        // console.log(top);
        if (top > 300) {
            el.show();
        } else {
            el.hide();
        }
    })
    $(el).on("click",function () {
        $(window).scrollTop(0);
    })
}
//slider 切换
$.fn.UiSlider=function(){
    var ui = $(this);
    var wrap =$(".ui-slider-wrap");

    var current = 0;//不能定义为index会跟下面的参数冲突

    var items=$(".ui-slider-wrap>.item",ui);
    var tips =$(".ui-slider-process> .item", ui);

    var btn_prev = $(".ui-slider-arrow> .left", ui);
    var btn_next = $(".ui-slider-arrow> .right", ui);

    var size =items.length;
    // var size =items.size();
    var width = items.eq(0).width();

    var enableAuto=true;
    //设置自动滚动感应（如果鼠标在wrap中，不要自动滚动
    ui.on("mouseover",function () {
        enableAuto=false;
        // console.log(enableAuto);
    })
    ui.on("mouseout",function () {
        enableAuto=true;
        // console.log(enableAuto);
    })
    //具体操作
    console.log(size);
    wrap.on("move_prev",function () {
        if (current<=0){
            current=size;
        }
        current--;
        console.log(current)
        wrap.triggerHandler('move_to',current);
    })
    .on("move_next",function () {
        // console.log($(this).index());
        if (current>=size-1){
            current=-1;
        }
        current++;

        wrap.triggerHandler('move_to',current);
    })
    .on("move_to",function (e,index) {
        // debugger;

        wrap.css("left",index*width*-1);
        tips.removeClass("item_focus").eq(index).addClass("item_focus");})
    .on("auto",function () {
            // console.log(enableAuto);
            setInterval(function () {
                enableAuto && wrap.triggerHandler("move_next");
            },2000)
     })
        .triggerHandler("auto");

    //事件
    btn_prev.on("click",function () {
        wrap.triggerHandler("move_prev")
    })
    btn_next.on("click",function () {
        wrap.triggerHandler("move_next")
    })
    tips.on("click",function (e,index) {
        console.log(wrap);
        var index = $(this).index();
        current = index;
        wrap.triggerHandler("move_to",index);
    })
}

//uiCascading
$.fn.UiCascading=function(){
    var ui =$(this);
    // 获取所有下拉列表元素
    var selects =$("select",ui);
    //给所有下拉列表绑定改变事件
    selects
        .on("change",function () {
            // 获取当前select的索引
            var index  =selects.index(this);
            // 获取当前列表选中的值,例如'朝阳区'
            var val = $(this).val();
            // debugger;
            //根据当前的值触发下一个select的更新
            // 获取当前下拉列表的data-where属性值
            var where = $(this).attr("data-where");
            // 判断data-where属性是否有值，如果有就分隔，没有赋值为[]
            where=where?where.split(","):[];
            // 在属性值中添加当前下拉列表选择的值
            where.push($(this).val());
            // 更新当前的下一个列表data-where属性值
            selects.eq(index+1)
                .attr("data-where",where.join(","))
                .triggerHandler("reloadOptions");
            //	触发下一个之后的所有 select  的初始化（清除不应该的数据项）
            ui.find('select:gt('+(index+1)+')').each(function () {
                $(this)
                    .attr("data-where","")
                    .triggerHandler("reloadOptions");
            })
         })
        // 绑定自定义reloadOptions事件
            .on("reloadOptions",function () {
                // 获取select的data-search属性值
                var method = $(this).attr("data-search");
                // 获取select的data-where属性值并分隔为字符串
                var arg = $(this).attr("data-where").split(",")
                // 从通过字符串参数从data.js文件中获取数据
                var data =AjaxRemoteGetData[method].apply(this,arg);
                var select = $(this);
                // 将原有的option移除
                select.find("option").remove();
                // 将获取的指定数据遍历，和option标签拼接，重新添加到select中
                $.each(data,function (i,item) {
                    // debugger;
                    var el =$('<option value="'+item+'">'+item+'</option>');
                    console.log(el);
                    select.append(el);
                })
        })
    // 默认第一个的select触发更新事件
    selects.eq(0).triggerHandler("reloadOptions")
}
//页面脚本逻辑
$(function () {
    $(".ui-search").UiSearch();
    //>表示子代原则器
    $(".content-tab").UiTab(".caption>.item", ".block>.item", "item_focus");
    $(".block").UiTab(".block-caption>a", ".block-content>.block-wrap", "block-caption-item_focus")
    $("body").UiBackTop();
    $(".ui-slider").UiSlider();
    $(".ui-cascading").UiCascading();
})