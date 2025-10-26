let paramProps = {
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
        default:0
    },
    modify:{
        type:'number',
        default:-1
    }
}
let enterprise = require('../../utils/enterprise')
module.exports = async (context,app,param,setup)=>{
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    let news_categories_all = await enterpriseInstance.news_categories_son({ id: 0 });
    let categoryPidInfo = {};
    let categoryPid = 0;
    news_categories_all.forEach((item)=>{
        if(item.name.indexOf('招聘城市')===0){
            categoryPidInfo = item;
            categoryPid = item.id;
        }
    })
    context.body.data.modify = param.modify;
    context.body.data.categoryPidInfo = categoryPidInfo;
    context.body.data.categorySon = app.utils.tree.subtree(news_categories_all,categoryPid,0);
    if(context.isAjax){
        if(typeof(context.post.sort)==='undefined'){
            context.post.sort = 99;
        }
        if(context.post.type === 'zhaopinAdd'){
            context.post.domain_id = context.session.get('user').domain_id;
            app.tables.zhaopin.add(context.post);
            context.toSTRING('插入成功')
            return;
        }
        if(context.post.type === 'zhaopinUpdate'){
            let postProps = {
                id:{
                    type:'number',
                    default:-1
                }
            }
            setup(context.post,postProps);
            context.post.id = context.post.modify;
            app.tables.zhaopin.update(context.post,`id=${context.post.id} and domain_id=${context.session.get('user').domain_id}`);
            context.toSTRING('修改成功');
            return;
        }
        if(param.modify!==-1){
            let zhaopin_Curr = app.tables.zhaopin.get({id:param.modify,domain_id:context.session.get('user').domain_id});
            context.toJSON(zhaopin_Curr[0]);
            return;
        }
    }
    return context.render('/view/admin/zhaopin_add.ejs',context.body.data);
    
}