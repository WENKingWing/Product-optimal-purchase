$(function () {
    // 获取用户名和密码,并进行简答的验证

    $(".pyg_login").on("tap", function () {
        var username = $('.pyg_username').val()
        var password = $('.pyg_password').val()
        if(!$.checkPhone(username.trim())){
            mui.alert("请输入有效的手机号码")
        }else if(!password.trim().length>0){
            mui.alert("请输入密码");
        }
        // 获取数据，根据数据进行判断是否登录成功
        $.ajax({
            type: "post",
            url: "login",
            data: {username:username,password:password},
            dataType: "json",
            success: function (res) {
                // 判断用户名是否正确，如果不正确的话就给出提示
                if(res.meta.status===400){
                    mui.alert(res.meta.msg);
                }else{
                    //如果账号密码正确的话，把token值存放在本地，获取存放在本地的url地址
                    var localUrl=sessionStorage.getItem("pyg_loginUrl");
                    sessionStorage.setItem("pyg_token",res.data.token)
                    if(localUrl){
                        location.href=localUrl;
                    }else{
                        location.href="../index.html"
                    }

                }
                
            }
        });

    })

})