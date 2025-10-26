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
    }
}

module.exports = async (context,app,param,setup)=>{
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    //context.body.data.categoryPidInfo
    //context.body.data.categoryPid
    //context.body.data.categorySon
    //context.body.data.news_categories_all
    let isAdmin = await enterpriseInstance.isAdmin();
    if(!isAdmin){
        return context.toSTRING('权限不足');
    }
    if(context.isAjax){
        if(context.post.disabledId){
            //更新禁用状态
            setup(context.post,{
                disabledId:{
                    type:'number',
                    default:-1
                },
                status:{
                    type:'number',
                    default:0
                }
            })
            if(context.post.disabledId<1){
                return context.toSTRING('操作失败');
            }
            context.post.id = context.post.disabledId;
            context.post.disabled = context.post.status==1?0:1;
            let domainInfo = app.tables.domain.get(context.post.id)[0];
            if(domainInfo.domain_inside==='www'){
                return context.toSTRING('此域名为网站根域名禁止禁用');
            }
            app.tables.domain.update(context.post);
            return context.toSTRING('操作成功');
        }else{
        //列表渲染
        let condition = `order by ${param.sort} ${param.order}`;
        //category_idArr
        let data = await enterpriseInstance.domain_list(
                ' domain_inside like @search '+condition
                ,{search:`%${param.search}%`}
                ,param.offset
                ,param.limit
            );
        //获取每条数据对应的用户名
        data.rows.forEach(row=>{
            let user = app.tables.uni_id_users.get(row.user_id)[0];
            row.username = user.username;
        })
        //username
        context.toJSON(data);
        return;

        }
    }
    context.body.data.isAdmin = isAdmin;
    return context.render('/view/admin/domain_list.ejs',context.body.data);
}
