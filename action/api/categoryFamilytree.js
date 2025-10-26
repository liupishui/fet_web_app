let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
let paramProps = {
    id:{
        type:'number',
        default:0
    }
}

class categoryFamilytree extends baseApi{
    async run(){
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        //判断是否新闻下的分类，如果不是则返回[]，如果是返回对应数据
        setup(paramProps);
        let categories = await enterpriseInstance.news_categories_familytree({id:param.id});
        return context.toJSON(categories);
    }
}
module.exports = categoryFamilytree;