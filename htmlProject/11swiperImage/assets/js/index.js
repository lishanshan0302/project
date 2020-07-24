(function (window, document) {
    let canChange = true;
    let curPreviewImgIndex = 0;
    /**
     * @Description: 公共类样式操作方法
     * @param:
     * @author Shanshan Li  2020/6/30
     */
    const methods = {
        /**
         * @Description: 添加元素
         * @param:
         * @author Shanshan Li  2020/6/30
         */
        appendChild(parent, ...children) {
            children.forEach(el => {
                parent.appendChild(el);
            })
        },
        $(selector, root = document) {
            return root.querySelector(selector);
        },
        $$(selector, root = document) {
            return root.querySelectorAll(selector);
        }
    };
    let Img = function (options) {
        this._init(options);
        this._createElement();
        this._bind();
        this._show();

    };
    /**
     * @Description: 初始化参数
     * @param: data----图片数据，iniType---图片类型，parasitifer---挂载点
     * @author Shanshan Li  2020/6/30
     */
    Img.prototype._init = function ({data, initType, parasitifer}) {
        this.types = ['全部'];//所有图片分类
        this.all = [];//所有图片元素
        this.classified = {'全部': []};//按照类型分类后的图片
        this.curType = initType;//当前图片分类
        this.parasitifer = methods.$(parasitifer);
        this.imgContainer = null;//所有图片的容器
        this.wrap = null;//整体容器
        this.typeBtnEls = null;//所有分类按钮组成的数组
        this.figures = null;//所有当前显示图片组成的数组
        this._classify(data);
    };
    Img.prototype._classify = function (data) {
        let srcs = [];
        data.forEach(({title, type, alt, src}, index) => {
            if (!this.types.includes(type)) {
                this.types.push(type);
            }
            // Object.keys  返回一个所有元素为字符串的数组，其元素来自于从给定的object上面可直接枚举的属性。这些属性的顺序与手动遍历该对象属性时的一致。
            if (!Object.keys(this.classified).includes(type)) {
                this.classified[type] = [];
            }
            if (!srcs.includes(src)) {
                //图片么有生成过
                //生成图片，添加到对应的分类中，
                srcs.push(src);
                let figure = document.createElement('figure');
                let img = document.createElement('img');
                let figcaption = document.createElement('figcaption');
                img.src = src;
                img.setAttribute('alt', alt);
                figcaption.innerText = title;
                methods.appendChild(figure, img, figcaption);
                this.all.push(figure);
                //添加索引
                this.classified[type].push(this.all.length - 1)
            } else {
                //否则去all中找到对应的图片，添加到对应的分类中
                //findIndex(fn)传入一个条件返回符合条件的第一个索引值；
                this.classified[type].push(srcs.findIndex(s1 => s1 === src))
            }
        })
    };
    //获取图片type类别figure；
    Img.prototype._getImgsByType = function (type) {
        //map一个由原数组每个元素执行回调函数的结果组成的新数组。
        // index可选 callback 数组中正在处理的当前元素的索引。
        return type === '全部' ? [...this.all] : this.classified[type].map(index => this.all[index]);
    };
    //生成dom
    Img.prototype._createElement = function () {
        //创建分类按钮
        let typeBtn = [];
        for (let type of this.types.values()) {
            typeBtn.push(`<li class="__Img__classify__type-btn${type === this.curType ? ' __Img__type-btn-active' : ''}">${type}</li>`);
        }
        //整体的模板
        let template = `<ul class="__Img__classify">${typeBtn.join('')}</ul><div class="__Img__img-container"></div>`;
        let wrap = document.createElement('div');
        wrap.className = '__Img__container';
        wrap.innerHTML = template;
        //取出存放图片容器；放入图片；
        this.imgContainer = methods.$('.__Img__img-container', wrap);
        methods.appendChild(this.imgContainer, ...this._getImgsByType(this.curType));
        this.wrap = wrap;
        this.typeBtnEls = [...methods.$$('.__Img__classify__type-btn', wrap)];
        this.figures = [...methods.$$('figure', wrap)];
        //遮罩层
        let overLay = document.createElement('div');
        overLay.className = '__Img__overlay';
        overLay.innerHTML = `<div class="__Img__overlay-prev-btn"></div>
                            <div class="__Img__overlay-next-btn"></div>
                            <img src="" alt="">`;
        methods.appendChild(wrap, overLay);
        this.overlay = overLay;
        this.previewImg = methods.$('img', overLay);
        this._calcPosition(this.figures);
    };
    Img.prototype._diff = function (prev, next) {
        let diffArr = [];
        prev.forEach((src1, index1) => {
            let index2 = next.findIndex(src2 => src1 === src2);
            if (index2 !== -1) {
                diffArr.push([index1, index2]);
            }
        });
        return diffArr;
    };
    /**
     * @Description: 绑定事件
     * @param:
     * @author Shanshan Li  2020/6/30
     */
    Img.prototype._bind = function () {
        //ul代理li的事件
        methods.$('.__Img__classify', this.wrap).addEventListener('click', ({target}) => {
            console.log(target.nodeName)
            if (target.nodeName !== 'LI') return;
            if (!canChange) return;
            canChange = false;
            const type = target.innerText;
            //获取图片
            const els = this._getImgsByType(type);
            //上一组图片地址数组
            //this.figures 如果直接使用methods.$$('figure', wrap)获取，是dom元素，不是数组，没有数组的方法  需要转化
            let prevImg = this.figures.map(figure => methods.$('img', figure).src);
            //下一组图片地址数组
            let nextImg = els.map(figure => methods.$('img', figure).src);
            //判断相同图片地址
            const diffArr = this._diff(prevImg, nextImg);
            diffArr.forEach(([, i2]) => {
                this.figures.every((figure, index) => {
                    let src = methods.$('img', figure).src;
                    //forEach中使用return，只是跳出当前循环，不会跳出整个循环的。
                    // 所以这里会继续判断后面的图片。return没有什么用，不加return 也可以
                    if (src === nextImg[i2]) {
                        //figures移除了相同的图片，剩余的就是不同的。
                        // 那么把不同的隐藏，后续又会在图片容器中移出它们，所以页面中剩余的就是相同的图片
                        this.figures.splice(index, 1);
                        return false;
                    } else {
                        return true
                    }
                })
            });
            //计算图片的位置
            this._calcPosition(els);
            //过滤需要添加的元素，相同不重新添加，不同隐藏
            let needAppendEls = [];
            if (diffArr.length) {
                //获取相同下标索引；
                let nextElsIndex = diffArr.map(([, i2]) => i2);
                els.forEach((figure, index) => {
                    //如果当前图片组地址没有相同下标，放入添加列；
                    if (!nextElsIndex.includes(index)) {
                        needAppendEls.push(figure);
                    }
                })
            } else {
                needAppendEls = els;
            }
            this.figures.forEach(el => {
                el.style.transform = 'scale(0) translate(0,100%)';
                el.style.opacity = '0';
            });
            methods.appendChild(this.imgContainer, ...needAppendEls);
            setTimeout(() => {
                els.forEach(el => {
                    el.style.transform = 'scale(1) translate(0,0)';
                    el.style.opacity = 1;
                })
            });
            //重复赋值
            setTimeout(() => {
                this.figures.forEach(figure => {
                    this.imgContainer.removeChild(figure);
                });
                this.figures = els;
                canChange = true;
            }, 600);

            this.typeBtnEls.forEach(btn => (btn.className = '__Img__classify__type-btn'));
            target.className = '__Img__classify__type-btn __Img__type-btn-active'
        });
        //为图片父容器绑定事件，代理图片的点击事件,由于图片一直在动态切换，直接绑定需要多次绑定
        this.imgContainer.addEventListener('click', ({target}) => {
            if (target.nodeName !== 'FIGURE' && target.nodeName !== 'FIGCAPTION') return;
            if (target.nodeName === 'FIGCAPTION') {
                target = target.parentNode;
            }
            const src = methods.$('img', target).src;
            //记录当前图片索引；
            curPreviewImgIndex = this.figures.findIndex((figure) => methods.$('img', figure).src === src);
            this.previewImg.src = src;
            //显示预览
            this.overlay.style.display = 'flex';
            setTimeout(() => this.overlay.style.opacity = '1')
        });
        //点击遮罩层隐藏
        this.overlay.addEventListener('click', () => {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlay.style.display = 'none';
            })
        });
        //点击按钮显示下一张上一张
        methods.$('.__Img__overlay-prev-btn', this.overlay).addEventListener('click', (e) => {
            // 阻止事件冒泡
            e.stopPropagation();
            curPreviewImgIndex = curPreviewImgIndex === 0 ? this.figures.length - 1 : curPreviewImgIndex - 1;
            this.previewImg.src = methods.$('img', this.figures[curPreviewImgIndex]).src;
        });
        methods.$('.__Img__overlay-next-btn', this.overlay).addEventListener('click', (e) => {
            e.stopPropagation();
            curPreviewImgIndex = curPreviewImgIndex === this.figures.length - 1 ? 0 : curPreviewImgIndex + 1;
            this.previewImg.src = methods.$('img', this.figures[curPreviewImgIndex]).src;
        });
    };
    //显示元素
    Img.prototype._show = function () {
        methods.appendChild(this.parasitifer, this.wrap);
        setTimeout(() => {
            this.figures.forEach(figure => {
                figure.style.transform = 'scale(1) translate(0,0)';
                figure.style.opacity = 1;
            })
        })
    };
    Img.prototype._calcPosition = function (figures) {
        let horizontalzImgIndex = 0;
        figures.forEach((figure, index) => {
            figure.style.top = parseInt(index / 4) * 140 + parseInt(index / 4) * 15 + 'px';
            figure.style.left = horizontalzImgIndex * 240 + horizontalzImgIndex * 15 + 'px';
            figure.style.transform = 'scale(0) translate(0,-100%)';
            horizontalzImgIndex = (horizontalzImgIndex + 1) % 4;
        });
        //向上取整
        let len = Math.ceil(figures.length / 4);
        this.imgContainer.style.height = len * 140 + (len - 1) * 15 + 'px';
    };
    window.$Img = Img;
})(window, document);
