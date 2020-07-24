(function ($) {
    "use strict";//声明严格模式
    /**
     * window.mt.transition----transition.js内封装，用于接收不同浏览器的transition属性中的transitionend方法名
     */

    var transition = window.mt.transition;//接收变量
    /**
     * 初始化页面，判断当前元素是否显示以及隐藏，根据判断添加自定义属性
     * @param $elem jQuery对象
     * @param initCallback 回调函数，只有传入参数是function类型时才会执行；
     */

    function init($elem, initCallback) {
        if ($elem.is(":hidden")) {//hidden
            $elem.data("status", "hidden")
            if (typeof initCallback === "function") initCallback();
        } else {
            $elem.data("status", "shown")
        }
    }

    /**
     * 全局显示函数封装，用于监听显示动画执行状态时触发的绑定事件，通过设置初始值来避免重复点击时的重复调用
     * @param $elem
     * @param callback 回调函数（选传）
     */

    function show($elem, callback) {
        if ($elem.data("status") === "show") return;
        if ($elem.data("status") === "shown") return;
        /*设置状态，绑定监听*/
        $elem.data("status", "show").trigger("show");
        callback();
    }

    /**
     * 全局显示函数封装，用于监听隐藏动画执行状态时触发的绑定事件，通过设置初始值来避免重复点击时的重复调用
     * @param $elem
     * @param callback 回调函数（选传）
     */

    function hide($elem, callback) {
        if ($elem.data("status") === "hide") return;
        if ($elem.data("status") === "hidden") return;
        $elem.data("status", "hide").trigger("hide");
        callback();
    }

    /**
     * jQ静态动画
     */

    var silent = {
        init: init,
        show: function ($elem) {
            show($elem, function () {
                $elem.show();
                $elem.data("status", "shown").trigger("shown");
            })
        },
        hide: function ($elem) {
            hide($elem, function () {
                $elem.hide();
                $elem.data("status", "hidden").trigger("hidden");
            })
        }
    }
    /**
     * css3动画
     */
    var css3 = {
        fade: {
            init: function ($elem) {

                css3._init($elem, "fadeOut");
            },
            show: function ($elem) {
                css3._show($elem, "fadeOut")
            },
            hide: function ($elem) {
                css3._hide($elem, "fadeOut");
            }
        },
        slideUpDown: {
            init: function ($elem) {
                //初始化高度，防止因为没有设置高度造成动画失效
                $elem.height($elem.height());
                css3._init($elem, "slidUpDownCollapse");
            },
            show: function ($elem) {
                css3._show($elem, "slidUpDownCollapse");
            },
            hide: function ($elem) {
                css3._hide($elem, "slidUpDownCollapse")
            }
        },
        slideLeftRight: {
            init: function ($elem) {
                //初始化高度，防止因为没有设置高度造成动画失效
                $elem.width($elem.width());
                css3._init($elem, "slideLeftRightCollapse");
            },
            show: function ($elem) {
                css3._show($elem, "slideLeftRightCollapse");
            },
            hide: function ($elem) {
                css3._hide($elem, "slideLeftRightCollapse")
            }
        },
        fadeSlideUpDown: {
            init: function ($elem) {
                //初始化高度，防止因为没有设置高度造成动画失效
                $elem.width($elem.width());
                css3._init($elem, "fadeOut slideLeftRightCollapse");
            },
            show: function ($elem) {
                css3._show($elem, "fadeOut slideLeftRightCollapse");
            },
            hide: function ($elem) {
                css3._hide($elem, "fadeOut slideLeftRightCollapse")
            }
        },
        fadeSlideLeftRight: {
            init: function ($elem) {
                //初始化高度，防止因为没有设置高度造成动画失效
                $elem.width($elem.width());
                css3._init($elem, "fadeOut slideLeftRightCollapse");
            },
            show: function ($elem) {
                css3._show($elem, "fadeOut slideLeftRightCollapse");
            },
            hide: function ($elem) {
                css3._hide($elem, "fadeOut slideLeftRightCollapse")
            }
        }
    };
    /**
     * className用于通过添加类名方式，通过css设置transition
     */
    //css3初始化封装
    css3._init = function ($elem, className) {
        //添加动画时间，此部分需要考虑兼容性前缀
        $elem.addClass("transition")
        //初始化状态，设置css3动画；
        init($elem, function () {
            $elem.addClass(className);
        });
    };
    /**
     * css3显示封装
     * transition.end：通过暴露全局变量的方式，从其他js文件中引入封装后的兼容性不同浏览器的transitionend属性名
     * 由于最开始设置动画元素display：none属性，如果直接不设置setTimeout，会导致动画与显示同时进行，页面不显示动画
     */
    css3._show = function ($elem, className) {
        show($elem, function () {
            /*transitionend为js事件，只有transition执行完毕才会触发，确保上一个过度执行完毕才会触发这个事件*/
            $elem.off(transition.end).one(transition.end, function () {/*使用on绑定会反复的绑定事件,会反复触发事件监听*/
                /*当执行完毕的时候设置属性，绑定监听*/
                $elem.data("status", "shown").trigger("shown");
                // console.log( $elem.data("status"))
            })
            $elem.show();/*如果直接从display变化无动画效果，不存在的元素时没有动画效果的*/
            setTimeout(function () {
                $elem.removeClass(className);
            },200)
        })
    };
    /**
     * css3隐藏封装
     * transition.end：通过暴露全局变量的方式，从其他js文件中引入封装后的兼容性不同浏览器的transitionend属性名
     * 由于最开始设置动画元素display：none属性，如果直接不设置setTimeout，会导致动画与显示同时进行，页面不显示动画
     */
    css3._hide = function ($elem, className) {
        hide($elem, function () {
            /*这样即使点击隐藏，立马点击显示依旧会触发hidden事件，需要每次绑定hidden之前取消上一次事件*/
            $elem.off(transition.end).one(transition.end, function () {
                /*确保隐藏之前已经完全显示，所以需要在上一次动画执行完毕之后再执行hide的操作*/
                $elem.hide();
                // hide()执行完毕之后添加自定义属性，并监听hidden事件；
                $elem.data("status", "hidden").trigger("hidden");
            })
            $elem.addClass(className);
        })
    }
    /**
     * js动画函数
     */
    var js = {
        fade: {
            init: function ($elem) {
                js._init($elem);
            },
            show: function ($elem) {
                js._show($elem, "fadeIn")
            },
            hide: function ($elem) {
                js._hide($elem, "fadeOut")
            }
        },
        slideUpDown: {
            init: function ($elem) {
                js._init($elem);
            },
            show: function ($elem) {
                js._show($elem, "slideDown")
            },
            hide: function ($elem) {
                js._hide($elem, "slideUp")
            }
        },
        slideLeftRight: {
            init: function ($elem) {
                js._customInit($elem, {
                    "width": 0,
                    'padding-left': 0,
                    "padding-right": 0
                });
            },
            show: function ($elem) {
                js._customShow($elem);
            },
            hide: function ($elem) {
                js._customHide($elem, {
                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                })
            }
        },
        fadeSlideUpDown: {
            init: function ($elem) {
                js._customInit($elem, {
                    'opacity': 0,
                    'padding-top': 0,
                    'padding-bottom': 0,
                    'height': 0
                });
            },
            show: function ($elem) {
                js._customShow($elem);
            },
            hide: function ($elem) {
                js._customHide($elem, {
                    'opacity': 0,
                    'padding-top': 0,
                    'padding-bottom': 0,
                    'height': 0
                })
            }
        },
        fadeLeftRight: {
            init: function ($elem) {
                js._customInit($elem, {
                    "opacity": 0,
                    "width": 0,
                    'padding-left': 0,
                    "padding-right": 0
                });
            },
            show: function ($elem) {
                js._customShow($elem);
            },
            hide: function ($elem) {
                js._customHide($elem, {
                    "opacity": 0,
                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                })
            }
        }
    }
    js._init = function ($elem, hiddenCallback) {
        $elem.removeClass("transition")//初始化移除样式，否则css动画会与js动画冲突；
        init($elem, hiddenCallback);//hiddenCallback 回调函数
    }
    js._customInit = function ($elem, options) {
        //初始化之前首先获取元素初始值
        var styles = {};
        for (var p in options) {
            styles[p] = $elem.css(p);
        }
        //使用$elem.data()方法设置的属性是以data-开头，创建是在内存中，
        // 不会显示在html结构中，但是也会覆盖本身的data-开头相同属性的值，
        //但是在htnl结构中仍旧会显示未覆盖之前的值；
        $elem.data("styles", styles);
        console.log($elem.data("style"));
        js._init($elem, function () {
            $elem.css(options);
        })
    }
    js._show = function ($elem, mode) {
        show($elem, function () {
            $elem.stop()[mode](function () {
                $elem.data("status", "shown").trigger("shown");
            })
        })
    }
    js._customShow = function ($elem) {
        show($elem, function () {
            $elem.show();
            console.log($elem.data("styles"));
            $elem.stop().animate($elem.data("styles"), function () {
                $elem.data("status", "shown").trigger("shown");
            })
        })
    }
    js._hide = function ($elem, mode) {
        hide($elem, function () {
            //隐藏
            $elem.stop()[mode](function () {
                $elem.data("status", "hidden").trigger("hidden");
            })
        })
    }
    js._customHide = function ($elem, options) {
        hide($elem, function () {
            //执行动画之前首先停止动画；
            $elem.stop().animate(options, function () {
                //动画结束之后隐藏
                $elem.hide();
                $elem.data("status", "hidden").trigger("hidden");
            })
        })
    }
    var defaults = {
        css3: false,
        js: false,
        animation: "fade"
    }

    function showHide($elem, options) {
        var mode = null;
        if (options.css3 && transition.isSurport) {
            // console.log(options.css3);
            mode = css3[options.animation] || css3[defaults.animation];
        } else if (options.js) {
            mode = js[options.animation] || js[defaults.animation];
        } else {
            mode = silent;
        }
        mode.init($elem);
        return {
            // show: mode.show,
            // hide: mode.hide
            //$.proxy()jq方法，可以改变函数的this指向，
            // 并传递参数，函数并不会执行，此方式方便外部调用的时候可以直接执行，不用再次传递参数
            show: $.proxy(mode.show, this, $elem),
            hide: $.proxy(mode.hide, this, $elem)
        }
    }

    $.fn.extend({
        showHide: function (option) {
            // alert(1)
            return this.each(function () {
                var $this = $(this),
                    options = $.extend({}, defaults, typeof option === "object" && option),
                    mode = $this.data("showHide");

                if (!mode) {
                    $this.data("showHide", mode = showHide($this, options));
                }
                if (typeof mode[option] === "function") {
                    mode[option]();
                }
            });
        }
    })
    // window.mt = window.mt || {};
    // window.mt.showHide = showHide;
})(jQuery)