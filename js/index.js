/* 异步非主色  
forEach可以产生函数作用域arr.forEach(function(value,index){
 })

 */
$(function () {
    bannerInit()
    navInit();
    render();
    // 实现轮播图的功能
    function bannerInit() {
        $.ajax({
            type: "get",
            url: "home/swiperdata",
            dataType: "json",
            success: function (res) {
                console.log(res);
                if (res.meta.status === 200) {
                    var bannerHtml = template("banner_tp", {
                        list: res.data
                    });
                    $(".mui-slider").html(bannerHtml);
                    //获得slider插件对象
                    mui('.mui-slider').slider({
                        interval: 2000
                    });
                }
            }
        });

    }

    // 实现导航功能
    function navInit() {
        $.get("home/catitems", function (res) {
            if (res.meta.status === 200) {
                var navHtml = template("nav_tp", {
                    list: res.data
                });
                $(".pyg_nav").html(navHtml);
            }
        })

    }

    // 实现商品列表功能
    var goodsData;
    function goodsInit() {
        $.get("home/goodslist", function (res) {
            if (res.meta.status === 200) {
                goodsData = res.data;
                localStorage.setItem("pyg_goods", JSON.stringify({
                    outTime: Date.now(),
                    goodsData: goodsData
                }))
                var goodsHtml = template("good_tp", {
                    list: goodsData
                });
                $(".goods").html(goodsHtml);
            }

        })
    }

    function render() {
        var localDataStr = localStorage.getItem("pyg_goods");
        if (localDataStr) {
            // 将json个数的字符串转变成数组或者对象
            var localData = JSON.parse(localDataStr);
            if (Date.now() - localData.outTime < 1000 * 1000) {
                // 将存放在本地上的数据渲染出来
                var goodsHtml = template("good_tp", {
                    list: localData.goodsData
                });
                $(".goods").html(goodsHtml);
            } else {
                localStorage.removeItem("pyg_goods");
                goodsInit();
            }

        } else {
            goodsInit();

        }
    }








})