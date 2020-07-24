(function (document, window) {
    class SelectBar {
        constructor() {
            this.$selectBtn = document.getElementById('select-btn');//选择按钮
            this.$selectText = document.getElementById('select-text');//选择框(上方)
            this.$searchText = document.getElementById('search-text');
            this.$dropdownLayer = document.getElementById('dropdown-layer');//下拉选择框
            this.classified = {};//按照type分类后的列表
            this.$previous = document.getElementById('previous');//上一个dom
            this.$current = document.getElementById('current');//当前dom
            this.previousText='';//上一个内容
            this.previousIndex='';//上一个索引
            this.currentText='';//当前内容
            this.currentIndex='';//当前索引
        }

        //初始化
        _init(data) {
            this._classify(data);
            this._renderSelectItem(this.classified);
            this._bind();
        }

        //分类
        _classify(data) {
            data.forEach(({id, name, type}) => {
                if (!Object.keys(this.classified).includes(type)) {
                    this.classified[type] = [];
                    this.classified[type].push([id, name])
                } else {
                    this.classified[type].push([id, name]);
                }
            });
        }

        //渲染列表
        _renderSelectItem(data) {
            let type = Object.keys(data);
            let group = '';
            for (let i = 0; i < type.length; i++) {
                let arr = '';
                data[type[i]].forEach(items => {
                    arr += `<dd class="select-bar-option-item" data-id=${items[0]}>${items[1]}</dd>`;
                });
                group += `<dl class="select-bar-option-group"><dt class="select-bar-option-title">${type[i]}</dt>${arr}</dl>`;
            }

            let str = `<input type="text" class="search-text" placeholder="搜索" id="search-text">
                      <div class="select-bar-option" id="select-bar-option">${group}</div>`;
            this.$dropdownLayer.innerHTML = str;
        }

        //渲染中间内容
        _renderP(currentText,currentIndex) {
            this.currentText = currentText;
            this.currentIndex = currentIndex;
            this.$previous.innerText = `之前的值是:${this.previousText?this.previousText:'未选择'}-${this.previousIndex?this.previousIndex:'undefined'}`;
            this.$current.innerText = `改变后的值是:${this.currentText}-${this.currentIndex}`;
        }
        //切换样式
        changeClass(el,current,cl){
            el.forEach(items=>items.classList.remove(cl));
            current.classList.add(cl);
        }
        //value改变事件
        changeValue() {
            let el =[...document.getElementsByClassName('select-bar-option-item')];
            document.getElementById('select-bar-option').addEventListener('click', ({target}) => {
                [this.previousText, this.previousIndex] = [this.currentText, this.currentIndex];
                if (target.nodeName === 'DD') {
                    this.$selectText.value = target.innerHTML;
                    this._show();
                    this.changeClass(el,target,'active');
                    this._renderP(target.innerText,target.getAttribute('data-id'));
                    return false;
                }
            });
        }

        //input change
        changeInput() {
            document.getElementById('search-text').addEventListener('input', ({target}) => {
                let pattern = new RegExp(target.value, 'i');
                let items = [...document.getElementById('select-bar-option').getElementsByClassName('select-bar-option-item')];
                items.forEach((item) => {
                    if (!pattern.test(item.innerText)) {
                        item.classList.add('linone');
                    }else {
                      item.classList.remove('linone')
                    }
                })
            })
        }

        //绑定事件
        _bind() {
            this.$selectBtn.addEventListener('click', (e) => {
                this._show();
                e.stopPropagation();
            });
            document.body.addEventListener('click',(e)=>{
              if (e.target.nodeName==='BODY'){
                this.$dropdownLayer.classList.add('none')
              }
            })
        }

        //显示隐藏
        _show() {
            this.$dropdownLayer.classList.toggle('none');
            document.getElementById('select-btn').classList.toggle('active')
        }
    }

    let select = new SelectBar();

    function getJSON(url) {
        return new Promise((resolve, reject) => {
            var xhr = creatXHR();
            //创建请求
            xhr.open("get", url, true);
            //相应XMLHttpRequest对象状态变化的函数，onreadystatechange在readystate属性发生改变时触发
            //发送请求
            xhr.send(null);
            //如果时post请求，传输不可以写在url地址栏内，get是用？连接写在地址后面；
            //xhr.send({user:"zhangsan",id:6});
            //设置http头部信息
            // xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
            // 数据渲染
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        //获得服务器返回数据
                        try {
                            let response = JSON.parse(xhr.responseText);
                            resolve(response)
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                }
            };
        })
    }

    getJSON("json/select.json").then(res => {
        select._init(res.data);
        return res;
    }).then((res) => {
        select.changeValue(res.data);
        select.changeInput()
    })

})(document, window);