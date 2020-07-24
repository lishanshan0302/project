(function (document,window) {
    //封装通用的xhr对象兼容各个版本
    function creatXHR() {
        var data = null;
        //判断浏览器是否将XMLHttpRequest作为本地对象实现，针对IE7，firefox、opera等；
        if(typeof XMLHttpRequest!="undefined"){
            return new XMLHttpRequest();
        }else if(typeof ActiveXObject !="undefined"){
            //将所有可能出现的的ActiveXObject版本放在一个数组中
            var xhrArr = ["Microsoft.XMLHTTP","Microsoft.XMLHTTP.6.0","Microsoft.XMLHTTP.5.0",
                "Microsoft.XMLHTTP.4.0","Microsoft.XMLHTTP.3.0","Microsoft.XMLHTTP.2.0"];
            //遍历创建所有XMlHttpRequest对象
            for (var  i = 0;i<xhrArr.length;i++){
                try {
                    //创建XMlHttpRequest对象
                    xhr = new ActiveXObject(xhrArr[i]);
                    break;
                }catch (e) {

                }
            }
            return xhr;
        }else {throw new Error("No xhr Object availabel ")}
    }
    window.creatXHR=creatXHR;
})(document,window);