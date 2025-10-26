// 更新主题
//app的themes节点添加主题
// {
//     domain_inside:{//更多字段看theme表
//         theme_real_path:'d://+server_path+/view/theme/blue/',//主题物理路径
//         theme_server_path:'/veiw/theme/blue/',//主题相对服务器路径
//         theme_view_path:'/theme/blue'//主题相对服务器/view目录的路径
//         theme_name:'blue',
//         is_static_server:false,//是否静态服务器
//         is_system_theme:true, //是否系统内置主题 
//     }
// }
module.exports = {
    run:true,
    schedule:function(context,app,config){
        //每秒更新一次themes信息,数据库有修改自动更新app.themes,无须重启服务器
        let path = require('path');
        let updateThemes = async function(){
            //所有站点的域名和主题信息映射关系
            let domain_theme_map = {};
            let themesMapArr = app.sqlite.prepare(`select domain_id,theme_id from webinfo`).all();
            //获取所有的域名
            let domainArr = app.sqlite.prepare(`select * from domain`).all();
            //获取所有的主题信息
            let themesArr = app.sqlite.prepare(`select * from theme`).all();
            themesMapArr.forEach(domainId_themeId=>{
                //域名id和themeId
                let themeCurr = {};
                let domain_id = domainId_themeId.domain_id;
                let theme_id = domainId_themeId.theme_id;
                themesArr.forEach(theme =>{
                    if(theme.id === theme_id){
                        themeCurr = Object.assign({},theme);
                        //app.serverPath +'/view/template/' + theme.theme+'/'
                        themeCurr.theme_real_path = path.resolve(app.serverPath + theme.theme_server_path);
                        themeCurr.theme_id = theme.id;
                    }
                })
                domainArr.forEach(domain =>{
                    if (domain.id===domain_id) {
                        themeCurr.domain_id = domain.id;
                        themeCurr.domain_disabled = domain.disabled;
                        domain_theme_map[domain.domain_inside] = themeCurr;
                        if(domain.domain_outside!==null){
                            domain_theme_map[domain.domain_outside] = themeCurr;
                        }
                    }
                })
            });
            app.themes = domain_theme_map;            
        }

        let schedule = app.lib['node-schedule']();
        let rule = new schedule.RecurrenceRule();
        rule.second = (function(){
            var arr = [];
            for(let i=0;i<60;i++){
                if(i%4===0){//每4秒执行一次
                    arr.push(i)
                }
            }
            return arr;
        })();
        let job = schedule.scheduleJob(rule, function(){
            updateThemes();
        });
        job.invoke();//立刻执行一次
        return job;
    }
}