$(function () {
    renderLocalStorang();

    // 初始化页面滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005
    });

    //切换侧边栏
    $(".mui-pull-right").on("tap", function (e) {
        e.preventDefault();
        mui('.mui-off-canvas-wrap').offCanvas().toggle();
    })

    //设置携带的参数
    var queryobj = {
        query: '',
        cid: $.getUrl("cid"),
        pagenum: 0,
        pagesize: 10
    }

    //编写ajax请求函数
    function renderGoodsList(callback) {
        $.get("goods/search", queryobj, function (res) {
            if (res.meta.status === 200) {
                callback(res);
            }
        })

    }

    //上拉加载，下拉刷新功能实现
    mui.init({
        pullRefresh: {
            container: "#pullrefresh",
            down: {
                height: 50, //可选,默认50.触发下拉刷新拖动距离,
                auto: false, //可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    //重置页面的码数,下拉之后使页面显示第一页的内容
                    queryobj.pagenum = 0;
                    renderGoodsList(function (res) {
                        var html = template("goodsListTemp", {
                            list: res.data.goods
                        });
                        $(".pyg_goodsList").html(html);
                        //获取数据并渲染页面结构之后停止下拉刷新
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                        // 初始化组件,重置原来的功能
                        mui('#pullrefresh').pullRefresh().refresh(true);
                    })
                }
            },
            up: {
                height: 50,
                auto: true,
                contentrefresh: "正在加载...",
                contentnomore: '没有更多数据了',
                callback: function () {
                    queryobj.pagenum++;
                    renderGoodsList(function (res) {
                        if (res.data.goods.length > 1) {
                            var html = template("goodsListTemp", {
                                list: res.data.goods
                            });
                            $(".pyg_goodsList").append(html);
                            // 结束加载更多，渲染页面之后停止加载更多功能
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            // 如果没有数据的话结束加载更多,没有数据传入true,反之传入false
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        }
                    })

                }

            }
        }
    });
     var arr;
    // 实现搜索功能
    function GetDataBySearch(){
         // 设置要传入的参数
         var obj = { ...queryobj
         };
         obj.query = $(".pyg_txt").val();
         if (!obj.query) {
             alert("请输入内容");
             return;
         }
         obj.pagenum = 1
         obj.pagesize = 100000
         $.get("goods/search", obj, function (result) {
             var searchListHTML = template('searchListTemp', {
                 list: result.data.goods
             })
             $('.searchList').html(searchListHTML)
 
         })
         // 将搜索的文字添加到localStorage里面
         arr.push(obj.query);
         arr = unique(arr);
         localStorage.setItem("pyg_localData", JSON.stringify(arr));
         // 重置结构，删除原有的
         $(".search_history span").remove();

    }
    $(".search_btn").on("tap", function () {
        GetDataBySearch()
        renderLocalStorang();
    })
    // 页面加载，渲染存放在本地的搜索记录
    function renderLocalStorang() {
        var localStr = localStorage.getItem("pyg_localData");
        if (localStr) {
            var localArr = JSON.parse(localStr);
            arr =localArr;
            localArr.forEach(function (value) {
                var tr = $("<span><span>").text(value);
                $(".search_history").append(tr);
            })

        }else{
            arr=[];
        }
    }
    //数组去重函数
    function unique(Arr) {
        var result = [],
            hash = {};
        for (var i = 0, elem;
            (elem = Arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }
    // 清除历史记录
    $(".clear_history").on("tap", function () {
        localStorage.removeItem("pyg_localData");
        $(".search_history span").remove();
        arr = [];
    })

    $(".search_history").on("tap","span",function(){
        $(".pyg_txt").val($(this).text())
        GetDataBySearch()
        renderLocalStorang();
    })
})