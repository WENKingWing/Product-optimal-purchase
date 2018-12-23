$(function(){
    // 拦截器:只要通过zepto发送的ajax请求，就一定就会经过这个函数
    // baseUrl为基准路径
    var baseUrl = 'http://api.pyg.ak48.xyz/api/public/v1/'
    // 访问路径分为两种，公有路径和私有路径，
    $.ajaxSettings.beforeSend=function(xhr,obj){
        obj.url=baseUrl+obj.url
        // 这里的obj里面包含着ajax请求的所有数据
    }
})