module.exports = async function (context, app){
    const fs = require('node:fs'), path = require('node:path');
    context.log = async function(error){
        try{
            if (error instanceof Error){
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
                if(!fs.existsSync(path.join(app.serverPath,'/log'))){
                    fs.mkdirSync(path.join(app.serverPath,'/log'));
                }
                if(app.config.isDebugging){
                    console.log(errInfo);
                }
                fs.appendFile(path.join(app.serverPath,'/log/error_'+ app.getNowTime().date +'.txt'),errInfo,function(){})        
            }else{
                let errInfo = app.getNowTime().full + '\n';
                errInfo+='请求原始路径:' + context.req.url + '\n';
                errInfo+='请求路径:' + context.url.href + '\n';
                errInfo += '访问者IP:' + (context.req.headers['x-forwarded-for']||context.req.connection.remoteAddress)+'\n';
                errInfo += 'message:\n';
                errInfo += ''+ JSON.stringify(error) +'\n';
                errInfo += 'stack:\n';
                let StackTrace = app.lib['stacktrace-js']().getSync();
                for(let i=0; i<StackTrace.length ;i++){
                    errInfo += `${StackTrace[i].functionName?(StackTrace[i].functionName+' '):''}(${StackTrace[i].fileName}:${StackTrace[i].lineNumber}:${StackTrace[i].columnNumber})` + '\n' + (StackTrace.source?('    at '+StackTrace.source+'\n'):'');
                }
                errInfo += '\n';
                if(!fs.existsSync(path.join(app.serverPath,'/log'))){
                    fs.mkdirSync(path.join(app.serverPath,'/log'));
                }
                if(app.config.isDebugging){
                    console.log(errInfo);
                }
                fs.appendFile(path.join(app.serverPath,'/log/error_'+ app.getNowTime().date +'.txt'),errInfo,function(){})    
    
            }
        }catch(e){
            throw e;
        }      
    }
}