module.exports = (context,app,param,setup)=>{
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
        let {username,password,code} = context.post;
        if(code.toLowerCase()!==context.session.get('captcha').toLowerCase()){
            returnMsg.code = '验证码不正确';
            context.session.set('captcha','');
        }else{
            //验证码正确,销毁验证码，再做其他判断
            context.session.set('captcha','');
            //判断用户名
            if(new RegExp(/^[_a-zA-Z0-9]{4,16}$/).test(username)===false){
                returnMsg.username = '4到16位，字母数字下划线';
            }else{
                //查看用户是否已经注册
                let user_registed = app.tables.uni_id_users.get({username:username});
                if(user_registed.length>0){
                    returnMsg.username = '用户名已被注册';
                }
            }
            if(new RegExp(/(?=.*[A-Za-z])(?=.*[$@!%*#.?&])[A-Za-z\d$@!%*#.?&]{6,16}$/).test(password)===false){
                returnMsg.password = '6到16位，包括至少一位字母，一个特殊字符';
            }
        }
        if(returnMsg.username===true && returnMsg.password===true && returnMsg.code===true){
            //全部验证通过,写入数据库
            let crypto = app.require('crypto');
            const hash = crypto.createHash('md5');
            hash.update(password);
            password = hash.digest('hex');
            //密码md5以后存储
            let regRst = app.tables.uni_id_users.add({username:username,password:password});
            let lastInsertRowid_User = regRst.lastInsertRowid;
            //初始化域名
            //默认子域名
            let domianInfo = {
                domain_inside:((lastInsertRowid_User+1234)*3).toString(16),
                user_id:lastInsertRowid_User
            }
            let lastInsertRowid_Domain = app.tables.domain.add(domianInfo).lastInsertRowid;
            //初始化webinfo
            //默认网站信息
            let webInfo = {
                user_id:lastInsertRowid_User,
                domain_id:lastInsertRowid_Domain,
                theme_id:app.tables.theme.get({is_system_theme:1,is_default:1})[0].id
            }
            app.tables.webinfo.add(webInfo);
            return context.toJSON({reg:1});
        }else{
            for(let x in returnMsg){
                if(returnMsg[x]===true){
                    delete returnMsg[x];
                }
            }
            return context.toJSON(returnMsg);
        }
    }
    context.render('/view/register.ejs',context.body.data)
}