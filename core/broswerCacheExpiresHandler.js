async function broswerCacheExpiresHandler(context,app){
    //如果浏览器静态文件缓存过期，发起请求时，会经过此方法处理
    let fs = require('fs'), path = require('path'), crypto = require('crypto'), canNext = true;
    //如果Expires已经过期
            //如果有context.req.headers['if-modified-since'],比较修改时间
            if(typeof(context.req.headers['if-modified-since'])!=='undefined'){
                let extname = path.extname(context.url.pathname);
                context.reqAddress = path.resolve(app.serverPath + '/view/' + context.url.pathname); 
                let isInThemeExcludePath = app.webconfig.themeExcludePath.filter(item=>{return context.url.pathname.indexOf(item)===0});
                if(app.webconfig.useTheme&&isInThemeExcludePath.length===0){
                    context.reqAddress = path.resolve(context.theme.theme_real_path + '/' +context.url.pathname);
                }
                if (extname === '' || typeof (extname) === 'undefined') {
                    // 如果静态文件不是/public/module/以/结尾的格式，则跳转
                    if(context.url.pathname.lastIndexOf('/')!==context.url.pathname.length-1){
                        context.url.pathname = context.url.pathname+'/';
                        context.router.redirectTo(context.url.toString());
                        return;
                    }
                    let hasDefault = false;
                    for (let j = 0; j < app.webconfig.defaultPage.length; j++) {
                        if (hasDefault === false) {
                            let destPath = app.serverPath+'/view/'+ context.url.path+'/' + app.webconfig.defaultPage[j];
                            if (fs.existsSync(destPath)) {
                                hasDefault = true; 
                                context.reqAddress = destPath;
                                extname = path.extname(context.reqAddress); 
                            }
                        }
                    }
                }
                if(fs.statSync(context.reqAddress).mtime.toUTCString() === context.req.headers['if-modified-since']){
                    //时间相等比较Etag，因为时间精确到秒，可能1秒内文件做了修改
                        //如果有context.req.headers['if-none-match'],比较etag
                        if(typeof(context.req.headers['if-none-match'])!=='undefined'){
                            let fileData = fs.readFileSync(context.reqAddress);
                            if(crypto.createHash('md5').update(fileData).digest('hex') === context.req.headers['if-none-match']){
                                //如果Etag相等
                                context.res.writeHead(304, {"Last-Modified":context.req.headers['if-modified-since'],"ETag":context.req.headers['if-none-match'],"Accept-Ranges":'bytes', 'Max-Age':24 * 60 * 60,'Expires':new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toUTCString()});
                                context.res.end();
                                canNext = false;            
                            }
                        }else{
                            context.res.writeHead(304, {"Last-Modified":context.req.headers['if-modified-since'],"Accept-Ranges":'bytes', 'Max-Age':24 * 60 * 60,'Expires':new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toUTCString()});
                            context.res.end();
                            canNext = false;
                        }
                }
            }

    return canNext;
}
module.exports = broswerCacheExpiresHandler;