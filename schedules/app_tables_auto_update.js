module.exports = {
    run: true,
    schedule: function (context, app, config) {
        //每秒更新一次tables信息,数据库有修改自动更新app.tables,无须重启服务器
        // 更新global.d.ts
        let tables = require(app.serverPath + '/core/app_init/db/sqlite/tables.js');
        let updateTables = async function () {
            let fs = require('fs'), path = require('path');
            let interfaceDbString = '';
            let dbTableString = '';
            let tableDefault = `{
                `;
            // 读取所有db
            let filesDbDir = fs.readdirSync(app.serverPath + '/db/');
            for (let i = 0; i < filesDbDir.length; i++) {
                if (path.extname(filesDbDir[i]) === '.db') {
                    // console.log(path.parse(filesDbDir[i]).name);
                    if (typeof (app.sqlite.DB[path.parse(filesDbDir[i]).name]) === 'undefined') {
                        Object.defineProperty(app.sqlite.DB, path.parse(filesDbDir[i]).name, {
                            get() {
                                return app.sqlite.DB(path.parse(filesDbDir[i]).name);
                            }
                        })
                    };
                }
            }
            // 更新所有db的table
            for (let i = 0; i < filesDbDir.length; i++) {
                if (path.extname(filesDbDir[i]) === '.db') {
                    // console.log(path.parse(filesDbDir[i]).name);
                    interfaceDbString += `
        ${path.parse(filesDbDir[i]).name}:${path.parse(filesDbDir[i]).name}_db`;
                    let dbTablesStringEach = `
interface ${path.parse(filesDbDir[i]).name}_db extends Database {
    tables: {`;
                    app.sqlite.DB[path.parse(filesDbDir[i]).name].tables = await tables(app.sqlite.dbEntry[path.parse(filesDbDir[i]).name]);
                    for (let tableName in app.sqlite.DB[path.parse(filesDbDir[i]).name].tables) {
                        dbTablesStringEach += `
        ${tableName}:table`;
                    }
                    dbTablesStringEach += `
    }
}
                        `;
                    dbTableString += dbTablesStringEach;

                    if (path.parse(filesDbDir[i]).name === 'default') {
                        app.tables = app.sqlite.dbEntry['default'].tables;
                        for (let tableName in app.tables) {
                            tableDefault += `${tableName}:table
                `;
                        }
                        tableDefault += '}';
                    }
                }
            }
            let updateDBdts = `
import type { Database } from 'better-sqlite3';
interface db_base extends Database {
    tables:{
        [key:string]:table
    }
}
${dbTableString}
interface fetSqlite extends Database {
    /*** 数据库名字或者better-sqlite3配置项options ***/
    DB: {
        (dbname?: string | { [key: string]: any }): db_base;${interfaceDbString}
    // 动态添加属性
    };
    dbEntry: { [key: string]: fetSqlite };
    tables: ${tableDefault};
    [key: string]: fetSqlite;
}
export = fetSqlite;
            `
            let updateDBdtsOrg = fs.readFileSync(app.serverPath + '/db/index.d.ts', 'utf-8');
            if (updateDBdtsOrg != updateDBdts) {
                fs.writeFileSync(app.serverPath + '/db/index.d.ts', updateDBdts);
            }
            let tableDefaultTxt = `interface defaultTables${tableDefault}
            export = defaultTables`
            let tableDefaultTxtOrg = fs.readFileSync(app.serverPath + '/db/default_tables.d.ts', 'utf-8');
            if (tableDefaultTxtOrg != tableDefaultTxt) {
                fs.writeFileSync(app.serverPath + '/db/default_tables.d.ts', tableDefaultTxt);
            }

        }


        let schedule = app.lib['node-schedule']();
        let rule = new schedule.RecurrenceRule();
        rule.second = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
        let job = schedule.scheduleJob(rule, function () {
            updateTables();
        });
        job.invoke();//立刻执行一次
        return job;
    }
}