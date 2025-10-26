module.exports = async function (context, app, config) {
    //context添加含有set，get，remove操作session的方法
    //session默认有效期4小时,中间有操作顺延4小时
    context.session = {};
    context.session.start = function(){
        //app添加session节点存储session
        /*
            session["9e13d4c2-4dc1-4959-9c5c-70276e4de31c"] = {
                param1:3113
                Expires:1685929121236
            }
        */
        //app.print(app.lib.uuid().v1());
        //清理过期session,放在定时任务里，每秒执行一次
        let sessionId = context.cookie.get('session_id');
        context.sessionId =  sessionId;
        //如果没有sessionId则创建sessionId
        if (sessionId === null) {
            sessionId = app.lib.uuid().v4();
            context.sessionId = sessionId;
        }

        if (typeof (app.session[sessionId]) === 'undefined') {
            //如果上下文session不存在，则创建上下文session
            app.session[sessionId] = {};
            app.session[sessionId].Expires = context.runtime + 4 * 60 * 60 * 1000;
            app.session[sessionId].sessionStore = {};
            let addRst = app.tables.session.add({ "sessionId": sessionId, "sessionStore": JSON.stringify(app.session[sessionId].sessionStore), "Expires": app.session[sessionId].Expires });
            app.session[sessionId].id = addRst.lastInsertRowid;
            //同一主域名下，公用一个session
            let net = require('net');
            if(net.isIP(context.url.hostname)===0){
                if(context.url.hostname==='localhost'){
                    context.cookie.forceSet('session_id', sessionId,{domain:context.url.hostname,path:'/',maxAge:0});
                }else{
                    let domain = context.url.hostname.split('.').splice(-2).join('.');
                    context.cookie.forceSet('session_id', sessionId,{domain:domain,path:'/',maxAge:0});
                }
            }else{
                context.cookie.forceSet('session_id', sessionId,{domain:context.url.hostname,path:'/',maxAge:0});
            }
        }else{
            app.session.updateExpires(sessionId);
        }

    }
    //获取SESSION
    context.session.get = function (sessionName) {
        return app.session.get(context.sessionId,sessionName);
    };

    //设置SESSION
    context.session.set = function (sessionName, sessionValue) {
        app.session.set(context.sessionId,sessionName,sessionValue);
    }

    //删除SESSION
    context.session.remove = function (sessionName) {
        app.session.remove(context.sessionId,sessionName);
    }

    //获取所有SESSION
    context.session.getAll = function () {
        return app.session[context.sessionId].sessionStore;
    }
    context.session.setExpires = function (timesTamp) {
        app.setExpires(context.sessionId,timesTamp);
        //context.session.set('Expires', timesTampCurr);
    };
}
