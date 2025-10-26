let paramProps = {
    search: {
        type: 'string',
        default: ''
    },
    order: {
        type: 'string',
        default: 'desc'
    },
    sort: {
        type: 'string',
        default: 'id'
    },
    offset: {
        type: 'number',
        default: 0
    },
    limit: {
        type: 'number',
        default: 10
    },
    categoryPid: {
        type: 'number',
        default: 56
    },
    category_id: {
        type: 'number',
        default: -1
    }
}
module.exports = async (context, app, param, setup) => {
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    //context.body.data.news_categories_all
    context.body.data.news_categories_all = await enterpriseInstance.news_categories_son({id:param.categoryPid});
    if(context.isAjax){
        context.body.data.categorySon = context.body.data.news_categories_all;
        if(context.post.delid){
            //数据删除
            let deleteArr = context.post.delid.split(',');
            let delArr = [];
            deleteArr.forEach(id=>{
                delArr.push({
                    id:id,
                    domain_id:context.session.get('user').domain_id
                })
            })
            app.tables.banner.delete(deleteArr);
            context.toSTRING('删除成功');
        }else{
            //列表渲染
            let condition = ` order by ${param.sort} ${param.order} `;
            //category_idArr
            let category_idArr = [];
            if(param.category_id===-1){
                context.body.data.categorySon.forEach(item=>{
                    category_idArr.push(item.id);
                });
            }else{
                category_idArr = [param.category_id]
            }

            let data = await enterpriseInstance.banner_list(
                    'category_id in (SELECT value FROM json_each(@inCategory)) and title like @search '+condition
                    ,{inCategory:JSON.stringify(category_idArr),search:`%${param.search}%`}
                    ,param.offset
                    ,param.limit
            );
            context.toJSON(data);

        }
        return;
    }
    return context.render('/view/admin/banner_list.ejs', context.body.data);
}