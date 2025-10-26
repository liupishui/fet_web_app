//模板接口说明https://github.com/imfht/maccms/blob/master/%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E6%96%87%E6%A1%A3/API%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E.txt
//https://www.uedbox.com/post/65027/#google_vignette
/**
 * The function `geturl` is an asynchronous function that retrieves data from a given URL and caches
 * the response using an LRU cache.
 * @param context - The context parameter is the execution context of the function. It can be used to
 * access variables and functions defined in the surrounding scope.
 * @param app - The `app` parameter is an object that contains various libraries and resources that the
 * function can use. It is likely a custom application object that is passed to the function.
 * @param url - The `url` parameter is the URL of the resource you want to retrieve. It can be a string
 * representing the URL of a webpage, an API endpoint, or any other resource accessible over the
 * internet.
 * @returns the data obtained from the specified URL if it is available in the cache or fetched from
 * the URL. If there is an error or the data is not available, it returns false.
 */
async function geturl(context, app, url) {
  try {

    if (typeof (app.LRU_6080) === 'undefined') {
      let LRUCache = app.lib['lru-cache']().LRUCache;
      app.LRU_6080 = new LRUCache({
        ttl: 1000 * 60 * 30,//30分钟缓存
        max: 5000
      });
    }
    if (app.LRU_6080.get(url)) {
      return app.LRU_6080.get(url);
    }
    let asiosRst = await app.lib.axios().get(url);

    if (asiosRst && asiosRst.data) {
      app.LRU_6080.set(url, asiosRst.data);
      return asiosRst.data;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
/**
 * The function `parseXML` takes in a context, app, and data parameter, and parses the XML data into a
 * JSON object.
 * @param context - The context parameter is not used in the given code snippet. It is likely intended
 * to be a reference to the current execution context or environment in which the function is being
 * called.
 * @param app - The `app` parameter is an object that contains the application's libraries and
 * resources.
 * @param data - The `data` parameter is the XML data that needs to be parsed.
 * @returns the variable `movieJSON`, which could be either `false` or the parsed XML data in JSON
 * format.
 */
async function parseXML(context, app, data) {
  if (data === false) {
    return false;
  }
  let movieJSON = false;
  app.lib.xml2js().parseString(data, { explicitRoot: false, explicitArray: false }, (err, dataJSON) => {
    if (err) {
      movieJSON = false;
    } else {
      if (dataJSON.list.video) {
        if (typeof (dataJSON.list.video[0]) === 'undefined') {
          dataJSON.list.video = [dataJSON.list.video];
        }
      } else {
        dataJSON.list.video = [];
      }
      movieJSON = dataJSON;
    }

  });
  return movieJSON;
}

/**
 * 获取电影列表
 * @param {string} $url 请求电影资源网接口url地址 
 * @param {number} $t 电影类型
 * @returns {{"$":{"version":"5.1"},"list":{"$":{"page":"1","pagecount":"1724","pagesize":"20","recordcount":"34474"},"video":[{"last":"2023-11-14 23:14:33","id":"49047","tid":"15","name":"即使忘了你","type":"日剧","dt":"ukm3u8","note":"更新至04集"}]},"class":{"ty":[{"_":"电影","$":{"id":"1"}}]}}} 电影列表
*/
s = {
  "a": "s"
}
async function getMovieListByPage(context, app, $url, $page = 1, $t = '') {
  /**
  * 类 名:无
  * 主要功能:根据页码返回该页码影片视频列表信息
  * 作 者:刘丕水
  * 创建日期:2023-11-15 09:47
  * 返回结果示例：
  {
$: {
  version: "5.1",
},
list: {
  $: {
    page: "1",
    pagecount: "1724",
    pagesize: "20",
    recordcount: "34474",
  },
  video: [
    {
      last: "2023-11-14 23:14:33",
      id: "49047",
      tid: "15",
      name: "即使忘了你",
      type: "日剧",
      dt: "ukm3u8",
      note: "更新至04集",
    },
    {
      last: "2023-11-14 23:14:11",
      id: "48852",
      tid: "15",
      name: "持有秘密的少年们",
      type: "日剧",
      dt: "ukm3u8",
      note: "更新至06集",
    },
    {
      last: "2023-11-14 23:13:41",
      id: "49073",
      tid: "21",
      name: "开创者",
      type: "台湾剧",
      dt: "ukm3u8",
      note: "更新至15集",
    },
    {
      last: "2023-11-14 23:12:52",
      id: "48433",
      tid: "15",
      name: "我早就死啦！",
      type: "日剧",
      dt: "ukm3u8",
      note: "更新至05集",
    },
    {
      last: "2023-11-14 23:08:48",
      id: "49290",
      tid: "16",
      name: "海军罪案调查处 悉尼",
      type: "欧美剧",
      dt: "ukm3u8",
      note: "更新至01集",
    },
    {
      last: "2023-11-14 23:06:07",
      id: "49289",
      tid: "16",
      name: "世界尽头的一场谋杀",
      type: "欧美剧",
      dt: "ukm3u8",
      note: "更新至02集",
    },
    {
      last: "2023-11-14 23:04:22",
      id: "49109",
      tid: "22",
      name: "婚礼大捷",
      type: "韩剧",
      dt: "ukm3u8",
      note: "更新至06集",
    },
    {
      last: "2023-11-14 23:03:06",
      id: "48657",
      tid: "22",
      name: "闪烁的西瓜",
      type: "韩剧",
      dt: "ukm3u8",
      note: "更新至16集",
    },
    {
      last: "2023-11-14 20:41:57",
      id: "49159",
      tid: "13",
      name: "风起西州",
      type: "国产剧",
      dt: "ukm3u8",
      note: "更新至19集",
    },
    {
      last: "2023-11-14 20:34:15",
      id: "49110",
      tid: "13",
      name: "宣判",
      type: "国产剧",
      dt: "ukm3u8",
      note: "更新至28集",
    },
    {
      last: "2023-11-14 20:13:34",
      id: "49212",
      tid: "23",
      name: "周三俱乐部",
      type: "泰剧",
      dt: "ukm3u8",
      note: "更新至03集",
    },
    {
      last: "2023-11-14 20:13:07",
      id: "48862",
      tid: "15",
      name: "ONE DAY～平安夜的风波～",
      type: "日剧",
      dt: "ukm3u8",
      note: "更新至06集",
    },
    {
      last: "2023-11-14 20:12:23",
      id: "48947",
      tid: "15",
      name: "税调 ~“缴不了税”是有原因的~",
      type: "日剧",
      dt: "ukm3u8",
      note: "更新至05集",
    },
    {
      last: "2023-11-14 20:11:53",
      id: "49281",
      tid: "13",
      name: "此心安处是吾乡",
      type: "国产剧",
      dt: "ukm3u8",
      note: "更新至06集",
    },
    {
      last: "2023-11-14 20:11:22",
      id: "49288",
      tid: "16",
      name: "诅咒",
      type: "欧美剧",
      dt: "ukm3u8",
      note: "更新至01集",
    },
    {
      last: "2023-11-14 20:10:26",
      id: "49114",
      tid: "16",
      name: "如我之狼 第二季",
      type: "欧美剧",
      dt: "ukm3u8",
      note: "更新至07集",
    },
    {
      last: "2023-11-14 20:09:07",
      id: "49151",
      tid: "13",
      name: "以爱为营",
      type: "国产剧",
      dt: "ukm3u8",
      note: "更新至24集",
    },
    {
      last: "2023-11-14 19:59:14",
      id: "49106",
      tid: "13",
      name: "我要逆风去",
      type: "国产剧",
      dt: "ukm3u8",
      note: "更新至30集",
    },
    {
      last: "2023-11-14 19:58:06",
      id: "49150",
      tid: "13",
      name: "无所畏惧",
      type: "国产剧",
      dt: "ukm3u8",
      note: "更新至28集",
    },
    {
      last: "2023-11-14 19:12:35",
      id: "49219",
      tid: "13",
      name: "宁安如梦",
      type: "国产剧",
      dt: "ukm3u8",
      note: "更新至20集",
    },
  ],
},
class: {
  ty: [
    {
      _: "电影",
      $: {
        id: "1",
      },
    },
    {
      _: "电视剧",
      $: {
        id: "2",
      },
    },
    {
      _: "综艺",
      $: {
        id: "3",
      },
    },
    {
      _: "动漫",
      $: {
        id: "4",
      },
    },
    {
      _: "动作片",
      $: {
        id: "6",
      },
    },
    {
      _: "喜剧片",
      $: {
        id: "7",
      },
    },
    {
      _: "爱情片",
      $: {
        id: "8",
      },
    },
    {
      _: "科幻片",
      $: {
        id: "9",
      },
    },
    {
      _: "恐怖片",
      $: {
        id: "10",
      },
    },
    {
      _: "剧情片",
      $: {
        id: "11",
      },
    },
    {
      _: "战争片",
      $: {
        id: "12",
      },
    },
    {
      _: "国产剧",
      $: {
        id: "13",
      },
    },
    {
      _: "港澳剧",
      $: {
        id: "14",
      },
    },
    {
      _: "日剧",
      $: {
        id: "15",
      },
    },
    {
      _: "欧美剧",
      $: {
        id: "16",
      },
    },
    {
      _: "动漫电影",
      $: {
        id: "20",
      },
    },
    {
      _: "台湾剧",
      $: {
        id: "21",
      },
    },
    {
      _: "韩剧",
      $: {
        id: "22",
      },
    },
    {
      _: "泰剧",
      $: {
        id: "23",
      },
    },
    {
      _: "记录片",
      $: {
        id: "24",
      },
    },
    {
      _: "伦理片",
      $: {
        id: "25",
      },
    },
    {
      _: "短剧",
      $: {
        id: "32",
      },
    },
  ],
},
}
  */
  let data = await context.use(geturl, `${$url}?ac=list${$t !== '' ? '&t=' + $t : ''}&pg=${$page}`);
  let movieJSON = await context.use(parseXML, data);
  return movieJSON;
}
/**
 * 获取电影列表
 * @param {string} $url - 请求电影资源网接口url地址 
 * @returns {{"$":{"version":"5.1"},"list":{"$":{"page":"1","pagecount":"1724","pagesize":"20","recordcount":"34474"},"video":[{"last":"2023-11-14 23:14:33","id":"49047","tid":"15","name":"即使忘了你","type":"日剧","dt":"ukm3u8","note":"更新至04集"}]},"class":{"ty":[{"_":"电影","$":{"id":"1"}}]}}} 电影列表
*/
async function getMovieListByName(context, app, $url, $page = 1, $t = '', $name) {
  //返回$name相关电影列表信息
  let data = await context.use(geturl, `${$url}?wd=${$name}${$t !== '' ? '&t=' + $t : ''}&pg=${$page}`);
  if (typeof (data) == 'object') {
    // let movieJSON = {};
    // movieJSON.$ = {};
    // movieJSON.$.version = "5.1";
    // movieJSON.list={}
    // movieJSON.list.$ = {
    //   page: data.page,
    //   pagecount: data.pagecount,
    //   pagesize: data.limit,
    //   recordcount: data.total,
    // }
    // movieJSON.list.video = [];

    // var b = {
    //   $: {
    //     version: "5.1",
    //   },
    //   list: {
    //     $: {
    //       page: "1",
    //       pagecount: "1724",
    //       pagesize: "20",
    //       recordcount: "34474",
    //     },
    //     video: [
    //       {
    //         last: "2023-11-14 23:14:33",
    //         id: "49047",
    //         tid: "15",
    //         name: "即使忘了你",
    //         type: "日剧",
    //         dt: "ukm3u8",
    //         note: "更新至04集",
    //       },
    //     ],
    //   },
    //   class: {
    //     ty: [
    //       {
    //         _: "电影",
    //         $: {
    //           id: "1",
    //         },
    //       },
    //     ],
    //   },
    // }
    // return movieJSON;
  } else {
    let movieJSON = await context.use(parseXML, data);
    return movieJSON;
  }
}
/**
 * The function `getMovieDetailByIdArray` retrieves movie details based on an array of movie IDs.
 * @param context - The context parameter is an object that contains any additional context or
 * dependencies that the function may need to execute. It could include things like database
 * connections, API clients, or other helper functions.
 * @param app - The app parameter is the application object that is used to access the app's
 * functionalities and resources. It is typically used to make API calls, access databases, or perform
 * other app-specific operations.
 * @param {string} url - The URL of the API endpoint to fetch movie details from.
 * @param {Array} movieIdArray - An array of movie IDs.
 * @param {number} page - The  parameter is used to specify the page number when querying the movie
 * details. It is an optional parameter with a default value of 1.
 * @returns a promise that resolves to a movieJSON object.
 */
async function getMovieDetailByIdArray(context, app, url, movieIdArray, page = 1) {
  //根据影片id数组查询电影信息
  if (movieIdArray.length === 0) {
    return { list: { video: [] } };
  }
  let data = await context.use(geturl, `${url}?ac=videolist&pg=${page}&ids=${movieIdArray.join(',')}`);
  let movieJSON = await context.use(parseXML, data);
  return movieJSON;
}
module.exports = {
  geturl,//请求URL获取数据
  parseXML,//解析xml影视数据为JSON
  getMovieListByPage,//根据页码获取影视列表
  getMovieListByName,//根据影视名字获取影视列表
  getMovieDetailByIdArray,//根据影片id数组获取影视详情

}