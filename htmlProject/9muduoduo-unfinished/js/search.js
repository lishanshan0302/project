(function ($) {
    var cache = {
        data:{},
        count: 0,
        addData: function (key,data) {
            if (!this.data[key]){
                this.data[key]=data;
                this.count++;
            }
        },
        readData: function (key) {
            return this.data[key];
        },
        deleteDataByKey:function (key) {
            delete this.data[key];
            this.count--;
        },
        deleteDateByOrder:function (num) {
            var count = 0;
            for (p in this.data){
                if (count>=num){
                    break;
                }
                count++;
                this.deleteDataByKey(p);
            }
        }
    }
    function Search($elem, options) {

        this.$elem = $elem;
        this.options = options;

        this.$input = this.$elem.find(".search-inputbox");
        this.$form = this.$elem.find(".search-form");
        this.$layer = this.$elem.find(".search-layer");

        this.loaded = false;
        //提交
        this.$elem.on("click", ".search-btn", $.proxy(this.submit, this));
        //自动完成
        if (this.options.autocomplete) {
            this.autocomplete();
        }
    }

    Search.DEFAULTS = {
        autocomplete: false,
        url: "https://suggest.taobao.com/sug?code=utf-8&_ksTS=1590563403532_754&callback=jsonp755&k=1&area=c2c&bucketid=19&q=",
        css3: false,
        js: false,
        animation: "fade",
        getDataInterval:200
    }
    Search.prototype.submit = function () {
        if (this.getInputValue() === "") {
            return false;
        } else {
            this.$form.submit();
        }
    }
    Search.prototype.autocomplete = function () {
        var timer = null,
            self = this;
        this.$input
            //设置定时器，以免每一次输入都发送一次ajax请求
            .on("input", function(){
                //由于定时器本身就是异步执行，所以当没有传入参数的时候不执行即可
                if (self.options.getDataInterval){
                    clearTimeout(timer);
                    timer=setTimeout(function () {
                        self.getDate();
                    },self.options.getDataInterval);
                }else {
                    self.getDate();
                }
            })
            .on("focus", $.proxy(this.showLayer, this))
            .on("click", function () {
                return false;
            });
        this.$layer.showHide(this.options);
        $(document).on("click", $.proxy(this.hideLayer, this))
    }
    Search.prototype.getDate = function () {
        var self = this;
        var inputVal = this.getInputValue()
        //如果为空值，直接发送消息，传递无数据消息
        if (inputVal==="") return self.$elem.trigger('search-noData');

        if (cache.readData(inputVal)) return self.$elem.trigger('search-getData', [cache.readData(inputVal)])
        //不为空值，发送ajax请求
        //通过$.ajax()返回值判断上一次ajax请求是否完毕，如果没有完成就中止
        if (this.jqXHR) this.jqXHR.abort();
        this.jqXHR = $.ajax({
            url: this.options.url + inputVal,
            dataType: "jsonp",
        }).done(function (data) {
            console.log(data);
            cache.addData(inputVal,data);
            console.log(cache.addData);
            console.log(cache.count);
            self.$elem.trigger('search-getData', [data])
        }).fail(function () {
            self.$elem.trigger('search-noData');
        }).always(function () {
            //请求执行完毕清空返回值；
            self.jqXHR=null;
        })
    }
    Search.prototype.showLayer = function () {
        //空值不显示；
        if (!this.loaded) return
        this.$layer.showHide("show");
    }
    Search.prototype.hideLayer = function () {
        this.$layer.showHide("hide");
    }
    Search.prototype.getInputValue = function () {
        return $.trim(this.$input.val());
    }
    Search.prototype.setInputVal = function (val) {
        this.$input.val(removeHtmlTags(val))

        function removeHtmlTags(str) {
            return str.replace(/<(?:[^'">]|"[^"]*"|'[^']*')*>/g, "");
        }
    }
    Search.prototype.appendLayer = function (html) {
        this.$layer.html(html);
        this.loaded=!!html;//通过！！将html转换成boolean值
    }
    $.fn.extend({
        //遍历数组中的每个对象调用search方法
        search: function (option, value) {
            return this.each(function () {
                var $this = $(this);
                //$(this).data()获取以data-开头的属性值，下述方法默认active属性先通过option获取，然后通过data-active属性获取，
                var search = $this.data("search");//从data-dropdown属性内获取
                var options = $.extend({}, Search.DEFAULTS, $this.data(), typeof option === "object" && option);
                if (!search) {//first time 初始化
                    $this.data("search", search = new Search($this, options))
                }
                //传入两个参数，一个元素，一个自定义动画对象
                //实例化对象并接收,如果对象下面没有该方法，程序并不会报错，只会返回undefined;
                if (typeof search[option] === "function") {
                    search[option](value);
                }
            });
        }
    })
})(jQuery);

// (function () {
//
//     var $search = $(".search"),
//         $input = $(".search-inputbox"),
//         $btn = $(".search-btn"),
//         $form = $(".search-form"),
//         $layer = $(".search-layer");
//     //验证,
//     $form.on('submit', function () {
//         if ($.trim($input.val()) === "") {
//             return false;
//         }
//     });
//     //自动完成
//     //input事件在input输入框发生改变的时候触发事件，不用等到光标移出，比change好
//     $input.on("input",function () {
//         //处理内容编码
//         var url ="https://suggest.taobao.com/sug?code=utf-8&_ksTS=1590563403532_754&callback=jsonp755&k=1&area=c2c&bucketid=19&q="+encodeURIComponent($.trim($input.val()));
//         $.ajax({
//             url:url,
//             dataType:"jsonp",}).done(function (data) {
//                 console.log(data);
//                 var html ="",
//                     dataNum = data["result"].length
//                     maxNum = 10;
//                 if (dataNum===0){
//                     $layer.hide().html("");
//                     return;
//                 }else {
//                     for (var i = 0;i<dataNum;i++){
//                         if (i>maxNum) return;
//                         html +='<li class="search-layer-item text-ellipsis">'+data["result"][i][0]+'</li>';
//                     }
//                 }
//             $layer.html(html).show();
//
//         }).fail(function () {
//             $layer.hide().html("");
//
//         }).always(function () {
//             console.log("always")
//         })
//     })
//     //jq事件代理  可以被代理的事件是可以冒泡的事件，不可以冒泡的事件是无法绑定的，例如blur focus
//     $layer.on("click",".search-layer-item",function () {
//         $input.val(removeHtmlTags($(this).html()));
//         $form.submit();
//     })
//     $input.on("focus",function () {
//         $layer.show()
//     }).on("click",function () {
//         return false;
//     })
//     $(document).on("click",function () {
//         $layer.hide();
//     })
//     //去除html标签
//     function removeHtmlTags(str) {
//         return str.replace(/<(?:[^'">]|"[^"]*"|'[^']*')*>/g,"");
//     }
// })();