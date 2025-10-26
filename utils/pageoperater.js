class serverPage{
    constructor(context,app,options) {
        //初始化参数
            this.pageSize = 10;
            this.parameterName = 'page';
            this.rowSize = 0;//总记录条数
            this.listNum=8;//页码个数
            this.sql_query = '';//用于获取数据的sql，排除limit以外的部分
            this.sql_count = '';//用于统计记录条数的sql，select count(*) as count from xx_table
            this.sql_param = {};//用于better_sqlite3的prepare预查寻语句后的参数
            this.config = {
                'header':"个记录",
                "prev":"上一页", 
                "next":"下一页", 
                "first":"首 页", 
                "last":"尾 页"
            }
            if(typeof(options.url)==='undefined'){
                options.url = context.url.toString();
            }
            this.url = context.url.parse(options.url);
            this.context = context,this.app = app,this.setup = app.setup;
            if(options.pageSize){
                this.pageSize = options.pageSize;
            }
            if(options.parameterName){
                this.parameterName = options.parameterName;
            }
            if(options.sql_query){
                this.sql_query = options.sql_query;
                if(typeof(options.sql_count)==='undefined'){
                    throw new Error('sql_count,统计记录条数的sql不能为空');
                }
                if(typeof(options.sql_param)==='undefined'){
                    throw new Error('sql_param,prepare预查寻语句需要的参数不能为空');
                }   
                this.sql_count = options.sql_count;
                this.sql_param = options.sql_param;
                //获取总记录条数
                try{
                    let countRst = app.sqlite.prepare(this.sql_count).all(this.sql_param);
                    this.rowSize = countRst[0]['count(*)']
                }catch(e){
                    this.rowSize = 0;
                }
                if(typeof(this.rowSize)==='undefined'){
                    this.rowSize = 0;
                }
            }
            if(options.rowSize){
                this.rowSize = options.rowSize;
            }
        
    }
    pageTotal(){
        return Math.ceil(this.rowSize/this.pageSize);
    }
    pageCurrent(){
        //获取当前页码
        var queryDefault = {};
        queryDefault[this.parameterName] = {
            type:'number',
            default:1
        }
        let url = this.url.parse(this.url.toString());
        this.setup(url.query, queryDefault);
        //pageCurrent不能超过总页数
        if(url.query[this.parameterName] < 1){
            url.query[this.parameterName] = 1;
        }
        if(url.query[this.parameterName] > this.pageTotal()){
            url.query[this.parameterName] = this.pageTotal();
        }

        return url.query[this.parameterName];

    }
    getDataList(){
        //获取当前页数据
        if(this.sql_query===''||typeof(this.sql_param)!=='object'){
            return [];
        }
        try{
            return this.app.sqlite.prepare(this.sql_query + ` limit ${this.pageSize*(this.pageCurrent()-1)},${this.pageSize}`).all(this.sql_param);
        }catch(e){
            return [];
        }
    }
    getDynamicHtml($htmlArray=[3,4,5,6,7]){
        //获取动态分页HTML代码,此处url.pathname必须为映射后的路径（防止/products/2/3,这样映射为/products/?t=2），如果想用原始url模板，请用getStaticHtml
        let $url = this.url.pathname;
        $url += '?';
        for(let $key in this.url.query){
            if($key != this.parameterName){
                $url += $key +'=' + this.url.query[$key] +'&';
            }
        }
        $url += this.parameterName + '={page}';
        return this.getHTML($htmlArray,$url);

    }
    getStaticHtml($htmlArray=[3,4,5,6,7],$url="/{page}.html"){
        //获取静态分页HTML代码
        return this.getHTML($htmlArray,$url);
    }
    getHTML($display=[0,1,2,3,4,5,6,7,8],$url="/{page}.html"){
        //获取动态分页HTML代码
        let that  = this;
        if(that.rowSize===0){
            return '';
        }

        var displayFunctions = {
            "0":function(){
                return `共有<b>${that.rowSize}</b>${that.config.header}`;
            },
            "1":function(){
                if(that.pageTotal() === that.pageCurrent()){
                    return `每页显示<b>${that.pageSize}</b>条，本页<b>${that.rowSize - that.pageSize * (that.pageCurrent()-1)}</b>条`;
                }
                return `每页显示<b>${that.pageSize}</b>条，本页<b>${that.pageSize}</b>条`
            },
            "2":function(){
                return `<b>${that.pageCurrent()}/${that.pageTotal()}</b>页`;
            },
            "3":function(){
                if(that.pageTotal()<=that.listNum || that.pageCurrent()<=that.listNum){
                    return '';
                }
                return `<a href='${$url.replace(/\{page\}/,'1')}' class='page_first'>${that.config["first"]}</a>`;
            },
            "4":function(){
                if(that.pageCurrent()===1||that.pageTotal()===0){
                    return '';
                }
                return `<a href='${$url.replace(/\{page\}/,that.pageCurrent()-1)}'>${that.config["prev"]}</a>`;
            },
            "5":function(){
                let inum=Math.floor(that.listNum/2);
                if(that.pageCurrent()<inum+1){// 4之前
                    //12345678 789/只显示listNum之前的
                    let rstHtml = '';
                    for(let i=0;i<that.listNum;i++){
                        if(i<that.pageTotal()){
                            //i小于总页码
                            if(i+1===that.pageCurrent()){
                                rstHtml += `<span>${i+1}</span>`;
                            }else{
                                rstHtml += `<a href='${$url.replace(/\{page\}/,i+1)}'>${i+1}</a>`;
                            }
                        }
                    }
                    return rstHtml;
                }else if(that.pageCurrent() > (that.pageTotal() - inum) ){
                    //4之后
                    //起始位置
                    let startPage = that.pageTotal() - that.listNum + 1;
                    let rstHtml='';
                    for(let i = 0; i < that.listNum; i++){
                        if(startPage > 0){
                            if(startPage === that.pageCurrent()){
                                //如果是当前页码
                                rstHtml += `<span>${startPage}</span>`;
                            }else{
                                rstHtml += `<a href='${$url.replace(/\{page\}/,startPage)}'>${startPage}</a>`
                            }
                        }
                        startPage++;
                    }
                    return rstHtml;
                }else{
                    //12345 {345 6 789} 10 11 12
                    let rstHtml='';
                    for(let i=0; i<that.listNum; i++){
                        let pageNum = that.pageCurrent() - (inum-i);
                        if(pageNum === that.pageCurrent()){
                            rstHtml += `<span>${pageNum}</span>`;
                        }else{
                            rstHtml += `<a href='${$url.replace(/\{page\}/,pageNum)}'>${pageNum}</a>`
                        }
                    }
                    return rstHtml;
                }
            },
            "6":function(){
                if(that.pageCurrent() === that.pageTotal()){
                    return '';
                }
                return `<a href='${$url.replace(/\{page\}/,that.pageCurrent()+1)}'>${that.config["next"]}</a>`;
            },
            "7":function(){
                if(that.pageCurrent() === that.pageTotal()){
                    return '';
                }
                return `<a href='${$url.replace(/\{page\}/,that.pageTotal())}'>${that.config["last"]}</a>`;
            },
            "8":function(){
                if(that.pageTotal()===0){
                    return '';
                }
                return `<input type="text" onkeydown="javascript:if(event.keyCode==13){var page=(this.value>${that.pageTotal()})?${that.pageTotal()}:this.value;location='${$url}'.replace('{page}',page)}" value="${that.pageCurrent()}" style="width:25px"><input type="button" value="GO" onclick="javascript:var page=(this.previousSibling.value>${that.pageTotal()})?${that.pageTotal()}:this.previousSibling.value;location='${$url}'.replace('{page}',page)">`
            }
        }
        return $display.map(function(item){
            return displayFunctions[item]();
        }).join('');

    }
    getPageData(){
        return {
            pageSize:this.pageSize,
            parameterName:this.parameterName,
            rowSize:this.rowSize,
            pageCurrent:this.pageCurrent()
        }
    }
}
// function serverPage(context,app,options){
//     this.context = context;
//     this.app = app;
//     if(options.pageSize){
//         this.pageSize = options.pageSize;
//     }
//     if(options.parameterName){
//         this.parameterName = options.parameterName;
//     }
//     if(options.sql_query){
//         this.sql_query = options.sql_query;
//         if(typeof(options.sql_count)==='undefined'){
//             throw new Error('sql_count,统计记录条数的sql不能为空');
//         }
//         if(typeof(options.sql_param)==='undefined'){
//             throw new Error('sql_param,prepare预查寻语句需要的参数不能为空');
//         }   
//         this.sql_count = options.sql_count;
//         this.sql_param = options.sql_param;
//         //获取总记录条数
//         try{
//             let countRst = app.sqlite.prepare(this.sql_count).all(this.sql_param);
//             this.rowSize = countRst[0]['count']
//         }catch(e){
//             this.rowSize = 0;
//         }
//         if(typeof(this.rowSize)==='undefined'){
//             this.rowSize = 0;
//         }
//     }
//     if(options.rowSize){
//         this.rowSize = options.rowSize;
//     }
// }

