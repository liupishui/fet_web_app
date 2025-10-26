module.exports = async function(context,app,param){
    if(!context.isAjax){
        return context.toJSON({
            "code": 0,
            "type": "ERROR",
            "message": "请求方式不对"
          })
    }
    return context.toJSON({
        "timeStamp": "131313131",
        "nonceStr": "fsafafa",
        "package": "prepay_id=1631616",
        "signType": "MD5",
        "paySign": "fasfsafafdasfa"
      });
}