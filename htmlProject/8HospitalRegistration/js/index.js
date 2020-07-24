var addressP=$(".hospital__address-detail-desc p");
//获取跳转链接元素

var detailGroup = $(".hospital__detail__group");
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


// adress部分图片定位
addressP.each(function () {
    var pos=-$(this).index()*20+"px";
    // console.log(pos)
    $(this).css({
        'background-positionY': pos
    })
})

//hospital 导航切换
$.fn.UiSwitchNav=function(){
    var ui= $(this);
    var detailNav =  $(".hospital__detail__nav-item",ui);
    var detailGroup = $(".hospital__detail__group",ui);
    detailNav.on("click",function () {
        var index = $(this).index();
        detailNav.removeClass("nav-item-focus").eq(index).addClass("nav-item-focus");
        detailGroup.hide().eq(index).show();
    })
}
//设置预约挂号数据
$.fn.SetDepartmentDate=function(obj){
    var groupDepartment = $(".hospital__detail__group").eq(0);
    for(k in obj){
        var str="";
        for(var i = 0;i<obj[k].length;i++){
            str+= '<a href="javascript:void (0);">'+obj[k][i]+'</a>';
        }
        var strs= '<div class="hospital__detail__group-department">'+
                        '<div class="hospital__detail__group-item-title">'+
                                '<div class="lf">'+k+'</div>'+
                        '</div>'+
                        '<div class="hospital__detail__group-item-detail">'+str+'</div>'+
                    '</div>';
        groupDepartment.append(strs);
    }

}
//设置预约停诊数据
$.fn.SetStopDate=function(obj){
    var groupDepartment = $(".stop__information-detail");
    for(k in obj){
        var str="";
        for(var i = 0;i<obj[k].length;i++){
            str+= '<td>'+obj[k][i]+'</td>';
        }
        // console.log(str);
        var strs= '<tr>'+str+'</tr>'
        // console.log(strs)
        groupDepartment.append(strs);
    }
}

//绑定事件
$(document).ready(function () {
    $(".ui-search").UiSearch();
    $(".nav-ui").UiSwitchNav()
    $.ajax({
        type:"get",
        dataType:"json",
        url:"json/index.json",
        async:true,
        success:function (data) {
            detailGroup.SetDepartmentDate(data.detail);
            $(".stop__information-detail").SetStopDate(data.stopDep)
            var title = $(".hospital__detail__group-item-title")
            //设置两侧行高相同
            for(var j = 0;j<title.length;j++){
                var heightIs =$(".hospital__detail__group-item-detail").eq(j).innerHeight();
                title.eq(j).css({'height':heightIs});
            }
            //departmeItems 跳转
            var departmeItems=$(".hospital__detail__group-department a")
            departmeItems.on("click",function () {
                window.location.href="departmentArrange.html";
            })
        }
    })
});