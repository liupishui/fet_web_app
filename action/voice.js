let sleep = function(sleepTime){
  return new Promise((resolve,reject)=>{
    setTimeout(() => {
      resolve(true);
    }, sleepTime);
  });
}
module.exports = async (context,app,param)=>{
    let fs = require('fs');
    let savePath = `/public/${context.post.__files.audio.name}`;
    let data = fs.readFileSync(context.post.__files.audio.path);
    fs.appendFileSync(`${app.serverPath}/view/${savePath}`,data);
    let axios = app.lib.axios();
    let res = await axios.post('https://audio.market.alicloudapi.com/audioshort',{src:fs.readFileSync(`${app.serverPath}/view/${savePath}`,'base64'),format:'wav',type:'zh-fast'},{headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', // 设置Content-Type为JSON
      'Authorization': 'APPCODE ec4fe9f47d3a4b268a76645d1472d764' // 设置Authorization头，例如Bearer Token
    }});
    fs.unlinkSync(`${app.serverPath}/view/${savePath}`);
    // 长文本解析
    // let serverDomain = 'http://voice2025.free.idcfengye.com/';
    // let res = await axios.post('https://audio.market.alicloudapi.com/audiolong',{src:`${serverDomain}/savePath`,format:'mp3',type:'zh'},{headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', // 设置Content-Type为JSON
    //   'Authorization': 'APPCODE ec4fe9f47d3a4b268a76645d1472d764' // 设置Authorization头，例如Bearer Token
    // }});
    // await sleep(5000);
      // let resWord = await axios.post('https://audio.market.alicloudapi.com/audioget',{src:res.data.taskid,format:'mp3',type:'zh'},{headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', // 设置Content-Type为JSON
      //   'Authorization': 'APPCODE ec4fe9f47d3a4b268a76645d1472d764' // 设置Authorization头，例如Bearer Token
      // }});
      let rst = {
        word:''
      }
      if(res.data?.msg?.length){
        rst.word = res.data.msg[0];
      }
    return context.toJSON(rst);
}