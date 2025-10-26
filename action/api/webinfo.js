let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
class webInfo extends baseApi{
    async run(){
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        let data = await enterpriseInstance.webinfo();
        if(data.length===0){
            return this.error('未找到企业信息');
        }
        return context.toJSON(data[0]);
    }
}
module.exports = webInfo;