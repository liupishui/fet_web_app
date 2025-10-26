var paramProps = {
    search:{
        type:'string',
        default:''
    },
    order:{
        type:'string',
        default:'desc'
    },
    sort:{
        type:'string',
        default:'id'
    },
    offset:{
        type:'number',
        default:0
    },
    limit:{
        type:'number',
        default:10
    },
    categoryPid:{
        type:'number',
        default:0
    },
    category_id:{
        type:'number',
        default:-1
    }
}
let enterprise = require('../../utils/enterprise');
module.exports = async (context,app,param,setup)=>{
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    //context.body.data.categoryPidInfo
    //context.body.data.categoryPid
    //context.body.data.categorySon
    //context.body.data.news_categories_all
    let news_categories_all = await enterpriseInstance.news_categories_son({ id: 0 });
    let categoryPidInfo = {};
    let categoryPid = 0;
    news_categories_all.forEach((item)=>{
        if(item.name.indexOf('招聘城市')===0){
            categoryPidInfo = item;
            categoryPid = item.id;
        }
    })
    context.body.data.categoryPid = categoryPid;
    context.body.data.news_categories_all = news_categories_all;
    context.body.data.modify = param.modify;
    context.body.data.categoryPidInfo = categoryPidInfo;
    context.body.data.categorySon = app.utils.tree.subtree(news_categories_all,categoryPid,0);
    if(context.isAjax){
        if(context.post.delid){
            //数据删除
            let deleteArr = context.post.delid.split(',');
            let DelArr = [];
            deleteArr.forEach(item=>{
                DelArr.push({
                    id:item,
                    domain_id:domain_id
                })
            });
            app.tables.zhaopin.delete(DelArr);
            context.toSTRING('删除成功');
        }else{
        //列表渲染
        let condition = '';
        param.sort = param.sort ? param.sort : 'id';
        if (param.sort) {
            condition = condition + 'order by ' + param.sort;
            param.order = param.order ? param.order : 'desc';
            condition = condition + ' ' +param.order;
        }
        //category_idArr
        let category_idArr = [];
        if(param.category_id===-1){
            context.body.data.categorySon.forEach(item=>{
                category_idArr.push(item.id);
            });
        }else{
            category_idArr = [param.category_id]
        }

        let data = await enterpriseInstance.zhaopin_list(
                'category_id in (SELECT value FROM json_each(@inCategory)) and zhiweimiaoshu like @search '+condition
                ,{inCategory:JSON.stringify(category_idArr),search:`%${param.search}%`}
                ,param.offset
                ,param.limit
            );
        context.toJSON(data);
        return;

        }
    }
    return context.render('/view/admin/zhaopin_list.ejs',context.body.data);
}
