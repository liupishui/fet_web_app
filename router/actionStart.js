/**
 * The function "actionStart" is an asynchronous function that takes in two parameters, "context" and
 * "app", but does not contain any code.(执行action之前)
 * @param context - The context parameter is an object that contains information about the current
 * state of the conversation and the user's input. It can be used to access and manipulate the
 * conversation history, user input, and other contextual information.
 * @param app - The `app` parameter is an object that represents the current application or bot. It
 * contains various properties and methods that can be used to interact with the application and
 * perform actions.
 * @returns a boolean value.
 */
async function actionStart(context,app){
    if(context.url.pathname.indexOf('/admin/')===0){
        // console.log(context.url.pathname);
        context.session.start();
        if(context.session.get('user')===null){
            //如果没有登录跳转登录页面
            context.router.redirectTo('/login');
            return false;
        }
    }
    return true;
}
module.exports = actionStart;