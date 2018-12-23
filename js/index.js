/* 异步非主色  
forEach可以产生函数作用域arr.forEach(function(value,index){
 })

 */
$(function () {
    bannerInit()
    navInit();
    goodsInit();
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
    function goodsInit(){
        $.get("home/goodslist",function(res){
            if(res.meta.status===200){
                var goodsHtml=template("good_tp",{list:res.data});
                $(".goods").html(goodsHtml);
            }

        })
    }
    
})