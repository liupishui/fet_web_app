paramProps = {
    modify:{
        type:'number',
        default:-1
    }
}
let fs = require('node:fs');
let path = require('node:path');
let enterprise = require('../../utils/enterprise');
module.exports = async (context,app,param,setup)=>{
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    context.body.data.modify = param.modify;
    let isAdmin = await enterpriseInstance.isAdmin();
    if(!isAdmin){
        context.toSTRING('无权限');
    }
    context.body.data.modify = param.modify;
    if(param.modify!==-1){
        context.body.data = app.tables.theme.get({id:param.modify})[0];
        context.body.data.modify = param.modify;
    }
    setup(context.body.data, {
        is_system_theme:{
            type:'number',
            default:1
        },
        is_default:{
            type:'number',
            default:0
        },
    });
    let postProps = {
        modify:{
            type:'number',
            default:-1
        },
        is_system_theme:{
            type:'number',
            default:1
        },
        is_default:{
            type:'number',
            default:0
        },
        theme_name:{
            type:'string',
            default:''
        },
        entry_page:{
            type:'string',
            default:'index.ejs'
        },
        poster:{
            type:'string',
            default:''
        },
        theme_server_path:{
            type:'string',
            default:''
        }
    }
    if(context.isAjax){
        setup(context.post,postProps);
        if(context.post.modify===-1){
            //添加
            if(!isAdmin){
                return context.toSTRING('无权限');
            }
            //is_system_theme,is_default,theme_name,poster,theme_server_path
            //判断主题路径是否存在，如果不存在返回提示
            if(fs.existsSync(app.serverPath+context.post.theme_server_path)===false){
                return context.toSTRING('路径不存在')
            }
            if(context.post.theme_server_path.indexOf('/view/')!==0){
                return context.toSTRING('路径不存在')
            }
            context.post.user_id = context.session.get('user').id;
            context.post.theme_view_path = context.post.theme_server_path.substr(5);
            context.post.is_static_server = 0;
            if(context.post.is_default){
                app.tables.theme.update({is_default:0},'1=1');
            }
            app.tables.theme.add(context.post);
            return context.toSTRING(1);
        }else{
            if(!isAdmin){
                return context.toSTRING('无权限');
            }
            //is_system_theme,is_default,theme_name,poster,theme_server_path
            //判断主题路径是否存在，如果不存在返回提示
            if(fs.existsSync(app.serverPath+context.post.theme_server_path)===false){
                return context.toSTRING('路径不存在')
            }
            if(context.post.theme_server_path.indexOf('/view/')!==0){
                return context.toSTRING('路径不存在')
            }
            context.post.user_id = context.session.get('user').id;
            context.post.theme_view_path = context.post.theme_server_path.substr(5);
            context.post.is_static_server = 0;
            if(context.post.is_default){
                app.tables.theme.update({is_default:0},'1=1');
            }
            app.tables.theme.update(context.post,`id=${context.post.modify}`);
            return context.toSTRING(1);
        }    
    }
    return context.render('/view/admin/theme_add.ejs',context.body.data);
}