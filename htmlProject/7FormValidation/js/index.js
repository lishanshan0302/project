function getEle(id) {
    return document.getElementById(id);
}
function getCls(cls) {
    return document.getElementsByClassName(cls);
}
var items = getCls("item_");
//获取用户名
var userAccount =getEle("userAccount");
//获取密码框
var userPass = getEle("userPass");
//获取密码确认
var userPassF =getEle("userPass_");
//获取姓名
var userName = getEle("userName");
//获取身份证号
var information = getEle("information");
//获取邮箱
var email = getEle("email");
//获取手机号
var telephone = getEle("telephone");
//提交按钮
var handup =getEle("handup");
//验证
test1 = false;
test2 = false;
test3 = false;
test4 = false;
test5 = false;
test6 = false;
test7 = false;
//正则
var reg = /^[\w]{6,18}$/;

//验证用户名
userAccount.onfocus=function () {
    items[0].innerHTML="请输入6-18位数字、字母、_用户名";
    items[0].style.color="green";
}
userAccount.onblur=function () {
    console.log(reg.test(this.value));
    if (this.value.length==0){
        items[0].innerHTML="用户名不能为空";
        items[0].style.color="red";
    }else {
        if (reg.test(this.value)==false){
            items[0].innerHTML="用户名请输入6-18位数字、字母、_";
            items[0].style.color="red";
        }else {
            items[0].innerHTML="输入正确";
            items[0].style.color="green";
            test1=true;
        }
    }
}
//密码框光标移入
userPass.onfocus=function () {
    items[1].innerHTML="请输入6-18位数字、字母、_密码";
    items[1].style.color="green";
}
//密码光标移出
userPass.onblur=function () {
    console.log(reg.test(this.value));
    if (this.value.length==0){
        items[1].innerHTML="密码不能为空";
        items[1].style.color="red";
    }else {
        if (reg.test(this.value)==false){
            items[1].innerHTML="密码请输入6-18位数字、字母、_";
            items[1].style.color="red";
        }else {
            items[1].innerHTML="密码输入正确";
            items[1].style.color="green";
            test2=true;
        }
    }
}
//密码确认光标移入
userPassF.onfocus=function () {
    items[2].innerHTML="请确认两次密码一致";
    items[2].style.color="green";
}
//密码确认光标移出
userPassF.onblur=function () {
    if (this.value.length==0){
        items[2].innerHTML="请确认两次密码一致";
        items[2].style.color="red";
    }else {
        if (this.value!=userPass.value){
            items[2].innerHTML="两次密码不一致";
            items[2].style.color="red";
        }else {
            items[2].innerHTML="两次密码一致";
            items[2].style.color="green";
            test3=true;
        }
    }
}
//姓名框光标移入
userName.onfocus=function () {
    items[3].innerHTML="请输入2-5位中文汉字";
    items[3].style.color="green";
}
//姓名光标移出
userName.onblur=function () {
    var reg = /^[\u4e00-\u9fa5]{2,5}$/;
    if (this.value.length==0){
        items[3].innerHTML="姓名不能为空";
        items[3].style.color="red";
    }else {
        if (reg.test(this.value)==false){
            items[3].innerHTML="姓名请输入2-5位中文汉字";
            items[3].style.color="red";
        }else {
            items[3].innerHTML="姓名输入正确";
            items[3].style.color="green";
            test4=true;
        }
    }
}
//身份证框光标移入
information.onfocus=function () {
    items[4].innerHTML="请输入身份证号";
    items[4].style.color="green";
}
//身份证光标移出
information.onblur=function () {
    var reg = /^\d{17}[\dXx]$/;
    if (this.value.length==0){
        items[4].innerHTML="身份证不能为空";
        items[4].style.color="red";
    }else {
        if (reg.test(this.value)==false){
            items[4].innerHTML="请输入正确身份证号";
            items[4].style.color="red";
        }else {
            items[4].innerHTML="身份证输入正确";
            items[4].style.color="green";
            test5=true;
        }
    }
}
//邮箱框光标移入
email.onfocus=function () {
    items[5].innerHTML="请输入邮箱号";
    items[5].style.color="green";
}
//邮箱光标移出
email.onblur=function () {
    var reg = /^\w+@\w+\.\w{2,4}$/;
    if (this.value.length==0){
        items[5].innerHTML="邮箱不能为空";
        items[5].style.color="red";
    }else {
        if (reg.test(this.value)==false){
            items[5].innerHTML="请输入正确邮箱号";
            items[5].style.color="red";
        }else {
            items[5].innerHTML="邮箱输入正确";
            items[5].style.color="green";
            test6=true;
        }
    }
}
//手机框光标移入
telephone.onfocus=function () {
    items[6].innerHTML="请输入手机号";
    items[6].style.color="green";
}
//手机光标移出
telephone.onblur=function () {
    var reg = /^\d{11}$/;
    if (this.value.length==0){
        items[6].innerHTML="手机号不能为空";
        items[6].style.color="red";
    }else {
        if (reg.test(this.value)==false){
            items[6].innerHTML="请输入正确手机号";
            items[6].style.color="red";
        }else {
            items[6].innerHTML="手机输入正确";
            items[6].style.color="green";
            test7=true;
        }
    }
}
handup.onclick=function () {
    if (test1==false||test2==false||test3==false||test4==false||test5==false||test6==false||test7==false){
        alert("注册信息填写不完整")
    }else{
        alert("注册成功")
    }
}