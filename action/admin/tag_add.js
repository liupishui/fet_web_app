let paramProps = {
    modify:{
        type:'number',
        default:-1
    },
    categoryPid:{
        type:'number',
        default:0
    }
}
let enterprise = require('../../utils/enterprise');
module.exports = async (context, app, param, setup) => {
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    if (context.isAjax) {
        if(param.modify!==-1){
            //修改信息
            let data = app.tables.tag.get({id:param.modify,domain_id:context.session.get('user').domain_id});
            context.toJSON(data[0]);
        }else{
            if(context.post.type==='tagAdd'){
                //添加
                let rst = app.tables.tag.get({news_categories_id:context.post.news_categories_id,name:context.post.name,domain_id:context.session.get('user').domain_id});
                if (rst.length === 0) {
                    context.post.domain_id = context.session.get('user').domain_id;
                    app.tables.tag.add(context.post);
                    context.toJSON({ "msg": "添加成功" });
                } else {
                    context.toJSON({ "msg": "标签已经存在请勿重复添加" })
                }
            }else if(context.post.type ==='tagUpdate'){
                //修改
                context.post.id = context.post.modify;
                setup(context.post,{id:{type:'number',default:-1}});
                let rst = app.tables.tag.update(context.post,`id=${context.post.id} and domain_id=${context.session.get('user').domain_id}`);
                context.toJSON({ "msg": "修改成功" });
            }
        }
        return;
    }
    //context.body.data.categorySon
    context.body.data.categorySon = await enterpriseInstance.news_categories_son(param.categoryPid);
    
    //context.body.data.modify
    context.body.data.modify = param.modify;

    return context.render('/view/admin/tag_add.ejs', context.body.data);
}