let paramProps = postProps =
{
    "user_id": { "type": "number", "default": -1 },
    "domain_inset": { "type": "string", "default": "" },
    "title": { "type": "string", "default": "" },
    "companyname": { "type": "string", "default": "" },
    "keywords": { "type": "string", "default": "" },
    "description": { "type": "string", "default": "" },
    "footer_company_brief": { "type": "string", "default": "" },
    "idea": { "type": "string", "default": "" },
    "code_statistics": { "type": "string", "default": "" },
    "map_card": { "type": "string", "default": "" },
    "contact_person": { "type": "string", "default": "" },
    "contact_mobile": { "type": "string", "default": "" },
    "contact_fax": { "type": "string", "default": "" },
    "contact_email": { "type": "string", "default": "" },
    "contact_address": { "type": "string", "default": "" },
    "contact_point": { "type": "string", "default": "" },
    "contact_qrcode": { "type": "string", "default": "" },
    "contact_qq": { "type": "string", "default": "" },
    "icp_num": { "type": "string", "default": "" },
    "icp_link": { "type": "string", "default": "" },
    "favicon": { "type": "string", "default": "" },
    "logo_src": { "type": "string", "default": "" },
    "logo_big_src": { "type": "string", "default": "" },
    "logo_src_mobile": { "type": "string", "default": "" },
    "icon": { "type": "string", "default": "" },
    "theme_id": { "type": "number", "default": 1 },
    "company1": { "type": "string", "default": "" },
    "tel1": { "type": "string", "default": "" },
    "email1": { "type": "string", "default": "" },
    "address1": { "type": "string", "default": "" },
    "map1": { "type": "string", "default": "" },
    "company2": { "type": "string", "default": "" },
    "tel2": { "type": "string", "default": "" },
    "email2": { "type": "string", "default": "" },
    "address2": { "type": "string", "default": "" },
    "map2": { "type": "string", "default": "" },
    "company3": { "type": "string", "default": "" },
    "tel3": { "type": "string", "default": "" },
    "email3": { "type": "string", "default": "" },
    "address3": { "type": "string", "default": "" },
    "map3": { "type": "string", "default": "" },
}
module.exports = (context, app, param, setup) => {
    let webInfo = app.tables.webinfo.get({user_id:context.session.get('user').id});
    let webinfoCurrent = {};
    if(webInfo.length > 0){
        webinfoCurrent = webInfo[0];
    }
    setup(webinfoCurrent,paramProps);
    context.body.data.webinfoCurrent = webinfoCurrent;
    if(context.isAjax){
        //获取用户webinfo信息
        context.post.user_id = context.session.get('user').id;
        //查询子域名是否已经注册，已经注册不允许插入或者更新
        // if(context.post.domain_inset!==''){
        //     if(/[^a-z0-9]/.test(context.post.domain_inset)){
        //         return context.toSTRING('域名格式不正确');
        //     }
        //     let domain_inset = app.tables.domain.get({domain_inset:context.post.domain_inset});
        //     if(domain_inset.length>0){
        //         return context.toSTRING('域名已经存在，请更换');
        //     }else{
        //         app.tables.update({domain_inset:context.post.domain_inset},`id=${context.session.get('user').domain_id}`);
        //     }
        // }
        //
        //更新信息，没有的字段不能插入默认值，否则会将默认值写入数据库
        setup(context.post,postProps,false);
        //更新
        context.post.id = webInfo[0].id;
        app.tables.webinfo.update(context.post,`id=${context.post.id} and domain_id=${context.session.get('user').domain_id}`);
        return context.toSTRING('更新信息成功');
    }
    return context.render('/view/admin/webinfo.ejs', context.body.data);
}