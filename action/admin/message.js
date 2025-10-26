var paramProps = {
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
let enterprise = require('../../utils/enterprise');
module.exports = async (context, app, param, setup) => {
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps)
    if(context.isAjax){
        let postProps = {
            delid:{
                type:'string',
                default:'-1'
            },
            updateId:{
                type:'number',
                default:-1
            }
        }
        setup(context.post,postProps);
        if(context.post.delid!=='-1'){
        //删除
            let deleteRst = await enterpriseInstance.message_delete(context.post.delid.split(','));
            if(deleteRst > 0){
                return context.toSTRING('删除成功');
            }else{
                return context.toSTRING('删除失败，请重试');
            }
        }else if(context.post.updateId!==-1){
            //设为已读
            await enterpriseInstance.message_readed(context.post.updateId,setup);
            return context.toSTRING('已设为已读');
        }else{
        //查询
            let condition = '',params = {},offset = param.offset,limit = param.limit;
            let data = await enterpriseInstance.message_list(
                 condition
                , params
                , offset
                , limit);
            return context.toJSON(data);
        }
    }
    context.body.data.category = await enterpriseInstance.news_categories_son({id:2});
    return context.render('/view/admin/message.ejs', context.body.data);
}