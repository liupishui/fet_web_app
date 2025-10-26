/**
 * The function "pageStart" is an asynchronous function that takes in two parameters, "context" and
 * "app", and returns a promise that resolves to true.
 * @param context - The context parameter is an object that contains information about the current
 * execution context. It can include details such as the user's session, request information, and any
 * other relevant data.
 * @param app - The `app` parameter is an object that represents the application or framework that is
 * being used to handle the web requests. It typically contains methods and properties for routing,
 * handling middleware, and managing the server.
 * @returns a boolean value.
 */
async function pageStart(context,app){
    let canNext = true;
    //禁止请求包含'.fet.js'的文件,.fet.js中可以通过module.exports={},导出对象，在其他ejs文件中通过require引用
    if(context.url.pathname.indexOf('.fet.js')!==-1||context.url.pathname.indexOf('.fet.ts')!==-1){
        let err = new Error('Forbbiden!');
        err.errno = 403;
        throw err;
    }
    //伪静态
    let Rewrite = require('./Rewrite');
    canNext = await context.use(Rewrite);

    //页面开始的时候,在这里做伪静态
    // if(context.url.pathname === '/test.html'){
    //     context.url.pathname = '/admin';//pathname对应action
    // }
    // context.url.query.name= '效力';
    // let data = context.url.toString();
    
    // if(context.url.pathname === '/test.html'){
    //     context.url.pathname = '/admin';//pathname对应action
    // }
    // context.url.query.name= '效力';
    // let data = context.url.toString();

    //    //根据action自动路由结束
    // context.addRouter({
    //     rule: '^/news/(\\d+)/(\\d+).html',
    //     action: action.admin_alias
    // })

    if(context.url.pathname==='/2023.html'){
        context.router.mapTo('/2023.ejs');
    }
    return canNext;
}
module.exports = pageStart;