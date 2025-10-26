module.exports = async function(context,app,param){
    return context.res.write(context.sessionId);
}