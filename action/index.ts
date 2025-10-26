module.exports = async function(context:Context,app:App,param:any){
    // context.cookie.remove('name');
    // ctx.res.write(ctx.cookie.get('name')||'333');
    // let data = await fetch('http://www.baidu.com');
    // console.log(await data.text())  
    // context.log(context.theme)
    //return context.toJSON(package);
    // let undici = app.lib.undici();
    // let data = await undici.fetch('https://photocq.photo.store.qq.com/psc?/780e3dd9-f413-4d3c-ab8b-9663a58c5d43/6nq6jQHsek7pw2Cz7Val6E4340xChUaNB86x*J4rcEBLtQLZON3KjHICj9gMO0TN7BBzudvS3oigFgtL3pLDqZGl079YlRK1yCTkTGMHDS8!/b&bo=ngL2AQAAAAABBEg!&rf=viewer_4')
    // let bufferData = await data.arrayBuffer();
    // require('fs').writeFileSync('./1.jpg',Buffer.from(bufferData));
    // console.log(bufferData);
    
    // let Sequelize = app.lib.sequelize();
    // try{
    //     let dialectModulePath = app.lib.sqlite3().currentModulePathDir();
    //     const sequelize = new Sequelize({
    //         dialect: 'sqlite',
    //         dialectModulePath:dialectModulePath,
    //         // 指定数据库文件路径
    //         storage: app.serverPath + '/db/test.db'
    //         // 其他可选配置...
    //       });
    
    //     await sequelize.authenticate();
    //     const User = sequelize.define("user", {
    //         name: Sequelize.DataTypes.TEXT,
    //         favoriteColor: {
    //             type: Sequelize.DataTypes.TEXT,
    //             defaultValue: 'green'
    //         },
    //         sex: Sequelize.DataTypes.TEXT
    //       });
    //     const jane = User.build({ name: "Jane" , sex:'男'});
    //     await jane.save();

    //     console.log('Connection has been established successfully.');
    // }catch(e){
    //     console.log(e)
    // }
    let path = require('node:path');
    // app.tables.domain.count();
    // let fetSqliteEnstance : fetSqlite = app.sqlite.DB.default.article.;
    // app.sqlite.DB('douyin');
    // if(typeof(param.data)=='undefined'){
    //     return context.toSTRING('缺少参数');
    // }
    // let dataSend = JSON.parse(param.data);
    // let record = app.sqlite.DB('douyin').tables.douyin1.get({link:dataSend.link});
    // if(record.length){
    //     app.sqlite.DB('douyin').tables.douyin1.update(dataSend,{id:record[0].id});
    // }else{
    //     app.sqlite.DB('douyin').tables.douyin1.add(JSON.parse(param.data));
    // }
    // return context.toSTRING(1);
    if(app.webconfig.useTheme){
        let extname = path.extname(context.theme.entry_page);
        if(extname==='.ejs'){
            return context.renderTheme(context.theme.entry_page,context.body.data);    
        }else{
            let fs = require('node:fs');
            return context.toHTML(fs.readFileSync(context.theme.theme_real_path + '/' + context.theme.entry_page));    
        }    
    }else{
        let mod = app.lib.less();
        let packageInfo = mod.package();    
        return context.toJSON(packageInfo);
    }
}
