//https://www.axios-http.cn/docs/multipart
function http(instance){
    let {context,app,param,setup} =  instance;
    let axios = app.lib.axios().create({
        baseURL: `${context.url.protocol}//${context.url.host}/`,
        timeout: 1000,
        Headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        }
      });
    //请求拦截
    axios.interceptors.request.use(request =>{
        if(typeof(request.param)==='undefined'){
            request.params = request.param;
        };
        return request;
    });
    return axios; 
}
module.exports = {
    http
}