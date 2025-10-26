let paramProps={
    modify:{
        type:'number',
        default:-1
    }
}
module.exports = async (context,app,param,setup)=>{
    setup(paramProps);
    context.body.data.modify = param.modify;
    if(context.isAjax){
        //修改数据获取 
        if(param.modify!==-1){
            let data  = app.tables.friendlink.get({id:param.modify,domain_id:context.session.get('user').domain_id})[0];
            data.image_url_org = data.img;
            let croperOrg = app.tables.cropper.get({image_new:data.img,domain_id:context.session.get('user').domain_id});
            if(croperOrg.length){
                data.image_url_org = croperOrg[0].image_org;
            }
            return context.toJSON(data);
        }else{
            let postProps = {
                modify:{
                    type:'number',
                    default:0
                },
                img:{
                    type:'string',
                    default:''
                },
                name:{
                    type:'string',
                    default:''
                },
                link:{
                    type:'string',
                    default:''
                },
                sort:{
                    type:'number',
                    default:99
                }
            }
            if(context.post.type==='Add'){
                setup(context.post,postProps);
                delete context.post.id;
                context.post.domain_id = context.session.get('user').domain_id;
                app.tables.friendlink.add(context.post);
                return context.toSTRING('添加成功');
            }else{
                setup(context.post,postProps);
                context.post.id = context.post.modify;
                setup(context.post,{id:{type:'number',default:-1}});
                app.tables.friendlink.update(context.post,`id=${context.post.id} and domain_id=${context.session.get('user').domain_id}`);
                return context.toSTRING('修改成功');
            }
        }
    }
    return context.render('/view/admin/friendlink_add.ejs',context.body.data);
}