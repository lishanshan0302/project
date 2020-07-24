(function ($) {
    function Tab($elem, options) {
        this.$elem = $elem;
        this.options = options;

        this.$items = this.$elem.find('.tab-item');
        this.$panels = this.$elem.find('.tab-panel');

        this.itemNum = this.$items.length;
        this.curIndex = this._getCorrectIndex(this.options.activeIndex);

        this._init();
    }

    Tab.DEFAULTS = {
        event: "mouseenter",//clicks
        css3: false,
        js: false,
        animation: 'fade',
        activeIndex: 0,
        interval:0,
        delay:0
    }
    Tab.prototype._init = function () {
        var self = this,
            timer=null;
        //init show
        this.$items.removeClass("tab-item-active");
        this.$items.eq(this.curIndex).addClass("tab-item-active");
        this.$panels.eq(this.curIndex).show();
        this.$elem.trigger('tab-show',[this.curIndex, this.$panels[this.curIndex]])

        //trigger event
        this.$panels.on('show shown hide hidden',function (e) {
            self.$elem.trigger('tab-'+e.type,[self.$panels.index(this), this])
        });


        //showHide init
        this.$panels.showHide(this.options);

        //bind event
        //默认mouseenter事件，只有传入click才是click事件
        this.options.event = this.options.event === 'click' ? 'click' : 'mouseenter';
        this.$elem.on(this.options.event, '.tab-item', function () {
            var elem =this;
            if (self.options.delay){
                clearTimeout(timer);
                timer=setTimeout(function () {
                self.toggle(self.$items.index(elem));
                },self.options.delay)
            }else {
                self.toggle(self.$items.index(elem));
            }

        })

        //auto
        if (this.options.interval&&!isNaN(Number(this.options.interval))){
            this.$elem.hover($.proxy(this.pause(),this),$.proxy(this.auto(),this));
            this.auto();
        }
    }
    Tab.prototype.toggle=function(index){
        //当前索引与指定相同直接返回
        if (this.curIndex===index)return;
        //当前面板隐藏，指定显示
        this.$panels.eq(this.curIndex).showHide("hide");
        this.$panels.eq(index).showHide("show");
        //当前标题隐藏，指定显示
        this.$items.eq(this.curIndex).removeClass("tab-item-active");
        this.$items.eq(index).addClass("tab-item-active");
        //当前索引被指定索引覆盖
        this.curIndex=index;

    }
    Tab.prototype.auto = function () {
        var self = this;
        this.IntervalId = setInterval(function () {
            self.toggle(self._getCorrectIndex(self.curIndex + 1))
        }, this.options.interval);
    }
    Tab.prototype.pause = function () {
        clearInterval(this.IntervalId);
    }
    Tab.prototype._getCorrectIndex = function (index) {
        if (isNaN(Number(index))) return 0;
        if (index < 0) return this.itemNum - 1;
        if (index > this.itemNum - 1) return 0;
        return index;
    }
    $.fn.extend({
        tab: function (option) {
            return this.each(function () {
                var $this = $(this);
                //$(this).data()获取以data-开头的属性值，下述方法默认active属性先通过option获取，然后通过data-active属性获取，
                var tab = $this.data("tab");//从data-dropdown属性内获取
                var options = $.extend({}, Tab.DEFAULTS, $this.data(), typeof option === "object" && option);
                if (!tab) {//first time 初始化
                    $this.data("tab", tab = new Tab($this, options))
                }
                //传入两个参数，一个元素，一个自定义动画对象
                //实例化对象并接收,如果对象下面没有该方法，程序并不会报错，只会返回undefined;
                if (typeof tab[option] === "function") {
                    tab[option]();
                }
            });
        }
    })
})(jQuery)