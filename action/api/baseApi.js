let indexClass = require('../../core/indexClass');
class baseApi extends indexClass {
    async run(){
    }
    isLogin(){
        let context = this.context;
        return context.session.get('user')!==null;
    }
    error(message='',code=0){
        return this.context.toJSON(code,{message:message});
    }
    get_domain_id(force=false){
        let context = this.context;
        //获取当前的domain_id，如果用户已经登录且在/admin/路径下的页面或者传入参数force(强制获取),则返回用户的domain_id，否则返回context.theme.domain_id(当前网站的domain_id)
        if((this.isLogin() && context.url.pathname.indexOf('/admin/')===0) || force===true){
            return context.session.get('user').domain_id;
        }
        return context.theme.domain_id;
    }
}
module.exports = baseApi;