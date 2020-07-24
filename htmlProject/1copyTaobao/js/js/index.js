(function ($) {
    //menu
    $('.menu').dropdown({
        css: true,
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
            css: true,
            js: true,
            animation: "fadeSlideLeftRight",
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
})(jQuery)