const http = require('http');
//http://ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226450/index.m3u8
const request = require('request');
console.log(request);
// request({
//     uri: 'http://example.com',
//     method: 'HEAD',
//     followAllRedirects: true
// }, function(error, response, body) {
//     if(error) {
//         console.error('Error fetching headers:', error);
//         return;
//     }
 
//     console.log(response.headers);
// });
async function get_statusCode(url){


        return new Promise((resolve,reject)=>{
            const options = {
                hostname: 'ottrrs.hl.chinamobile.com',
                port: 80,
                path: url,
                method: 'GET'
              };
            const req = http.request(options, (res) => {
                console.log(`状态码: ${res.statusCode}`);
            
                // 获取状态码后立即关闭请求
                resolve(res.statusCode);
                req.abort();
            });
            
            req.on('error', (e) => {
                reject(e);
                console.error(`请求遇到问题: ${e.message}`);
            });
       
            // 写入数据到请求体（如果有）
            // req.write(data);
            
            // 结束请求
            req.end();
        });

}
get_statusCode('/PLTV/88888888/224/223/index.m3u8').then(res=>console.log('222',res)).catch(e=>{console.log(333,e)});
 