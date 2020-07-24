(function () {
    var headerTabTmpl = '<a href="../$type/$type.html" class="nav-item $type">$text</a>';
    var headerTab = [
        {type: 'order', text: '点菜'},
        {type: 'comment', text: '评价'},
        {type: 'store', text: '商家'}
    ];
    var str ='';
    headerTab.forEach(function (item) {
        str+=headerTabTmpl.replace(/\$type/g,item.type)
            .replace('$text',item.text);
    });
    str = '<header class="header"><i class="iconfont">&#xe74e;</i>深圳前海麦当劳二餐厅</header>'+
            '<nav class="nav">'+str+'</nav>';
    $('.header-container').append(str);
    var hrefArr = window.location.href.split('/');
    var currentHref =hrefArr[hrefArr.length-1].split('.')[0];
    $('a.'+currentHref).addClass('active');
})();