module.exports = async function(ctx,app,config){
    let urlNow = ctx.url.parse();
    urlNow.query.xinbie='女';
    let str = urlNow.toString();
    ctx.res.write('ff');
    try{
       let users=  app.tables.user.getAll();
       ctx.res.write(JSON.stringify(users));
    }catch(e){
        throw e;
    }
}