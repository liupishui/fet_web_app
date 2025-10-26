let webconfig = require('../webconfig');
module.exports = async function (wsContext, app, config) {
    if(webconfig.ws === false){ //如果没有开启websocket
        wsContext.client.close();
    }
    //浏览器和服务器的websocket建立链接后进行下面的处理

    // 需要浏览器端执行下面的代码,发送session_id到服务器
    // var connectWebSocket = function() {
    //     if (typeof(WebSocket) !== 'undefined') {
    //       var timmerReload = '';
    //       var socketReload = new WebSocket((window.location.href.indexOf('https') === 0 ? 'wss://' : 'ws://') + window.location.host);
    //       //socketReload.binaryType = "arraybuffer"
    //       socketReload.onopen = function(event) {
    //         var cookieSessionId = document.cookie.replace(/\s+/g,'').split(';').filter(function(val){return val.replace(/\s+/g,'').indexOf('session_id=')===0});
    //         if(cookieSessionId.length>0){
    //           socketReload.send(cookieSessionId[0]);
    //         }
    //       };
    //       socketReload.onmessage = function(event) {
    //         if (event.data.indexOf('modifyLiveReload:') == 0) {
              
    //         }
    //       }
    //       socketReload.onclose = function(event) {
    //         if (event.code === 1000) {
    //           console.log('websocket正常关闭')
    //         } else {
    //           // console.log(event.code);
    //           connectWebSocket();
    //         }
    //       }
    //       socketReload.onerror = function(event) {
    //         socketReload.close();
    //         console.log(event);
    //       };
  
    //     }
    //   }
    //   connectWebSocket();

    //wsContext.client是和浏览器当前建立WebSocket链接的服务端。所有WebSocket链接放在app.ws.clients里面
    
    //wsContext.client的session操作
    //启动session
    wsContext.client.sessionStart = function(sessionId){
        if(typeof(sessionId) === 'undefined'){
            sessionId = app.lib.uuid().v4();
            wsContext.client.sessionId = sessionId;
            app.session[sessionId] = {};
            app.session[sessionId].sessionStore = {};
            wsContext.client.session = {};    
        }else{
            wsContext.client.sessionId = sessionId;
            wsContext.client.session = {};
        }
        ammountWsSessionUtil();
    }
    ammountWsSessionUtil = function(){
        //获取当前session内容
        wsContext.client.session.get = function(sessionName){
            return app.session.get(wsContext.client.sessionId,sessionName);
        }
        //设置session内容
        wsContext.client.session.set = function (sessionName, sessionValue) {
            app.session.set(sessionId,sessionName,sessionValue);
        }
        //删除SESSION
        wsContext.client.session.remove = function (sessionName) {
            app.session.remove(sessionId,sessionName);
        }
        //获取所有SESSION 
        wsContext.client.session.getAll = function () {
            return app.session[sessionId].sessionStore;
        }

    }
    wsContext.client.connectedFirst = true;
    sleep = function(){
        return new Promise(function(resolve,reject){
            setTimeout(() => {
                resolve(true);
            }, 10000);
        });
    }
    wsContext.client.on('message',async (message)=>{
        if (wsContext.client.connectedFirst === true) {
            wsContext.client.connectedFirst = false;
            if(message.indexOf('session_id=')===0){
                if(Buffer.isBuffer(message)){
                    message = message.toString();
                }
                if(typeof(message.split('=')[1])!=='undefined'){
                    wsContext.client.sessionStart(message.split('=')[1]);
                }else{
                    wsContext.client.sessionStart();
                }
            }else{
                wsContext.client.sessionStart();
            }
        }
        // wsContext.client.send('收到消息'+wsContext.client.sessionId);
        // if(wsContext.client.session.get('user')){
        //     wsContext.client.send(JSON.stringify(wsContext.client.session.get('user')));
        // }; 
        // console.log(message);
    })
    
    //向浏览器端发送消息
    // let i=0;
    // setInterval(() => {
    //     i++;
    //     if(i>3){
    //         wsContext.client.close();
    //     }else{
    //         wsContext.client.send('niaho'+i+JSON.stringify(app.tables.banner.getAll()));
    //     }
    // }, 5000);
}