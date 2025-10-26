let paramProps = {
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
    let enterpriseInstance = new enterprise(context,app);
    setup(paramProps);
    //context.body.data.category
    context.body.data.categorySon = await enterpriseInstance.news_categories_son({id:0});
    context.body.data.categoryAll = await enterpriseInstance.news_categories_son({id:0});
    if(context.isAjax){
        if(context.post.delid){
            //数据删除
            let deleteArr = context.post.delid.split(',');
            //如果有和文章对应关系的标签，提示先删除对应关系，再删除标签
            let tag_relationship_ids = [];
            let delArr = [];
            deleteArr.forEach(deleteId=>{
                let tag_relationship = app.tables['tag_relationship'].get({id:deleteId,domain_id:context.session.get('user').domain_id},['limit 0,1']);
                if(tag_relationship.length>0){
                    tag_relationship_ids.push(tag_relationship[0].news_articles_id);
                }
                delArr.push({
                    id:deleteId,
                    domain_id:context.session.get('user').domain_id
                });
            });
            if(tag_relationship_ids.length>0){
                return context.toSTRING('请先删除文章或者案例下id为'+ tag_relationship_ids.join(',') +'的相关内容');
            }
            app.tables.tag.delete(delArr);
            return context.toSTRING('删除成功');
        }else{
            //列表渲染
            let condition = ` order by ${param.sort} ${param.order} `;
            //category_idArr
            let category_idArr = [];
            if(param.category_id===-1){
                context.body.data.categorySon.forEach(item=>{
                    category_idArr.push(item.id);
                });
            }else{
                context.body.data.categorySon = await enterpriseInstance.news_categories_son({id:param.category_id});
                context.body.data.categorySon.forEach(item=>{
                    category_idArr.push(item.id);
                });
                category_idArr.push(param.category_id);
            }
            let data = await enterpriseInstance.tag_list(
                    'news_categories_id in (SELECT value FROM json_each(@inCategory)) and name like @search '+condition
                    ,{inCategory:JSON.stringify(category_idArr),search:`%${param.search}%`}
                    ,param.offset
                    ,param.limit
                );

                data.rows.forEach(item=>{
                    let news_categories = '';
                    let family = app.utils.tree.familytree(context.body.data.categoryAll,item.news_categories_id);
                    family.forEach(itemEach=>{
                        news_categories += '->' + itemEach.name;
                    })
                    item.news_categories=news_categories.substr(2);
                })
            context.toJSON(data);
        }
        return;

    }
    return context.render('/view/admin/tag_list.ejs',context.body.data)
}