module.exports = async function (context, app, config) {
    //返回当前上下文的theme路径
    let net = require('net');
    let path = require('path');
    let fs = require('fs');
    //查找子站点，根据子站点返回路径
    let subDomain = 'www';
    if(net.isIP(context.url.hostname)===0){
        if(context.url.hostname.split('.').length===3){
            subDomain = context.url.hostname.split('.')[0];
        }
    }
    // if(typeof(app.themes)==='undefined'){
    //     app.themes={}
    // }
    if(context.url.query.theme){
        if(app.themes[subDomain].domain_disabled === 1){
            //如果网站被禁用
            context.res.statusCode = 404;//当请求为页面内链接的时候，浏览器收到404状态码，会停止接收html
            context.res.setHeader('content-type','text/html;charset=utf-8');
            context.res.write(subDomain + '网站不存在');
            return false;    
        }
        let themeData = app.tables.theme.get(parseInt(context.url.query.theme));
        if(themeData.length>0){
            context.theme = app.themes[subDomain];
            context.theme = Object.assign(context.theme,themeData[0]);
            context.theme.theme_real_path = path.join(app.serverPath,themeData[0].theme_server_path);
            context.__theme = context.theme.theme_view_path;
        }else{
            context.res.statusCode = 404;//当请求为页面内链接的时候，浏览器收到404状态码，会停止接收html
            context.res.setHeader('content-type','text/html;charset=utf-8');
            context.res.write('主题不存在');
            return false;   
        }
    }else{
        if(typeof(app.themes[subDomain])==='undefined'){
            context.res.statusCode = 404;//当请求为页面内链接的时候，浏览器收到404状态码，会停止接收html
            context.res.setHeader('content-type','text/html;charset=utf-8');
           context.res.write(subDomain + '主题不存在');
            return false;
        }else{
            if(typeof(app.themes[subDomain])==='undefined'){
                context.res.statusCode = 404;//当请求为页面内链接的时候，浏览器收到404状态码，会停止接收html
                context.res.setHeader('content-type','text/html;charset=utf-8');
                context.res.write(app.themes[subDomain].themeName + '主题不存在');
                return false;
            }else{
                if(app.themes[subDomain].domain_disabled === 1){
                    //如果网站被禁用
                    context.res.statusCode = 404;//当请求为页面内链接的时候，浏览器收到404状态码，会停止接收html
                    context.res.setHeader('content-type','text/html;charset=utf-8');
                    context.res.write(subDomain + '网站不存在');
                    return false;    
                }
                context.theme = app.themes[subDomain];
                context.__theme = context.theme.theme_view_path;
            }
        }
    
    }
    // //主题返回样式图片js
    // if(context.url.pathname.indexOf('/images')===0||context.url.pathname.indexOf('/script')===0||context.url.pathname.indexOf('/styles')===0){
    //     context.reqAddress = context.themePath+'/'+context.url.pathname;
    //     let extname = path.extname(context.url.pathname);
    //     if (extname === '' || typeof (extname) === 'undefined') {
    //         let hasDefault = false;
    //         for (let j = 0; j < app.webconfig.defaultPage.length; j++) {
    //             if (hasDefault === false) {
    //                 let destPath = context.reqAddress +'/' + app.webconfig.defaultPage[j];
    //                 if (fs.existsSync(destPath)) {
    //                     hasDefault = true;
    //                     context.reqAddress = destPath;
    //                     extname = path.extname(context.reqAddress +'/' + app.webconfig.defaultPage[j]);
    //                 }
    //             }
    //         }
    //     }
    //     try{
    //        let rst =  await new Promise(function (resolve, reject) {
    //             let readStream = fs.createReadStream(context.reqAddress);
    //             readStream.on('open', () => {
    //                 try {
    //                     if (typeof (app.config.httpHeaders[extname]) === 'undefined') {
    //                         app.config.httpHeaders[extname] = 'application/octet-stream';
    //                     }
    //                     context.res.writeHead(200, { "Content-Type": app.config.httpHeaders[extname] });
    //                 } catch (e) {
    //                     e.message += `extname:${extname}`;
    //                     reject(e);
    //                 }
    //             })
    //             readStream.on('error', (e) => {
    //                 reject(e);
    //             });
    //             readStream.on('end', () => { readStream.destroy(); resolve(true) });
    //             readStream.pipe(context.res);
    //         })   
    //         console.log(rst); 
    //     }catch(e){
    //         throw e;
    //     }
    // }
    //ctx添加设置theme方法
    context.setTheme = function(theme_id){
        //判断用户是否登录，没有登录输出没有权限
        if(context.session.get('user')===null){
            context.res.writeHead(500,{ "Content-Type": 'text/html;charset=utf-8' });
            throw new Error('请登录后操作');
            context.res.write('请登录后操作');
            return false;
        }
        let webinfo = app.sqlite.webinfo.get({user_id:context.session.get('user').id});
        webinfo[0].theme_id = theme_id;
        //将设置写入数据库
        app.sqlite.webinfo.update(webinfo[0]);
        return true;
    }
    return true;
}