let baseApi = require('./baseApi');
let enterprise = require('../../utils/enterprise');
let getProps = {
    id:{
        type:'number',
        default:0
    }
}
class imageDetail extends baseApi {
    async run(){
        await super.run();
        let enterpriseInstance = new enterprise(this.context,this.app);
        this.setup(getProps);
        let imageDetail = await enterpriseInstance.image_get(this.param);
        return this.context.toJSON(imageDetail);
    }
}
module.exports = imageDetail;