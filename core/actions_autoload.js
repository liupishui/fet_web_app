//自动挂载所有action
let path = require('path');
let fs = require('fs');
let indexClass = require('./indexClass');
function getActionPathAndAction (context,app){
    //获取所有js文件路径和action方法
    let jsFileArr = [];
    let getFile = function(actionsPath,app){
        let files = fs.readdirSync(actionsPath,{withFileTypes:true});
        for(let i=0;i<files.length;i++){
            if(files[i].isFile()){
                let actionCurr = null;
                let actionCurrFilePath = path.join(actionsPath,files[i].name);
                try{
                    actionCurr = app.require(actionCurrFilePath);
                }catch(e){
                }
                // if(actionCurrFilePath.indexOf('ts')!==-1){
                //     console.log(actionCurrFilePath,actionCurr);
                // }
                if(typeof(actionCurr)==='function'){
                    // console.log(new actionCurr);
                    if(!!actionCurr.prototype){
                        //console.log(actionCurr,actionsPath, actionCurr instanceof indexClass,indexClass);
                        jsFileArr.push({
                            path: path.join(actionsPath,files[i].name),
                            action: async function(context, app, param, setup){ 
                                let actionCurrInstance = new actionCurr(context, app, param, setup);
                                if(actionCurrInstance instanceof indexClass){
                                    return await actionCurrInstance.run(context,app,param,setup);
                                }else{
                                    if(actionCurrFilePath.indexOf('.ts')!==-1){
                                        return await actionCurrInstance.run(context,app,param,setup);
                                    }else{
                                        throw new Error(`Action ${actionCurrFilePath} is not instance of indexClass!`);
                                    }
                                }
                            }
                        });
                    }else{
                        jsFileArr.push({
                            path: path.join(actionsPath,files[i].name),
                            action: actionCurr
                        });
                    }
                }
            }else{
                if(files[i].isDirectory()){
                    getFile(path.join(actionsPath,files[i].name),app);
                }
            }
        }
    };
    let actionsPath = path.resolve(__dirname,'../action');
    getFile(actionsPath,app);
    return jsFileArr;
}
// actionJsFiles.forEach(filePath=>{
//     let actionsPath = path.resolve(__dirname,'../action');
//     console.log(path.relative(actionsPath,filePath))
// })

//定义所有action返回的只是function，如果返回对象则不处理
function amountAction(action,nameSpaceArr,actionPathAndAction,app){
    if(nameSpaceArr.length===1){
        if(typeof(action[nameSpaceArr[0]])==='undefined'){
            action[nameSpaceArr[0]] = actionPathAndAction.action;
        }else{
            if(typeof(action[nameSpaceArr[0]])==='object'){
                // console.log(actionPathAndAction.path);
                action[nameSpaceArr[0]+'_alias'] = actionPathAndAction.action;
                //Object.assign(action[nameSpaceArr[0]],currAction);
            }
        }
    }else{
        let currName = nameSpaceArr.splice(0,1)[0];
        action[currName] || (action[currName]={});
        amountAction(action[currName],nameSpaceArr,actionPathAndAction,app);
    }
}
async function actions_autoload(context,app){
    app.action || (app.action = {});
    // app.action = {};
    let actionPathAndActionArr = getActionPathAndAction(context,app);
    let actionsPath = path.resolve(__dirname,'../action');
    let actionCurr = {};
    for(let i = 0; i< actionPathAndActionArr.length;i++){
        let actionPath = path.relative(actionsPath,actionPathAndActionArr[i].path);
        let nameSpaceArr = actionPath.substring(0,actionPath.indexOf('.')).split(path.sep);
        amountAction(actionCurr,nameSpaceArr,actionPathAndActionArr[i],app);
    }
    app.action = actionCurr;
    // console.log(app.action);
};
module.exports = actions_autoload;