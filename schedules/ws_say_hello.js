module.exports = {
    run:true,
    schedule:function(context,app,config){
        //需要返回一个定时任务
        let schedule = app.lib['node-schedule']();
        let rule = new schedule.RecurrenceRule();
        rule.second = [0, 10, 20, 30, 40, 50];
        return schedule.scheduleJob(rule, function(){
            app.ws.clients.forEach(client=>{
                //console.log(app.session)
                //console.log(client);
                if(typeof(client.session)!=='undefined'){
                    if (typeof(client.session.get)!=='undefined') {
                        if (client.session.get('user')) {
                            client.send(JSON.stringify(client.session.get('user')));
                            return;    
                        }
                    }
                }
                client.send('定时任务'+new Date().toLocaleTimeString());
            })
        });
    }
}