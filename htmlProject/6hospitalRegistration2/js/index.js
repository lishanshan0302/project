var more = $(".department_hot-content-rt>a");
var moreContent = $(".department_hot-content-more");
var menu = $(".department-menu");
var menuDetail = $(".department-item__detail");
var menuItem = $('.department-item__detail-list');
var itemGroup = $(".department-item__detail-group");

//hot部分数据填充；
$.fn.getDepartment = function (arr, cls) {
    var element = $(cls);
    for (var i = 0; i < arr.length; i++) {
        var ele = $("<span>" + arr[i] + "</span>");
        ele.attr("class", "department_hot-item")
        element.append(ele);
    }
}

//department-menu 部分数据填充；
$.fn.getMenu = function (obj) {
    for (k in obj) {
        //此部分如何嵌套一个一个生成标签？
        menu.append('<div class="department-menu-item">' + "<a href='#'>" + k + "</a>" + '</div>');
    }
    // var menuItem = $(".department-menu-item a");
    // menuItem.each(function () {
    //     var index = $(this).index();
    //     // $(this).attr({"id": index});
    //     $(this).attr({"href": "#" + index});
    // })

}

//department-item__detail部分数据填充
$.fn.getMenuDetail = function (obj) {
    for (k in obj) {
        var str = "";
        for (i = 0; i < obj[k].length; i++) {
            str += '<a href="">' + obj[k][i] + '</a>'
            // console.log(str);
        }
        menuDetail.append('<div class="department-item__detail-group">' + '<div class="department-item__detail-caption">' + k + '</div>'
            + '<div class="department-item__detail-list">' + str + '</div>' + '</div>');
        //此部分如何嵌套一个一个生成标签？

    }
    // var itemGroup = $(".department-item__detail-group");
    //
    // itemGroup.each(function () {
    //     var index = $(this).index();
    //     $(this).attr({"id": index});
    //
    // })
}
//搜索框切换
$.fn.UiSearch = function () {
    var ui = $(this);
    $(".search_input-selected").click(function () {
        $(".search_input-list").show();
        return false;
    })
    $(".search_input-list a").click(function () {
        $(".search_input-selected").text($(this).text());
        $(".search_input-list").hide();
        return false;
    })
    $("body").click(function () {
        $(".search_input-list").hide();
        return false;
    })

}

//为itemGroup 设置锚点定位
$.fn.setJump = function () {
    var menuItem = $(".department-menu-item ");
    menuItem.click(function () {
        var index = $(this).index();
        console.log(index);
        console.log(menuItem);
        var target_top = $(".department-item__detail-group").eq(index).offset().top;
        console.log(target_top);
        $("html,body").scrollTop(target_top);
    })
}

$(document).ready(function () {
//ajax请求
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "demo.json",
        // dataType:"json",
        success: function (data) {
            // console.log(data.tetail);
            var obj = data.tetail
            // for (k in obj){
            //     console.log(k)
            //     console.log(obj[k])
            // }
            $(".department_hot").getDepartment(data.department, ".department_hot-content-lf");
            $(".department_hot").getDepartment(data.department, ".department_hot-content-more");
            menu.getMenu(data.tetail);
            menuDetail.getMenuDetail(data.tetail);
            menu.setJump();
        }
    })
    //更多展开
    more.on("click", function () {
        // moreContent.eq(0).removeAttr("hidden");
        // console.log($(this).text()=="展开全部")
        if ($(this).text() == "展开全部") {
            moreContent.show();
            $(this).text("收起全部")
        } else {
            $(this).text("展开全部")
            moreContent.hide();
        }
    })
    $(".ui-search").UiSearch();
    // $(document).change($(".department-item__detail-group"),function(){console.log("需要执行的事情")
    // });
    // $(".department-item__detail-group").addclass("id","i");
    // $(".department-item__detail-group").live("click",function () {
    //     alert(123)
    // })
});