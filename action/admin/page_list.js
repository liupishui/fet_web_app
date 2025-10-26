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
    }
}
let enterprise = require('../../utils/enterprise');
module.exports = async (context, app, param, setup) => {
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    // context.body.data.categoryPidInfo
    // context.body.data.categoryPid
    // context.body.data.categorySon
    // context.body.data.news_categories_all

    context.body.data.news_categories_all = await enterpriseInstance.news_categories_son({ id: 0 });
    if(context.isAjax){
        if(context.post.delid){
            //数据删除
            let deleteArr = context.post.delid.split(',');
            let DelArr = [];
            deleteArr.forEach(item=>{
                DelArr.push({
                    id:item,
                    domain_id:domain_id
                })
            });

            app.tables.pages.delete(DelArr);
            context.toSTRING('删除成功');
        }else{
            //列表渲染
            let condition = ` order by ${param.sort} ${param.order} `;
            let data = await enterpriseInstance.pagesList( 
                    ' title like @search '+condition
                    ,{search:`%${param.search}%`}
                    ,param.offset
                    ,param.limit
                );
            context.toJSON(data);
        }
        return;
    }
    return context.render('/view/admin/page_list.ejs', context.body.data);
}