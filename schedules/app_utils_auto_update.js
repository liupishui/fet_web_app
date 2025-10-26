//将/utils第一级目录下的工具自动挂载到app.utils节点下面
let path = require('node:path');
let fs = require('node:fs');
function getUtilPathAndUtil (context,app){
    //获取所有js文件路径和util方法
    let jsFileArr = [];
    let getFile = function(utilsPath,app){
        let files = fs.readdirSync(utilsPath,{withFileTypes:true});
        for(let i=0;i<files.length;i++){
            if(files[i].isFile()){
                let utilsCurr = null;
                try{
                    utilsCurr = app.require(path.join(utilsPath,files[i].name));
                }catch(e){
                    if(app.config.isDebugging){
                        console.log(`app.utils工具加${utilsPath}/${files[i].name}载错误`,e);
                    }
                }
                if(typeof(utilsCurr)==='function'||typeof(utilsCurr)==='object'){
                    if(utilsCurr!==null){
                        jsFileArr.push({
                            path: path.join(utilsPath,files[i].name),
                            util: utilsCurr
                        });
                    }
                }
            }
            // else{
            //     if(files[i].isDirectory()){
            //         getFile(path.join(utilsPath,files[i].name),app);
            //     }
            // }
        }
    };
    let utilsPath = path.resolve(__dirname,'../utils/');
    getFile(utilsPath,app);
    return jsFileArr;
}
function amountUtil(utils,nameSpaceArr,utilPathAndUtil,app){
    if(nameSpaceArr.length===1){
        if(typeof(utils[nameSpaceArr[0]])==='undefined'){
            utils[nameSpaceArr[0]] = utilPathAndUtil.util;
        }
    }
}
module.exports = {
    run:true,
    schedule:function(context,app,config){
        let path = require('path');
        let updateUtils = async function(){
            let utilPathAndUtilArr = getUtilPathAndUtil(context,app);
            let utilsPath = path.resolve(__dirname,'../utils/');
            let utilsCurr = {};
            for(let i = 0; i< utilPathAndUtilArr.length;i++){
                let utilPath = path.relative(utilsPath,utilPathAndUtilArr[i].path);
                let nameSpaceArr = utilPath.substring(0,utilPath.indexOf('.')).split(path.sep);
                amountUtil(utilsCurr,nameSpaceArr,utilPathAndUtilArr[i],app);
            }
            
            app.utils = utilsCurr;

            //console.log(utilsCurr);
        }

        let schedule = app.lib['node-schedule']();
        let rule = new schedule.RecurrenceRule();
        rule.second = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];
        let job = schedule.scheduleJob(rule, function(){
            updateUtils();
        });
        job.invoke();//立刻执行一次
        return job;
    }
}