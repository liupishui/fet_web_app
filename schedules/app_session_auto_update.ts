//定时任务自动清除过期session
module.exports = {
    run:true,
    schedule:function(context:Context,app:App,config:any){
        //每秒更新一次,清除app.session里和数据库里过期的session

        let schedule = app.lib['node-schedule']();
        let rule = new schedule.RecurrenceRule();
        rule.second = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];
        let job = schedule.scheduleJob(rule, function(){
            let currTime = Date.now();
            for (let x in app.session) {
                if (app.session[x].Expires < currTime) {
                    app.tables.session.delete({ sessionId: x });
                    delete app.session[x];
                    // console.log(app.session[x]);
                }
            }
        });
        job.invoke();//立刻执行一次
        return job;
    }
}