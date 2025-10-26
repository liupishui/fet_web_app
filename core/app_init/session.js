module.exports = async function (context, app, config) {
    app.session || (app.session = {});
    //删除数据库里过期的session
    let deleteSql = `DELETE FROM session WHERE Expires<${new Date().getTime()}`;
    app.sqlite.exec(deleteSql);
    //获取所有session，并初始化
    let sessionArray = app.tables.session.getAll();
    for (let i = 0; i < sessionArray.length; i++) {
        sessionArray[i].sessionStore = JSON.parse(sessionArray[i].sessionStore);
        app.session[sessionArray[i].sessionId] = sessionArray[i];
        app.session[sessionArray[i].sessionId].Expires = app.session[sessionArray[i].sessionId].Expires-0;
    }
    //获取SESSION
    app.session.get = function (sessionId, sessionName) {
        // 注 app.session[sessionId].sessionStore[sessionName]的值有可能为0，false，null
        if (app.session[sessionId] && typeof(app.session[sessionId].sessionStore[sessionName])!=='undefined') {
            return app.session[sessionId].sessionStore[sessionName];
        } else {
            return null;
        }
    };

    //设置SESSION
    app.session.set = function (sessionId, sessionName, sessionValue) {
        if (app.session[sessionId]) {
            app.session[sessionId].sessionStore[sessionName] = sessionValue;
            app.tables.session.update({
                "id": app.session[sessionId].id,
                "sessionStore": JSON.stringify(app.session[sessionId].sessionStore)
            })
        };
    }

    //删除SESSION
    app.session.remove = function (sessionId,sessionName) {
        if (app.session[sessionId] && typeof(app.session[sessionId].sessionStore[sessionName])!=='undefined') {
            delete app.session[sessionId].sessionStore[sessionName];
            app.tables.session.update({
                "id": app.session[sessionId].id,
                "sessionStore": JSON.stringify(app.session[sessionId].sessionStore)
            })
        }
    }

    //获取所有SESSION
    app.session.getAll = function (sessionId) {
        return app.session[sessionId].sessionStore;
    }

    app.session.setExpires = function (sessionId,timesTamp) {
        timesTamp || (timesTamp = new Date().getTime() + 4 * 60 * 60 * 1000)
        //默认4小时过期
        if(app.session[sessionId]){
            //获取上次过期时间和当前访问时间差
            let period = app.session[sessionId].Expires - new Date().getTime();
            //如果时间大于等于100年则认为永久有效
            if(timesTamp - new Date().getTime() >= 31104e8){
                app.session[sessionId].Expires = timesTamp;
                //更新数据库里过期时间
                app.tables.session.update({
                    "id": app.session[sessionId].id,
                    "Expires": timesTamp
                })
                return;
            }
            if(period > 36e5){//大于1小时为有效用户，顺延时间
                if(period < 144e5){
                    ////大于1小时小于4小时顺延,顺延session
                    app.session[sessionId].Expires = timesTamp;
                    //更新数据库里过期时间
                    app.tables.session.update({
                        "id": app.session[sessionId].id,
                        "Expires": timesTamp
                    })
                }else{
                    //超过四小时删除session
                    app.session[sessionId].sessionStore = {};
                    app.tables.session.update({
                        "id": app.session[sessionId].id,
                        "sessionStore": JSON.stringify(app.session[sessionId].sessionStore),
                    })

                }
            }    
        };
    };
    app.session.updateExpires = function(sessionId){
        //获取距过期还剩多久
        let period = app.session[sessionId].Expires - new Date().getTime();
        //如果有效期还有1年则不做处理
        if(period > 315360e6){
            return;
        }
        if(period < 18e5){
            //如果还剩半小时
            if(period > 0){
                //如果还没过期则顺延session
                app.session.setExpires(sessionId,new Date().getTime()+144e5);
            }else{
                //超过四小时删除session
                app.session[sessionId].sessionStore = {};
                app.tables.session.update({
                    "id": app.session[sessionId].id,
                    "sessionStore": JSON.stringify(app.session[sessionId].sessionStore),
                })
            }
        }
        //app.session[sessionId].Expires = context.runtime + 4 * 60 * 60 * 1000;
        //更新数据库里session有效期
        // app.tables.session.update({id: app.session[sessionId].id,"sessionStore": JSON.stringify(app.session[sessionId].sessionStore), "Expires": new Date().getTime() + 4 * 60 * 60 * 1000 });
    }
}