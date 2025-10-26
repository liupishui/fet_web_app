module.exports = async (context,app,param,setup)=>{
    context.session.start();
    context.body.data.error = false;
    if(context.isAjax){
        let returnMsg = {
            username:true,
            password:true,
            code:true
        }
        let postProps = {
            username:{
                type:'string',
                default:''
            },
            password:{
                type:'string',
                default:''
            },
            code:{
                type:'string',
                default:''
            }
        }
        setup(context.post,postProps);
        if(context.session.get('captcha')==null){
            return context.toJSON(0,{message:'验证码过期'})
        }
        if(context.post.code.toLowerCase()!==context.session.get('captcha').toLowerCase()){
            returnMsg.code = '验证码不正确';
            context.session.set('captcha','');
        }else{
            context.session.set('captcha','');
            let crypto = app.require('crypto');
            const hash = crypto.createHash('md5');
            hash.update(context.post.password);
            context.post.password = hash.digest('hex');
            let user = app.tables.uni_id_users.get(context.post);
            if(user.length>0){
                //登录成功
                //获取用户的domain_id,注册完成后domain_id不变
                user[0].domain_id = app.tables.domain.get({user_id:user[0].id})[0].id;
                context.session.set('user',user[0]);
            }else{
                returnMsg.username = '用户名/密码错误';
                returnMsg.password = '用户名/密码错误';
            }    
        }
        if(returnMsg.username===true && returnMsg.password===true && returnMsg.code===true){
            return context.toJSON({is_login:true});
        }else{
            for(let x in returnMsg){
                if(returnMsg[x]===true){
                    delete returnMsg[x];
                }
            }
            return context.toJSON(returnMsg);
        }
    }
    return context.render('/view/login.ejs');
}