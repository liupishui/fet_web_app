let table = require('./table_class.js');
module.exports = function(dbEntry){
    //为每一个表建立对应的对象，并使其拥有增删改查方法，方便调用
    let tables = {};//用于存放所有的表对象
    let stmtTable = dbEntry.prepare(`select name from sqlite_master where type='table'`);
    let stmtTableAll = stmtTable.all();
    for (let i = 0; i < stmtTableAll.length; i++) {
        let table_info = dbEntry.prepare(`PRAGMA table_info(${stmtTableAll[i].name})`).all();
        tables[stmtTableAll[i].name] = new table(dbEntry,stmtTableAll[i].name,table_info);
    }
    return tables;
}