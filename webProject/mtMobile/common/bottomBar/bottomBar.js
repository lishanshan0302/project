(function () {
    var bottomBarTmpl = '<a class="item $type" href="../$type/$type.html"><i class="iconfont">$icon</i>$text</a>';
    var Bottom = [
        {type: 'index', icon: '&#xe603;', text: '首页'},
        {type: 'menu', icon: '&#xe602;', text: '订单'},
        {type: 'my', icon: '&#xe609;', text: '我的'}
    ];
    var str ='';
    Bottom.forEach(function (item) {
        str+=bottomBarTmpl.replace(/\$type/g,item.type)
            .replace('$icon',item.icon)
            .replace('$text',item.text);
    });
    $('.bottomBar').append(str);
    var hrefArr = window.location.href.split('/');
    var currentHref =hrefArr[hrefArr.length-1].split('.')[0];
    $('a.'+currentHref).addClass('active');
})();