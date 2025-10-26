module.exports = async function (context, app) {
    if(typeof(app.action)==='undefined'){
        return;
    }
    let { action } = app;
    context.router = {};//让每次的router都是最新
    context.router.entry = {};
    context.router.redirectTo = function (path,statusCode = 302) {
        context.type('html');
        context.res.statusCode = statusCode;
        if(statusCode===301 || statusCode===302){
            context.res.setHeader('Location',path);    
        }else{
            context.res.write(`<script type='text/javascript'>window.location.href='${path}'</script>`);
        }
        context.res.end();
    }
    context.router.mapTo = function(pathname,query){
        //路由映射
        if(pathname){
            context.url.pathname = pathname;
        }
        if(typeof(query)==='object'){
            context.url.query = query;
        }
        context.url.href = context.url.toString();
    }
    context.router.beforeEach = async function(routerInfo){
        //路由守卫，如果可以继续访问则返回true，不可以继续访问则返回false
        if(routerInfo.progress === 'pageStart'){
            let pageStart = require('./pageStart');
            let canNext = await pageStart(context,app);
            return canNext;
        }
        if(routerInfo.progress === 'actionStart'){
            let actionStart = require('./actionStart');
            let canNext = await actionStart(context,app);
            return canNext;
        }
        return true;
    }
    context.addRouter = function (ruleObj) {
        context.router.entry[ruleObj.rule] = ruleObj;
    }
    //根据action自动添加路由
    autoRouter = function(action,prevUrlPath,app){
        for(let x in action){
            if(typeof(action[x])==='function'){
                let currRouter = {
                    rule:prevUrlPath+x,
                    action:action[x]
                }
                context.addRouter(currRouter)
                /**
                 * 解析类似/install/test.js,install.js类似的路径,可以别通过url路径/install/test和/install访问到
                 */
                let actionAlias = /(.+)_alias$/.exec(x);
                if(actionAlias!==null){
                    context.addRouter({
                        rule:prevUrlPath + actionAlias[1],
                        action:action[x]
                    }) 
                }
                /**
                 * 解析类似/install/index.js的路径,可以通过/install/访问到
                 */
                if(x === 'index' || x==='index_alias'){
                    context.addRouter({
                        rule: prevUrlPath,
                        action: action[x]
                    })
                }
                //console.log(actionAlias[1]);
            }else{
                autoRouter(action[x],prevUrlPath+x+'/',app);
            }
        }
    }
    autoRouter(action,'/',app);
    //根据action自动路由结束
    // context.addRouter({
    //     rule: '^/news/(\\d+)/(\\d+).html',
    //     action: action.admin_alias
    // })
    return true;
}