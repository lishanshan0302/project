//通过id获取元素
function getEle(id) {
    return document.getElementById(id);
}
//获取属性
var getCls= function (element) {
    return element.getAttribute("class");
}
//设置属性
var setCls = function (element,cls) {
    element.setAttribute("class",cls);
}
//增加属性
var addCls = function (element,cls) {
    var baseCls = element.getAttribute("class");
    if (baseCls.indexOf(cls)===-1){
        element.setAttribute("class",baseCls+" "+cls);
    }
}
//删除属性
var removeCls = function (element,cls) {
    var baseCls = element.getAttribute("class");
    if (baseCls.indexOf(cls)!= -1){
        //匹配所有空白字符将其替换为一个空格
        element.setAttribute("class",baseCls.split(cls).join(" ").replace(/\s+/g," "));
    }
}
var flag = [false,false,false,false,false,false,false];
//获取用户名
var username =getEle("username");
//获取密码
var password =getEle("password");
//获取密码提示
var pwError =document.getElementsByClassName("pw-error")[0];
//获取密码强度
var rank = getEle("div-pw-rank");
//获取密码确认
var passwordConfirm=getEle("password_");
//获取姓名
var userXm=getEle("userXm");
//获取身份证
var informationNumber = getEle("informationNumber");
//获取邮箱
var email = getEle("email");
//获取手机号
var telNumber = getEle("telNumber");
//提交验证
var loginSubmit =document.getElementsByClassName("login-submit")[0];
//用户名验证
username.onblur=function () {
    var reg = /^[a-zA-Z][\w]{5,29}$/;
    if (this.value.length==0){
        this.nextElementSibling.innerHTML="6-30位字母、数字或'_'，字母开头";
        this.nextElementSibling.style.color="red";
    }else {
        if (reg.test(this.value)!=false){
            this.nextElementSibling.innerHTML="用户名输入正确";
            this.nextElementSibling.style.color="green";
            flag[0]=true;
        }else {
            this.nextElementSibling.innerHTML="6-30位字母、数字或'_'，字母开头";
            this.nextElementSibling.style.color="red";
        }
    }
}
//密码强度判断
var rankStr = ["rank-a", "rank-b", "rank-c"];
function getRank(val){
    var modes= 0;
    if (/\d/.test(val))  modes++;//数字
    if(/[a-zA-Z]/.test(val)) modes++;//字母
    if(/[^a-zA-Z0-9\u4e00-\u9fa5    ]/.test(val)) modes++;//字符
    return modes;
}
//密码规则判断
password.onblur=function () {
    var reg = /^\S{6,20}$/;
    console.log(reg.test(this.value));
    console.log(this.value);
    if (this.value.length==0){
        pwError.style.display="block";
        pwError.innerHTML="请输入6-20位字母、数字或符号";
    }else {
        if (reg.test(this.value)!=false){
            pwError.style.display="none";
            flag[1]=true;
            var index = getRank(this.value);
            for (var i= 0;i<rankStr.length;i++){
                removeCls(rank,rankStr[i]);
            }
            addCls(rank,rankStr[Number(index-1)]);
        }else {
            pwError.style.display="block";
            pwError.innerHTML="请输入6-20位字母、数字或符号";
        }
    }
}
//两次密码是否一致判断
passwordConfirm.onblur=function () {
    if (this.value.length==0){
        this.nextElementSibling.innerHTML="密码不能为空";
        this.nextElementSibling.style.color="red";
    }else {
        if (this.value==password.value){
            this.nextElementSibling.innerHTML="两次输入一致";
            this.nextElementSibling.style.color="green";
            flag[2]=true;
        }else {
            this.nextElementSibling.innerHTML="两次密码输入不一致，请重新输入";
            this.nextElementSibling.style.color="red";
        }
    }
}
// 姓名
userXm.onblur=function () {
    var reg = /^([\u4e00-\u9fa5]{2,15}|[a-zA-Z]{3,30})$/;
    console.log(reg.test(this.value))
    if (this.value.length==0){
        this.nextElementSibling.innerHTML="姓名只能包含中文或者英文,且字符在3-30个之间";
        this.nextElementSibling.style.color="red";
        this.nextElementSibling.style.textDecoration="none";
    }else {
        if (reg.test(this.value)!=false){
            this.nextElementSibling.innerHTML="姓名输入正确";
            this.nextElementSibling.style.color="green";
            this.nextElementSibling.style.textDecoration="none";
            flag[3]=true;
        }else {
            this.nextElementSibling.innerHTML="姓名只能包含中文或者英文,且字符在3-30个之间";
            this.nextElementSibling.style.color="red";
            this.nextElementSibling.style.textDecoration="none";

        }
    }
}
//身份证
informationNumber.onblur=function () {
    var reg = /^\d{17}[\dXx]$/;
    console.log(reg.test(this.value))
    if (this.value.length==0){
        this.nextElementSibling.innerHTML="请输入18位身份证号码";
        this.nextElementSibling.style.color="red";
    }else {
        if (reg.test(this.value)!=false){
            this.nextElementSibling.innerHTML="号码输入正确";
            this.nextElementSibling.style.color="green";
            flag[4]=true;
        }else {
            this.nextElementSibling.innerHTML="请输入18位身份证号码";
            this.nextElementSibling.style.color="red";
        }
    }
}
//邮箱
email.onblur=function () {
    var reg = /^[\w-]+@[\w-]+\.[\w-]+$/;
    console.log(reg.test(this.value))
    if (this.value.length==0){
        this.nextElementSibling.innerHTML="请输入正确的邮箱";
        this.nextElementSibling.style.color="red";
    }else {
        if (reg.test(this.value)!=false){
            this.nextElementSibling.innerHTML="邮箱格式正确";
            this.nextElementSibling.style.color="green";
            flag[5]=true;
        }else {
            this.nextElementSibling.innerHTML="请输入正确的邮箱";
            this.nextElementSibling.style.color="red";
        }
    }
}
//手机号
telNumber.onblur=function () {
    var reg = /^1[^12]\d{9}$/;
    console.log(reg.test(this.value))
    if (this.value.length==0){
        this.nextElementSibling.innerHTML="您输入的手机号码不是有效的格式！";
        this.nextElementSibling.style.color="red";
    }else {
        if (reg.test(this.value)!=false){
            this.nextElementSibling.innerHTML="手机格式正确";
            this.nextElementSibling.style.color="green";
            flag[6]=true;
        }else {
            this.nextElementSibling.innerHTML="您输入的手机号码不是有效的格式！";
            this.nextElementSibling.style.color="red";
        }
    }
}
//跳转判断
loginSubmit.onclick=function () {
    console.log(flag)
    for (k in flag){
        if(flag[k]==false){
            alert("第"+(Number(k)+1)+"项还未完成");
            return;
        }
    }
    window.location="http://www.imooc.com";
}