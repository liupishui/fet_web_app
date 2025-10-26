//接收到错误消息时处理
let fs = require('fs');
let path = require('path');
let StackTraceRender = async function(context,app,error){
    let StackTrace = app.lib['stacktrace-js']();
    try{
        let stackframes = await StackTrace.fromError(error);
        if(context.res.headersSent===false){
            if(error.errno){
                if(error.errno=== -4058||error.errno=== -4068){
                    context.res.statusCode = 404;//当请求为页面内链接的时候，浏览器收到404状态码，会停止接收html
                    context.res.setHeader('content-type','text/html;charset=utf-8');
                }else{
                    context.res.statusCode = 500;
                    context.res.setHeader('content-type','text/html;charset=utf-8');
                }
            }else{
                context.res.statusCode = 500;
                context.res.setHeader('content-type','text/html;charset=utf-8');
            }
        }

        let Errors = {stackframes:stackframes,error:error};
        return context.render('/core/error.ejs',Errors);
    }catch(e){
        throw e;
    }
}
module.exports = async function(context,app,error){
    if(app.config.isDebugging){
        console.log(context.req.url, path.resolve(app.serverPath+'/core/errorHanlder.js'),context.res.writableEnded,error);
    }
    if(context.res.writableEnded===false){
        if(app.config.isDebugging){
            await StackTraceRender(context,app,error);
        }else{
            context.log(error);
            let is404 = false;
            if(context.res.statusCode===404){
                is404 = true;
            };
            if(error.errno){
                if(error.errno=== -4058||error.errno=== -4068){
                    is404 = true;
                }
            }
            if (is404) {
                //     // 设置允许跨域访问
                //     res.setHeader('Access-Control-Allow-Origin', '*');
                context.res.statusCode = 404;//当请求为页面内链接的时候，浏览器收到404状态码，会停止接收html
                context.res.setHeader('content-type','text/html;charset=utf-8');
                context.res.write("页面" + context.url.pathname+'不存在!'); 
                context.res.end();
            }else{
                context.res.statusCode = 500;//当请求为页面内链接的时候，浏览器收到404状态码，会停止接收html
                context.res.setHeader('content-type','text/html;charset=utf-8');
                context.res.write(`服务器错误`);
                context.res.end();        
            }
        }
    }else{
       // console.log(error)
    }
    try{
        let StackTrace = app.lib['stacktrace-js']();
        let stackframes = await StackTrace.fromError(error);
        let errInfo = app.getNowTime().full + '\n';
        errInfo+='请求原始路径:' + context.req.url + '\n';
        errInfo+='请求路径:' + context.url.href + '\n';
        errInfo += '访问者IP:' + (context.req.headers['x-forwarded-for']||context.req.connection.remoteAddress)+'\n';
        if(typeof(error.code)!=='undefined'){
            errInfo+= 'code:'+error.code+'\n';
        }
        if(typeof(error.errno)!=='undefined'){
            errInfo+= 'errno:'+error.errno+'\n';
        }
        if(typeof(error.syscall)!=='undefined'){
            errInfo+= 'syscall:'+error.syscall+'\n';
        }
        errInfo += 'message:\n';
        errInfo += '        '+error.message+'\n';
        errInfo += 'stack:'+'\n';
        stackframes.forEach(element =>{
            errInfo += '        '+element.fileName.replace(/\\/g,'/').split('/').splice(-2).join('\\') +':'+ (element.lineNumber?element.lineNumber:'')+ ' '+ (element.functionName?element.functionName:'') +'\n        '+ element.source+'\n'
        })
        errInfo += '\n';
       // let errInfo = app.getNowTime().full +' \n'+ error.message+ '\n' + error.stack+'\n\n';
       if(!fs.existsSync(path.join(app.serverPath,'/log'))){
            fs.mkdirSync(path.join(app.serverPath,'/log'));
        }

        fs.appendFile(path.join(app.serverPath,'/log/error_'+ app.getNowTime().date +'.txt'),errInfo,function(){})    
    }catch(e){
        throw e;
    }
    return true;    
}