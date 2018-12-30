$(function () {
    initCard();

    // 初始化页面,手动初始化控件
    function initCard() {
        $.get("my/cart/all", function (res) {
            console.log(res);
            if (res.meta.status === 200) {
                var cartlist = JSON.parse(res.data.cart_info)
                var cartlistHTML = template('cartListTemp', {
                    cartlist: cartlist
                });
                $(".orders_list").html(cartlistHTML)
                mui('.mui-numbox').numbox()
                totalPrice();
            }
        })
    }

    //编辑按钮操作
    $(".pyg_editBtn").on("tap", function () {
        if ($(this).text() == "完成") {
            $(this).text("编辑")
            var allLi = $(".orders_list").find("li");
            console.log(allLi);
            synsCart(allLi);
        } else {
            $(this).text("完成")

        }
        $("body").toggleClass("tb_str ")


    })

    //删除按钮操作
    $(".pyg_cartDelete").on("tap", function () {
        // 获取没有被选中的li,然后同步数据
        var allLi = $(".orders_list").find("input[type='checkbox']").not(":checked").parents("li");
        //同步没有被选中的数据
        synsCart(allLi);
    })

    // 数据同步函数
    function synsCart(allLi) {
        var goods_info = {};
        for (var i = 0; i < allLi.length; i++) {
            var temp = $(allLi[i]);
            // 获取的是全部的数据
            var obj = temp.data("goods");
            // 这里要在temp中查找,而不是直接查找
            obj.amount = temp.find(".mui-numbox-input").val();
            goods_info[obj.goods_id] = obj;
        }
        $.post("my/cart/sync", {
            infos: JSON.stringify(goods_info)
        }, function (res) {
            if (res.meta.status === 200) {
                initCard();
            }
        })
    }

    //计算总价函数
    function totalPrice() {
        var allLi = $(".orders_list").find("li");
        var totalPrice = 0;
        for (var i = 0; i < allLi.length; i++) {
            // 找到元素存放在li里面的价格，将价格乘以添加款里面的数量就获得到了总价格
            var obj = $(allLi[i]).data("goods")
            totalPrice += $(allLi[i]).find(".mui-numbox-input").val() * obj.goods_price
        }
        $(".totalPrice").html("￥" + totalPrice);
    }
    $(".orders_list").on("tap", ".list_btn", function () {
        totalPrice();
    })


    $(".createOrder").on("tap", function () {
        var price=parseInt($(".totalPrice").text().substr(1));
        console.log(price);
        var order_obj={
            "order_price": 5,
            "consignee_addr": "广州市花城制药厂",
            "goods": []
        }
        var allLi=$(".orders_list").find("li");
        for(var i=0;i<allLi.length;i++){
            var obj=$(allLi[i]).data("goods");
            var temp={
                goods_id:obj.goods_id,
                goods_number:obj.amount,
                goods_price:obj.goods_price
            }
        }
        order_obj.goods.push(temp)
        //发送ajax请求获取数据
        $.post('my/orders/create',order_obj,function(res){
            console.log(res);
            mui.alert(res.meta.msg);
            initCard();
         
        })


    })






})