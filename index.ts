async function run(context:Context,app:App){
    let core = app.require(__dirname + '/core/index.js');
    context.runtime = Date.now();
    try{
        return await context.use(core);
    }catch(e){
        throw e;
    }
}
module.exports = run;



