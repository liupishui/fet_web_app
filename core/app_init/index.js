let fs = require("fs"), path = require('path');

let webconfig = require('../../webconfig');

module.exports = async function(context,app){
    //将 webconfig 挂在到app节点上
    app.webconfig = webconfig;

    // https://dev59.com/ZToDtIcB2Jgan1znL8FP
    const dns = require('dns');
    // Set default result order for DNS resolution
    dns.setDefaultResultOrder('ipv4first');

    if(webconfig.tsNode === true){
        try{
            let tsconfig = require(app.serverPath + '/tsconfig.json');
                tsconfig.compilerOptions.rootDir = path.join(app.serverPath,tsconfig.compilerOptions.rootDir);
                tsconfig.compilerOptions.typeRoots = tsconfig.compilerOptions.typeRoots.map((item)=>{
                    return path.join(app.serverPath,item);
                })
            app.lib['ts-node']().register(tsconfig);
        }catch(e){
            throw e;
        }
    }
    app.webconfig.httpHandler = async (context,app)=>{
       return context.res.end(`${app.httpHandlerPath}没有正确加载！`);
    }
    try{
        app.webconfig.httpHandler = require(app.httpHandlerPath);
    }catch(e){
        
    }
    //编码方法
    app.encode = function(string=''){
        return unescape(encodeURIComponent(string));
    }
    app.decode = function(string=''){
        return decodeURIComponent(escape(string));
    }
    app.setup = function(model,props,setDefault = true){
        // if (typeof (props) === 'undefined') {
        //     props = model;
        //     model = param;
        // }
        if(typeof(model)==='undefined' || typeof(props)==='undefined'){
            return {};
        }
        for (let x in props) {
            if (typeof (props[x].type) === 'undefined') {
                throw new Error(`Props[${x}]定义错误:属性type未定义`);
            }
            if (typeof (props[x].default) === 'undefined') {
                throw new Error(`Props[${x}]定义错误:属性default未定义`);
            }
            if (typeof (model[x]) === 'undefined') {
                if(setDefault===true){
                    model[x] = props[x].default;
                }
            } else {
                if (props[x].type === 'string') {
                    if (typeof (model[x]) !== 'string') {
                        if(model[x]===null){
                            model[x]=props[x].default
                        }else if(model[x] instanceof Buffer){
                            model[x] = model[x].toString();
                        }else{
                            model[x] = JSON.stringify(model[x]);
                        }
                    }
                } else if (props[x].type === 'number') {
                    if (typeof (model[x]) !== 'number') {
                        model[x] = parseFloat(model[x]);
                        isNaN(model[x]) && (model[x] = props[x].default);
                    }
                } else if (props[x].type === 'boolean') {
                    if (typeof (model[x]) !== 'boolean') {
                        model[x] = model[x] - 0;
                        if(isNaN(model[x])){
                            model[x] = props[x].default;
                        }else{
                            model[x] = model[x] === 1;
                        }
                    }
                } else if (props[x].type === 'array'){
                    if (Array.isArray(model[x])===false){
                        model[x] = props[x].default;
                    }
                } else if (typeof(props[x].type)==='function'){
                    if (model[x] instanceof props[x].type === false){
                        model[x] = props[x].default;
                    }
                }
            }
        }
        return model;
    }

    app.print = function (obj) {
        context.res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
        //打印对象的所有属性
        var obj = obj || this;
        var allPam = '';
        if (typeof (obj) == 'string') {
            context.res.write(obj);
            return;
        }
        var showPam = function (obj) {
            for (var x in obj) {
                if (typeof (obj[x]) == 'string' || typeof (obj[x]) == 'number' || typeof (obj[x]) == 'boolean') {
                    allPam += x + "<strong>" + obj[x] + "</strong><br/>";
                } else {
                    allPam += x + '&nbsp;&nbsp;&nbsp;&nbsp;<strong>' + typeof (obj[x]) + '</strong><br>';
                }
            }
        }
        showPam(obj);
        context.res.write(allPam);
    }
    app.printAll = function (obj, stringJiange) {
        //target:打印对象的所有属性
        //pam:obj对象 ,string层深间隔符
        //return htmlString
        context.res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
        if (typeof (obj) == 'undefined') {
            context.res.write('对象不存在');
            return;
        }
        //打印对象的所有属性
        var obj = obj || this;
        var allPam = '';
        if (typeof (obj) == 'string') {
            context.res.write(obj);
            return;
        }
        var arrProp = [];
        var treeId = 0;
        var trees = function (objN, parentId, level) {//递归建树
            for (let j in objN) {
                var levelN = level;
                treeId++;
                if (objN[j]) {
                    if (typeof (objN[j]) == 'undefined') {
                        arrProp.push({ id: treeId, parentId: parentId, name: j, type: typeof (objN[j]), content: 'undefined', level: levelN });
                    } else {
                        if (typeof (objN[j]) == 'string' || typeof (objN[j]) == 'number' || typeof (objN[j]) == 'boolean') {
                            arrProp.push({ id: treeId, parentId: parentId, name: j, type: typeof (objN[j]), content: objN[j], level: levelN });
                        } else {
                            arrProp.push({ id: treeId, parentId: parentId, name: j, type: typeof (objN[j]), content: typeof (objN[j]), level: levelN });
                            if (typeof (objN[j]) == 'object' || typeof (objN[j]) == 'function') {
                                levelN++
                                trees(objN[j], treeId, levelN);
                            }
                        }
                    }
                } else {
                    arrProp.push({ id: treeId, parentId: parentId, name: j, type: typeof (objN[j]), content: 'undefined', level: levelN });
                };
            }
        }
        trees(obj, 0, 1);
        var treeHtml = '';
        for (var x in arrProp) {
            var arrTmp = new Array(arrProp[x].level);
            if (arrProp[x].type == 'string' || arrProp[x].type == 'number' || arrProp[x].type == 'boolean') {
                treeHtml += arrTmp.join(stringJiange || '-') + arrProp[x].name + "<span style='color:#999;font-size:12px;'>(" + arrProp[x].type + ')</span> ' + arrProp[x].content + '<br/>';
            } else {
                treeHtml += arrTmp.join(stringJiange || '-') + arrProp[x].name + "<span style='color:#999;font-size:12px;'>(<strong>" + arrProp[x].type + '</strong>)</span> ' + arrProp[x].content + '<br/>';
            }
        }
        context.res.write(treeHtml);
    }
    
    // 深度克隆
    app.deepClone = function (obj) {
        // 对常见的“非”值，直接返回原来值
        if ([null, undefined, NaN, false].includes(obj)) return obj;
        if (typeof obj !== "object" && typeof obj !== 'function') {
            //原始类型直接返回
            return obj;
        }
        var o = obj instanceof Array ? [] : {};
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                o[i] = typeof obj[i] === "object" ? app.deepClone(obj[i]) : obj[i];
            }
        }
        return o;
    }
    // JS对象深度合并,返回一个新对象
    app.deepMerge = function (target = {}, source = {}) {
        target = app.deepClone(target);
        if (typeof target !== 'object' || typeof source !== 'object') return false;
        for (var prop in source) {
            if (!source.hasOwnProperty(prop)) continue;
            if (prop in target) {
                if (typeof target[prop] !== 'object') {
                    target[prop] = source[prop];
                } else {
                    if (typeof source[prop] !== 'object') {
                        target[prop] = source[prop];
                    } else {
                        if (target[prop].concat && source[prop].concat) {
                            target[prop] = target[prop].concat(source[prop]);
                        } else {
                            target[prop] = app.deepMerge(target[prop], source[prop]);
                        }
                    }
                }
            } else {
                target[prop] = source[prop];
            }
        }
        return target;
    }
    //合并对象,返回原对象,可以用Object.assign
    app.extend = function (destination, source) {
        let sourceNow = new source;
        for (let prototype in sourceNow) {
            destination.prototype[prototype] = sourceNow[prototype];
        }
        return destination;
    };
    
    //连接数据库
    let db = require("./db");
    for(var dbEach in db){
        if(typeof(db[dbEach])==='function'){
            await app.use(db[dbEach]);
        }
    }
    //初始化数据库
    if (!fs.existsSync(app.serverPath + '/install/locked.txt')) {
        if(fs.existsSync(app.serverPath + '/install/main.sql')){
            fs.writeFileSync(app.serverPath + '/install/locked.txt', '1');
            let sql = fs.readFileSync(app.serverPath + '/install/main.sql', 'utf-8');
            app.sqlite.exec(sql);   
        }
    }

    //初始化session
    let app_session = require('./session');
    await app.use(app_session);

    //初始化定时任务
    let app_schedule = require('./schedule');
    await app.use(app_schedule);

    //httpheaders
    let httpheaders = require('./httpheaders');
    await app.use(httpheaders);

    //ejs的LRU缓存
    let lru = require('./LRU');
    await app.use(lru);
}