module.exports = async function(context,app){
    let LRUCache = app.lib['lru-cache']().LRUCache;
        //全局缓存
        app.LRU = new LRUCache({
            ttl: 1,//设置成0是永久生效
            max: 500
        });
        //ejs 缓存问题太多，已禁用。需要缓存的页面单独去做缓存(例如：context.LRU_HREF_PAGE_OPTION = {ttl:1})
}