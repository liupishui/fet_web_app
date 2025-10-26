class table {
    constructor(dbEntry, tablename, table_info) {
        this.table_info = table_info, this.tablename = tablename, this.dbEntry = dbEntry;
    }
    add(insertDataArr) {
        try {
            if (insertDataArr instanceof Array === false) {
                insertDataArr = [insertDataArr];
            }
            if (insertDataArr.length === 0) {
                return { changes: 0, lastInsertRowid: -1 }
            }
            let firstInsertData = insertDataArr[0];
            let canInsertField = []; //获取可插入字段
            for (let i = 0; i < this.table_info.length; i++) {
                if (typeof (firstInsertData[this.table_info[i].name]) !== 'undefined') {
                    canInsertField.push(this.table_info[i].name);
                }
            }

            // 准备INSERT INTO语句
            let insertSql = `INSERT INTO ${this.tablename} (${canInsertField.join(', ')}) VALUES (${canInsertField.map((f) => '@' + f).join(', ')})`
            const stmt = this.dbEntry.prepare(insertSql);

            // 开始事务处理
            let result = {
                changes: 0,
                lastInsertRowid: -1
            };
            const transaction = this.dbEntry.transaction(() => {
                for (let i = 0; i < insertDataArr.length; i++) {
                    let resultCurr = stmt.run(insertDataArr[i]);
                    result.changes += resultCurr.changes;
                    result.lastInsertRowid = resultCurr.lastInsertRowid;
                }
            });
            transaction();
            return result;
        } catch (e) {
            return {
                changes: 0,
                lastInsertRowid: -1,
                error: e
            };
        }

    }
    update(updateDataArr, conditionString) {
        try {
            if (updateDataArr instanceof Array === false) {
                updateDataArr = [updateDataArr];
            }
            //获取可更新字段
            let firstUpdateData = updateDataArr[0];
            if (typeof (conditionString) === 'undefined' && typeof (firstUpdateData.id) === 'undefined') {
                //如果跟新条件或者没有id则不继续执行
                throw new Error('更新条件为空，且id也不存在');
            }
            let canUpdateField = [];
            for (let i = 0; i < this.table_info.length; i++) {
                if (typeof (firstUpdateData[this.table_info[i].name]) !== 'undefined') {
                    if (this.table_info[i].name !== 'id') {
                        canUpdateField.push(this.table_info[i].name);
                    }
                }
            }

            //准备 UPDATE 语句
            let updateSql = '';
            if (typeof (conditionString)!=='undefined' && typeof (conditionString) !== '') {
                updateSql = `UPDATE ${this.tablename} SET ${canUpdateField.map(f => f + '=@' + f).join(',')} WHERE ` + conditionString;
            } else {
                updateSql = `UPDATE ${this.tablename} SET ${canUpdateField.map(f => f + '=@' + f).join(',')} WHERE id = @id`;
            }
            const stmt = this.dbEntry.prepare(updateSql);

            //开始事务处理
            let result = {
                changes: 0,
                lastInsertRowid: -1
            };
            const transaction = this.dbEntry.transaction(() => {
                for (let i = 0; i < updateDataArr.length; i++) {
                    let resultCurr = stmt.run(updateDataArr[i]);
                    result.changes += resultCurr.changes;
                    result.lastInsertRowid = updateDataArr[i].id || resultCurr.lastInsertRowid;
                }

            });
            transaction();
            return result;
        } catch (e) {
            return {
                changes: 0,
                lastInsertRowid: -1,
                error: e
            }
        }

    }
    get(idArr, orderByLimitArr = [], isAndIdArr = true, isAndOrderByLimitArr = true) {
        if (Array.isArray(orderByLimitArr) === 'false') {
            throw new Error(`${this.tablename}表的get方法的第二个参数必须为数组.`);
        }
        try {
            let isNumberRegExp = new RegExp(/^\d+$/g);
            if ((typeof (idArr) === 'string' && isNumberRegExp.test(idArr)) || typeof (idArr) === 'number') {
                //如果是数组则转化成数组
                idArr = [{ id: idArr }];
            } else if (idArr instanceof Array) {
                if (isNumberRegExp.test(idArr.join(''))) {
                    let idArrTemp = [];
                    for (let i = 0; i < idArr.length; i++) {
                        idArrTemp.push({ id: idArr[i] });
                    }
                    idArr = idArrTemp;
                } else {
                    let idArrTemp = [];
                    for (let j = 0; j < idArr.length; j++) {
                        let modeEach = {};
                        for (let i = 0; i < this.table_info.length; i++) {
                            if (typeof (idArr[j][this.table_info[i].name]) !== 'undefined') {
                                modeEach[this.table_info[i].name] = idArr[j][this.table_info[i].name];
                            }
                        }
                        if (Object.keys(modeEach).length > 0) {
                            idArrTemp.push(modeEach);
                        }
                    }
                    idArr = idArrTemp;
                }
            } else {
                let idArrTemp = [];
                let modeEach = {};
                for (let i = 0; i < this.table_info.length; i++) {
                    if (typeof (idArr[this.table_info[i].name]) !== 'undefined') {
                        modeEach[this.table_info[i].name] = idArr[this.table_info[i].name];
                    }
                }
                if (Object.keys(modeEach).length > 0) {
                    idArrTemp.push(modeEach);
                }
                idArr = idArrTemp;
            };
            if (idArr.length > 0) {
                let getRst = [];
                for (let i = 0; i < idArr.length; i++) {
                    let keys = Object.keys(idArr[i]);
                    //准备SELECT语句
                    let selectSql = `select * from ${this.tablename} where ${keys.map(f => f + '=@' + f).join((isAndIdArr === true ? ' and ' : ' or '))}`;
                    if (orderByLimitArr[i]) {
                        //如果存在
                        if (orderByLimitArr[i].indexOf('>') !== -1 || orderByLimitArr[i].indexOf('<') !== -1) {
                            selectSql += ((isAndOrderByLimitArr === true ? ' and ' : ' or ') + orderByLimitArr[i]);
                        } else {
                            selectSql += ' ' + orderByLimitArr[i];
                        }
                    } else {
                        //如果不存在则返回此条件下最多99条记录
                        selectSql += ' order by id desc limit 0,99';
                    }
                    let stmt = this.dbEntry.prepare(selectSql);
                    let rst = stmt.all(idArr[i]);
                    getRst = [...getRst, ...rst];
                }
                return getRst;
            } else {
                return [];
            }
        } catch (e) {
            // throw new Error(e);
            return [];
        }

    }
    getAll() {
        try {
            let selectSql = `select * from ${this.tablename}`;
            let stmt = this.dbEntry.prepare(selectSql);
            return stmt.all();
        } catch (e) {
            return [];
        }
    }
    delete(id) {
        //支持按单个id删除和按照条件删除,number or Object或者按数组id删除
        let isNumberRegExp = new RegExp(/^\d+$/g);
        try {
            if (Array.isArray(id)) {
                if (isNumberRegExp.test(id[0])) {
                    //如果第一个是数字
                    id = id.map(function (item) { return item - 0 });
                    let deleteSql = `DELETE FROM ${this.tablename} where id in (SELECT value FROM json_each(@deleteidArray))`;
                    let rst = this.dbEntry.prepare(deleteSql).run({ deleteidArray: JSON.stringify(id) });
                    return rst;
                } else {
                    let changes = 0;
                    let lastInsertRowid = 0;
                    for (let i = 0; i < id.length; i++) {
                        let rstDel = this.delete(id[i]);
                        changes += rstDel.changes;
                        lastInsertRowid = rstDel.lastInsertRowid;
                    }
                    //console.log({changes:changes,lastInsertRowid:lastInsertRowid});
                    return { changes: changes, lastInsertRowid: lastInsertRowid }
                }

            }
            let deleteObject = {};
            if (isNumberRegExp.test(id)) {
                deleteObject['id'] = id;
            } else {
                if (id.length === 0) {
                    throw new Error('删除条件不能为空');
                }
                for (let i = 0; i < this.table_info.length; i++) {
                    if (typeof (id[this.table_info[i].name]) !== 'undefined') {
                        deleteObject[this.table_info[i].name] = id[this.table_info[i].name];
                    }
                }
            }
            //准备DELETE语句
            let deleteSql = `DELETE FROM ${this.tablename} WHERE ${Object.keys(deleteObject).map(f => f + '=@' + f).join(' and ')}`;
            let stmt = this.dbEntry.prepare(deleteSql);
            return stmt.run(deleteObject);
        } catch (e) {
            // throw new Error(e);
            return { changes: 0, lastInsertRowid: -1 };
        }
    }
    count(condition = '', param = {}) {
        if (typeof (condition) !== 'string' || condition === '') {
            let countRst = this.dbEntry.prepare(`SELECT COUNT(*) FROM ${this.tablename}`).all();
            return countRst[0]['COUNT(*)'];
        } else {
            try {
                let countRst = this.dbEntry.prepare(`SELECT COUNT(*) FROM ${this.tablename} where ${condition}`).all(param);
                return countRst[0]['COUNT(*)'];
            } catch (e) {
                return 0;
            }
        }
    }
    query(condition, param = {}) {
        try {
            let countRst = this.dbEntry.prepare(`SELECT * FROM ${this.tablename} where ${condition}`).all(param);
            return countRst;
        } catch (e) {
            return [];
        }
    }
    get info() {
        return this.table_info;
    }
    // set info(value){
    //     this.table_info = value; 
    // }
    get name() {
        return this.tablename;
    }
    get db() {
        return this.dbEntry;
    }
}
module.exports = table;