// //初始化参数
// serverPage.prototype.pageSize = 10;
// serverPage.prototype.parameterName = 'page';
// serverPage.prototype.rowSize = 0;//总记录条数
// serverPage.prototype.listNum=8;//页码个数
// serverPage.prototype.sql_query = '';//用于获取数据的sql，排除limit以外的部分
// serverPage.prototype.sql_count = '';//用于统计记录条数的sql，select count(*) as count from xx_table
// serverPage.prototype.sql_param = {};//用于better_sqlite3的prepare预查寻语句后的参数
// serverPage.prototype.config = {
//     'header':"个记录",
//     "prev":"上一页", 
//     "next":"下一页", 
//     "first":"首 页", 
//     "last":"尾 页"
// }
// serverPage.prototype.pageTotal = function(){
//     return Math.ceil(this.rowSize/this.pageSize);
// }
// serverPage.prototype.pageCurrent = function(){
//     //获取当前页码
//     var queryDefault = {};
//     queryDefault[this.parameterName] = {
//         type:'number',
//         default:1
//     }
//     //this.app.setup(this.context.url.query, queryDefault);
//     //pageCurrent不能超过总页数
//     if(this.context.url.query[this.parameterName] < 1){
//         this.context.url.query[this.parameterName] = 1;
//     }
//     if(this.context.url.query[this.parameterName] > this.pageTotal()){
//         this.context.url.query[this.parameterName] = this.pageTotal();
//     }

