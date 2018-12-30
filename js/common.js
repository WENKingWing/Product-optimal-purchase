$(function () {
    // 拦截器:只要通过zepto发送的ajax请求，就一定就会经过这个函数
    // baseUrl为基准路径
    var baseUrl = 'http://api.pyg.ak48.xyz/api/public/v1/'
    // 访问路径分为两种，公有路径和私有路径，
    $.ajaxSettings.beforeSend = function (xhr, obj) {
        obj.url = baseUrl + obj.url
        // 这里的obj里面包含着ajax请求的所有数据
        $("body").addClass("loadding");

        if(obj.url.indexOf('/my/') != -1){
            xhr.setRequestHeader('Authorization',sessionStorage.getItem('pyg_token'))
        }
    }
    $.ajaxSettings.complete = function () {
        $("body").removeClass("loadding")
    }

    $.extend($, {
        getUrl: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        checkPhone: function (phone) {
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                return false;
            } else {
                return true;
            }
        },
        checkEmail: function (myemail) {
            var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
            if (myReg.test(myemail)) {
                return true;
            } else {
                return false;
            }
        }


    })
    // 重置a的href
    mui("body").on("tap", "a", function (e) {
        e.preventDefault()
        window.top.location.href = this.href;

    })




})