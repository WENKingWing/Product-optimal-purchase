$(function(){
     // 定义添加到购物车所需要的参数
     var cartObj = {
        cat_id:'',
        goods_id:'',
        goods_name:'',
        goods_number:'',
        goods_price:'',
        goods_small_logo:'',
        goods_weight:''
    }
    $.get("goods/detail",{goods_id:$.getUrl("gid")},function(res){
        var { cat_id,
        goods_id,
        goods_name,
        goods_number,
        goods_price,
        goods_small_logo,
        goods_weight
        }=res.data;
        // 将结构拆析出来在进行赋值
        cartObj.cat_id = cat_id
        cartObj.goods_id = goods_id
        cartObj.goods_name = goods_name
        cartObj.goods_number = goods_number
        cartObj.goods_price = goods_price
        cartObj.goods_small_logo = goods_small_logo
        cartObj.goods_weight = goods_weight

        var caursorHtml=template("goodsDetailTemp",res.data);
        $(".pyg_view").html(caursorHtml);
        mui('.mui-slider').slider({
            interval: 2000
        });
    })

    $(".join_cart").on("tap",function(){
        /**
         * 分析：
         *  判断是否有token,如果存在token的话就意味着登录成功，那么将会显示添加到购物车成功
         * 如果没有token值的话,就跳转到登录界面，并将url地址存储在本地存储中
         */
        var local_token=sessionStorage.getItem("pyg_token");
        if(!local_token){
            console.log("没有token值，意味着还没登录,此时的token为null");
            sessionStorage.setItem("pyg_loginUrl",location.href);
            location.href="login.html";
        }else{
            // 如果有token值,则表示登录成功，则将商品添加到购物车
            $.ajax({
                type: "post",
                url: "my/cart/add",
                data: {info:JSON.stringify(cartObj)},
                dataType: "json",  
                // headers:{
                //     Authorization:sessionStorage.getItem('pyg_token'),
                // },
                success: function (res) {
                    // 消息确认框的添加
                    mui.confirm(res.meta.msg,"温馨提示",["跳转","继续购物"],function(e){
                        if(e.index==0){
                            location.href="./cart.html";
                        }
                    });
                }
            });
            
            

        }
       
    })
})