//     return this.context.url.query[this.parameterName];
// }
// serverPage.prototype.getDataList = function(){
//     //获取当前页数据
//     if(this.sql_query===''||typeof(this.sql_param)!=='object'){
//         return [];
//     }
//     try{
//         return this.app.sqlite.prepare(this.sql_query + ` limit ${this.pageSize*(this.pageCurrent()-1)},${this.pageSize}`).all(this.sql_param);
//     }catch(e){
//         return [];
//     }
// }
// serverPage.prototype.getDynamicHtml = function($htmlArray=[3,4,5,6,7]){
//     //获取动态分页HTML代码,此处url.pathname必须为映射后的路径（防止/products/2/3,这样映射为/products/?t=2），如果想用原始url模板，请用getStaticHtml
//     let $url = this.context.url.pathname;
//     $url += '?';
//     for(let $key in this.context.url.query){
//         if($key != this.parameterName){
//             $url += $key +'=' + this.context.url.query[$key] +'&';
//         }
//     }
//     $url += this.parameterName + '={page}';
//     return this.getHTML($htmlArray,$url);
// }
// serverPage.prototype.getStaticHtml = function($htmlArray=[3,4,5,6,7],$url="/{page}.html"){
//     //获取静态分页HTML代码
//     return this.getHTML($htmlArray,$url);
// }
// serverPage.prototype.getHTML = function($display=[0,1,2,3,4,5,6,7,8],$url="/{page}.html"){
//     //获取动态分页HTML代码
//     let that  = this;
//     if(that.rowSize===0){
//         return '';
//     }

