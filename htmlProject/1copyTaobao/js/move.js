(function () {
    var transition = window.mt.transition;

    var init =function ($elem) {
        this.$elem = $elem;
        this.curX = parseFloat(this.$elem.css("left"))
        this.curY = parseFloat(this.$elem.css("top"))
    }
    var to = function (x,y,callback) {
        y = (typeof y === "number") ? y : this.curY;
        x = (typeof x === "number") ? x : this.curX;
        if (this.curX === x && this.curY === y) return;
        this.$elem.trigger("move",[this.$elem]);
        if (typeof callback==="function"){
            callback();
        }
        this.curX = x;
        this.curY = y;

    }

    var Silent = function ($elem) {
        init.call(this,$elem);
        //调用前移出过渡属性，无论是否有此属性
        this.$elem.removeClass("transition")

    }
    Silent.prototype.to = function (x, y) {
        var self = this;
        to.call(this,x,y,function () {
            self.$elem.css({
                left: x,
                top: y
            })
            self.$elem.trigger("moved",[self.$elem]);
        })
    }
    Silent.prototype.x = function (x) {
        this.to(x);
    }
    Silent.prototype.y = function (y) {
        this.to(null, y);
    }

    var Css3 = function ($elem) {
        init.call(this,$elem);
        this.$elem.addClass("transition");
        //初始化设置left以及top值，以免动画失效；
        this.$elem.css({
            left:this.curX,
            top:this.curY
        })
    }
    Css3.prototype.to = function (x,y) {
        var self = this;
        to.call(this,x,y,function () {
            //确保每次执行只绑定一次transition.end事件,绑定之前先清除
            self.$elem.off(transition.end).one(transition.end,function () {
                self.$elem.trigger("moved",[self.$elem]);
            })
            self.$elem.css({
                left: x,
                top:y
            })
        })
    }
    Css3.prototype.x = function (x) {
        this.to(x);
    }
    Css3.prototype.y = function (y) {
        this.to(null,y);
    }

    var Js = function ($elem) {
        init.call(this,$elem);
        this.$elem.removeClass("transition")
    }
    Js.prototype.to = function (x,y) {
        var self = this;
        to.call(this,x,y,function () {
            self.$elem.stop().animate({
                left:x,
                top:y
            },function () {
                self.$elem.trigger("moved",[self.$elem]);
            })
        })
    }
    Js.prototype.x = function (x) {
        this.to(x);
    }
    Js.prototype.y = function (y) {
        this.to(null,y);
    }

    // var $box = $("#box"),
    //     $goBtn = $("#go-btn"),
    //     $backBtn = $("#back-btn"),
    //     // move = new Silent($box)
    //     // move = new Css3($box)
    //     move = new Js($box)
    // // $box.move({
    // //     css3:true,
    // //     js:false
    // // })
    // $box.on("move moved",function (e,$elem) {
    //     console.log(e.type)
    //     // console.log($elem)
    // })
    // $goBtn.on("click", function () {
    //     // move.to(100, 50);
    //     move.x(200);
    //     // move.y(200);
    // })
    // $backBtn.on("click", function () {
    //     // move.to(0, 20);
    //     // move.y(100);
    //     move.x(20);
    // })
    var DEFAULTS = {
        css3: false,
        js:false
    }
     var move=function($elem,options){
        var mode = null;
        if (options.css3&&transition.isSurport){
            mode = new Css3($elem);
        }else if(options.js){
            mode=new  Js($elem)
        }else {
            mode = new Silent($elem)
        }
        return {
            to:$.proxy(mode.to,mode),
            x:$.proxy(mode.x,mode),
            y:$.proxy(mode.y,mode)
        }
     }
    $.fn.extend({
        move: function (option,x,y) {
            return this.each(function () {
                var $this = $(this);
                //$(this).data()获取以data-开头的属性值，下述方法默认active属性先通过option获取，然后通过data-active属性获取，
                var mode = $this.data("move");//从data-dropdown属性内获取
                var options = $.extend({}, DEFAULTS, typeof option === "object" && option);
                if (!mode) {//first time 初始化
                    $this.data("move", mode = move($this, options))
                }
                //传入两个参数，一个元素，一个自定义动画对象
                //实例化对象并接收,如果对象下面没有该方法，程序并不会报错，只会返回undefined;
                if (typeof mode[option] === "function") {
                    mode[option](x,y);
                }
            });
        }
    })
})(jQuery)