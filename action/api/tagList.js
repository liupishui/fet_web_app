let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
let paramProps = {
    cat:{
        type:"number",
        default:1
    }
}
class tagList extends baseApi{
    async run(){        
        await super.run();
        let {context,app,param,setup} = this;
        setup(paramProps);
        let enterpriseInstance = new enterprise(context,app);
        let domainId = await enterpriseInstance.get_domain_id();
        let categories = await enterpriseInstance.news_categories_son({id:param.cat});
        if(categories.length === 0){
            return context.toJSON([]);
        }else{
            let category_idArr = [param.cat];
            categories.forEach(cate=>{
                category_idArr.push(cate.id);
            })
            let condition = `domain_id=@domain_id and news_categories_id in (SELECT value FROM json_each(@inCategory))`;
            console.log('select * from tag where '+condition);
            console.log({domain_id:domainId,inCategory:category_idArr});
            let data = app.sqlite.prepare('select * from tag where '+condition).all({domain_id:domainId,inCategory:JSON.stringify(category_idArr)});
            context.toJSON(data);
        }
    }
}
module.exports = tagList;