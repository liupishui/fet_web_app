let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
let paramProps = {
    cat:{
        type:'number',
        default:2
    },
    page:{
        type:'number',
        default:1
    },
    pageSize:{
        type:"number",
        default:20
    }
}

class caseList extends baseApi{
    async run(){
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        //判断是否新闻下的分类，如果不是则返回[]，如果是返回对应数据
        setup(paramProps);
        let categories = await enterpriseInstance.news_categories_son({id:2});
        if(param.cat===2 || categories.filter((item)=>{return item.id === param.cat}).length>0){
            let data = await enterpriseInstance.news_articles_list_server(param.cat,param.pageSize);
            return context.toJSON(data);
        }else{
            return context.toJSON({data:{},page:"",pageData:{}});
        };     
    }
}
module.exports = caseList;