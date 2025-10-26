async function newsArticlesListServer(categoryid = 1,pageSize=10){
    let {context,app,require,setup,param} = this;
    // console.log(param);
    let enterprise = this.require('/utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    let rstData = await enterpriseInstance.news_articles_list_server(categoryid,pageSize);
    return rstData;

}
module.exports = {newsArticlesListServer};