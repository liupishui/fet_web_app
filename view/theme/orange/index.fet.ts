interface category {
    id:number
}

async function hotnews (num=5,categoryid=1){
    //新闻
    let {context,app} = this;
    let appCurr = app as App;
    let enterprise = require( appCurr.serverPath + '/utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    let sql = `select * from news_articles where domain_id=@domain_id and category_id in (SELECT value FROM json_each(@inCategory)) order by id desc,sort asc limit 0,${num}`;
    let categorySon = await enterpriseInstance.news_categories_son({id:categoryid});
    let inCategoryArr = categorySon.map((item:category)=>{return item.id});
    inCategoryArr.push('20');
    // inCategoryArr = categorySon.map(item=>{return item.id}).push(20);
    let paramQuery = {
        domain_id:context.theme.domain_id,
        inCategory: JSON.stringify(inCategoryArr)
    }
    return app.sqlite.prepare(sql).all(paramQuery);
}
module.exports = {hotnews}