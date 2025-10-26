module.exports = {
    tsNode: true,//需要安装 ts-node 模块
    main: "/index.ts",
    staticPath: ['/favicon.ico', '/public/', '/static/'], //静态目录 相对于/view/目录
    defaultPage: ['index.html'],
    useTheme: true,
    themeExcludePath: ['/admin', '/6080', '/api_doc', '/public', '/aktools'],//当useTheme为true时,以数组内路径开头的请求不渲染主题
    gzip: true,//是否对静态文件开启gzip压缩
    ws: true,  //是否开启websocket服务
    rewrite: [ //重定向伪静态设置
        {
            type: 'Redirect',
            path: '^/index.html$',
            target: '/',
            redirectType:"Permanent"
        },
        {
            type: "Rewrite",
            path: "^/newslist_([0-9]+)_([0-9]+).html$",
            target: "/newslist.ejs?type=${1}&page=${2}"
        },
        {
            type: 'Rewrite',
            path: '^/newslist.html$',
            target: '/newslist.ejs?type=1&page=1',
            redirectType: "Permanent"
        },
        {
            type: "Rewrite",
            path: "^/news_article_([0-9]+).html$",
            target: "/news_detail.ejs?id=${1}"
        },
        // {
        //     type:'Rewrite',
        //     path:'^/products/([0-9]+)/([0-9]+)$',
        //     target:'/products/?type=${1}&id=${2}',
        // },
        // {
        //     type:'Redirect',
        //     path:'^/products/([0-9]+)/$',
        //     target:'https://www.baidu.com/${1}',
        //     redirectType:"Found"
        // },
        // {
        //     type:'Redirect',
        //     path:'^/products/$',
        //     target:'https://www.baidu.com/',
        //     redirectType:"Permanent"
        // },
        // {
        //     type:'CustomResponse',
        //     path:'^/login$',
        //     statusCode: 200,
        //     statusMessage:"ok"
        // },
        // {
        //     type:'AbortRequest',
        //     path:'^/logins$'
        // }

    ]
}
