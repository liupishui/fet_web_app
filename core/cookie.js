async function cookie(context,app,options){
    context.cookie||(context.cookie = {});
    context.cookie.get = function(cookieName){
        const cookieStr = context.req.headers.cookie ? context.req.headers.cookie.split('; ').find(cookie => cookie.startsWith(`${cookieName}=`)) : null;
        let cookieValue = cookieStr ? cookieStr.split('=')[1] : null;
        if(cookieValue!==null){
            cookieValue = decodeURIComponent(cookieValue);
        }
        return cookieValue;
    }
    context.cookie.getAll = function(){
        const cookieArr = context.req.headers.cookie ? context.req.headers.cookie.split('; '):null;
        if(cookieArr!==null){
            let cookieObj = {};
            cookieArr.forEach((item)=>{
                cookieObj[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
            });
            return cookieObj;
        }
    }
    context.cookie.set = function(cookieName,cookieValue,options){
        cookieValue = encodeURIComponent(cookieValue);
        if(context.cookie.get(cookieName)===null){
            var optionsDefault = {'Max-Age':24 * 60 * 60,'Expires':new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toUTCString()};
            if(options){
                Object.assign(optionsDefault,options);
            }
            context.res.setHeader('Set-Cookie', `${cookieName}=${cookieValue};${Object.keys(optionsDefault).map(f=>f+'='+optionsDefault[f]).join(';')}`);    
        }
    };
    context.cookie.forceSet = function(cookieName,cookieValue,options){
        cookieValue = encodeURIComponent(cookieValue);
        var optionsDefault = {'Max-Age':24 * 60 * 60,'Expires':new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toUTCString()};
        if(options){
            Object.assign(optionsDefault,options);
            if(optionsDefault.maxAge===0){
                delete optionsDefault['Max-Age'];
                delete optionsDefault['Expires'];
            }
        }
        context.res.setHeader('Set-Cookie', `${cookieName}=${cookieValue};${Object.keys(optionsDefault).map(f=>f+'='+optionsDefault[f]).join(';')}`);    
    };
    context.cookie.remove = function(cookieName){
        context.res.setHeader('Set-Cookie',`${cookieName}=;Max-Age=0;Expires=${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toUTCString()}`);
    }
    // const http = require('http');

    // http.createServer(function (req, res) {
    // // 获取 Cookie
    // const myCookie = req.headers.cookie ? req.headers.cookie.split('; ').find(cookie => cookie.startsWith('mycookie=')) : null;
    // const myCookieValue = myCookie ? myCookie.split('=')[1] : null;

    // // 设置 Cookie
    // const maxAge = 24 * 60 * 60;
    // const expires = new Date(new Date().getTime() + maxAge * 1000);
    // res.setHeader('Set-Cookie', `mycookie=newcookie; Max-Age=$${maxAge}; Expires=$${expires.toUTCString()}`);

    // // 删除 Cookie
    // res.setHeader('Set-Cookie', `mycookie=; Max-Age=0, Expires=$${new Date(0).toUTCString()}`);

    // // 输出响应
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.end(`Hello World, mycookie=$${myCookieValue}`);
    // }).listen(8080);
}
module.exports = cookie;