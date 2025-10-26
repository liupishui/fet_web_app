let enterprise = require('../../utils/enterprise')
module.exports = async (context,app,param,setup)=>{
    let enterpriseInstance = new enterprise(context, app);
    if(context.isAjax){
        let enterprise = app.utils.enterprise;
        if(context.post.password){
            if(new RegExp(/(?=.*[A-Za-z])(?=.*[$@!%*#.?&])[A-Za-z\d$@!%*#.?&]{6,16}$/).test(context.post.password)===false){
                return context.toSTRING('密码格式不正确');
            }
            context.post.id = context.session.get('user').id;
            //将密码MD5
            let crypto = app.require('crypto');
            const hash = crypto.createHash('md5');
            hash.update(context.post.password);
            context.post.password = hash.digest('hex');
            app.tables.uni_id_users.update(context.post);
            await enterpriseInstance.signout();
            return context.toSTRING('1');
        }
    }
    return context.render('/view/admin/password_reset.ejs',context.body.data);
}