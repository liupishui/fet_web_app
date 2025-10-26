let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
class friendlinkList extends baseApi{
    async run(){
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        let data = await enterpriseInstance.friendlink_list_server();
        if(data.length===0){
            return this.error('未找到企业信息');
        }
        context.toJSON(data);
    }
}
module.exports = friendlinkList;