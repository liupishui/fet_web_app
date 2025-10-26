let baseApi = require('./baseApi');
class banner extends baseApi {
    async run(){
       await super.run();
       let {context,app,param,setup} = this;
    //    var str = app.lib.jsonwebtoken().sign({name:'xiaoli',iat: Math.floor(Date.now() / 1000) + 30},'1234ab..',{algorithm:'HS256'});
    //    console.log(str);
    //    console.log(app.lib.jsonwebtoken().verify(str,'1234ab..'));
    //    console.log(app.lib.jsonwebtoken().decode(str));
    return context.toJSON(app.tables.banner.get({domain_id:this.get_domain_id()}));
   }
}
module.exports = banner;