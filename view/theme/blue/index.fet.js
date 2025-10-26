async function banner (num=5){
    //banner图
     return this.app.tables.banner.get({domain_id:this.context.theme.domain_id},[`order by id desc,sort asc limit 0,${num}`]);
}
async function hotnews (num=5,categoryid=1){
    //新闻
    let {context,app,param,setup} = this;
    let enterprise = require('../../../utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    let sql = `select * from news_articles where domain_id=@domain_id and category_id in (SELECT value FROM json_each(@inCategory)) order by id desc,sort asc limit 0,${num}`;
    let categorySon = await enterpriseInstance.news_categories_son({id:categoryid});
    let paramQuery = {
        domain_id:context.theme.domain_id,
        inCategory: JSON.stringify(categorySon.map(item=>{return item.id}))
    }
    if(categorySon.length==0){
        return [];
    }
    return app.sqlite.prepare(sql).all(paramQuery);
}
async function newsCategorySubtree (categoryId = 1){
    //获取子分类
    let {context,app,setup,param} = this;
    // console.log(param);
    let enterprise = require('../../../utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    return enterpriseInstance.news_categories_son({id:categoryId});
}
async function newsCategoryFamilytree (categoryId = 1){
    //获取子分类
    let {context,app,setup,param} = this;
    // console.log(param);
    let enterprise = require('../../../utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    return enterpriseInstance.news_categories_familytree({id:categoryId});
}
async function newsArticlesListServer(categoryid = 1,pageSize=10){
    let {context,app,setup,param} = this;
    // console.log(param);
    let enterprise = require('../../../utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    return enterpriseInstance.news_articles_list_server(categoryid,pageSize);

}
module.exports = {banner,hotnews,newsCategorySubtree,newsCategoryFamilytree,newsArticlesListServer};