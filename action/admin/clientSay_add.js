paramProps = {
    modify:{
        type:'number',
        default:-1
    }
}
module.exports = (context,app,param,setup)=>{
    setup(paramProps);
    context.body.data.modify = param.modify;
    context.body.data.clientssayModify={};
    if(param.modify!==-1){
        context.body.data.clientssayModify = app.tables.clientssay.get({id:param.modify,domain_id:context.session.get('user').domain_id})[0];
    }
    if(context.isAjax){
        let postProps = {
            modify:{
                type:'number',
                default:-1
            }
        }
        setup(context.post,postProps);
        if(context.post.modify===-1){
            //添加
            context.post.domain_id = context.session.get('user').domain_id;
            app.tables.clientssay.add(context.post);
            return context.toSTRING(1);
        }else{
            context.post.id=context.post.modify;
            setup(context.post,{id:{type:'number',default:-1}});
            app.tables.clientssay.update(context.post,`id=${context.post.id} and domain_id=${context.session.get('user').domain_id}`)
            return context.toSTRING(1);
            //修改
        }    
    }
    return context.render('/view/admin/clientSay_add.ejs',context.body.data);
}