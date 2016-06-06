(function (window, document) {
    "use strict";
    var flick;
    if (window.app === undefined) {
        window.app = {};
    }
    flick = function () {
        var tags = 'london',

            script = document.createElement('script');
        script.src = 'http://api.flickr.com/services/feeds/photos_public.gne' +
            '?format=json&jsoncallback=app.flick.jsoncallback&' +
            'tags=' + tags;
        document.getElementsByTagName('head')[0].appendChild(script);

        this.container = document.querySelector('#container');
    };
    flick.prototype.jsoncallback = function (data) {
        this.data = data;
        this.build();
        this.bind();
    };
    flick.prototype.bind = function () {
        var images = this.container.querySelectorAll('#container img'),
            clickEvent = function (e) {
                e.preventDefault();
                var target = e.target ? e.target : e.srcElement;
                if (target.classList.contains("selected")) {
                    localStorage.removeItem(target.dataset.id);
                } else {
                    localStorage.setItem(target.dataset.id, "");
                }
                target.classList.toggle("selected");
            };

        for (var i = 0; i < images.length; i++) {
            images[i].addEventListener("click", function (e) {
                clickEvent(e);
            }, false);
        }
    };
    flick.prototype.build = function () {
        var item, itemImg,
            box = document.createElement('div');
        if (this.data !== undefined && this.data.items !== undefined) {

            for (item in  this.data.items) {
                if (this.data.items.hasOwnProperty(item)) {
                    itemImg = document.createElement('img');
                    itemImg.src = this.data.items[item].media.m;
                    var tempArray = this.data.items[item].link.split("/");
                    itemImg.dataset.id = tempArray[tempArray.length - 2];
                    if (localStorage.getItem(tempArray[tempArray.length - 2]) !== null) {
                        itemImg.classList.add("selected");
                    }
                    box.appendChild(itemImg);
                }
            }
            this.container.appendChild(box);
        }
    };
    app.flick = new flick();
})(window, document);