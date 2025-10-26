module.exports = async (context,app,param)=>{
    console.log(context.post)
    return context.toJSON(context.post)
}