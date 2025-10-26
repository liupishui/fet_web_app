let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
class contactLeave extends baseApi{
    async run(){
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        let data = await enterpriseInstance.context_add();
        if(data!==true){
            return this.error(data);
        }
        return context.toJSON(data);
    }
}
module.exports = contactLeave;