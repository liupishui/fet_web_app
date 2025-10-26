let paramProps = {
    categoryPid:{
        type:'number',
        default:1
    },
    modify:{
        type:'number',
        default:0
    }
}
module.exports = async (context, app, param,setup) => {
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    setup(paramProps);
    context.body.data.modifyId = param.modify;
    if(context.isAjax){
        if(context.post.type && context.post.type ==='articleAdd'){
           let rst =  await enterpriseInstance.news_articles_add(param);
            //app.tables.news_articles.add(context.post);
            context.res.write('提交成功');   
            return; 
        }
        if(context.post.type && context.post.type === 'articleUpdate'){
            context.body.data.modifyId = context.post.modify;
            let rst = await enterpriseInstance.news_articles_update({id:context.post.modify});
            if(rst){
                context.res.write('修改成功');
            }else{
                context.res.write('修改失败，请重试');
            }
            return;
        }
        if(param.modify){//获取修改内容
            let $news_articles_Curr = await enterpriseInstance.news_articles_get({id:param.modify});
            context.toJSON($news_articles_Curr);
            return;
            //console.log($news_articles_Curr);
        }
    }
    let news_categories_all = await enterpriseInstance.news_categories_son({ id: 0 });

    //当前分类id
    context.body.data.categoryPid = param.categoryPid || 1;

    //当前分类信息
    context.body.data.categoryPidInfo = news_categories_all.filter((item) => {
        return item.id === (param.categoryPid || 1);
    })[0];

    //当前分类下子分类
    context.body.data.categorySon = app.utils.tree.subtree(news_categories_all, param.categoryPid || 1, 0);
    
    //当前分类下所有的标签
    context.body.data.tags = await enterpriseInstance.news_categories_tag({categoryPid:param.categoryPid || 1});
    return context.render('/view/admin/news_add.ejs',context.body.data);
}