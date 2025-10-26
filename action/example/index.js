module.exports = {
    main: async function(ctx,app,param){
            // var data={
            //     works:yield new $$.tables.works_items().getList(10),
            //     workers:yield new $$.tables.workers().getList(1),
            //     get:$$.get,
            //     name:'张三'
            // }
            // for(var x in ctx.post['__files']){
            //     var newPath='/public/'+(new Date()-0)+'.'+path.extname($$.post['__files'][x].name);
            //     fs.rename($$.post.files[x].path,$$.serverPath+newPath);
            //     data.imgSrc=newPath;
            // }
            // const apps=require('lodash');
            ctx.sjj=null;
            app.ws.clients.forEach(client=>{
                if(ctx.sessionId){
                    //console.log(ctx.sessionId);
                    //console.log('---',client.sessionId)
                    // for(var x in client){
                    //     console.log(x,ctx.sessionId);
                    // }
                    if (client.sessionId === ctx.sessionId) {
                        client.send('你好');
                    }
                }
            });
            if(typeof(app.schedules)==='undefined'){
                let schedule = app.lib['node-schedule']();
                let rule = new schedule.RecurrenceRule();
                rule.second = [0, 10, 20, 30, 40, 50];
                app.schedules = schedule.scheduleJob(rule, function(){
                    app.ws.clients.forEach(client=>{
                        client.send(client.sessionId);
                    })
                    console.log('The answer to life, the universe, and everything!');
                  });
            }
            ctx.renderTheme(`index.ejs`);
    },
    news:function(ctx,app,param){
        // $$.lib.genny.run(function *(resume){
        //     var data={
        //         works:yield new $$.tables.works_items().select(id)
        //     }
        //     //$$.printAll($$.req);
        //     res.end();
        //     $$.connection.destroy();
        // });
        ctx.res.write(ctx.get.id);
    },
    javascript: async(ctx,app,param) => {
        // ctx.cookie.remove('name');
        ctx.cookie.set('name','zhangsan');
        ctx.cookie.set('sex','1');
        try{
            ctx.res.setHeader('content-type','text/html;charset=utf-8');    
        }catch(e){

        }
        if(ctx.session.get('test')===null){
            ctx.session.set('test',new Date().getTime());
        }
        ctx.res.write(ctx.session.get('test')+'');
        ctx.res.write(Buffer.from('1316'));
        ctx.session.set('username','李明');
        ctx.session.remove('isUsed');
        ctx.res.write('9999');
        ctx.res.write(JSON.stringify(ctx.post||'777'));
        ctx.res.write(JSON.stringify(ctx.session.getAll()));
    },
    name: async function(){
        console.log(333);
    }
}
/***
$$.post={};
$$.get={};
$$.files={};
if($$.url.pathname=='/'){
    var i=0;
    if($$.req.method=='POST'){
        var body='';
        req.on('data',function(d){
            i++;
            console.log($$.lib.loadsh);
            console.log(d.toString());
        });
    };
    $$.url.queryNow='main';
    $$.action[$$.url.queryNow]();
}
***/










































