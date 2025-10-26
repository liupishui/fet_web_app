let webconfig = require('../webconfig');
let broswerCacheExpiresHandler = require('./broswerCacheExpiresHandler');
module.exports = async (context,app,param)=>{
    context.gzip = async ()=>{
        let isGziped = false; 
        let path = require('node:path');
        let fs = require('node:fs');
        let zlib = require('node:zlib');
        let crypto = require('crypto');
        let canNext = await broswerCacheExpiresHandler(context,app);
        if(canNext === false){
            return true;
        }
        //对可以开启gzip压缩的文件进行gzip压缩
        if(context.req.headers['accept-encoding']?.indexOf('gzip')!==-1){
            //如果有缓存则直接读取缓存
            if (typeof (app.LRU_HREF_PAGE) === 'undefined') {
                let LRUCache = app.lib['lru-cache']().LRUCache;
                app.LRU_HREF_PAGE = new LRUCache({ttl:30*60*1000,max:1000});//默认存活30分钟
            }
            let serverCacheData = app.LRU_HREF_PAGE.get(context.url.href);
            if(serverCacheData){
                isGziped = true;
                let resData = serverCacheData;
                context.res.writeHead(200, {"Last-Modified":resData.lastModifyTime,"ETag":resData.etag,"Accept-Ranges":'bytes',"Content-Length":resData.data.length, "Content-Type": app.config.httpHeaders['.'+resData.type], "Content-Encoding":'gzip','Max-Age':24 * 60 * 60,'Expires':new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toUTCString()});
                context.res.write(resData.data);
                context.res.end(); 
                return isGziped;
            }
            //对js，css文件进行gzip压缩
            context.reqAddress = path.resolve(app.serverPath + '/view/' + context.url.pathname);
 
            let extname = path.extname(context.url.pathname);
            if (extname === '' || typeof (extname) === 'undefined') {
                // 如果静态文件不是/public/module/以/结尾的格式，则跳转
                if(context.url.pathname.lastIndexOf('/')!==context.url.pathname.length-1){
                    context.url.pathname = context.url.pathname+'/';
                    context.router.redirectTo(context.url.toString());
                    return;
                }
            }
            let isThemeExcludePath = false;
            if(app.webconfig.useTheme){
                isThemeExcludePath = app.webconfig.themeExcludePath.filter(function(pathEach){return context.url.path.indexOf(pathEach)===0;}).length !== 0;
            }
            let theme_path = false;
            if (extname === '' || typeof (extname) === 'undefined') {
                let hasDefault = false;
                for (let j = 0; j < app.webconfig.defaultPage.length; j++) {
                    if (hasDefault === false) {
                        let destPath = context.reqAddress + '/' + app.webconfig.defaultPage[j];
                        if(!isThemeExcludePath && app.webconfig.useTheme){
                            destPath = (context.theme.theme_real_path +'/'+ context.url.pathname) + '/' + app.webconfig.defaultPage[j];
                            if (fs.existsSync(destPath)) {
                                hasDefault = true;
                                theme_path = true;
                                context.reqAddress = destPath;
                                extname = path.extname(context.reqAddress);
                            }
                        }else{
                            if (fs.existsSync(destPath)) {
                                hasDefault = true;
                                context.reqAddress = destPath;
                                extname = path.extname(context.reqAddress);
                            }
                        }
                    }
                }
            }
            if(extname==='.js'||extname==='.css'||extname==='.svg'||extname==='.html'){
                // // html只是静态文件不渲染数据 
                if(theme_path === false){
                    if(!isThemeExcludePath && app.webconfig.useTheme){
                        //如果使用主题,并且不在主题排除外的路径
                        context.reqAddress = context.theme.theme_real_path +'/'+ context.url.pathname;
                    }
                }
                let orgData = fs.readFileSync(context.reqAddress);
                let compressedData = orgData; 
                let etag = crypto.createHash('md5').update(compressedData).digest('hex');
                if(extname==='.html'&&app.webconfig.useTheme&&context.url.query.theme){
                    //主题修改链接
                    let editLinkScript = `
                        <script type='text/javascript'>
                        document.querySelectorAll('a').forEach(link=>{
                            let linkAdress = link.getAttribute('href');
                            if (linkAdress.indexOf('?')!==-1) {
                                linkAdress+='&theme=${context.url.query.theme}'
                            }else{
                                linkAdress+='?theme=${context.url.query.theme}'
                            }
                            link.setAttribute('href',linkAdress)
                        })
                        </script>
                        `;
                        compressedData += editLinkScript;
                }
                if(webconfig.gzip === true){
                    compressedData = zlib.gzipSync(orgData);
                    // if(context.req.url.indexOf('animate')!==-1){
                    //     console.log(compressedData.toString());
                    // }
                }
                // 保证app.config.httpHeaders有".js",".css",".html",".svg"三个属性
                // if (typeof (app.config.httpHeaders[extname]) === 'undefined') {
                //     app.config.httpHeaders[extname] = 'application/octet-stream';
                // }
                // context.res.writeHead(200, { "Content-Type": app.config.httpHeaders[extname],"Content-Encoding":'gzip',"Expires" : new Date(new Date().getTime()+24*60*60*1000)});
                let lastModifyTime = fs.statSync(context.reqAddress).mtime.toUTCString();

                if (typeof (app.LRU_HREF_PAGE) === 'undefined') {
                    let LRUCache = app.lib['lru-cache']().LRUCache;
                    app.LRU_HREF_PAGE = new LRUCache({ttl:30*60*1000,max:1000});//默认存活30分钟
                }
                app.LRU_HREF_PAGE.set(context.url.href,{lastModifyTime:lastModifyTime,etag:etag,type:extname.substr(1),data:compressedData},{ttl:400});
                if(webconfig.gzip === true){
                    if(extname==='.html'){
                        context.res.writeHead(200, {'Max-Age':0,'Cache-Control':'no-cache',"Content-Encoding":'gzip'});
                    }else{
                        context.res.writeHead(200, {"Last-Modified":lastModifyTime,"ETag":etag,"Accept-Ranges":'bytes', "Content-Length":compressedData.length, "Content-Type": app.config.httpHeaders[extname],"Content-Encoding":'gzip','Max-Age':24 * 60 * 60,'Expires':new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toUTCString()});
                    }
                }else{
                    if(extname==='.html'){
                        context.res.writeHead(200, {'Max-Age':0,'Cache-Control':'no-cache'});
                    }else{
                        context.res.writeHead(200, {"Last-Modified":lastModifyTime,"ETag":etag,"Accept-Ranges":'bytes', "Content-Length":compressedData.length,"Content-Type": app.config.httpHeaders[extname],'Max-Age':24 * 60 * 60,'Expires':new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toUTCString()});
                    }
                }
                context.res.write(compressedData);
                context.res.end();
                isGziped = true;
            }
        }
        return isGziped;    
    }
}