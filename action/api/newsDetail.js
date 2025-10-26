let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
class newsDetail extends baseApi{
    async run(){        
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        let data = await enterpriseInstance.news_articles_get({id:param.id}); 
        if(data){
            let catNews = await enterpriseInstance.news_categories_son({id:1});
            let isInCatNews = catNews.filter((item)=>{return item.id == data.category_id}).length>0;
            if(isInCatNews){
                return context.toJSON(data);
            }else{
                return this.error('没有查询到记录');
            }
        }else{
            return this.error('没有查询到记录');
        }
    }
}
module.exports = newsDetail;