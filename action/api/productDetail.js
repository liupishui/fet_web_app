let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
class productDetail extends baseApi{
    async run(){        
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        let data = await enterpriseInstance.news_articles_get({id:param.id}); 
        //let newsDetail = app.tables.news_articles.get({domain_id:this.get_domain_id(),id:param.id});
        // newsDetail.category = app.tables.category.get({category_id});
        if(data){
            let catProduct = await enterpriseInstance.news_categories_son({id:3});
            let isInCatProduct = catProduct.filter((item)=>{return item.id == data.category_id}).length>0;
            if(isInCatProduct){
                return context.toJSON(data);
            }else{
                return this.error('没有查询到记录');
            }
        }else{
            return this.error('没有查询到记录');
        }
    }
}
module.exports = productDetail;