paramProps = {
    modify:{
        type:'number',
        default:-1
    }
}
let fs = require('node:fs');
let path = require('node:path');
module.exports = async (context,app,param,setup)=>{
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    context.body.data.modify = param.modify;
    let isAdmin = await enterpriseInstance.isAdmin();
    //目前只有管理员有权限吧
    if(!isAdmin){
        //如果不是管理员只能修改自己的数据
        //context.body.data = app.tables.domain.get(context.session.get('user').id);
        context.toSTRING('无权限');
    }
    if(param.modify===-1){
        //获取自己的信息
        context.body.data = app.tables.domain.get(context.session.get('user').id)[0];
    }else{
        context.body.data = app.tables.domain.get(param.modify)[0];
    }
    context.body.data.modify = param.modify;
    if(context.isAjax){
        let postProps = {
            modify:{
                type:'number',
                default:-1
            }
        }
        setup(context.post,postProps);
        if(context.post.modify===-1){
           //修改自己的
           if(new RegExp(/^[a-zA-Z0-9]{1,16}$/).test(context.post.domain_inside)===false){
            return context.toSTRING('域名格式不正确');
           }
           //查看子域名和域名是否有重复
           let hasDomain_outside = app.tables.domain.get({domain_outside:context.post.domain_outside});
           if(hasDomain_outside.length>0){
            if(hasDomain_outside[0].user_id!==context.session.get('user').id){
                //如果重复的不是自己的域名信息
                return context.toSTRING('已经包含此站外域名，请更换域名');
            }
           }
           let hasDomain_inside = app.tables.domain.get({domain_inside:context.post.domain_inside});
           if(hasDomain_inside.length>0){
            if(hasDomain_inside[0].user_id!==context.session.get('user').id){
                //如果重复的不是自己的域名信息
                return context.toSTRING('已经包含此站内域名，请更换域名');
            }
           }
           context.post.id = context.session.get('user').id;
           app.tables.domain.update(context.post);
           return context.toSTRING('修改成功');
        }else{
            if(!isAdmin){
                return context.toSTRING('无权限');
            }
            if(new RegExp(/^[a-zA-Z0-9]{1,16}$/).test(context.post.domain_inside)===false){
                return context.toSTRING('域名格式不正确');
               }

               //查看站外域名和站内域名是否有重复
               let hasDomain_outside = app.tables.domain.get({domain_outside:context.post.domain_outside});
               if(hasDomain_outside.length>0){
                if(hasDomain_outside[0].id!==context.post.modify){
                    //如果重复的不是正则修改的域名信息
                    return context.toSTRING('已经包含此站外域名，请更换域名');
                }
               }
               let hasDomain_inside = app.tables.domain.get({domain_inside:context.post.domain_inside});
               if(hasDomain_inside.length>0){
                if(hasDomain_inside[0].id!==context.post.modify){
                    //如果重复的不是正则修改的域名信息
                 return context.toSTRING('已经包含此站内域名，请更换域名');
                }
               }
               context.post.id = context.post.modify;
               app.tables.domain.update(context.post);
               return context.toSTRING('修改成功');
        }    
    }
    return context.render('/view/admin/domain_add.ejs',context.body.data);
}