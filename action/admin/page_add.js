
let paramProps = {
    modify:{
        type:'number',
        default:-1
    }
}
let enterprise = require('../../utils/enterprise');
module.exports = async (context,app,param,setup)=>{
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    context.body.data.modify = param.modify;
    if(context.isAjax){

        if(param.modify!==-1){
            let PageData = await enterpriseInstance.page_get({id:param.modify});
            context.toJSON(PageData[0]);
        }else{
            if(context.post.type==='pagesUpdate'){
                //修改页面
                await enterpriseInstance.page_update(param,setup);
                context.toSTRING('修改成功');
                
            }else if(context.post.type==='pagesAdd'){
                //添加页面
                await enterpriseInstance.page_add(param,setup);
                context.toSTRING('添加成功');
            }
        }
        return;
    }
    return context.render('/view/admin/page_add.ejs',context.body.data);
}