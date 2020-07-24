(function () {
    function Slider($elem, options) {
        this.$elem = $elem;
        this.options = options;
        this.$items = this.$elem.find(".slider-item");
        this.$indicators = this.$elem.find(".slider-indicator");
        this.itemNum = this.$items.length;
        this.curIndex = this._getCorrectIndex(this.options.activeIndex);
        this.$controls = this.$elem.find(".slider-control");
        this._init();
    }

    Slider.DEFAULTS = {
        css3: true,
        js: false,
        animation: 'fade', //slider
        activeIndex: 0,//默认显示第几张
        Interval: 0,//自动切换功能
        loop: false//是否整体滑动
    }
    //初始化
    Slider.prototype._init = function () {
        var self = this;
        //声明切换样式
        //移出下方圆点样式，显示当前索引样式
        this.$indicators.removeClass("slider-indicator-active");
        this.$indicators.eq(this.curIndex).addClass("slider-indicator-active");
        //to
        if (this.options.animation === "slide") {
            this.$elem.addClass("slider-slide");
            this.to = this._slide
            this.$container = this.$elem.find(".slider-container");
            this.itemWidth = this.$elem.eq(0).width();
            this.$container.css('left', -1 * this.curIndex * this.itemWidth);

            //move init
            this.$container.move(this.options);

            if (this.options.loop) {
                //把第一个子元素克隆一份添加到父容器最后；
                this.$container.append(this.$items.eq(0).clone());
                this.transitionClass=this.$container.hasClass('transition')?'transition':"";
                //更新itemNum
                this.itemNum++;
            }
        } else {
            this.$elem.addClass("slider-fade");
            this.$items.eq(this.curIndex).show();
            //send message
            this.$items.on('show shown hide hidden', function (e) {
                self.$elem.trigger("slider-" + e.type, [self.$items.index(this), this]);
            })

            //showHide init
            this.$items.showHide(this.options);
            this.to = this._fade;
        }
        //bind event
        this.$elem
            .hover(function () {
                self.$controls.show()
            }, function () {
                self.$controls.hide()
            })
            .on("click", ".slider-control-lf", function () {
                //传入第二个参数，通过第二个参数的正负值判断左右；
                self.to(self._getCorrectIndex(self.curIndex - 1),1);
            })
            .on("click", ".slider-control-rt", function () {
                self.to(self._getCorrectIndex(self.curIndex + 1),-1);
            })
            .on("click", ".slider-indicator", function () {
                self.to(self._getCorrectIndex(self.$indicators.index(this)));
            })
        if (this.options.Interval && !isNaN(Number(this.options.Interval))) {
            this.$elem.hover($.proxy(this.pause, this), $.proxy(this.auto, this))
            this.auto();
        }


    }

    Slider.prototype._getCorrectIndex = function (index, maxNum) {
        maxNum = maxNum || this.itemNum;
        if (isNaN(Number(index))) return 0;
        if (index < 0) return maxNum - 1;
        if (index > maxNum - 1) return 0;
        return index;
    }
    Slider.prototype._activateIndicators = function (index) {
        this.$indicators.removeClass("slider-indicator-active");
        this.$indicators.eq(index).addClass("slider-indicator-active");
    }
    Slider.prototype._fade = function (index) {
        if (this.curIndex === index) return;
        this.$items.eq(this.curIndex).showHide("hide");
        this.$items.eq(index).showHide("show")
        this._activateIndicators(index);
        this.curIndex = index;

    }
    Slider.prototype._slide = function (index,direction) {
        var self = this;
        if (this.curIndex === index) return;
        this.$container.move("x", -1 * index * this.itemWidth);
        this.curIndex = index;
        if (this.options.loop&&direction){
            if (direction<0){//right
                if (index===0){
                    this.$container.removeClass(this.transitionClass).css("left",0);
                    this.curIndex=index=1;
                    setTimeout(function () {
                        self.$container.addClass(self.transitionClass).move("x", -1 * index * self.itemWidth);
                    })
                }
            }else {//left
                if (index===this.itemNum-1){
                    this.$container.removeClass(this.transitionClass).css("left",-1*index*this.itemWidth);
                    this.curIndex=index=this.itemNum-2;
                    setTimeout(function () {
                        self.$container.addClass(self.transitionClass).move("x", -1 * index * self.itemWidth);
                    })
                }
            }
            index = this._getCorrectIndex(index, this.itemNum - 1)
        }
        this._activateIndicators(index);

    }
    Slider.prototype.auto = function () {
        var self = this;
        this.IntervalId = setInterval(function () {
            self.to(self._getCorrectIndex(self.curIndex + 1),-1)
        }, this.options.Interval);
    }
    Slider.prototype.pause = function () {
        clearInterval(this.IntervalId);
    }
    $.fn.extend({
        slider: function (option) {
            return this.each(function () {
                var $this = $(this);
                //$(this).data()获取以data-开头的属性值，下述方法默认active属性先通过option获取，然后通过data-active属性获取，
                var slider = $this.data("slider");//从data-dropdown属性内获取
                var options = $.extend({}, Slider.DEFAULTS, $this.data(), typeof option === "object" && option);
                if (!slider) {//first time 初始化
                    $this.data("slider", slider = new Slider($this, options))
                }
                //传入两个参数，一个元素，一个自定义动画对象
                //实例化对象并接收,如果对象下面没有该方法，程序并不会报错，只会返回undefined;
                if (typeof slider[option] === "function") {
                    slider[option]();
                }
            });
        }
    })
})(jQuery)