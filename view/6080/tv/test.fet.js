const { url } = require('inspector');

async function run(context, app) {
    const http = require('http');
    //http://ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226450/index.m3u8
    const request = app.lib.request();
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
    let puppeteer = app.lib.puppeteer();
    let puppeteerConfig = {};
    // puppeteerConfig = {executablePath:'C:/Users/Administrator/.cache/puppeteer/chrome/win64-126.0.6478.126/chrome-win64/chrome.exe'};
    const browser = await puppeteer.launch(puppeteerConfig);
    async function get_statusCode(url) {
        const dns = require('dns');
        // Set default result order for DNS resolution
        dns.setDefaultResultOrder('verbatim');
        const page = await browser.newPage();
        // Set screen size
        // await page.setViewport({width: 750, height: 1080});
        //await page.setCookie();
        // await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');
        page.setDefaultTimeout(5000);
        try{
            await page.goto(url);
            return 404;    
        }catch(e){
            await page.close();
            return 200;
        }

        // return new Promise((resolve, reject) => {
        //     const dns = require('dns');
        //     // Set default result order for DNS resolution
        //     dns.setDefaultResultOrder('verbatim');

        //     //    const req =  request({
        //     //         uri: url,
        //     //         method: 'HEAD',
        //     //         followAllRedirects: true
        //     //     }, function(error, response, body) {
        //     //         if(error) { 
        //     //             console.error('Error fetching headers:', error);
        //     //             return;
        //     //         }
        //     //         console.log(body)
        //     //         resolve(response.statusCode);
        //     //     });
        //     //     req.on('error', (e) => {
        //     //         reject(e);
        //     //         console.error(`请求遇到问题: ${e.message}`);
        //     //     });
        //     //     req.end();

        //     // const options = {
        //     //     hostname: 'ottrrs.hl.chinamobile.com',
        //     //     port: 80,
        //     //     path: url,
        //     //     method: 'GET'
        //     // };
        //     // const req = http.request(options, (res) => {
        //     //     console.log(`状态码: ${res.statusCode}`);

        //     //     // 获取状态码后立即关闭请求
        //     //     resolve(res.statusCode);
        //     //     req.abort();
        //     // });

        //     // req.on('error', (e) => {
        //     //     reject(e);
        //     //     console.error(`请求遇到问题: ${e.message}`);
        //     // });

        //     // // 写入数据到请求体（如果有）
        //     // // req.write(data);

        //     // 结束请求
        //     // req.end();
        // });

    }
    let urls = [];
   // 4958
    for(let i=4958;i<10000;i++){
        //http://ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226450/index.m3u8
        i=''+i;
        if(i.length==1){
            i = '000'+i;
        }
        if(i.length==2){
            i = '00'+i;
        }
        if(i.length==3){
            i = '0'+i;
        }
        let url = `http://ottrrs.hl.chinamobile.com/PLTV/88888888/224/322122${i}/index.m3u8`;
        //let url = `http://ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226450/index.m3u8`;
        let data =  await get_statusCode(url);
        if(data=='200'){
            console.log(url);
            urls.push(url);
        }
    }
    console.log(urls);
    let fs = require('fs');
    fs.writeFileSync('./1.txt',JSON.stringify(urls));
}
module.exports = { run }