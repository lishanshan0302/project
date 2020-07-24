(function ($) {
    "use strict";//声明严格模式

    function Dropdown($elem,options) {
        this.$elem = $elem,
        this.options=options,//将options绑定在this上，方便后面函数调用，否则无法获取
        this.$layer = this.$elem.find(".dropdown-layer"),
        this.activeClass = options.active+"-active";
        //初始化
        this._init();
    }

    /**
     *event 绑定事件类型
     *css3 触发动画方式
     *js 触发动画方式
     *animation 触发动画类型
     *delay 是否动画延迟
     *active dropdown组件当前状态
     */

    Dropdown.DEFAULTS={
        event:"hover",
        css3: false,
        js: false,
        animation: "fade",
        delay:0,
        active:"dropdown"
    }
    Dropdown.prototype._init=function(){
        var self = this;
        this.$layer.showHide(this.options);
        this.$layer.on("show shown hide hidden",function (e) {
            self.$elem.trigger("dropdown-"+e.type);
        })
        //根据event不同进行判断
        //获取jq对象
        if(this.options.event==="click"){
            this.$elem.on("click",function (e){
                //由于该事件内的this是一个dom对象，此部分调用jq方法，需要在外部的jq对象上绑定
                self.show();
                //阻止事件冒泡
                e.stopPropagation();});
            $(document).on("click",$.proxy(this.hide,this));
        }else {//不做===等于判断，仅提供若指定方式为click触发click事件，其余默认为hover事件
            //改变函数的this指向
            this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this))
        }
    }
    Dropdown.prototype.show=function(){
        var self = this;
        //setTimeOut实际上是一个异步的处理方式，会在系统内排队等待，即使不传入参数也会导致定时器内函数等一段事件之后才会执行
        if (this.options.delay){//delay
            //在this上保存定时器，方便后面hide方法内部清理
            this.timer=setTimeout(function () {
                _show();
            },this.options.delay)
        } else {
            _show();
        }
        function _show() {
            self.$elem.addClass(self.activeClass);
            //显示
            self.$layer.showHide("show");
        }
    }
    Dropdown.prototype.hide=function () {
        if (this.options.delay){
           clearTimeout(this.timer)
        }
        this.$elem.removeClass(this.activeClass);
        //隐藏
        this.$layer.showHide("hide");
    }

    /**
     *
     * @param elem dom元素，当前下拉组件父容器；
     */
    // function dropdown(elem,options) {
    //     var $elem = $(elem);
    //     var $layer = $elem.find(".dropdown-layer");
    //     var activeClass = $elem.data("active")+"-active";
    //     //调用动画组件
    //     $layer.showHide(options);
    //     $elem.hover(function () {
    //         $elem.addClass(activeClass);
    //         //显示
    //         $layer.showHide("show");
    //     },function () {
    //         $elem.removeClass(activeClass);
    //         //隐藏
    //         $layer.showHide("hide");
    //         // console.log($layer.showHide)
    //     })
    // }
    /**
     * $.fn.extend()为jq原型方法，用于jq对象扩展方法，可直接通过. 的方式调用
     */

    $.fn.extend({
        //遍历数组中的每个对象调用dropdown方法
        dropdown:function (option) {
            return this.each(function (){
                var $this = $(this);
                //$(this).data()获取以data-开头的属性值，下述方法默认active属性先通过option获取，然后通过data-active属性获取，
                var dropdown = $this.data("dropdown");//从data-dropdown属性内获取
                var options =$.extend({}, Dropdown.DEFAULTS,$this.data(), typeof option==="object"&&option);
                if (!dropdown){//first time 初始化
                    $this.data("dropdown", dropdown=new Dropdown($this,options))
                }
                //传入两个参数，一个元素，一个自定义动画对象
                //实例化对象并接收,如果对象下面没有该方法，程序并不会报错，只会返回undefined;
                if (typeof dropdown[option]==="function"){
                    dropdown[option]();
                }
            });
        }
    })
})(jQuery)//传入jQuery防止$被覆盖;