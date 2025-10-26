module.exports = async (context,app,param)=>{
    //let data = await context.use(app.utils.api6080.geturl,'https://www.baidu.com');
    //https://api.ukuapi.com/api.php/provide/vod/from/ukm3u8/at/xmlsea/
    //根据页码获取某页视频列表
    let api6080 = require('../utils/api6080');
    // let s = api6080.getMovieListByName(context,app,)
    let data = await context.use(api6080.getMovieListByPage,'https://api.ukuapi.com/api.php/provide/vod/from/ukm3u8/at/xmlsea/',1,13);
    // let data = await context.use(app.utils.api6080.getMovieDetailByIdArray,'https://api.ukuapi.com/api.php/provide/vod/from/ukm3u8/at/xmlsea/',[36897],1);
    return context.toJSON(data);
}