// Aktools官网 https://akshare.akfamily.xyz/data/bond/bond.html
// https://aktools.akfamily.xyz/aktools/
// akshare 升级命令 pip install --upgrade akshare

// 快速安装 pip install aktools 升级命令 pip install aktools --upgrade -i https://pypi.org/simple 

// 快速启动 python -m aktools


class aktools {
    constructor(context, app, db) {
        this.context = context;
        this.app = app;
    }
    sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve(true) }, time)
        })
    }
    async db() {
        return await this.app.sqlite.DB('akshare');
    }
    /**
     * 基础接口
     *  @param {string} path api接口路径
     *  @param {{}} param 预查询语句对应的参数
     *  @returns {{"status":200,"statusText":"OK","headers":{},config:{},data:[]}} - status返回状态码 statusText状态值 data返回数据
    **/
    async get(path = '', param = {}) {
        let $axios = this.app.lib.axios();
        $axios.defaults.baseURL = 'http://127.0.0.1:8080/api/public/'
        let baseConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        //随机请求时间，防封
        await this.sleep(1000 + 1000 * Math.random());
        if (arguments.length === 0) {
            return $axios.get('');
        }
        if (arguments.length === 1) {
            return $axios.get(arguments[0], baseConfig)
        }

        if (arguments.length === 2) {
            return $axios.get(arguments[0], Object.assign(baseConfig, {
                params: arguments[1]
            }))
        }
    }

    getChinesePinyin(str) {
        // 拼音声母可能的首字母
        const PINYIN_INITIAL_CONSONANT_LETTERS = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('');
        // 拼音声母对应的边界中文
        const PINYIN_BOUNDARY_CHAR = '驁簿錯鵽樲鰒餜靃攟鬠纙鞪黁漚曝裠鶸蜶籜鶩鑂韻糳'.split('');

        /**
         * 获取拼音首字母（大写）, 如果不是中文，返回原字符
         * 示例
         *  '中文' => 'ZW'
         *  '中文123' => 'ZW123'
         *  'abc' => 'abc'
         */
        if (!str) {
            return '';
        }
        var strArr = str.split(''), strPinyinArr = [];
        for (let i = 0; i < strArr.length; i++) {
            // 判断字符是否为中文,不是中文返回原字符
            if (/[^\u4e00-\u9fa5]/.test(strArr[i])) {
                strPinyinArr.push(strArr[i]);
            } else {
                const index = PINYIN_BOUNDARY_CHAR.findIndex((char) => {
                    return char.localeCompare(strArr[i], 'zh-CN-u-co-pinyin') >= 0;
                });
                if (strArr[i] === '行') {
                    if (str === '任子行' || str === '喜悦智行' || str === '永安行' || str === '行动教育' || str === '三人行' || str === '并行科技') {
                        strPinyinArr.push('X');
                    } else {
                        strPinyinArr.push('H');
                    }
                } else {
                    strPinyinArr.push(PINYIN_INITIAL_CONSONANT_LETTERS[index]);
                }
            }
        }
        return strPinyinArr.join('');
    }
    /**
     * 获取股票所属市场标识
     *         沪市主板
        600：沪市主板股票。
        601：沪市主板股票。
        603：沪市主板股票。
        605：沪市主板股票。
        深市主板
        000：深市主板股票。
        001：深市主板股票。
        002：深市中小板股票（已并入深市主板）。
        003：深市主板股票（新开板的深市主板）。
        创业板
        300：创业板股票。
        301：创业板股票。
        科创板
        688：科创板股票。
        689：科创板股票（实际上，689并不是一个标准的股票代码前缀，可能是误写或特殊情况）。
        新三板
        430：新三板基础层股票。
        830：新三板基础层股票。
        831：新三板基础层股票。
        832：新三板基础层股票。
        833：新三板基础层股票。
        834：新三板基础层股票。
        835：新三板基础层股票。
        836：新三板基础层股票。
        837：新三板基础层股票。
        838：新三板基础层股票。
        839：新三板基础层股票。
        870：新三板创新层股票。
        871：新三板创新层股票。
        872：新三板创新层股票。
        873：新三板创新层股票。
        874：新三板创新层股票。
        875：新三板创新层股票。
        876：新三板创新层股票。
        877：新三板创新层股票。
        878：新三板创新层股票。
        879：新三板创新层股票。
        其他
        920：B股（上海）。

        沪市主板：股票代码以600、601或603开头。

        深市主板：股票代码以000、001、002、003开头。

        创业板：股票代码以300开头，隶属于深交所。

        科创板：股票代码以688开头，隶属于上交所。

        北交所：股票代码以8开头。

        新三板：股票代码以400、430、830开头，属于场外市场，新三板企业被称为挂牌而非上市。
     * **/
    getStockFlag(stockCode) {
        if (stockCode === '') {
            return false;
        }
        var str = stockCode.substring(0, 3);
        if (str === '600' || str === '601' || str === '603' || str === '605') {
            return '沪市主板';//sz
        }
        if (str === '000' || str === '001' || str === '002' || str === '003') {
            return '深市主板';//sh
        }
        if (str === '300' || str === '301') {
            return '创业板';
        }
        if (str === '688' || str === '689') {
            return '科创板';//sh
        }
        if (str === '920') {
            return 'B股';
        }
        return '新三板';
    }

    /**
     * 股票行情是否最新日期
     * @param timeString 
     * @returns boolean
     */

    stock_is_last(timeString) {
        let today = new Date().toISOString().split('T')[0];

        if (new Date().getDay() === 6) { // 星期六
            today = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }
        if (new Date().getDay() === 0) { // 星期天
            today = new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }

        return new Date(timeString.indexOf('T') === -1 ? timeString : timeString.split('T')[0]).getTime() == new Date(today).getTime()
    }

    /**
     * 获取更新本地数据库历史行情
     * 
     * **/
    async update_stock_hist() {
        let DB = await this.db();
        let codeName = DB.tables.stock_info_a_code_name.getAll();
        console.log(codeName.length);
        for (let i = 0; i < codeName.length; i++) {
            let dataCurr = DB.tables.hist_daily.get({ code: codeName[i].code });
            let dataDaily = {};
            if (dataCurr.length === 0) {
                try {
                    let dataFetch = await this.stock_zh_a_hist(codeName[i].code);
                    if (dataFetch) {
                        dataDaily.code = codeName[i].code;
                        dataDaily.hist_daily = JSON.stringify(dataFetch);
                        DB.tables.hist_daily.add(dataDaily);
                    }
                    console.log('添加成功:',dataDaily);
                } catch (e) {
                    console.log('err1', e.message,codeName[i]);
                }
            } else {
                try {
                    // 获取当前日期(周六周日定位到本周五)和本地数据库最后一天股票行情日期对比，相同不获取，不相同则重新获取
                    let dataCurrStockHist = JSON.parse(dataCurr[0].hist_daily);
                    if(this.stock_is_last(dataCurrStockHist[dataCurrStockHist.length - 1]['日期'])===false){
                        let dataFetch = await this.stock_zh_a_hist(dataCurr[0].code);
                        dataDaily.code = dataCurr[0].code;
                        dataDaily.hist_daily = JSON.stringify(dataFetch);
                        dataDaily.id = dataCurr[0].id;
                        dataDaily.updated_at = new Date().toLocaleString().replace(/\//g, '-');
                        let rst = DB.tables.hist_daily.update(dataDaily);
                        if (typeof (rst.error) !== 'undefined') {
                            console.log(rst);
                        }
                        console.log('更新成功:', dataCurr[0]);
                    }else{
                        console.log('无需更新:', dataCurr[0]);
                    }
                } catch (e) {
                    console.log('err2',e.message, dataCurr[0]);
                }
            }
            // try{
            //     if(dataCurr.hist_daily == null){
            //         if(new Date(dataCurr.updated_at).toDateString()!==new Date().toDateString()){
            //             let data = await this.stock_zh_a_hist(dataCurr.code);
            //             if(data){
            //                 dataCurr.hist_daily = JSON.stringify(data);
            //                 dataCurr.updated_at = new Date().toLocaleString().replace(/\//g,'-');
            //                 let DB = await this.db();
            //                 DB.tables.stock_info_a_code_name.update(dataCurr);
            //                 data = null;
            //             }

            //         }
            //     }

            // }catch(e){
            //     console.log('err',i,e);
            // }
        }
        return true;
    }
    /**
     * 获取实时行情
     * **/
    async stock_zh_a_spot_em() {
        try {
            let data = await this.get('stock_zh_a_spot_em');
            // console.log(data);
            return data.data;
        } catch (e) {
            return [];
        }
    }
    /**
     * 获取股票历史行情数据
     * {"日期":"2007-08-17T00:00:00.000","股票代码":"002158","开盘":10.22,"收盘":6.73,"最高":10.22,"最低":6.47,"成交量":192044,"成交额":703156767.52,"振幅":-441.18,"涨跌幅":891.76,"涨跌额":7.58,"换手率":63.17}
     * **/
    async stock_zh_a_hist(stock_code = '000001', locale = false, period = 'daily', adjust = 'qfq') {
        if (locale === true) {
            let DB = await this.db();
            return DB.tables.hist_daily.get({ code: stock_code });
        }
        let data = await this.get('stock_zh_a_hist', { symbol: stock_code, period: period, adjust: adjust });
        if (data.status == 200) {
            return data.data;
        } else {
            return false;
        }
    }
    /**
     * {证券代码: '600133', 证券简称: '东湖高新', 公司全称: '武汉东湖高新集团股份有限公司', 上市日期: '1998-02-12T00:00:00.000'}
     * **/
    async stock_info_sh_name_code() {
        let data = await this.get('stock_info_sh_name_code');
        return data;
    }
    /**
     * {板块: '主板', A股代码: '000516', A股简称: '国际医学', A股上市日期: '1993-08-09', A股总股本: '2,260,382,715', …}
     * **/
    async stock_info_sz_name_code() {
        let data = await this.get('stock_info_sz_name_code');
        return data;
    }
    /**
     * 
报告日期:
'2024-11-21T00:00:00.000'
地区:
'北京市'
流通股本:
121329200
上市日期:
'2023-05-31T00:00:00.000'
所属行业:
'医药制造业'
证券代码:
'430017'
证券简称:
'星昊医药'
总股本:
122577200
     * **/
    async stock_info_bj_name_code() {
        let data = await this.get('stock_info_bj_name_code');
        return data;
    }
    async hist_lastday_update() {
        let DB = await this.db();
        let CodeName = DB.tables.stock_info_a_code_name.getAll();
        for (let i = 0; i < CodeName.length; i++) {
            if (DB.tables.hist_daily.get({ code: CodeName[i].code }).length) {
                // 获取每行的历史行情
                let hist_daily_codeCurr = JSON.parse(DB.tables.hist_daily.get({ code: CodeName[i].code })[0].hist_daily);
                // 获取最后一天行情
                let currHist_daily_Info = hist_daily_codeCurr[hist_daily_codeCurr.length - 1];
                // 从hist_lastday表中获取最后一天历史行情
                let currHist_daily_Info_last = DB.tables.hist_lastday.get({ code: CodeName[i].code });
                // 组装数据
                let hist_lastday_row = {};
                hist_lastday_row['code'] = CodeName[i].code;
                hist_lastday_row['日期'] = currHist_daily_Info['日期'];
                hist_lastday_row['股票代码'] = currHist_daily_Info['股票代码'];
                hist_lastday_row['开盘'] = currHist_daily_Info['开盘'];
                hist_lastday_row['收盘'] = currHist_daily_Info['收盘'];
                hist_lastday_row['最高'] = currHist_daily_Info['最高'];
                hist_lastday_row['最低'] = currHist_daily_Info['最低'];
                hist_lastday_row['成交量'] = currHist_daily_Info['成交量'];
                hist_lastday_row['成交额'] = currHist_daily_Info['成交额'];
                hist_lastday_row['振幅'] = currHist_daily_Info['振幅'];
                hist_lastday_row['涨跌幅'] = currHist_daily_Info['涨跌幅'];
                hist_lastday_row['涨跌额'] = currHist_daily_Info['涨跌额'];
                hist_lastday_row['换手率'] = currHist_daily_Info['换手率'];
                if (currHist_daily_Info_last.length === 0) {
                    //如果没获取到添加
                    DB.tables.hist_lastday.add(hist_lastday_row);
                } else {
                    //如果获取到了，组装数据添加id节点,然后更新数据
                    hist_lastday_row['id'] = currHist_daily_Info_last[0].id;
                    DB.tables.hist_lastday.update(hist_lastday_row);
                }

            } else {
                console.log(CodeName[i]);
            }
        }
        return true;
    }
    /**
     * 基础接口,查询A股代码和名字列表，并将不存在的插入数据库
     * @param {boolean} local 从本地数据库读取
     *  @returns {[{"code": "000004","name": "国华网安","pinyin": "GHWA"}]} - 返回数组
    **/
    async stock_info_a_code_name(local = false) {
        let DB = await this.db();
        if (local === true) {
            // let start=0;
            // const stmt = DB.prepare('SELECT * FROM stock_info_a_code_name');
            // for(const row of stmt.iterate()){
            //     start++;
            // }
            // console.log(start);
            return DB.tables.stock_info_a_code_name.getAll();
        }
        let data = await this.get('stock_info_a_code_name');
        if (data.status == 200) {
            for (let i = 0; i < data.data.length; i++) {
                data.data[i].pinyin = this.getChinesePinyin(data.data[i].name).replace(/\s+/g, '');
                data.data[i].flag = this.getStockFlag(data.data[i].code);
                let codeName = DB.tables.stock_info_a_code_name.get({ code: data.data[i].code });
                if (codeName.length == 0) {
                    DB.tables.stock_info_a_code_name.add(data.data[i]);
                }
            }
            return data.data;
        } else {
            return false;
        }
    }

}
module.exports = aktools;