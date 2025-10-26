node v20.9.0
#fet_web_app

### 将fet-win32-x64/resources添加到工作区和fet_web_app也添加到工作区

调试：
npm run-script debug

第二步
点击vscode左侧的调试，然后点击展开面板里的三角形图标


//用户域名信息
表 domain 
    id   网站唯一的domain_id
    domain_inside 在主域名下的唯一子域名
    domain_outside 用于自购买外部域名
表 webinfo
    user_id 子站点网站对应用户id
    domain_id  子站点id
    theme_id   对应theme的id
表 theme
   id theme对应的id
   theme_server_path 从app.serverPath/下面开始的路径,防止更换盘符导致主题访问不到
   theme_view_path   从app.serverPath /view/下面开始的路径,用于静态文件链接 default.css
未登录 domain_outside或者domain_inside映射网站domain_id, theme_id由domain_id映射

一个域名可以有好几个主题，但有个默认主题。默认主题在webinfo表里存储
    app
        themes节点存储
        
```javascript
{
    domain_inside:{
        theme_real_path:'d://+server_path+/view/theme/blue/',//主题物理路径,其他字段同 theme的节点        
    }
}
```
## app,context几个重要属性

    const {server,serverPath,lib} = app;

    const {req,res,url,reqAddress} = context;

# app.table

```javascript
            app.tables.banner.add({
                'image_url':'https://www.baidu.com',
                'title':'测试'                
            })
            app.tables.banner.update([{
                'image_url':'https://www.baidu.com',
                'id':12
            },{
                'image_url':'https://www.baidu.com',
                'id':16
            }])
            console.log(app.tables.banner.get([{id:1},{image_url:'https://www.baidu.com'}]));
            console.log(app.tables.banner.count());
```

注册成功则初始化网站基础信息
domain表增加一条新的域名信息 domain_inside默认一条域名
webinfo表里增加一条信息，默认domain_id,theme_id=1

# .fet.js/.fet.ts文件说明

view文件夹内.fet.js/.fet.ts为后缀的文件无法通过浏览器访问,此类文件不遵从ejs语法，通过module.exports导出模块，在.ejs文件里,通过require引用;

例如,a.fet.js文件内容为

```javascript
    module.exports = {
        name: "xiaoli"
    }
```

在b.ejs文件里，可以直接require
```ejs
    <%
        let name = require('a.fet.js').name;
    %>
```

# Rewrite

配置路径 /webconfig.js 的rewrite节点

示例：

```javascript
    [
        {
            type:'Rewrite',
            path:'^/products/([0-9]+)/([0-9]+)$',
            target:'/products/?type=${1}&id=${2}',
        },
        {
            type:'Redirect',
            path:'^/products/([0-9]+)/$',
            target:'https://www.baidu.com/${1}',
            redirectType:"Found"
        },
        {
            type:'Redirect',
            path:'^/products/$',
            target:'https://www.baidu.com/',
            redirectType:"Permanent"
        },
        {
            type:'CustomResponse',
            path:'^/login$',
            statusCode: 200,
            statusMessage:"ok"
        },
        {
            type:'AbortRequest',
            path:'^/logins$'
        }
    ]
```

## context

context.toHTML,context.toSTRING,context.toJSON都返回context对象本身

## websocket

action里收到请求，websocket发送消息的例子

```javascript
    module.exports = function(context,app,query,setup){
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
    }
```
## 定时任务

在action里启动一个定时任务

```javascript
    module.exports = function(context,app,query,setup){
            if(typeof(app.schedules_example)==='undefined'){
                let schedule = app.lib['node-schedule']();
                let rule = new schedule.RecurrenceRule();
                rule.second = [0, 10, 20, 30, 40, 50];
                app.schedules_example = schedule.scheduleJob(rule, function(){
                    app.ws.clients.forEach(client=>{
                        client.send(client.sessionId);
                    })
                    console.log('The answer to life, the universe, and everything!');
                });
            }
    }
```

在action里关闭一个定时任务

```javascript
    module.exports = function(context,app,query,setup){
        if(typeof(app.schedules_example)!=='undefined'){
            app.schedules_example.cancel();
        }
    }
```

## ts支持

取消/core/app_init/index.js里2至6行的注释

使用 require('./demo.ts')的方式引用ts文件

## 插件swagger-tool使用方法

将array或者object所在文档的语言改为 json（vscode右下角设置）,然后ctrl+c复制array或者object(属性值不可以为null)，
打开/view/api_doc/swagger.json用快捷键ctrl+all+v粘贴schema

todo

是否添加自定义表单，自定义表单怎么实现

api/webinfo  网站信息 已完成 

api/messageList 用户留言列表,设计意向什么的，中科齐创专用那个(暂时不做)

api/leaveContact 留言表单

api/contactList 联系我们，留言列表 

api/friendlinkList 友情链接列表

// 页面级别缓存,都放在app.LRU_HREF_PAGE里面

## HTML&EJS

html文件是静态文件，不做渲染数据；EJS动态文件渲染数据

