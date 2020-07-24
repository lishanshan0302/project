var addressP = $(".hospital__address-detail-desc p");
var arrLf = $(".arr-lf");
var arrRt = $(".arr-rt");
var weeksItems=$(".week");
var schedulingTable=$(".hospital__scheduling-desc-md");
var schedulingItems=$(".hospital__scheduling-desc-md-item");
var count = 7;
//获取页面导航切换元素
var hospitalCrumb = $(".hospital__scheduling-crumb>span").eq(1);
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
// console.log(schedulingItems);
//动态生成排班表
for(var i = 0;i<20;i++){
    schedulingItems.eq(0).clone().appendTo(schedulingTable);
}
//获取生成之后的日期
var dayItems = $(".date");

//获取当前时间前一周
function getNowDate() {
    var myDate = new Date;
    var year = myDate.getFullYear(); //获取当前年
    var mon = myDate.getMonth() + 1; //获取当前月
    var date = myDate.getDate()-7; //获取当前日前七天日期
    // var h = myDate.getHours();//获取当前小时数(0-23)
    // var m = myDate.getMinutes();//获取当前分钟数(0-59)
    // var s = myDate.getSeconds();//获取当前秒
    // var week = myDate.getDay();
    // var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    // console.log(year, mon, date, weeks[week])
    // $("#time").html(year + "年" + mon + "月" + date + "日" + weeks[week]);
    return (year+"-"+mon+"-"+date);
}
// console.log('(getNowDate())');

//格式化获取时间
function getDate(d) {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
// 设置表格时间动态填充下一天
function setNextDay(ele, eleItems) {
    var val = ele.html();
    if (val == "") return false;
    var dt = new Date(val.replace(/\-/g, "\/"));
    eleItems.each((function () {
        // console.log(eleItems);
        return function (n) {
            if (n != 0) dt.setDate(dt.getDate() + 1);
            var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            var week = dt.getDay();
            $(this).html(getDate(dt));
            $(this).prev().prev().html(weeks[week]);
        }
    })(dt))
}
//设置第一天
dayItems.eq(0).html(getNowDate());
//设置其他表格时间
setNextDay(dayItems.eq(0),dayItems);

//切换排班表

var schedulingItems=$(".hospital__scheduling-desc-md-item");
arrLf.on("click",function () {
    if(count>=schedulingItems.length-7){
        count=schedulingItems.length-7
        alert("超过最大可查看预约时间");
        return false;
    }
    count+=7;
    schedulingTable.stop().animate({left:(-count*95+33)+"px"});

})
//切换排表减少
arrRt.on("click",function () {
    if (count==0){
        alert("只能查看当前日期上一周预约日期")
        return false;
    }
    count-=7;
    schedulingTable.stop().animate({left:(-count*95+33)+"px"});

})
//设置表格颜色
console.log()
$(".hospital__scheduling-desc-md div").each(function () {
    if($(this).html()=="约满"){
        $(this).css({"background-color":"#e0eefd",
        "color":"#4ab4ed"})
    }
})
//切换页面地址
hospitalCrumb.on("click",function () {
    window.location.href="index.html";
})
// address部分图片定位
addressP.each(function () {
    var pos = -$(this).index() * 20 + "px";
    // console.log(pos)
    $(this).css({
        'background-positionY': pos
    })
})
// 绑定搜索框切换
$(document).ready(function () {
    $(".ui-search").UiSearch();
})