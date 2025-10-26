//挂载数据库的方法
// app.sqlite默认为default.db的betterSqlite3的实例
// 加载其他sqlite3数据库用 app.sqlite.DB('databasename');
const path = require('path');
const fs = require('fs');
let tables = require('./tables');
async function db_sqlite(context,app){
        if(typeof(app.sqlite)==='undefined'){
            let dbPath = app.serverPath+'/db/';
            if(!fs.existsSync(dbPath)){
                fs.mkdirSync(dbPath,{ recursive: true });
            }
            app.sqlite = new app.lib['better-sqlite3']()(dbPath+'/default.db');
            app.sqlite.dbEntry = {};
            app.sqlite.dbEntry['default'] = app.sqlite;
            app.sqlite.dbEntry['default'].pragma('journal_mode = WAL');
            app.sqlite.dbEntry['default'].pragma('cache_size = -8192');
            app.sqlite.dbEntry['default'].pragma('synchronous = FULL');
            app.sqlite.dbEntry['default'].tables = tables(app.sqlite.dbEntry['default']);
            app.tables = app.sqlite.dbEntry['default'].tables;
           // app.sqlite.dbEntry['default'].prepare(`pragma timezone='local'`).run();
            app.sqlite.DB = function(options_input){
                let options_default={
                    DB : dbPath+'/default.db',
                };
                if(typeof(options_input)==='string'){
                    if(app.sqlite.dbEntry[options_input]){
                        return app.sqlite.dbEntry[options_input];
                    }else{
                        options_default.DB = dbPath + options_input +'.db'
                    }
                }
                if(typeof(options_input)==='object'){
                    options_default = {...options_default,...options_input};
                }
                //判断数据库是否存在，如果不存在则添加数据库
                let DB_Name = path.parse(options_default.DB).name;
                if(app.sqlite.dbEntry[DB_Name]){
                    return app.sqlite.dbEntry[DB_Name];
                }
                if(!fs.existsSync(path.parse(options_default.DB).dir)){
                    fs.mkdirSync(path.parse(options_default.DB).dir,{ recursive: true });
                }
                app.sqlite.dbEntry[DB_Name] = new app.lib['better-sqlite3']()(options_default.DB,options_default);
                app.sqlite.dbEntry[DB_Name].pragma('journal_mode = WAL');
                app.sqlite.dbEntry[DB_Name].pragma('cache_size = -8192');
                app.sqlite.dbEntry[DB_Name].pragma('synchronous = FULL');
                app.sqlite.dbEntry[DB_Name].tables = tables(app.sqlite.dbEntry[DB_Name]);
                return app.sqlite.dbEntry[DB_Name];
            }
        }
        //return app.dbEntry['default'];
}
module.exports = db_sqlite;