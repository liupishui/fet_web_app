let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
class tag extends baseApi{
    async run(){        
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        let data = await enterpriseInstance.tag({id:param.id}); 
        context.toJSON(data);
    }
}
module.exports = tag;