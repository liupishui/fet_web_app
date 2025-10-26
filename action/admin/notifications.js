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
    setup(paramProps)
    let enterpriseInstance = new enterprise(context, app);
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
            await enterpriseInstance.contact_delete(context.post.delid.split(','));
            return context.toSTRING('删除成功');
        }else if(context.post.updateId!==-1){
            //设为已读
            await enterpriseInstance.contact_readed(context.post.updateId,setup);
            return context.toSTRING('已设为已读');
        }else{
        //查询
            let condition = '',params = {},offset = param.offset,limit = param.limit;
            let data = await enterpriseInstance.contact_list(
                 condition
                , params
                , offset
                , limit);
            return context.toJSON(data);
        }
    }
    return context.render('/view/admin/notifications.ejs', context.body.data);
}