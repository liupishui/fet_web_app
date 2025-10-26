let paramProps = {
    categoryId:{
        type:'number',
        default:56
    },
    modify:{
        type:'number',
        default:-1
    }
}
module.exports = async (context, app, param, setup) => {
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    // let d = new enterprise(context,app);
    // d.test()
    //context.body.data.modify
    context.body.data.modify = param.modify;
    //context.body.data.categorySon
    context.body.data.categorySon = await enterpriseInstance.news_categories_son({id:param.categoryId});
    let domain_id = context.session.get('user').domain_id;
    if(context.isAjax){
        if(param.modify!==-1){
            context.body.data = await enterpriseInstance.banner_get({id:param.modify});
            context.body.data[0]['image_url_org'] = context.body.data[0]['image_url'];
            let imgCroper = app.tables['cropper'].get({image_new:context.body.data[0]['image_url'],domain_id:domain_id,domain_id:context.session.get('user').domain_id},['limit 0,1']);
            if(imgCroper.length>0){
                context.body.data[0]['image_url_org'] = imgCroper[0]['image_org'];
            }
            context.toJSON(context.body.data[0])   
            return;
        }
        if(context.post.type==='bannerAdd'){
            await enterpriseInstance.banner_add(context.post);
            context.toSTRING('添加成功')
            return;
        }
        if(context.post.type==='bannerUpdate'){
            context.post.id = context.post.modify;
            await enterpriseInstance.banner_update();
            context.toSTRING('添加成功');
            return;
        }
    }
    return context.render('/view/admin/banner_add.ejs',context.body.data)
}