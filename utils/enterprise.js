class enterprise {
    constructor(context,app) {
        this.context = context;
        this.app = app
    }
    /**
     * 自定义页面列表
     *  @param {string} condition - 预查询语句
     *  @param {string} param - 预查询语句对应的参数
     *  @param {number} offset - 记录开始位置
     *  @param {number} limit - 查询记录条数
     *  @returns {{"rows":[{"id":29,"domain_id":1,"user_id":null,"category_id":23,"title":"1222","keywords":"","description":"","content":"<p>1313</p>","excerpt":null,"article_status":null,"view_count":null,"is_sticky":null,"is_essence":null,"comment_status":null,"comment_count":null,"last_comment_user_id":null,"avatar":null,"publish_date":"2023-08-14 11:01:01","publish_ip":"127.0.0.1","last_modify_date":1691982394316,"last_modify_ip":"127.0.0.1","mode":null,"poster":"/public/fcup_upload/2023_08_14/6fd5225bd53618d88f0433983efe837f.jpg","sort":"93","attached_file_link":"","attached_file_name":"","addtime":"2023-08-14 11:01:01","platform":0}],"total":1,"page":1}} rows记录，total总记录条数,page总页码
    */
    async pagesList (condition, param, offset, limit) {
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()} and ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'pages', condition, param, offset, limit);
        return data;
    }
    /**
    * 轮播图 根据id获取轮播图
    * @param {{id:number}} param - 轮播图片id
    * @returns {[{"id":2,"nav_ids":null,"title":"","sort":99,"description":"","image_url":"/public/fcup_upload/2023_07_24/c211c6446e25f3e6cfc081d40b45f709.jpg","open_type":null,"open_url":"2023","category_id":57,"addtime":"2023-07-24 13:07:12","domain_id":1}]} - 轮播图数组
    */
    async banner_get (param) {
        param.domain_id = await this.get_domain_id();
        return app.tables.banner.get(param);
    }
    /**
    * 网站信息
    * @returns {[{"id":1,"user_id":1,"domain_id":1,"title":"艺堂1","companyname":"艺堂科技有限公司","keywords":"","description":"","footer_company_brief":"","idea":"","code_statistics":"","map_card":"","contact_person":"","contact_mobile":"","contact_fax":"","contact_email":"","contact_address":"","contact_point":"","contact_qrcode":"","contact_qq":"","icp_num":"","icp_link":"","favicon":"","logo_src":"/public/fcup_upload/2024_02_18/89cf76f7a03ed5e11d3ab587b6952586.jpg","logo_big_src":"","logo_src_mobile":"","icon":"","theme_id":1,"addtime":"2023-06-09 05:34:21","company1":"1313","tel1":"","email1":"","address1":"","map1":"","company2":"","tel2":"","email2":"","address2":"","map2":"","company3":"","tel3":"","email3":"","address3":"","map3":""}]} - 网站信息
    */
    async webinfo () {
        let domain_id = await this.get_domain_id();
        return this.app.tables.webinfo.get({domain_id:domain_id});
    }

    /**
    * 添加轮播图
    * @returns {{changes:0,lastInsertRowid:-1}} - 影响的数据行数
    */
    async banner_add () {
        let context = this.context, app = this.app;
        context.post.domain_id = await this.get_domain_id();
        return app.tables.banner.add(context.post);
    }
    
    /**
    * 更新轮播图
    * @returns {{changes:0,lastInsertRowid:-1}} - 影响的数据行数
    */
    async banner_update (){
        let context = this.context, app = this.app;
        return app.tables.banner.update(context.post,`id=${context.post.id} and domain_id=${await this.get_domain_id()}`);
    }

    /**
     * 轮播图列表 
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":2,"nav_ids":null,"title":"","sort":99,"description":"","image_url":"/public/fcup_upload/2023_07_24/c211c6446e25f3e6cfc081d40b45f709.jpg","open_type":null,"open_url":"2023","category_id":57,"addtime":"2023-07-24 13:07:12","domain_id":1}],"total":7,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async banner_list (condition, param, offset, limit) {
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()} and ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'banner', condition, param, offset, limit);
        return data;
    }

    /**
    * 图片墙获取图片信息
    * @param {{id:number}} - 图片id
    * @returns {[{"id":3,"domain_id":1,"title":"","content":"","category_id":31,"src":"/public/fcup_upload/2023_07_20/93f259dcd4c5d64a12478a095ea2be99.png","link":"","sort":"","addtime":"2023-07-24 10:56:50"}]} - 返回对应id图片的详细信息
    */
    async image_get (param) {
        let context = this.context, app = this.app;
        param.domain_id = await this.get_domain_id();
        let imageData = app.tables.image.get(param);
        return imageData;
    }

    /**
    * 图片墙图片修改
    * @param {{}} param context.post
    * @returns {boolean} true修改成功
    */
    async image_modify (param) {
        let context = this.context, app = this.app;
        app.tables.image.update(param,`id=${param.id} and domain_id=${await this.get_domain_id()}`);
        return true;
    }
    
    /**
    * 图片墙添加图片
    * @param {{}} param context.post
    * @returns {boolean} true添加成功
    */
    async image_add (param) {
        let context = this.context, app = this.app;
            param.domain_id = await this.get_domain_id();
        let addRst = app.tables.image.add(param);
        return addRst.changes > 0;
    }
    /**
     * 图片列表
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":2,"domain_id":1,"title":"","content":"","category_id":30,"src":"/public/fcup_upload/2023_07_20/93f259dcd4c5d64a12478a095ea2be99.png","link":"","sort":"","addtime":"2023-07-24 10:56:47"}],"total":6,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async image_list (condition, param, offset, limit) {
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()} and ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'image', condition, param, offset, limit);
        return data;
    }
    /**
     * 图片列表,服务器端分页，用于页面渲染,api接口
     *  @param {number} categrory_id 图片分类，默认5，全部分类
     *  @param {pageSize} pageSize 每页数据条数
     *  @returns {{"data":[{"id":7,"domain_id":1,"title":"","content":"","category_id":31,"src":"/public/fcup_upload/2023_07_20/93f259dcd4c5d64a12478a095ea2be99.png","link":"","sort":"","addtime":"2023-07-24 10:57:07"},{"id":6,"domain_id":1,"title":"","content":"","category_id":29,"src":"/public/fcup_upload/2023_07_20/93f259dcd4c5d64a12478a095ea2be99.png","link":"","sort":"","addtime":"2023-07-24 10:57:02"}],"page":"<span>1</span><a href='/api/imageList?pageSize=2&cat=5&page=2'>2</a><a href='/api/imageList?pageSize=2&cat=5&page=3'>3</a><a href='/api/imageList?pageSize=2&cat=5&page=2'>下一页</a><a href='/api/imageList?pageSize=2&cat=5&page=3'>尾 页</a>","pageData":{"pageSize":2,"parameterName":"page","rowSize":6,"pageCurrent":1}}} - data记录数据 page分页html数据 pageData分页JSON数据
    **/
    async image_list_server (categrory_id, pageSize) {
        // let context = this.context, app = this.app;
        // condition = `domain_id=${await this.get_domain_id()} and ${condition}`;
        // let data = await context.use(app.utils.pageoperater.bootstrap, 'image', condition, param, offset, limit);
        // return data;
        let {context,app} = this;
        if(typeof(categrory_id)==='undefined'){
            return [];
        }
        let categorySon = await this.news_categories_son({id:categrory_id});
        let category_idArr = [categrory_id];
        categorySon.forEach(cate=>{
            category_idArr.push(cate.id);
        })
        let condition = `domain_id=@domain_id and category_id in (SELECT value FROM json_each(@inCategory))`;
        let options = { 
            pageSize:pageSize,
            sql_query:`select * from image where ${condition} order by id desc`,
            sql_count:`select count(*) from image where ${condition}`,
            sql_param:{domain_id:await this.get_domain_id(),inCategory:JSON.stringify(category_idArr)},
        };
        let serverPage = app.utils.pageoperater.serverPage(context,app,options);
        // console.log(data.getDataList());
        let data = serverPage.getDataList();
        let page = serverPage.getDynamicHtml([3,4,5,6,7]);
        let pageData = serverPage.getPageData();
        return {
            data:data,
            page:page,
            pageData:pageData
        }
    
    }

    //招聘相关
    /**
     * 招聘列表
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":6,"domain_id":1,"city":"61","gangwei":"2222","zhaopinrenshu":"212121","zhiweimiaoshu":"21212121","zhiweizhize":"212112","renzhizige":"12122121","fulidaiyu":"122112","email":"liupishui@gmail.com","tel":"5555","addtime":"2023-07-23 20:20:08","category_id":61}],"total":6,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async zhaopin_list (condition, param, offset, limit) {
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()} and ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'zhaopin', condition, param, offset, limit);
        return data;
    }
    /**
     * 招聘列表,全部读出，一个家公司的招聘没有多少条
     *  @returns {[{"id":6,"domain_id":1,"city":"61","gangwei":"2222","zhaopinrenshu":"212121","zhiweimiaoshu":"21212121","zhiweizhize":"212112","renzhizige":"12122121","fulidaiyu":"122112","email":"liupishui@gmail.com","tel":"5555","addtime":"2023-07-23 20:20:08","category_id":61},{"id":5,"domain_id":1,"city":"61","gangwei":"1221","zhaopinrenshu":"212121","zhiweimiaoshu":"21212121","zhiweizhize":"212112","renzhizige":"12122121","fulidaiyu":"122112","email":"liupishui@gmail.com","tel":"122121","addtime":"2023-07-23 20:19:34","category_id":61},{"id":4,"domain_id":1,"city":"61","gangwei":"1221","zhaopinrenshu":"212121","zhiweimiaoshu":"21212121","zhiweizhize":"212112","renzhizige":"12122121","fulidaiyu":"122112","email":"liupishui@gmail.com","tel":"122121","addtime":"2023-07-23 20:16:48","category_id":61},{"id":3,"domain_id":1,"city":"61","gangwei":"1221","zhaopinrenshu":"212121","zhiweimiaoshu":"21212121","zhiweizhize":"212112","renzhizige":"12122121","fulidaiyu":"122112","email":"liupishui@gmail.com","tel":"122121","addtime":"2023-07-23 20:15:35","category_id":61},{"id":2,"domain_id":1,"city":"61","gangwei":"1221","zhaopinrenshu":"212121","zhiweimiaoshu":"21212121","zhiweizhize":"212112","renzhizige":"12122121","fulidaiyu":"122112","email":"liupishui@gmail.com","tel":"122121","addtime":"2023-07-23 20:15:11","category_id":61},{"id":1,"domain_id":1,"city":"61","gangwei":"2222","zhaopinrenshu":"111","zhiweimiaoshu":"111","zhiweizhize":"112","renzhizige":"12","fulidaiyu":"121212","email":"122121","tel":"122112","addtime":"2023-07-23 08:55:53","category_id":61}]} - rows记录数据 total总记录条数 page 总页码
    **/
    async zhaopin_list_server () {
        let domain_id = await this.get_domain_id();
        let data = await this.app.tables.zhaopin.get({domain_id:domain_id});
        return data;
    }

    //文章相关
    /**
    * 新增一篇文章,返回插入文章的id
    * @returns {number} 当前添加文章的id
    */
    async news_articles_add () {
        let context = this.context, app = this.app;
        if (typeof (context.post.sort) === 'undefined' || context.post.sort === '') {
            context.post.sort = 99;
        }
        context.post.domain_id = await this.get_domain_id();
        context.post.content = app.encodeURIComponentSafe(context.post.content);
        context.post.publish_ip = context.req.connection.remoteAddress;
        context.post.last_modify_ip = context.req.connection.remoteAddress;
        let lastNews_articles_id = app.tables.news_articles.add(context.post).lastInsertRowid;
        //插入关联标签
        if (typeof (context.post.tags) !== 'undefined' && context.post.tags !== '') {
            let tagsArr = context.post.tags.split(',');
            let arrTag = [];
            let domain_id = await this.get_domain_id();
            tagsArr.forEach( tagId => {
                if (typeof (tagId) !== 'undefined' && tagId !== '') {
                    arrTag.push({
                        news_articles_id: lastNews_articles_id,
                        news_categories_id: context.post.category_id,
                        tag_id: tagId,
                        domain_id: domain_id
                    });
                }
            })
            app.tables.tag_relationship.add(arrTag);
        }
        return lastNews_articles_id;
    }

    /**
    * 更新一篇文章 
    * @returns {boolean} 是否更新成功
    */
    async news_articles_update (param) {
        let context = this.context, app = this.app;
        if (typeof (context.post.sort) === 'undefined' || context.post.sort === '') {
            context.post.sort = 99;
        }
        context.post.content = app.encodeURIComponentSafe(context.post.content);
        context.post.last_modify_ip = context.req.connection.remoteAddress;
        context.post.last_modify_date = new Date().getTime();
        context.post.last_modify_ip = context.req.connection.remoteAddress;
        context.post.id = param.id;
        let rst = app.tables.news_articles.update(context.post,`id=${context.post.id} and domain_id=${await this.get_domain_id()}`);
        //更新tags
        //删除对应tag对应关系
        app.tables.tag_relationship.delete({ news_articles_id: param.id,domain_id:await this.get_domain_id()});
        //重新插入对应关系
        if (typeof (context.post.tags) !== 'undefined' && context.post.tags !== '') {
            let tagsArr = context.post.tags.split(',');
            let arrTag = [];
            let domain_id = await this.get_domain_id();
            tagsArr.forEach(tagId => {
                if (typeof (tagId) !== 'undefined' && tagId !== '') {
                    arrTag.push({
                        news_articles_id: param.id,
                        news_categories_id: context.post.category_id,
                        tag_id: tagId,
                        domain_id:domain_id
                    });
                }
            })
            app.tables.tag_relationship.add(arrTag);
        }
        return rst.changes > 0
    }
    /**
    * 文章详情
    * @param {{id:number}} 文章id
    * @returns {{"id":29,"domain_id":1,"user_id":null,"category_id":23,"title":"1222","keywords":"","description":"","content":"<p>1313</p>","excerpt":null,"article_status":null,"view_count":null,"is_sticky":null,"is_essence":null,"comment_status":null,"comment_count":null,"last_comment_user_id":null,"avatar":null,"publish_date":"2023-08-14 11:01:01","publish_ip":"127.0.0.1","last_modify_date":1702862516063,"last_modify_ip":"127.0.0.1","mode":null,"poster":"/public/croper/2023_12_18/41db56fa-151b-4f36-ac65-b16d03f16ea6-1702862511752.jpg","sort":"93","attached_file_link":"","attached_file_name":"","addtime":"2023-08-14 11:01:01","platform":0,"tags":"","poster_org":"/public/fcup_upload/2023_08_14/6fd5225bd53618d88f0433983efe837f.jpg"}} 文章详情
    */
    async news_articles_get (param) {
        if(typeof(param.id) === 'undefined'){
            return false;
        }
        let context = this.context, app = this.app;
        param.domain_id = await this.get_domain_id();
        let news_articles_Curr = app.tables.news_articles.get(param);
        if (news_articles_Curr.length === 0) {
            return null;
        }
        news_articles_Curr = news_articles_Curr[0];
        news_articles_Curr.content = app.decodeURIComponentSafe(news_articles_Curr.content);
        let tags = app.tables.tag_relationship.get({ news_articles_id: param.id ,domain_id:await this.get_domain_id()});
        let tagsStr = '';
        tags.forEach(item => {
            tagsStr = tagsStr + item.tag_id + ',';
        })
        news_articles_Curr.tags = tagsStr;
        news_articles_Curr.poster_org = news_articles_Curr.poster;
        let cropperImg = app.tables.cropper.get({ image_new: news_articles_Curr.poster,domain_id:await this.get_domain_id()});
        if (cropperImg.length > 0) {
            //如果存在
            news_articles_Curr.poster_org = cropperImg[0].image_org;
        }
        return news_articles_Curr;
    }

    /**
     * 获取文章列表 
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":29,"domain_id":1,"user_id":null,"category_id":23,"title":"1222","keywords":"","description":"","content":"<p>1313</p>","excerpt":null,"article_status":null,"view_count":null,"is_sticky":null,"is_essence":null,"comment_status":null,"comment_count":null,"last_comment_user_id":null,"avatar":null,"publish_date":"2023-08-14 11:01:01","publish_ip":"127.0.0.1","last_modify_date":1702862516063,"last_modify_ip":"127.0.0.1","mode":null,"poster":"/public/croper/2023_12_18/41db56fa-151b-4f36-ac65-b16d03f16ea6-1702862511752.jpg","sort":"93","attached_file_link":"","attached_file_name":"","addtime":"2023-08-14 11:01:01","platform":0}],"total":1,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async news_articles_list (condition, param, offset, limit) {
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()} and ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'news_articles', condition, param, offset, limit);
        return data;
    }
    async news_articles_list_server (categrory_id,pageSize) {
        let {context,app} = this;
        if(typeof(categrory_id)==='undefined'){
            return [];
        }
        let categorySon = await this.news_categories_son({id:categrory_id});
        let category_idArr = [categrory_id];
        categorySon.forEach(cate=>{
            category_idArr.push(cate.id);
        })
        let condition = `domain_id=@domain_id and category_id in (SELECT value FROM json_each(@inCategory))`;
        let options = { 
            pageSize:pageSize,
            sql_query:`select * from news_articles where ${condition} order by id desc`,
            sql_count:`select count(*) from news_articles where ${condition}`,
            sql_param:{domain_id:await this.get_domain_id(),inCategory:JSON.stringify(category_idArr)},
        };
        let serverPage = app.utils.pageoperater.serverPage(context,app,options);
        // console.log(data.getDataList());
        let data = serverPage.getDataList();
        let page = serverPage.getDynamicHtml([3,4,5,6,7]);
        let pageData = serverPage.getPageData();
        let getStaticPage = function($url="/{page}.html"){return serverPage.getStaticHtml([3,4,5,6,7],$url)}
        return {
            data:data,
            page:page,
            getStaticPage:getStaticPage,
            pageData:pageData
        }
    }
    /**
    * 获取分类ID下的所有tag标签
    * @param {{categoryPid: number}} param - 要获取子分类的id
    * @returns {[{news_categories_id:1,domain_id:2}]} - tag列表
    */
    async news_categories_tag (param) {
        let context = this.context, app = this.app;
        // let allTags = app.tables.tag.getAll();
        let categorys = await this.news_categories_son({id:param.categoryPid});
        let conditionArr = [];
        let domain_id = await this.get_domain_id();
        categorys.forEach(cate=>{
            conditionArr.push({
                news_categories_id:cate.id,
                domain_id:domain_id
            })
        })
        return app.tables.tag.get(conditionArr);
    }

    

    /**
     * 分类列表 
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":1,"domain_id":1,"is_system":1,"name":"新闻资讯","keywords":"","description":"","pid":0,"sort":2,"publish_date":"2021-03-26 09:41:30","modifytime":null,"addtime":"2023-05-30 06:34:33","level":0}],"total":36,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async category_list(condition, param, offset, limit){
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()} or is_system=1 ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'news_categories', condition, param, offset, limit);
        return data;
    }
    //删除一个分类
    async category_delete(){
        let context = this.context, app = this.app;
        //如果是删除
        //重要分类不能删除
        //let importantCategory = [1,2,3,5,20,22,23,29,30,31,35,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62];
        let importantCategory = app.tables.news_categories.get({is_system:1});
        if(importantCategory.filter(item=>{return item.id===parseInt(context.post.delCategoryId)}).length>0){
            return context.toSTRING('重要分类不能删除!');
        }
        //获取节点信息
        let nodeInfo = app.tables['news_categories'].get(context.post.delCategoryId);
        if(nodeInfo.length===0){
            content.toSTRING('没有相关节点信息');
        } 
        //如果有子节点，不能删除
        let nodeSon = await this.news_categories_son({id:context.post.delCategoryId});
        if(nodeSon.length>0){
            return context.toSTRING('分类下有子分类，不能删除');
        }
        //如果有内容，不可以删除
        let bannerArr = app.tables['banner'].get({category_id:context.post.delCategoryId,domain_id:await this.get_domain_id()},['limit 0,1']);
        if(bannerArr.length>0){
            return context.toSTRING(`请先删除[图片轮播->${nodeInfo[0].name}]下面相关内容，再删除此分类`);
        }
        let imageArr = app.tables['image'].get({category_id:context.post.delCategoryId,domain_id:await this.get_domain_id()},['limit 0,1']);
        if(imageArr.length>0){
            return context.toSTRING(`请先删除[照片->${nodeInfo[0].name}]下面相关内容，再删除此分类`);
        }
        let newsArticlesArr = app.tables['news_articles'].get({category_id:context.post.delCategoryId,domain_id:await this.get_domain_id()},['limit 0,1']);
        if(newsArticlesArr.length>0){
            return context.toSTRING(`请先删除[文章->${nodeInfo[0].name}]||[案例->${nodeInfo[0].name}]下面相关内容，再删除此分类`);
        }
        let tagArr = app.tables['tag'].get({news_categories_id:context.post.delCategoryId,domain_id:await this.get_domain_id()},['limit 0,1']);
        if(tagArr.length>0){
            return context.toSTRING(`请先删除[标签->${nodeInfo[0].name}下面相关内容，再删除此分类`);
        }
        let zhaopinArr = app.tables['zhaopin'].get({category_id:context.post.delCategoryId,domain_id:await this.get_domain_id()},['limit 0,1']);
        if(zhaopinArr.length > 0){
            return context.toSTRING(`请先删除[招聘->${nodeInfo[0].name}下面相关内容，再删除此分类`)
        }
        return app.tables['news_categories'].delete({id:context.post.delCategoryId,domain_id:await this.get_domain_id()});
    }

    /**
     * 标签 
     *  @returns {{"id":10,"domain_id":1,"name":"贾静雯","news_categories_id":1,"addtime":"2023-08-14 11:11:13"}} - rows记录数据 total总记录条数 page 总页码
    **/
        async tag(){
            let paramProps={
                id:{
                    type:'number',
                    default:0
                }
            } 
            this.app.setup(this.context.url.query,paramProps);
            let data = await this.app.sqlite.tables.tag.get({domain_id:await this.get_domain_id(),id:this.context.url.query.id}); 
            return data.length===0?{}:data[0];
        }
    

    /**
     * 标签列表 
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":10,"domain_id":1,"name":"贾静雯","news_categories_id":1,"addtime":"2023-08-14 11:11:13","news_categories":"新闻资讯"}],"total":3,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async tag_list(condition, param, offset, limit){
        let context = this.context,app = this.app;
        condition = `domain_id=${await this.get_domain_id()} and ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'tag', condition, param, offset, limit);
        return data;
    }

    // 分类
    /**
    * 获取某个分类下的所有子分类
    * @param {{id:number}} 获取此id下的所有分类
    * @returns {[{"id":20,"domain_id":1,"is_system":0,"name":"公司新闻","keywords":"","description":"公司新闻，XXX公司今日新闻","pid":1,"sort":1,"publish_date":"2021-03-26 09:49:29","modifytime":null,"addtime":"2023-05-30 06:34:33","level":0}]} 所有子分类数组
    **/
    async news_categories_son (param) {
        let context = this.context, app = this.app;
        //只返回本网站下分类和系统分类
        let categories_all = app.tables.news_categories.getAll();
        let categories_all_domain = [];
        let domain_id = await this.get_domain_id();
        categories_all.forEach(categories=>{
            if(categories.domain_id === domain_id||categories.is_system===1){
                categories_all_domain.push(categories);
            }
        });
        return app.utils.tree.subtree(categories_all_domain, param.id, 0);
    }
    /**
    * 获取某个分类下的一级子分类
    * @param {{id:number}} 获取此id下的一级子分类
    * @returns {[{"id":20,"domain_id":1,"is_system":0,"name":"公司新闻","keywords":"","description":"公司新闻，XXX公司今日新闻","pid":1,"sort":1,"publish_date":"2021-03-26 09:49:29","modifytime":null,"addtime":"2023-05-30 06:34:33"}]} 所有一级子分类数组
    **/
    async news_categories_child (param) {
        let context = this.context, app = this.app;
        //只返回本网站下某个分类下的一级子分类
        let categories_all = app.tables.news_categories.getAll();
        let categories_all_domain = [];
        let domain_id = await this.get_domain_id();
        categories_all.forEach(categories=>{
            if(categories.domain_id === domain_id||categories.is_system===1){
                categories_all_domain.push(categories);
            }
        });
        return app.utils.tree.findson(categories_all_domain, param.id);
    }    
    /**
    * 获取某个分类的族谱树，常用于面包屑导航等
    * @param {{id:number}} 获取此id的族谱树
    * @returns {[{"id":20,"domain_id":1,"is_system":0,"name":"公司新闻","keywords":"","description":"公司新闻，XXX公司今日新闻","pid":1,"sort":1,"publish_date":"2021-03-26 09:49:29","modifytime":null,"addtime":"2023-05-30 06:34:33"}]} 所有父级分类
    **/
    async news_categories_familytree (param) {
        let context = this.context, app = this.app;
        //只返回本网站下某个分类的族谱树
        let categories_all = app.tables.news_categories.getAll();
        let categories_all_domain = [];
        let domain_id = await this.get_domain_id();
        categories_all.forEach(categories=>{
            if(categories.domain_id === domain_id||categories.is_system===1){
                categories_all_domain.push(categories);
            }
        });
        return app.utils.tree.familytree(categories_all_domain, param.id);
    }

    //自定义页面
    /**
    * 添加自定义页面
    * @returns {number} 新添加页面的id,如果是-1则是添加失败
    */
    async page_add(){
        let context = this.context, app = this.app;
        if (typeof (context.post.sort) === 'undefined' || context.post.sort === '') {
            context.post.sort = 99;
        }
        let pageProps = {
            platform:{
                type:'number',
                default:0
            },
            show_nav:{
                type:'number',
                default:0
            },
            show_home:{
                type:'number',
                default:0
            },
            sort:{
                type:'number',
                default:0
            },
            modify_time:{
                type:'number',
                default:new Date().getTime()
            }
        }
        app.setup(context.post,pageProps);
        context.post.document = app.encodeURIComponentSafe(context.post.document);
        context.post.ip = context.req.connection.remoteAddress;
        context.post.domain_id = await this.get_domain_id();
        return app.tables.pages.add(context.post).lastInsertRowid;
    }

    /**
    * 修改自定义页面
    * @returns {boolean} 是否修改成功 
    */
    async page_update(){
        let context = this.context, app = this.app;
        if (typeof (context.post.sort) === 'undefined' || context.post.sort === '') {
            context.post.sort = 99;
        }
        let pageProps = {
            platform:{
                type:'number',
                default:0
            },
            show_nav:{
                type:'number',
                default:0
            },
            show_home:{
                type:'number',
                default:0
            },
            sort:{
                type:'number',
                default:0
            },
            modify_time:{
                type:'number',
                default:new Date().getTime()
            }
        }
        app.setup(context.post,pageProps);
        context.post.id = context.post.modify;
        context.post.document = app.encodeURIComponentSafe(context.post.document);
        context.post.ip = context.req.connection.remoteAddress;
        return app.tables.pages.update(context.post,`id=${context.post.id} and domain_id=${await this.get_domain_id()}`).changes > 0;
    }

    /**
    * 获取自定义页面的详细信息
    * @param {{id:number}} 自定义页面的id
    * @returns {[{"id":3,"domain_id":1,"platform":0,"title":"地图测试","poster":"/public/fcup_upload/2023_08_14/6fd5225bd53618d88f0433983efe837f.jpg","keywords":"2","description":"2","document":"<p>\n    <br/>\n</p>\n<p>\n    大发萨法\n</p>","show_nav":1,"show_home":1,"sort":99,"ip":"127.0.0.1","modify_time":1691981173696,"addtime":"2023-07-25 14:46:11","title_en":""}]} 数组页面详情
    */
    async page_get(param){
        let context = this.context, app = this.app;
        param.domain_id = await this.get_domain_id();
        let pageData = app.tables.pages.get(param);
        pageData[0].document = app.decodeURIComponentSafe(pageData[0].document);
        return pageData;
    }

    //用户评价
    /**
     * 用户评价
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":2338,"domain_id":1,"name":"孙雪宁2","job":"sss","evaluation":"ss","avatar":"/public/fcup_upload/2023_07_20/68e6eb3b749ee3614f4410ae843a4d77.png","addtime":"2023-07-28 09:40:43"}],"total":6,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async clientssay_list(condition, param, offset, limit){
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'clientssay', condition, param, offset, limit);
        return data;
    }

    //用户留言
    /**
     * 用户留言
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":1,"domain_id":1,"name":"王先生","category_id":43,"tel":"13793332405","address":"土卫一号","mianji":"109","detail":"设计的如苍穹","readed":0,"ip":null}],"total":1,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async message_list(condition, param, offset, limit){
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()} ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'message', condition, param, offset, limit);
        return data;
    }

    /**
    * 删除用户需求留言
    * @param {[]} arrayId 要删除的信息的id数组
    * @returns {number} 删除了多少行
    */
    async message_delete(arrayId){
        let context = this.context, app = this.app;
        let idArr = []
        let domain_id = await this.get_domain_id();
        arrayId.forEach(id=>{
            idArr.push({
                id:id,
                domain_id:domain_id
            })
        })
        return app.tables.message.delete(idArr).changes;
    }

    /**
    * 将用户需求留言设为已读
    * @returns {number} 标记已读数据的个数
    */
    async message_readed(messageId){
        let context = this.context, app = this.app;
        let updateProps = {
            readed:{
                type:'number',
                default:0
            },
            id:{
                type:'number',
                default:-1
            }
        }
        context.post.readed = 1;
        context.post.id = messageId;
        app.setup(context.post,updateProps);
        return app.tables.message.update(context.post,`id=${context.post.id} and domain_id=${await this.get_domain_id()}`).changes;
    }
    //联系我们普通
    /**
     * 用户留言
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":1,"domain_id":1,"name":"静水","email":"550830233@qq.com","mobile":"13793332405","context":null,"time":null,"ip":null,"readed":0,"addtime":1702889149864}],"total":1,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async contact_list(condition, param, offset, limit){
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()} ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'contact', condition, param, offset, limit);
        return data;
    }

    /**
     * 网站联系我们留言信息 单个网站数据少，不做分页
     *  @returns {[{"id":1,"domain_id":1,"name":"静水","email":"550830233@qq.com","mobile":"13793332405","context":'null',"time":'null',"ip":'null',"readed":1,"addtime":1702889149864}]} - 联系我们留言列表
    **/
    async contact_list_server(){
        let context = this.context, app = this.app;
        let condition = `domain_id=${await this.get_domain_id()}`;
        let data = await app.sqlite.tables.contact.query(condition);
        return data;
    }
    

    /**
    * 删除用户联系我们留言信息
    * @param {[]} arrayId 要删除的信息的id数组
    * @returns {number} 删除了多少行
    */
    async contact_delete(arrayId){
        let context = this.context, app = this.app;
        let idArr = []
        let domain_id = await this.get_domain_id();
        arrayId.forEach(id=>{
            idArr.push({
                id:id,
                domain_id:domain_id
            })
        })
        return app.tables.contact.delete(arrayId).changes;
    }

    /**
    * 获取用户未读留言条数
    * @returns {number} 返回用户未读留言条数
    */
    async getContactlength(){
        let context = this.context, app = this.app;
        let count = app.tables.contact.count('readed=0 and domain_id='+await this.get_domain_id(context,app));
        return count;
    }

    /**
     * 添加联系我们留言
     * @param {string} name 留言标题/姓名
     * @param {string} email 联系邮箱
     * @param {string} mobile 联系电话
     * @param {string} context 留言内容
     * @param {string} ip 留言时用户的ip地址
     * @param {number} readed 阅读状态，默认0未读
     * @returns {boolean} 返回是否插入成功
     */
    async context_add(){
        // `<!DOCTYPE html>
        // <html lang="en">
        // <head>
        //     <meta charset="UTF-8">
        //     <meta http-equiv="X-UA-Compatible" content="IE=edge">
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <title>前端留言demo</title>
        // </head>
        // <body>
        //     <div>
        //         <input type="text" placeholder="姓名" name="name">
        //         <input type="text" placeholder="邮箱" name="email">
        //         <input type="text" placeholder="电话" name="mobile">
        //         <textarea name="context" placeholder="内容"></textarea>
        //         <input type="text" placeholder="请输入验证码" autocomplete="off" onblur="validate_code()" id="code"><img src="/checkcode" class="checkcode" onclick="this.src = '/checkcode?'+new Date().getTime()"  alt="">
        //         <button class="btn">发送</button>
        //     </div>
        //     <script src="/scripts/jquery.min.js"></script>
        //     <script type="text/javascript">
        //         function validate_code(){
        //             var code = $("#code").val();
        //             if(new RegExp(/^[a-zA-Z0-9]{4,4}$/).test(code)===false){
        //                 alert('验证码格式不正确');
        //                 return false;
        //             }
        //             return true;
        //         }
        //         $(function(){
        //             $(".btn").click(function(){
        
        //                 var mobileRegex = new RegExp(/^1[3-9]\d{9}$/);
        //                 var emailReg = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        //                 //判断邮箱
        //                 if ($('[name=name]').val()=='') {
        //                     alert('请输入姓名');
        //                     return;
        //                 }
        //                 if(!emailReg.test($('[name=email]').val())){
        //                     alert('请输入正确的邮箱');
        //                     return;
        //                 }
        //                 if(!mobileRegex.test($('[name=mobile]').val())){
        //                     alert('请输入正确的手机号');
        //                     return;
        //                 }
        //                 if ($('[name=context]').val()=='') {
        //                     alert('请输入留言内容');
        //                     return;
        //                 }
        //                 if(!validate_code()){
        //                   return;
        //                 };
        //                 $.post('/api/contactLeave',{
        //                     name:$('[name=name]').val(),
        //                     email:$('[name=email]').val(),
        //                     mobile:$('[name=mobile]').val(),
        //                     context:$('[name=context]').val(),
        //                     code:$("#code").val()
        //                 },function(rst){
        //                     if(typeof(rst.code)!=='undefined'&&rst.code==0){
        //                         if (rst.data.message=='验证码不正确') {
        //                             $(".checkcode").attr('src','/checkcode?'+new Date().getTime());
        //                         }
        //                         alert(rst.data.message);
        //                     }
        //                     alert('留言成功');
        //                 })
        //             });
        //         })
        //     </script>
        // </body>
        // </html>`
    


        let postParam = {
            name:{
                type:'string',
                default:''
            },
            email:{
                type:'string',
                default:''
            },
            mobile:{
                type:'string',
                default:''
            },
            context:{
                type:'string',
                default:''
            },
            code:{
                type:'string',
                default:''
            }
        }
        let {context,app} = this;
        if(context.req.method.toLowerCase()==='get'){
            return '接口不能通过get请求'
        }
        app.setup(context.post,postParam);
        if(context.session.get('captcha')==null){
            return '验证码过期'
        }
        if(context.post.code.toLowerCase()!==context.session.get('captcha').toLowerCase()){
            context.session.set('captcha','');
            return '验证码不正确';
        }
        context.session.set('captcha','');
        if(context.post.name===''){
            return '姓名不能为空';
        }
        if(context.post.email===''){
            return '联系邮箱不能为空';
        }
        if(context.post.mobile===''){
            return '联系电话不能为空';
        }
        if(context.post.context===''){
            return '联系内容不能为空';
        }
        context.post.ip = await context.getRemoteIp();
        context.post.readed = 0; 
        context.post.domain_id = await this.get_domain_id();
        let data = app.sqlite.tables.contact.add(context.post);
        if(data.error){
            return '插入数据库错误'
        } 
        return true;
    }

    /**
    * 将用户留言设为已读
    * @returns {number} 本次操作设置为已读的条数
    */
    async contact_readed(contactId){
        let context = this.context, app =  this.app;
        let updateProps = {
            readed:{
                type:'number',
                default:0
            },
            id:{
                type:'number',
                default:-1
            }
        }
        context.post.readed = 1;
        context.post.id = contactId;
        app.setup(context.post,updateProps);
        return app.tables.contact.update(context.post,`id=${context.post.id} and domain_id=${await this.get_domain_id()}`).changes;
    }

    /**
     * 友情链接列表
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":2,"domain_id":1,"name":"百度","link":"https://www.baidu.com","sort":"88.0","addtime":"2023-07-30 10:08:15","img":null}],"total":3,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async friendlink_list(condition, param, offset, limit){
        let context = this.context, app = this.app;
        condition = `domain_id=${await this.get_domain_id()} ${condition}`;
        let data = await context.use(app.utils.pageoperater.bootstrap, 'friendlink', condition, param, offset, limit);
        return data;
    }
    /**
     * 友情链接列表 单个网站数据少，不做分页
     *  @returns {[{"id":2,"domain_id":1,"name":"百度","link":"https://www.baidu.com","sort":"88.0","addtime":"2023-07-30 10:08:15","img":null},{"id":3,"domain_id":1,"name":"百度","link":"https://www.baidu.com","sort":"99.0","addtime":"2023-07-30 10:13:10","img":null},{"id":4,"domain_id":1,"name":"百度","link":"https://www.baidu.com","sort":"3.0","addtime":"2023-07-30 10:14:10","img":"/public/croper/2023_07_30/00a283b8-ea1b-431b-8833-8703be28996f-1690683544070.jpg"}]} - 友情链接列表
    **/
    async friendlink_list_server(){
        let context = this.context, app = this.app;
        let condition = `domain_id=${await this.get_domain_id()}`;
        let data = await app.sqlite.tables.friendlink.query(condition);
        return data;
    }

    /**
     * 主题列表
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":2,"user_id":1,"is_static_server":0,"is_system_theme":1,"is_default":1,"theme_name":"blue","addtime":"2023-06-10 21:17:38","poster":"","theme_server_path":"/view/theme/blue/","theme_view_path":"/theme/blue/","maker":"admin","curr_theme":"否"}],"total":2,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async theme_list(condition, param, offset, limit){
        let context = this.context, app = this.app;
        //如果是管理员则显示全部，否则只显示系统主题和自己上传的主题(即自己账号对应域名id下的主题)
        let isAdmin = await this.isAdmin();
        if(isAdmin){
            condition = `${condition}`;
        }else{
            condition = `user_id=${context.session.get('user').id} or is_system_theme=1 and ${condition}`;
        }
        let data = await context.use(app.utils.pageoperater.bootstrap, 'theme', condition, param, offset, limit);
        return data;
    }

    /**
     * 域名列表
     *  @param {string} condition 预查询语句
     *  @param {{}} param 预查询语句对应的参数
     *  @param {number} offset 记录开始位置
     *  @param {number} limit 查询记录条数
     *  @returns {{"rows":[{"id":6,"user_id":3,"domain_outside":null,"domain_inside":"e7f","disabled":0,"username":"zhuifengh3o"}],"total":3,"page":1}} - rows记录数据 total总记录条数 page 总页码
    **/
    async domain_list(condition, param, offset, limit){
        let context = this.context, app = this.app;
        if(context.session.get('user').id!==1){
            //获取所有下线Id
            let recommend_user_all_arr = await recommend_user_all(context,app,context.session.get('user').id);
            recommend_user_all_id = recommend_user_all_arr.map(item=>{return item.id});
            recommend_user_all_id.unshift(context.session.get('user').id);
            //获取所有下线Id结束
        
            condition = `user_id in (SELECT value FROM json_each(@inRecommendUserAllId)) and ${condition}`; 
            param.inRecommendUserAllId = JSON.stringify(recommend_user_all_id);
            let data = await context.use(app.utils.pageoperater.bootstrap, 'domain', condition, param, offset, limit);
            return data;    
        }
        let data = await context.use(app.utils.pageoperater.bootstrap, 'domain', condition, param, offset, limit);
        return data;

    }
    async isAdmin(){
        let context = this.context;
        let adminIdArr = [1];
        return adminIdArr.includes(context.session.get('user').id);
    }

    async signout(){
        let context = this.context;
        return context.session.remove('user');
    }

    async isLogin(){
        let context = this.context;
        return context.session.get('user')!==null;
    }

    async get_domain_id(force=false){
        let context = this.context;
        //获取当前的domain_id，如果用户已经登录且在/admin/路径下的页面或者传入参数force(强制获取),则返回用户的domain_id，否则返回context.theme.domain_id(当前网站的domain_id)
        if((await this.isLogin() && context.url.pathname.indexOf('/admin/')===0) || force===true){
            return context.session.get('user').domain_id;
        }
        return context.theme.domain_id;
    }

    async recommend_user_all(pid){
        let context = this.context, app = this.app;
        if(typeof(pid)!=='number'){
            pid = context.session.get('user');
        }
        return app.sqlite.prepare(`select * from uni_id_users where pid=@pid`).all({pid:pid});
    }
}

