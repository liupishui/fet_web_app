
/**
 * The function redirects the user to the homepage of the Baidu search engine if the requested URL is
 * the root ("/").
 * @param context - The context parameter represents the current request context, including information
 * about the request URL, headers, and other details.
 * @param app - The "app" parameter is an instance of the Express.js application. It is used to handle
 * HTTP requests and responses in the Node.js server.
 * @param {[{type:"Rewrite",path:"^/products/([0-9]+)$",target:"/product/index.ejs?id=$$1"}]} rules - The `config` parameter is an object that contains configuration settings for the
 * application. It can include things like database connection information, API keys, or any other
 * settings that the application needs to function properly.
 * @returns {boolean} 是否成功
 */
let webconfig = require('../webconfig');
async function Rewrite(context,app){
    let rules = webconfig.rewrite? webconfig.rewrite : [];
    /**
     * rule.type
     *      None ：仅记录正在访问的URL，但不进行任何处理。这通常用于调试或URL跟踪。
     * 示例
     * {
     *   type:"None"
     *   path:"/news/1.html"
     * }
     *      Rewrite ：将请求的URL映射到对应的URL地址
     * 示例
     * {
     *   type:"Rewrite",
     *   path:"^^/products/([0-9]+)/([0-9]+)$",
     *   target:"/products/?type=${1}&id=${2}"
     * }
     *      Redirect ：将客户端的请求重定向到新的URL。可以使用 statusCode 属性来设置HTTP状态代码。如果指定为301永久重定向，则可能会影响搜索引擎优化（SEO）。 redirectType有Permanent和Found两个值，Permanent是永久重定向(301,一般搜索引擎会更新快照),Found是临时重定向(302,搜索引擎不会更新快照);
     * 示例
     * {
     *    type:"Redirect",
     *    path:"/news/2.html",
     *    url:"https://www.example.com/test"
     *    redirectType:"Permanent",
     * }
     *      CustomResponse ：返回自定义的响应代码和消息，可以使用 statusCode 和 statusMessage 属性来设置HTTP状态代码和原因短语。自定义原因短语statusMessage并不是HTTP协议规范中的一部分，它可能会导致与标准不一致的问题。因此，除非特殊需要，我们通常建议使用标准的原因短语，不要单独定制。不影响程序继续执行。 https://www.jb51.net/article/254342.htm
     * 示例
     * {
     *    type:"CustomResponse",
     *    path:"^/$"
     *    statusCode:"404",
     *    statusMessage:"Not Found",
     * }
     *      AbortRequest ：停止请求的处理并返回响应。这通常用于快速中止处理，或者如果客户端请求无效或可能导致无法处理的大量响应数据的情况。       
     * 示例
     * {
     *    type:"AbortRequest"
     *    path:"/system/"
     * }
    */
   for(let i=0;i<rules.length;i++){
        let rule = rules[i];
        if(rule.type === 'None'){
            return true;
        }
        const regex = new RegExp(rule.path);
        if(regex.test(context.url.path)){
            if(rule.type === 'Rewrite'){
                const match = regex.exec(context.url.pathname);
                if(match){
                    const targetUrl = rule.target.replace(/\${([0-9]+)}/g, (m, g) => match[g]);
                    let parseUrl = context.url.parse(targetUrl);
                    context.router.mapTo(parseUrl.pathname,parseUrl.query);
                }
                return true;
            } 
            if(rule.type === 'Redirect'){
                const match = regex.exec(context.url.pathname);
                if(match){
                    const targetUrl = rule.target.replace(/\${([0-9]+)}/g, (m, g) => match[g]);
                    context.res.statusCode = 302;
                    if(rule.redirectType==='Permanent'){
                        context.res.statusCode = 301;
                    }
                    if(rule.redirectType==='Found'){
                        context.res.statusCode = 302;
                    }
                    context.res.setHeader('Location',targetUrl);
                }
                return false;
            }
            if(rule.type === 'CustomResponse'){
                context.res.statusCode = rule.statusCode;
                if(rule.statusMessage){
                    context.res.statusMessage = rule.statusMessage;
                }
                return true;
            }
            if(rule.type === 'AbortRequest'){
                context.res.statusCode = 499;
                context.res.statusMessage = 'AbortRequest';
                context.res.end();
                return false; 
            }
        }
        // const match = regex.exec(context.url.href);
        // if(match){

        // }
    }      
    return true;      
    // if(context.url.pathname ==='/'){
    //     context.res.statusCode = 301;
    //     context.res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
    //     context.res.setHeader('Location','http://www.baidu.com');
    // }
}
module.exports = Rewrite;