let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
class contactList extends baseApi{
    async run(){
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        let data = await enterpriseInstance.contact_list_server();
        if(data.length===0){
            this.error('没有留言');
        }
        return context.toJSON(data);
    }
}
module.exports = contactList;