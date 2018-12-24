$(function () {
    render();
    var globalData, myScroll;

    function getCategories() {
        $.get("categories", function (res) {
            if (res.meta.status === 200) {
                globalData = res.data;
                //把获取到的数据放在客户端的localstroage里面
                localStorage.setItem("pyg_globalData", JSON.stringify({
                    //JSON.stringfiy将对象转变成json对象的字符串
                    outTime: Date.now(),
                    globalData: globalData
                }))
                renderLeftMenu()
                renderRigthContent(0);
            }
        })
    }
    function render() {
        // 如果客户端中的localStorage储存有数据，
        // 就渲染localStorage里面的数据
        //获取localStrong里面的数据
        var localDataStr = localStorage.getItem("pyg_globalData");
        if (localDataStr) {
            //将json格式的字符串转变成数组或者对象 
            var localData = JSON.parse(localDataStr);
            //  判断是否过期，如果过期的话就就重新发送请求，如果还没过期就渲染localStrong里面的数据
            if (Date.now() - localData.outTime < 10000000) {
                // 将localStorang；里的数据返回给globalData，用于渲染数据
                globalData = localData.globalData;
                renderLeftMenu();
                renderRigthContent(0);
            }else{
                // 如果超过规定的时间，要清除掉存储在localStorage里面的数据
                localStorage.removeItem("pyg_globalData");
                getCategories();
            }
        } else {
            getCategories();
        }
    }

    function renderLeftMenu() {
        var leftHtml = template("cateLeftTemp", {
            list: globalData
        });
        $(".pyg_cateList").html(leftHtml);
        //初始化滚动事件
        myScroll = new IScroll('.pyg_cateLeft');
    }

    function renderRigthContent(index) {
        var rightHtml = template("cateRightTemp", {
            list: globalData[index].children
        });
        $(".cateRight").html(rightHtml);
        var count = $(".cateRight img").length;
        $(".cateRight img").on("load", function () {
            count--;
            if (count == 0) {
                var yourScroll = new IScroll('.cateRight');
            }

        })
    }
    $(".pyg_cateList").on("tap", "li", function () {
        var index = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        myScroll.scrollToElement(this);
        renderRigthContent(index)
    })


})