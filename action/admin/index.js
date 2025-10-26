let enterprise = require('../../utils/enterprise');
module.exports = async function(context,app,param){
    // let {body} = await app.lib.undici().request('http://127.0.0.1:'+app.server.address().port+'/api/news/cat');
    // let data = await body.json();
    // context.toJSON(data);
    context.session.start();
    if(context.isAjax){
        if(context.post.signout==1){
            context.session.remove('user');
            return context.toSTRING('成功退出');
        }
    }
    let enterpriseInstance = new enterprise(context,app);
    // let enterprise = app.utils.enterprise;
    context.body.data.isAdmin = await enterpriseInstance.isAdmin();
    //留言条数
    context.body.data.contactLength = await enterpriseInstance.getContactlength();
    return context.render('/view/admin/index.ejs',context.body.data);
}