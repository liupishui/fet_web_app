module.exports = {
    run:true,
    schedule:function(context:Context,app:App,config:any){
        //每秒更新一次action,不在每次请求里去都去自动加载action，这样可以加快程序运行速度。
        let schedule = app.lib['node-schedule']();
        let rule = new schedule.RecurrenceRule();
        rule.second = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];
        let job = schedule.scheduleJob(rule, function(){
            let path = require('path');
            let actions_autoload = app.require(path.resolve(__dirname, '../core/actions_autoload.js'));
            app.use(actions_autoload);
        });
        job.invoke();//立刻执行一次
        return job;
    }
}