let paramProps = {
    sort:{
        type:'string',
        default:'id'
    },
    order:{
        type:'string',
        default:'desc'
    },
    offset:{
        type:'number',
        default:0
    },
    limit:{
        type:'number',
        default:20
    }
}
module.exports = async(context,app,param,setup)=>{
    //显示
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    context.body.data.news_categories_all = await enterpriseInstance.news_categories_son({id:0}); 
    if(context.isAjax){
        //删除
        if(context.post.delid){
            let deleteArr = context.post.delid.split(',');
            let delIdArr = [];
            deleteArr.forEach(id=>{
                delIdArr.push({
                    id:id,
                    domain_id:context.session.get('user').domain_id
                })
            });
            app.tables.friendlink.delete(delIdArr);
            return context.toSTRING('删除成功');
        }else{
        //列表
            let condition = '';
            let params = {};
            let offset = param.offset;
            let limit = param.limit;
            let data = await enterpriseInstance.friendlink_list(
                condition
                ,params
                ,offset
                ,limit);
            return context.toJSON(data);
        }
    }
    return context.render('/view/admin/friendlink_list.ejs',context.body.data);
}