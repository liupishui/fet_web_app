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
module.exports = async (context, app, param, setup) => {
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    if(context.isAjax){
        let postProps = {
            delCategoryId:{
                type:'number',
                default:-1    
            }
        }
        setup(context.post,postProps);
        if(context.post.delCategoryId !==-1){
            let data = await enterpriseInstance.category_delete(param,setup);
            return context.toSTRING('删除成功');
        }else{
            //列表请求
            let condition = ` order by ${param.sort} ${param.order} `;
            let params = {};
            let offset = param.offset;
            let limit = param.limit;
            let data = await enterpriseInstance.category_list(condition, params, offset, limit);
            data.rows = app.utils.tree.subtree(data.rows,0,0);
            return context.toJSON(data);
        }
    }
    return context.render('/view/admin/category_list.ejs',context.body.data);
}