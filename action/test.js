module.exports = async(context,app,param,setup)=>{
    // let pageoprater = await context.use(app.utils.pageoperater.serverPage,
    //     {
    //         sql_query:'select * from banner',
    //         sql_count:'select count(*) as count from banner',
    //         sql_param:{}
    //     });
    // console.log(pageoprater.getDataList());
    // return context.render('/view/test.ejs');
    // var b = await app.lib.axios().get('https://www.baidu.com');
    // console.log(b.data);
    // var $ = app.lib.cheerio().load(b.data);
    // var g = $("div").text();
    const dns = require('dns');
    // Set default result order for DNS resolution
    dns.setDefaultResultOrder('verbatim');

    let puppeteer = app.lib.puppeteer();
    let puppeteerConfig = {};
    // puppeteerConfig = {executablePath:'C:/Users/Administrator/.cache/puppeteer/chrome/win64-126.0.6478.126/chrome-win64/chrome.exe'};
    const browser = await puppeteer.launch(puppeteerConfig);
    const page = await browser.newPage();
    // Set screen size
    await page.setViewport({width: 750, height: 1080});
    //await page.setCookie();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');
    page.setDefaultTimeout(5000);
    await page.goto('https://author.baidu.com/home/1586036333991397')
    let elAll = await page.$$('.sfi-article-text');
    let imgSrc = '';
    for(let i=0;i< elAll.length;i++){
        let contentCurr = await elAll[i].evaluate(el=>el.innerText);
        if(contentCurr.indexOf('淄博')!=-1){
            imgSrc = await elAll[i].evaluate(el=>el.querySelector('.s-image-wrap .s-image').getAttribute('original'));
        }
    }
    // const textSelector = await page.waitForSelector('div',{timeout:3000});
    // let htmlBody  = await textSelector.evaluate(el=>el.textContent);
    // let pageShotCurr = await page.screenshot();
    // fs.writeFileSync('./body.png',pageShotCurr);
    if(imgSrc.indexOf('http')===0){
        let data = await app.lib.axios().request({
            url:imgSrc,
            responseType:'arraybuffer'
           });
           //fs.writeFileSync('./body.png',data.data);
        //let base64Img = Buffer.from(data.data).toString('base64');
        context.type('png');
        return context.res.write(data.data);
    }else{
        return false;
    }

    //return context.toHTML(g);
}