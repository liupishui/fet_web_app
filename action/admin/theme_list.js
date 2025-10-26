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
    }
}
let enterprise = require('../../utils/enterprise')
module.exports = async (context,app,param,setup)=>{
    let net = require('net');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    //context.body.data.categoryPidInfo
    //context.body.data.categoryPid
    //context.body.data.categorySon
    //context.body.data.news_categories_all
    let isAdmin = await enterpriseInstance.isAdmin();
    if(context.isAjax){
        if(context.post.delid){
            if(!isAdmin){
                return context.toSTRING('权限不足');
            }
            //数据删除
            let deleteArr = context.post.delid.split(',');
            let DelArr = [];
            deleteArr.forEach(item=>{
                DelArr.push({
                    id:item
                })
            });
            //查看主题是否被使用，如果被使用则禁止删除;
            let isInUsedArr = [];
            for(let i=0;i<DelArr.length;i++){
                let inUsedTheme = app.tables.webinfo.get({theme_id:DelArr[i].id});
                let themeInfo = app.tables.theme.get(DelArr[i].id);
                if(themeInfo[0].is_default){
                    return context.toSTRING('当前主题为系统默认主题，请修改系统默认主题后删除.')
                }
                if(inUsedTheme.length > 0){
                    isInUsedArr.push(DelArr[i]);
                };
            }
            if(isInUsedArr.length>0){
                return context.toSTRING('主题被使用中，禁止删除');
            }else{
                app.tables.theme.delete(DelArr.map(function(item){return item.id}));
                return context.toSTRING('删除成功');
            };
        }else if(context.post.setCurrentTheme){
            //设置网站主题
            let postProps = {
                setCurrentTheme:{
                    type:'number',
                    default:-1
                }
            }
            setup(context.post, postProps);
            if(context.post.setCurrentTheme<1){
                return context.toSTRING('设置失败');
            }else{
                //只能添加自己的和系统默认的主题
                //user_id=${context.session.get('user').id} or is_system_theme=1
                let updateThemeInfo = app.tables.theme.get({id:context.post.setCurrentTheme})[0]||{};
                if(updateThemeInfo.is_system_theme==1||updateThemeInfo.user_id==context.session.get('user').id){
                    app.tables.webinfo.update({theme_id:context.post.setCurrentTheme},'user_id='+context.session.get('user').id);
                    return context.toSTRING('设置成功');    
                }else{
                    return context.toSTRING('您没有权限设置此主题');
                }
            }
        }else{
        //列表渲染
        let condition = `order by ${param.sort} ${param.order}`;
        //category_idArr
        let data = await enterpriseInstance.theme_list( 
                ' theme_name like @search '+condition
                ,{search:`%${param.search}%`}
                ,param.offset
                ,param.limit
            );
        //获取所有域名
        //用户的主题id
        let theme_id = app.tables.webinfo.get({user_id:context.session.get('user').id})[0].theme_id;
        let domainInside = app.tables.domain.get(context.session.get('user').domain_id)[0].domain_inside;
        data.rows.forEach(item=>{
            //制作者id
            let makerId = item.user_id;
            //制作者用户名
            item.maker = app.tables.uni_id_users.get({id:makerId})[0].username;
            //是否当前用户正在使用的网站模板
            item.curr_theme = item.id===theme_id ? '是':'否';
            item.domainInside = domainInside;
            if(net.isIP(context.url.hostname)){
                item.previewUrl = context.url.host +'?theme='+item.id;
            }else if (context.url.hostname.indexOf('localhost')===0) {
                item.previewUrl = context.url.host +'?theme='+item.id;
            }else if (context.url.hostname.indexOf('www.')===0) {
                item.previewUrl = domainInside +'.'  + context.url.host.substring(4) +'?theme='+item.id;
            }
            item.host = context.url.host;
        });
        //获取当前主题
        context.toJSON(data);
        return;

        }
    }
    context.body.data.isAdmin = isAdmin;
    return context.render('/view/admin/theme_list.ejs',context.body.data);
}