module.exports = enterprise;
//     ,
//     pagesList,           //自定义页面列表
//     page_add,             //添加页面
//     page_update,          //更新页面
//     page_get,             //获取页面信息

//     banner_get,           //根据id轮播图
//     banner_add,           //添加轮播图
//     banner_update,        //更新轮播图
//     banner_list,          //轮播图列表

//     image_get,            //获取图片信息
//     image_modify,         //照片修改
//     image_add,            //照片添加
//     image_list,           //图片列表，照片墙

//     zhaopin_list,         //招聘列表

//     news_articles_get,    //获取一篇文章
//     news_articles_add,    //新增文章
//     news_articles_update, //更新一篇文章
//     news_articles_list,   //文章列表

//     category_list,        //分类列表
//     category_delete,      //删除一个分类
//     news_categories_son,  //获取某个分类下的所有子分类
    
//     news_categories_tag,  //获取分类ID下的所有tag标签
//     tag_list,             //标签列表

//     clientssay_list,      //用户评价列表

//     message_list,         //用户留言列表
//     message_delete,       //删除用户留言
//     message_readed,       //将用户留言设为已读

//     contact_list,         //用户联系我们留言列表
//     contact_delete,       //删除联系我们的留言
//     contact_readed,       //将联系我们的用户留言设为已读
//     getContactlength,     //获取未读用户留言条数
    
//     friendlink_list,      //友情链接

//     theme_list,           //主题列表
    
//     domain_list,          //域名列表

//     isAdmin,              //是否是管理员

//     signout,              //退出登录

//     isLogin,              //是否已经登录

//     get_domain_id,        //获取当前的domain_id，如果用户已经登录且在/admin/路径下的页面或者传入参数user,则返回用户的domain_id，否则返回context.theme.domain_id(当前网站的domain_id)。

//     recommend_user_all,  //用户所有推荐成员
// }