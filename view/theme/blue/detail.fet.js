async function detail(){
    let {context,app,param,setup,require} = this;
    let enterprise = require('/utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    let data = await enterpriseInstance.news_articles_get({id:param.id}); 
    if(data){
        let catNews = await enterpriseInstance.news_categories_son({id:1});
        let isInCatNews = catNews.filter((item)=>{return item.id == data.category_id}).length>0;
        let familyTree = await enterpriseInstance.news_categories_familytree({id:data.category_id});
        data.familyTree = familyTree;
        if(isInCatNews){
            return data;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
async function article_pre(){
    let {context,app,param,setup,require} = this;
    let enterprise = require('/utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    let data = await enterpriseInstance.news_articles_get({id:param.id}); 
    if(data){
        let catNews = await enterpriseInstance.news_categories_son({id:1});
        let isInCatNews = catNews.filter((item)=>{return item.id == data.category_id}).length>0;
        if(isInCatNews){
            let article_pre_data = this.app.tables.news_articles.get({category_id:data.category_id,domain_id:this.context.theme.domain_id},[` id < ${data.id} ORDER BY id DESC limit 0,1 `]);
            return article_pre_data[0];
        }else{
            return false;
        }
    }else{
        return false;
    }

} 
async function article_next(){
    let {context,app,param,setup,require} = this;
    let enterprise = require('../../../utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    let data = await enterpriseInstance.news_articles_get({id:param.id}); 
    if(data){
        let catNews = await enterpriseInstance.news_categories_son({id:1});
        let isInCatNews = catNews.filter((item)=>{return item.id == data.category_id}).length>0;
        if(isInCatNews){
            let article_pre_data = this.app.tables.news_articles.get({category_id:data.category_id,domain_id:this.context.theme.domain_id},[` id > ${data.id} ORDER BY id asc limit 0,1`])
            return article_pre_data[0];
        }else{
            return false;
        }
    }else{
        return false;
    }

} 
//更新新闻浏览量
async function article_view_count_add(articleDetail) {
    //id view_count
    let {context,app,param,setup} = this;
    app.tables.news_articles.update({id:articleDetail.id,view_count:articleDetail.view_count});
}
module.exports = {article_view_count_add,detail,article_pre,article_next}