# 几个重要的库和官网

### redis 

https://github.com/redis/node-redis

version 4.7.0

### 邮件发送 nodemailer

https://nodemailer.com/

version 6.9.15

### 数据库操作，sequelize（默认 better-sqlite3）

https://sequelize.org/  支持数据库mssql, mariadb, mysql, oracle, postgres, db2 and sqlite

version 6.37.4

连接sqlite3示例1

```javascript
    let Sequelize = app.lib.sequelize();
    try{
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            dialectModulePath:__dirname + '/utils/sequelize/sqlite3',
            // 指定数据库文件路径
            storage: __dirname + '/db/test.db',
            // 其他可选配置...
          });
    
        await sequelize.authenticate();
        let data = await sequelize.query('select * from user');
        console.log(data);
        const User = sequelize.define("user", {
            name: Sequelize.DataTypes.TEXT,
            favoriteColor: {
                type: Sequelize.DataTypes.TEXT,
                defaultValue: 'green'
            },
            sex: Sequelize.DataTypes.TEXT
          });
        const jane = User.build({ name: "Jane" , sex:'男'});
        await jane.save();
        console.log('Connection has been established successfully.');
    }catch(e){
        console.log(e)
    }
```
连接sqlite3示例2

```javascript
    let Sequelize = app.lib.sequelize();
    try{
        let dialectModulePath = app.lib.sqlite3().currentModulePathDir();
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            dialectModulePath:dialectModulePath,
            // 指定数据库文件路径
            storage: app.serverPath + '/db/test.db'
            // 其他可选配置...
          });
    
        await sequelize.authenticate();
        const User = sequelize.define("user", {
            name: Sequelize.DataTypes.TEXT,
            favoriteColor: {
                type: Sequelize.DataTypes.TEXT,
                defaultValue: 'green'
            },
            sex: Sequelize.DataTypes.TEXT
          });
        const jane = User.build({ name: "Jane" , sex:'男'});
        await jane.save();

        console.log('Connection has been established successfully.');
    }catch(e){
        console.log(e)
    }
```
连接mysql示例

```javascript
    let Sequelize = app.lib.sequelize();
    try{
        let mysql2 = app.lib.mysql2();
        const sequelize = new Sequelize('database_name', 'username', 'password', {
                host: 'localhost', // 数据库服务器地址
                dialect: 'mysql', // 指定数据库类型
                port: 3306, // 数据库端口，默认为3306
                pool: {
                    max: 5, // 连接池中最大连接数量
                    min: 0, // 连接池中最小连接数量
                    acquire: 30000, // 最大获取连接时间
                    idle: 10000 // 如果一个连接在指定的毫秒数内没有被使用，则该连接将被释放
                },
                dialectModule:mysql2,
                define: {
                    timestamps: false // 是否自动为每个模型添加createdAt和updatedAt字段
                }
            });
    
        await sequelize.authenticate();
        const User = sequelize.define("user", {
            name: Sequelize.DataTypes.TEXT,
            favoriteColor: {
                type: Sequelize.DataTypes.TEXT,
                defaultValue: 'green'
            },
            sex: Sequelize.DataTypes.TEXT
          });
        const jane = User.build({ name: "Jane" , sex:'男'});
        await jane.save();

        console.log('Connection has been established successfully.');
    }catch(e){
        console.log(e)
    }
```
连接MSSQL示例

```javascript
    let Sequelize = app.lib.sequelize();
    try{
        let tedious = app.lib.tedious();
        const sequelize = new Sequelize('数据库名', '用户名', '密码', {
                                host: '主机地址',
                                dialect: 'mssql', // 使用mssql作为方言
                                dialectModule: tedious, // 使用tedious作为连接模块
                                port: 1433, // MSSQL默认端口是1433，如果不是，请修改为正确的端口
                                pool: {
                                    max: 10, // 最大连接数
                                    min: 0, // 最小连接数
                                    idle: 10000 // 连接的最大空闲时间
                                },
                                dialectOptions: {
                                    options: {
                                    encrypt: true // 如果你的数据库启用了SSL加密，设置为true
                                    }
                                }
                            });
    
        await sequelize.authenticate();
        const User = sequelize.define("user", {
            name: Sequelize.DataTypes.TEXT,
            favoriteColor: {
                type: Sequelize.DataTypes.TEXT,
                defaultValue: 'green'
            },
            sex: Sequelize.DataTypes.TEXT
          });
        const jane = User.build({ name: "Jane" , sex:'男'});
        await jane.save();

        console.log('Connection has been established successfully.');
    }catch(e){
        console.log(e)
    }
```

文档 sequelize 连接sql [server服务的简单封装](https://blog.csdn.net/foren_whb/article/details/102499363)


### jwt jsonwebtoken

https://github.com/auth0/node-jsonwebtoken

version 9.0.2

### js文件生成.d.ts文件

全局安装dts-gen

如下会在 enterprise.js同级文件夹下生成enterprise.d.ts
```bash
dts-gen --expression-file enterprise.js
```







