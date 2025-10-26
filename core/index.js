
const path = require('path');
const fs = require('fs');
async function core(context, app) {
    context.type = function(typeString){
        if (!context.res.headersSent) {
            if(typeof(app.config['httpHeaders'][`.${typeString}`])!=='undefined'){
                context.res.setHeader('Content-Type', app.config['httpHeaders'][`.${typeString}`]);
            }else{
                context.res.setHeader('Content-Type', 'application/octet-stream');
            }
        }
    }
    context.getRemoteIp = function(){
        return context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress;
    }
    context.render = async function (tplPath, data, config) {
        //tpl 模板路径，相对根目录,data数据
        if (typeof (data) === 'undefined') {
                data = context;
        }
        //如果有缓存则直接读取缓存
        if (typeof (app.LRU_HREF_PAGE) === 'undefined') {
            let LRUCache = app.lib['lru-cache']().LRUCache;
            app.LRU_HREF_PAGE = new LRUCache({ttl:30*60*1000,max:1000});//默认存活30分钟
        }
        if(typeof(app.LRU_HREF_PAGE?.get(context.url.href)?.type)!=='undefined' && context.isAjax===false){
            let resData = app.LRU_HREF_PAGE.get(context.url.href);
                context.type(resData.type);
                return context.res.write(resData.data);    
        }
        let configDefault = {
            cache: false,//缓存ejs模板函数不可预知问题太多，禁用缓存，保持稳定
            async: true
        };
        if (typeof (config) !== 'undefined') {
            configDefault = Object.assign(configDefault, config);
        }
        configDefault.context = {
            app:app,
            context:context,
            setup:app.setup,
            param: context.url.query
        }
        //data注入一些常量
        data['__filename']= path.resolve(app.serverPath + tplPath);
        data['__dirname']= path.dirname(data['__filename']);
        data['__serverpath'] = app.serverPath;
        data['__path'] = context.url.path;
        data['__pathname'] = context.url.pathname; 
        if(app.webconfig.useTheme){
            data['__theme'] = context.__theme+'/';
        }
        let renderData = false;
        
        if(path.extname(app.serverPath + tplPath) !== '.ejs'){
            //只渲染.ejs后缀的模板            
            let err = new Error( `文件${path.resolve(app.serverPath + tplPath)}非.ejs文件,不进行渲染`);
            err.errno = -4058;
            throw err;
        }else{
          configDefault.context.__filename = data['__filename'];
          configDefault.context.__dirname = path.dirname(data['__filename']);
          configDefault.context.require = function(relativePath){
              // if(relativePath.indexOf('fet')!==-1){
              //     console.log(relativePath);
              // }
              if(relativePath.indexOf('/')===0){
                  return require(app.serverPath + relativePath);
              }
              if(relativePath.indexOf('node:')===0){
                  return require(relativePath);
              }
              let modulePath = path.resolve(path.dirname(data['__filename']),relativePath);
              if(path.relative(app.serverPath,modulePath).indexOf('view'+path.sep)===0){
                  if(modulePath.indexOf('.fet.js')===(modulePath.length-7)||modulePath.indexOf('.fet.ts')===(modulePath.length-7)){
                      return require(modulePath);
                  } else if(modulePath.indexOf('.fet')===(modulePath.length-4)){
                    try{
                        return require(modulePath+'.js'); 
                    }catch(e){
                        return require(modulePath+'.ts'); 
                    }
                  } else {
                      return require(relativePath);
                  }
              }
              if(path.relative(app.serverPath,modulePath).indexOf('view'+path.sep)!==0){
                  try{
                      let requireModule = require(modulePath);
                      return requireModule;
                  }catch(e){
                      return require(relativePath);
                  }
              }
              return require(relativePath);
              // if(relativePath === 'querystring'){
              //     console.log(require.resolve('querystring'));
              // };
          }
          renderData = await app.lib.ejs().renderFile(data['__filename'], data, configDefault);
        }
        if(renderData && context.res.writableEnded===false){
            // ERR_INVALID_ARG_TYPE:The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Received type boolean (false)
            if(context.LRU_HREF_PAGE_OPTION && context.LRU_HREF_PAGE_OPTION.ttl){
                // render方法内ajax请求不做缓存
                if(context.isAjax===false){
                    app.LRU_HREF_PAGE.set(context.url.href,true);
                }
            }
            if(typeof(renderData.type)!=='undefined'&&typeof(renderData.data)!=='undefined'){
                // if(typeof(app.LRU_HREF_PAGE[context.url.href])!=='undefined'){
                //     app.LRU_HREF_PAGE[context.url.href].set(context.url.href,renderData);
                // }
                if(typeof(app.LRU_HREF_PAGE.get(context.url.href))!=='undefined'){
                    app.LRU_HREF_PAGE.set(context.url.href,renderData,context.LRU_HREF_PAGE_OPTION);
                }
                context.type(renderData.type);
                if(app.webconfig.useTheme===true){
                    if(context.url.query.theme){
                        let editLinkScript = `
                        <script type='text/javascript'>
                        document.querySelectorAll('a').forEach(link=>{
                            let linkAdress = link.getAttribute('href');
                            if (linkAdress.indexOf('?')!==-1) {
                                linkAdress+='&theme=2'
                            }else{
                                linkAdress+='?theme=2'
                            }
                            link.setAttribute('href',linkAdress)
                        })
                        </script>
                        `;
                        renderData += editLinkScript;
                    }
                }    
                return context.res.write(renderData.data);
            }
            if(typeof(app.LRU_HREF_PAGE.get(context.url.href))!=='undefined'){
                app.LRU_HREF_PAGE.set(context.url.href,{type:'html',data:renderData},context.LRU_HREF_PAGE_OPTION);
            }
            context.type('html');
            //主题修改页面内链接
            if(app.webconfig.useTheme===true){
                if(context.url.query.theme){
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
                    renderData += editLinkScript;
                }
            }
            return context.res.write(renderData);
        }else{
            if(context.res.writableEnded === false){
                context.res.end();
                // let error = new Error(`typeError:renderData ${path.resolve(app.serverPath + tplPath)}`,renderData);
                // error.errno = -4058
                // throw error;
            }
            if(app.config.isDebugging){
                context.log(`${path.resolve(app.serverPath + tplPath)}渲染结束`);
            }
            return true;
        }
    }
    context.renderTheme = async function (themePath, data, config) {
        // /view/template/${ctx.themeName}/index.ejs
        if(app.webconfig.useTheme !== true){
            throw new Error(`please set 'useTheme=true' in file ${app.serverPath}/webconfig.js`);
        }
        let tplPath = context.theme.theme_server_path + '/' + themePath;
        data = data || {};
        data.__theme = context.__theme+'/';
        try{
            await context.render(tplPath, data, config);
        }catch(e){
            throw e;
        }
    }
    context.isAjax = false;
    if (typeof (context.req.headers['content-type']) !== 'undefined') {
        if (context.req.headers['content-type'].indexOf('application/json') !== -1) {
            context.isAjax = true;
        } else if (context.req.headers['content-type'].indexOf('application/x-www-form-urlencoded') !== -1) {
            context.isAjax = true;
        }
    }
    if (typeof (context.req.headers['x-requested-with']) !== 'undefined') {
        if (context.req.headers['x-requested-with'] === 'XMLHttpRequest') {
            context.isAjax = true;
        }
    }
    context.get = context.url.query;

    context.body = {
        code: 200,
        data: {}
    };
    context.toHTML = function(){
        context.type('html');
        let sendData = {
            resData:arguments[0]
        }
        let sendDataProps = {
            resData:{
                type:'string',
                default:''
            }
        }
        app.setup(sendData,sendDataProps);
        if(context.res.writableEnded === false){
            context.res.write(sendData.resData)
            return context;
        }
    }
    context.toSTRING = function(){
        context.type('txt');
        let sendData = {
            resData:arguments[0]
        }
        let sendDataProps = {
            resData:{
                type:'string',
                default:''
            }
        }
        app.setup(sendData,sendDataProps);
        if(context.res.writableEnded === false){
            context.res.write(sendData.resData);
            return context;
        }
    }
    context.toJSON = function () {
        context.type('json');
        let returnObject = {};
        context.body.code = typeof(context.body.code)==='undefined' ? 200 : context.body.code;
        if (arguments.length === 0) {
            returnObject.code = context.body.code;
            returnObject.data = context.body.data;
        }
        if (arguments.length === 1){
            returnObject = arguments[0];
        }
        if (arguments.length === 2) { //两个参数时，返回的json格式都是{code:number,data:{}}
            let IsMixToContextBody = arguments[1]; //是否混合到context.body
            if(IsMixToContextBody === true){
                Object.assign(context.body.data,arguments[0]);
                returnObject.code = context.body.code;
                returnObject.data = context.body.data;
            }
            if(IsMixToContextBody === false){
                returnObject.code = context.body.code;
                returnObject.data = context.body.data;
            }
            if(typeof(arguments[0])==='number'){
                returnObject.code = arguments[0];
                returnObject.data = arguments[1];
            }
        }
        if(context.res.writableEnded === false){
            context.res.write(JSON.stringify(returnObject));
            context.res.end();
        }
    };

    //加载log方法
    let log = app.require(path.resolve(__dirname, './log.js'));
    await context.use(log);

    //加载另一个数据库
    // await app.sqlite.DB('test');
    //加载另一个数据库结束


    //自动加载所有actions
    // let actions_autoload = app.require(path.resolve(__dirname, './actions_autoload.js'));
    // await app.use(actions_autoload, context);

    // 加载路由   
    let router = app.require(path.resolve(__dirname, '../router/router.js'));
    await context.use(router);

    //加载cookie
    let cookie = app.require(path.resolve(__dirname, './cookie.js'));
    await context.use(cookie);

    //加载session
    let session = app.require(path.resolve(__dirname, './session.js'));
    await context.use(session);
    
    //加载theme
    if(app.webconfig.useTheme){
        //非静态文件再加载theme
        let theme = app.require(__dirname + '/theme.js');
        let isUseTheme = await context.use(theme);
        if(isUseTheme!==true){
            return;
        }
    }

    //加载gzip
    let gzip = app.require(path.resolve(__dirname, './gzip.js'));
    await context.use(gzip);

    try {
        let canNext = await context.router.beforeEach({
            progress: 'pageStart'
        });
        if (canNext !== true) {
            return;
            //throw new Error('No Right',{code:'33',errno:'55'});
        }
    } catch (e) {
        throw e;
    }
    //静态目录下文件静态输出
    // themepath模板路径用session解决，session.themePath
    var isStatic = false;
    for (let i = 0; i < app.webconfig.staticPath.length; i++) {
        if (context.url.pathname.indexOf(app.webconfig.staticPath[i]) === 0) {
            isStatic = true;
            let isGziped = await context.gzip();
            if(isGziped===false){
                context.reqAddress = app.serverPath + '/view/' + context.url.pathname;
                let extname = path.extname(context.url.pathname);
                if(extname==='.gz'){
                    context.res.setHeader('Content-Encoding','gzip');
                    extname = path.extname(path.parse(context.url.pathname).name);
                }
                if(extname==='.br'){
                    context.res.setHeader('Content-Encoding','br');
                    extname = path.extname(path.parse(context.url.pathname).name);
                }
                if (extname === '' || typeof (extname) === 'undefined') {
                    // 如果不是/public/module/以/结尾的格式，则跳转
                    if(context.url.pathname.lastIndexOf('/')!==context.url.pathname.length-1){
                        context.url.pathname = context.url.pathname+'/';
                        context.router.redirectTo(context.url.toString());
                        return;
                    }
                    let hasDefault = false;
                    for (let j = 0; j < app.webconfig.defaultPage.length; j++) {
                        if (hasDefault === false) {
                            let destPath = path.join(context.reqAddress, app.webconfig.defaultPage[j]);
                            if (fs.existsSync(destPath)) {
                                hasDefault = true;
                                context.reqAddress = destPath;
                                extname = path.extname(context.reqAddress);
                            }
                        }
                    }
                }
                try {
                    await new Promise(function (resolve, reject) {
                        let readStream = fs.createReadStream(context.reqAddress);
                        if(extname==='.html'&&app.webconfig.useTheme&&context.url.query.theme){
                            // 主题预览模式
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
                                let data = fs.readFileSync(context.reqAddress);
                                data += editLinkScript;
                                context.toHTML(data);
                                return resolve(true);
                        }
                        readStream.on('open', () => {
                            try {
                                if (typeof (app.config.httpHeaders[extname]) === 'undefined') {
                                    app.config.httpHeaders[extname] = 'application/octet-stream';
                                }

                                context.res.statusCode = 200;
                                //context-type
                                context.res.setHeader("Content-Type",app.config.httpHeaders[extname]);

                                //如果是css,js,html,.svg,.png,.jpeg,.jpg,.gif等添加缓存时间
                                if (extname==='.js'||extname==='.mp4'||extname==='.mp3'||extname==='.css'||extname==='.html'||extname==='.svg'||extname===".png"||extname==='.jpg'||extname==='.jpeg'||extname==='.gif') {
                                    // max-age
                                    context.res.setHeader("Max-Age",24 * 60 * 60);

                                    // Last-Modified
                                    context.res.setHeader("Last-Modified",fs.statSync(context.reqAddress).mtime.toUTCString());
                                    //Etag 图片有可能太大，浪费内存，不做Etag验证,如需要手动添加

                                    // expires
                                    context.res.setHeader("Expires",new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toUTCString());

                                }
                            } catch (e) {
                                e.message += `extname:${extname}`;
                                reject(e);
                            }
                        })
                        readStream.on('error', (e) => {
                            readStream.destroy();
                            reject(e);
                        });
                        readStream.on('end', () => { readStream.destroy(); resolve() });
                        readStream.pipe(context.res);
                    })
    
                } catch (e) {
                    throw e;
                }    
            }
            // context.res.write(fs.readFileSync(context.reqAddress));
        }
    }
    if (!isStatic) {
        //基础路由都是路径加参数的模式;其他模式如果RESTfull接口路由或者伪静态通过插件修改context.url的pathname和query属性的方式实现
        //url匹配路由，匹配到了，执行对应的方法,匹配不到返回404
        // console.log(app.router);
        let getAction = function () {
            for (let x in context.router.entry) {
                if (typeof (context.router.entry[x].rule) === 'string') {
                    // 路径/admin和路径/admins
                    if (context.url.pathname === context.router.entry[x].rule) {
                        return {
                            pathname: context.url.pathname,
                            rule: context.router.entry[x].rule,
                            action: context.router.entry[x].action
                        }
                    }
                } else {
                    let errorCurr = new Error('路由规则只可以是访问路径的url字符串!!')
                    errorCurr.errno = 500;
                    throw errorCurr;
                }
            }
            return null;
        }
        //获取当前访问对应的action
        let actionContext = getAction();
        // console.log(actionObject);
        if (actionContext !== null) {
            //文件上传及post
            var form = new app.lib.formidable().IncomingForm({
                uploadDir: app.serverPath +'/view/'+ '/public/temp/',
                multiples: true
            });
            var result = await new Promise(function (resolve, reject) {
                form.parse(context.req, function (err, fields, files) {
                    resolve({ err: err, fields: fields, files: files });
                });
            })
            if (result.err) {
                throw result.err;
            }
            context.post = result.fields;
            context.post['__files'] = result.files;
            // if(context.url.href.indexOf('install')!==-1){
            //     throw new Error(JSON.stringify(actionObject));
            // }
            try {
                actionContext.progress = 'actionStart';
                let canNext = await context.router.beforeEach(actionContext);
                if (canNext !== true) {
                    return;
                }
            } catch (e) {
                throw e;
            }
            try {
                let param = context.url.query || {};
                let setup = function(model,props,setDefault=true){
                    if (typeof (props) === 'undefined') {
                        props = model;
                        model = param;
                    }
                    let data = app.setup(model,props,setDefault);
                    return data;
                };
                await context.use(actionContext.action, param , setup);
            } catch (e) {
                throw e;
            }
        } else {
            if(context.url.pathname.indexOf('.')===-1 && context.url.pathname.lastIndexOf('/')+1 !== context.url.pathname.length){
                //将/path/name这样的路径重定向到/path/name/下
                let isThemeExcludePath = app.webconfig.themeExcludePath.filter(function(pathEach){return context.url.path.indexOf(pathEach)===0;}).length === 0;
                if(app.webconfig.useTheme && isThemeExcludePath){
                    return context.renderTheme(context.url.pathname+'.ejs');
                }
                context.url.pathname = context.url.pathname + '/';
                return context.router.redirectTo(context.url.toString());
            }
            if(context.url.pathname.lastIndexOf('/')+1 === context.url.pathname.length){
                if(fs.existsSync(`${app.serverPath}/view/${context.url.pathname}index.ejs`)){
                    context.router.mapTo(`${context.url.pathname}index.ejs`);
                }
            }
            if (context.url.href.indexOf('.ejs') !== -1) {
                let renderPath = '/view' + context.url.pathname;
                let isThemeExcludePath = app.webconfig.themeExcludePath.filter(function(pathEach){return context.url.path.indexOf(pathEach)===0;}).length === 0;
                if(app.webconfig.useTheme && isThemeExcludePath){
                    renderPath = '/view/' + context.__theme + context.url.pathname
                }
                if(fs.existsSync(app.serverPath + renderPath)){
                    //解析post
                    var form = new app.lib.formidable().IncomingForm({
                        uploadDir: app.serverPath +'/view/'+ '/public/temp/',
                        multiples: true
                    });
                    var result = await new Promise(function (resolve, reject) {
                        form.parse(context.req, function (err, fields, files) {
                            resolve({ err: err, fields: fields, files: files });
                        });
                    })
                    if (result.err) {
                        throw result.err;
                    }
                    context.post = result.fields;
                    context.post['__files'] = result.files;
                    //解析post结束
                    try{
                       await context.render(renderPath);
                    }catch(e){
                        throw e;
                    }
                    
                }else{
                    context.res.statusCode = 404;//当请求为页面内链接的时候，浏览器收到404状态码，会停止接收html
                    context.res.setHeader('content-type','text/html;charset=utf-8');
                    throw new Error('No Page ' + renderPath);    
                }
            } else {
                let isGziped = await context.gzip();
                if(isGziped===false){
                    //如果开启主题，则读取主题内文件，themeExcludePath路径内的文件除外
                    context.reqAddress = path.resolve(app.serverPath + '/view/' + context.url.pathname);
                    let extname = path.extname(context.url.pathname);
                    let isThemeExcludePath = false;
                    if(app.webconfig.useTheme){
                        isThemeExcludePath = app.webconfig.themeExcludePath.filter(function(pathEach){return context.url.path.indexOf(pathEach)===0;}).length !== 0;
                    }
                    if(extname==='.gz'){
                        context.res.setHeader('Content-Encoding','gzip');
                        extname = path.extname(path.parse(context.url.pathname).name);
                    }
                    if(extname==='.br'){
                        context.res.setHeader('Content-Encoding','br');
                        extname = path.extname(path.parse(context.url.pathname).name);
                    }    
                    let theme_path = false;
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
                    await new Promise(function (resolve, reject) {
                        //不是文件路径返回404；是文件路径，文件不存在返回404
                        if(theme_path === false){
                            if(!isThemeExcludePath && app.webconfig.useTheme){
                                //如果使用主题,并且不在主题排除外的路径
                                context.reqAddress = context.theme.theme_real_path +'/'+ context.url.pathname;
                            }
                        }
                        let readStream = fs.createReadStream(context.reqAddress);
                        readStream.on('open', () => {
                            try {
                                if (typeof (app.config.httpHeaders[extname]) === 'undefined') {
                                    app.config.httpHeaders[extname] = 'application/octet-stream';
                                }
                                context.res.statusCode = 200;
                                //context-type
                                context.res.setHeader("Content-Type",app.config.httpHeaders[extname]);

                                //如果是css,js,html,.svg,.png,.jpeg,.jpg,.gif等添加缓存时间
                                if (extname==='.js'||extname==='.mp4'||extname==='.mp3'||extname==='.css'||extname==='.html'||extname==='.svg'||extname===".png"||extname==='.jpg'||extname==='.jpeg'||extname==='.gif') {
                                    // max-age
                                    context.res.setHeader("Max-Age",24 * 60 * 60);

                                    // Last-Modified
                                    context.res.setHeader("Last-Modified",fs.statSync(context.reqAddress).mtime.toUTCString());
                                    //Etag 图片有可能太大，浪费内存，不做Etag验证,如需要手动添加

                                    // expires
                                    context.res.setHeader("Expires",new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toUTCString());

                                }
                            } catch (e) {
                                e.message += `extname:${extname}`;
                                e.message += context.reqAddress;
                                reject(e);
                            }
                        })
                        readStream.on('error', (e) => {
                            readStream.destroy();
                            reject(e);
                        });
                        readStream.on('end', () => { readStream.destroy(); resolve() });
                        readStream.pipe(context.res);
                    })
    
                }
            }
        }
    }
    return context;
}
module.exports = core;