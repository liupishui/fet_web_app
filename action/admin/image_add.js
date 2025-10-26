
let paramProps = {
    categoryPid:{
        type:'number',
        default:5
    },
    modify:{
        type:'number',
        default:-1
    }
}
module.exports = async (context,app,param,setup)=>{
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    context.body.data.modify = param.modify;

    //context.body.data.news_categories_all
    context.body.data.news_categories_all = await enterpriseInstance.news_categories_son({id:param.categoryPid});
    
    //context.body.data.categoryPidInfo
    context.body.data.categoryPidInfo = app.tables.news_categories.get([{id:param.categoryPid,domain_id:context.session.get('user').domain_id},{id:param.categoryPid,is_system:1}])[0];

    //context.body.data.categorySon
    context.body.data.categorySon = context.body.data.news_categories_all;
    if(context.isAjax){
        if(param.modify!==-1){
            let imageModify = await enterpriseInstance.image_get({id:param.modify});
            context.toJSON(imageModify[0]);
            return;
        }
        if(context.post.type === 'Add'){
            let addRst = await enterpriseInstance.image_add(context.post);
            if(addRst){
                return context.toSTRING('添加成功');
            }else{
                return context.toSTRING('添加失败');
            }
        }
        if(context.post.type === 'Update'){
            context.post.id = context.post.modify;  
            await enterpriseInstance.image_modify(context.post);
            context.toSTRING('修改成功')
            return;
        }
    }
    return context.render('/view/admin/image_add.ejs',context.body.data)
}