//自动加载并执行schedules目录下的定时任务
let path = require('path');
let fs = require('fs');
async function runSchedule (context,app){
    app.schedules || (app.schedules = {});
    let actionsPath = app.serverPath + '/schedules/';
    let files = fs.readdirSync(actionsPath,{withFileTypes:true});
    for(let i=0;i<files.length;i++){
        if(files[i].isFile()){
            if (path.parse(files[i].name).ext==='.js' || path.parse(files[i].name).ext==='.ts') {
                try{
                    let schedule = app.require(path.resolve(actionsPath,'./'+files[i].name),true);
                    //console.log(schedule);
                    if(schedule.run){
                        //可以执行
                        if(typeof(app.schedules[path.parse(files[i].name).name])==='undefined'){
                            try{
                                app.schedules[path.parse(files[i].name).name] = schedule.schedule(context,app);
                            }catch(e){
                                throw e;
                            }
                        }else{
                            if(app.schedules[path.parse(files[i].name).name]===false){
                                try{
                                    app.schedules[path.parse(files[i].name).name] = schedule.schedule(context,app);
                                }catch(e){
                                    throw e;
                                }
                            }else{
                                schedule = null;
                            }
                            //app.schedules[path.parse(files[i].name).name].reschedule();
                        }
                    }else{
                        //停止定时任务
                        if(typeof(app.schedules[path.parse(files[i].name).name])!=='undefined'){
                            if(app.schedules[path.parse(files[i].name).name].cancel){
                                app.schedules[path.parse(files[i].name).name].cancel();
                                app.schedules[path.parse(files[i].name).name] = false;
                            }else{
                                app.schedules[path.parse(files[i].name).name] = false;
                                schedule = null;
                            };

                        }else{
                            schedule = null
                        }
                    }
                    //app.schedules[path.parse(files[i].name).name] = app.require(path.resolve(actionsPath,'./'+files[i].name));
                }catch(e){
                    return e;
                }
            }
        }
    }

}
async function schedules(context,app){
    let schedule = app.lib['node-schedule']();
    let rule = new schedule.RecurrenceRule();
    rule.second = (function(){
        var arr = [];
        for(let i=0;i<60;i++){
            if(i%2===0){//每两秒执行一次
                arr.push(i)
            }
        }
        return arr;
    })();
    app.schedules = schedule.scheduleJob(rule, function(){
        runSchedule(context,app);
    });
    app.schedules.invoke();
};
module.exports = schedules;



