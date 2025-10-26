module.exports = function(ctx,app,param){
        if(ctx.isAjax===false){
            return ctx.render('/view/install.ejs');
        }else{
            let user = app.tables.uni_id_users.get({id:1});
            if(user[0].password==null){
                user[0].password = ctx.post.password;
                app.tables.uni_id_users.update(user[0]);
                return ctx.toJSON(200,{ok:1});
            }else{
                return ctx.toJSON(200,{ok:0});
            }
        }
    }