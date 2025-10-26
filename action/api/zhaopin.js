let baseApi = require('./baseApi');
let enterprise = require('../../utils/enterprise');
class zhaopin extends baseApi {
    async run(){
        await super.run();
        let enterpriseInstance = new enterprise(this.context,this.app);
        return this.context.toJSON(await enterpriseInstance.zhaopin_list_server());
    }
}
module.exports = zhaopin;