//     var displayFunctions = {
//         "0":function(){
//             return `共有<b>${that.rowSize}</b>${that.config.header}`;
//         },
//         "1":function(){
//             if(that.pageTotal() === that.pageCurrent()){
//                 return `每页显示<b>${that.pageSize}</b>条，本页<b>${that.rowSize - that.pageSize * (that.pageCurrent()-1)}</b>条`;
//             }
//             return `每页显示<b>${that.pageSize}</b>条，本页<b>${that.pageSize}</b>条`
//         },
//         "2":function(){
//             return `<b>${that.pageCurrent()}/${that.pageTotal()}</b>页`;
//         },
//         "3":function(){
//             if(that.pageTotal()<=that.listNum || that.pageCurrent()<=that.listNum){
//                 return '';
//             }
//             return `<a href='${$url.replace(/\{page\}/,'1')}' class='page_first'>${that.config["first"]}</a>`;
//         },
//         "4":function(){
//             if(that.pageCurrent()===1||that.pageTotal()===0){
//                 return '';
//             }
//             return `<a href='${$url.replace(/\{page\}/,that.pageCurrent()-1)}'>${that.config["prev"]}</a>`;
//         },
//         "5":function(){
//             let inum=Math.floor(that.listNum/2);
//             if(that.pageCurrent()<inum+1){// 4之前
//                 //12345678 789/只显示listNum之前的
//                 let rstHtml = '';
//                 for(let i=0;i<that.listNum;i++){
//                     if(i<that.pageTotal()){
//                         //i小于总页码
//                         if(i+1===that.pageCurrent()){
//                             rstHtml += `<span>${i+1}</span>`;
//                         }else{
//                             rstHtml += `<a href='${$url.replace(/\{page\}/,i+1)}'>${i+1}</a>`;
//                         }
//                     }
//                 }
//                 return rstHtml;
//             }else if(that.pageCurrent() > (that.pageTotal() - inum) ){
//                 //4之后
//                 //起始位置
//                 let startPage = that.pageTotal() - that.listNum + 1;
//                 let rstHtml='';
//                 for(let i = 0; i < that.listNum; i++){
//                     if(startPage > 0){
//                         if(startPage === that.pageCurrent()){
//                             //如果是当前页码
//                             rstHtml += `<span>${startPage}</span>`;
//                         }else{
//                             rstHtml += `<a href='${$url.replace(/\{page\}/,startPage)}'>${startPage}</a>`
//                         }
//                     }
//                     startPage++;
//                 }
//                 return rstHtml;
//             }else{
//                 //12345 {345 6 789} 10 11 12
//                 let rstHtml='';
//                 for(let i=0; i<that.listNum; i++){
//                     let pageNum = that.pageCurrent() - (inum-i);
//                     if(pageNum === that.pageCurrent()){
//                         rstHtml += `<span>${pageNum}</span>`;
//                     }else{
//                         rstHtml += `<a href='${$url.replace(/\{page\}/,pageNum)}'>${pageNum}</a>`
//                     }
//                 }
//                 return rstHtml;
//             }
//         },
//         "6":function(){
//             if(that.pageCurrent() === that.pageTotal()){
//                 return '';
//             }
//             return `<a href='${$url.replace(/\{page\}/,that.pageCurrent()+1)}'>${that.config["next"]}</a>`;
//         },
//         "7":function(){
//             if(that.pageCurrent() === that.pageTotal()){
//                 return '';
//             }
//             return `<a href='${$url.replace(/\{page\}/,that.pageTotal())}'>${that.config["last"]}</a>`;
//         },
//         "8":function(){
//             if(that.pageTotal()===0){
//                 return '';
//             }
//             return `<input type="text" onkeydown="javascript:if(event.keyCode==13){var page=(this.value>${that.pageTotal()})?${that.pageTotal()}:this.value;location='${$url}'.replace('{page}',page)}" value="${that.pageCurrent()}" style="width:25px"><input type="button" value="GO" onclick="javascript:var page=(this.previousSibling.value>${that.pageTotal()})?${that.pageTotal()}:this.previousSibling.value;location='${$url}'.replace('{page}',page)">`
//         }
//     }
//     return $display.map(function(item){
//         return displayFunctions[item]();
//     }).join('');
// }
module.exports = {
    bootstrap:function(context,app,tablename,condition,param,offset,limit){
        //bootstrap table插件返回数据
        /**
         * param 
         *  tablename 表名
         *  condition 预查询语句
         *  param     预查询语句对应的参数
         *  offset    记录开始位置
         *  limit     查询记录条数
         * return
         *  rows      记录
         *  total     总记录条数
         *  page      总页码
        **/
       // 初始化数据
        let returnData = {
            rows:[],
            total:0,
            page:0
        }
        if(typeof(tablename)!=='string'||tablename===''){
            return returnData;
        }
        if(typeof(app.tables[tablename])==='undefined'){
            return returnData;
        }
        if(isNaN(parseInt(offset))){
            offset=20;
        }else{
            offset = parseInt(offset);
        }
        if(offset<0){
            offset=0;
        }
        if(isNaN(parseInt(limit))){
            limit=20;
        }else{
            limit = parseInt(limit);
        }
        if(limit<1){
            limit = 20;
        }
        //rows 记录
        try{
            if(condition.indexOf('order')===-1){
                if(condition.split('order')[0].replace(/\s+/g,'')===''){
                    condition = '1=1 '+condition;
                }
            }
            let sql = `select * from ${tablename} where ${condition} limit ${offset},${limit}`;
            returnData.rows = app.sqlite.prepare(sql).all(param);
        }catch(e){
            throw e;
        }

        //total 总记录条数
        returnData.total = app.tables[tablename].count(condition,param);
        //page  总页码
        returnData.page = Math.ceil(returnData.total/limit);
        return returnData;
    },
    serverPage:function(context,app,options){
        return new serverPage(context,app,options);
        // // 示例:
        // let pageoprater = await context.use(app.utils.pageoperater.serverPage,
        //     {
        //         sql_query:'select * from banner',
        //         sql_count:'select count(*) as count from banner',
        //         sql_param:{}
        //     });
        // console.log(pageoprater.getDataList());
    }
}