module.exports = {
    run:false,
    schedule:function(context,app,config){
        //需要返回一个定时任务
        let schedule = app.lib['node-schedule']();
        let rule = new schedule.RecurrenceRule();
        rule.second = [0, 10, 20, 30, 40, 50];
        return schedule.scheduleJob(rule, function(){
            console.log(444);
        });
    }
}