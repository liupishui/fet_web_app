var paramProps = {
    platform:{
        type:'number',
        default:-1
    },
    search:{
        type:'string',
        default:''
    },
    order:{
        type:'string',
        default:'desc'
    },
    sort:{
        type:'string',
        default:'id'
    },
    offset:{
        type:'number',
        default:0
    },
    limit:{
        type:'number',
        default:10
    },
    categoryPid:{
        type:'number',
        default:1
    },
    category_id:{
        type:'number',
        default:-1
    }
}
module.exports = async (context, app, param, setup) => {
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context,app);
    setup(paramProps)
    //判断传递过来的父级分类id,默认为1（资讯）,根据父级分类查找所有子分类,然后搜索所有子级分类新闻。
    let categoryPid = param.categoryPid;
    // 当前分类
    context.body.data.categoryPid = categoryPid;
    let domain_id = context.session.get('user').domain_id;
    //获取当前页面分类信息
    context.body.data.categoryPidInfo = app.tables.news_categories.get([{ id: categoryPid,domain_id:domain_id},{id: categoryPid,is_system:1}])[0];
 
    let categoryPidForSearch = categoryPid;
    if (param.category_id !== -1) {
        categoryPidForSearch = param.category_id;
    }
    //获取子孙树
    context.body.data.categorySon = await enterpriseInstance.news_categories_son({id:categoryPidForSearch});
    //获取所有分类
    context.body.data.news_categories_all = await enterpriseInstance.news_categories_son({ id: 0 });

    if (context.isAjax) {
        if(context.post.delid){
            let deleteArr = context.post.delid.split(',');
            let DelArr = [];
            deleteArr.forEach(item=>{
                DelArr.push({
                    id:item,
                    domain_id:domain_id
                })
            });
            //只能删除自己网站下的信息
            app.tables.news_articles.delete(DelArr);
            //删除标签和文章的对应关系
            let delTag_relationship = [];
            deleteArr.forEach(item=>{
                delTag_relationship.push({
                    news_articles_id:item,
                    domain_id:domain_id
                })
            });
            context.res.write('删除成功');
            return;
        }
        let condition = '';
        param.sort = param.sort ? param.sort : 'id';
        if (param.sort) {
            condition = condition + 'order by ' + param.sort;
            param.order = param.order ? param.order : 'desc';
            condition = condition + ' ' +param.order;
        }
        //比较重要的IN查询 https://github.com/WiseLibs/better-sqlite3/issues/283#issuecomment-1044105886
        let category_idArr = [];
        category_idArr.push(categoryPidForSearch);
        context.body.data.categorySon.forEach(cate=>{
            category_idArr.push(cate.id);
        })
        if(param.platform!==-1){
            let data = await enterpriseInstance.news_articles_list('domain_id='+ domain_id +' and category_id in (SELECT value FROM json_each(@inCategory)) and title like @search and platform=@platform '+condition, {inCategory:JSON.stringify(category_idArr),platform:param.platform,search:`%${param.search}%`}, param.offset, param.limit);
            context.toJSON(data);

        }else{
            let data = await enterpriseInstance.news_articles_list('domain_id='+ domain_id +' and category_id in (SELECT value FROM json_each(@inCategory)) and title like @search '+condition, {inCategory:JSON.stringify(category_idArr),search:`%${param.search}%`}, param.offset, param.limit);
            context.toJSON(data);
        }
        return;
    }
    return context.render('/view/admin/news_list.ejs', context.body.data);
}