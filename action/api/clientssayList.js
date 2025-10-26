let baseApi = require('./baseApi');
const enterprise = require('../../utils/enterprise');
class clientssayList extends baseApi{
    async run(){
        await super.run();
        let {context,app,param,setup} = this;
        let enterpriseInstance = new enterprise(context,app);
        let domainId = await enterpriseInstance.get_domain_id();
        let data = app.tables.clientssay.query('domain_id='+domainId); 
        context.toJSON(data);
    }
}
module.exports = clientssayList;