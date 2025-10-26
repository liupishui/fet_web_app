// fcup文件上传
let fs = require('node:fs');
let path = require('node:path');
module.exports = async (context, app, param) => {
    let {jsonMsg,UP_PATH,UP_URL}  = app.require(__dirname + '/utils');
    //设置允许跨域的域名，*代表允许任意域名跨域
    context.res.setHeader("Access-Control-Allow-Origin", "*");
    //跨域允许的header类型
    context.res.setHeader("Access-Control-Allow-Headers", "Content-type,Content-Length,Authorization,Accept,X-Requested-Width");
    //跨域允许的请求方式
    context.res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //context.post.__files.file_data.size	
    let dataSize = null;
    // 检查有没有数据
    if (typeof(context.post.__files.file_data)!=='undefined') {
        dataSize = context.post.__files.file_data.size;
    }
    if (!dataSize) {
        context.toJSON({ "status": 0, "message": "没有数据" });
        return;
    }
    //新增数据
    let add = function (data) {
        app.tables.files.add(data);
    }

    //更新数据
    let update = function (md5, index) {
        return app.tables.files.update({ file_index: index, file_md5: md5 }, `file_md5='${md5}'`);
    }

    let $file = context.post.__files.file_data;
    let $name = context.post.file_name ? context.post.file_name : null; //要保存的文件名

    let $total = context.post.file_total ? context.post.file_total : 0; //总片数

    let $index = context.post.file_index ? context.post.file_index : 0; //当前片数

    let $md5 = context.post.file_md5 ? context.post.file_md5 : 0; //文件的md5值

    let $size = context.post.file_size ? context.post.file_size : null; //文件大小

    let $chunksize = context.post.file_chunksize ? context.post.file_chunksize : null; //当前切片的文件大小

    let  $suffix = context.post.file_suffix ? context.post.file_suffix : null; //当前上传的文件后缀
   
    let $ext = $suffix;
    if($ext.indexOf('.')===-1){
        $ext = '.' + $ext;
    }
    let $file_name = $md5 + '.' + $ext;

    let UP_PATH_String = await context.use(UP_PATH);    
    let $newfile = UP_PATH_String + '/' + $file_name; 

    // 文件可访问的地址
    let UP_URL_Sring = await context.use(UP_URL);
    let $url = UP_URL_Sring + $file_name;
    
    // 定义要插入数据库里的数据
    let $datas = {
        "path":$url,
        "basename_org":$name,
        "file_size":$size,
        "file_index":$index,
        "file_total":$total,
        "file_md5":$md5,
        "extname":$ext,
        "user_id":context.session.get('user').id,
        "plugin":"fcup"
    };

    let $id = 0;
    // 检查文件是否存在在数据库中
    let $re = app.tables.files.get({file_md5: $md5});
    // 数据库里有记录说明已经上传过
    if($re.length>0){
        $id = $re[0].id;
        $url = $re[0].path;
        $path = app.serverPath + '/view/'+$re[0].path;
        $file_size = $re[0]['file_size'];
        $file_index = $re[0]['file_index'];
        $file_total = $re[0]['file_total'];
        //是否已经上传完成
        if($file_index-0 < $file_total-0){
            try{
                let $content = fs.readFileSync(context.post.__files.file_data.path);
                fs.appendFileSync($path,$content);
                fs.unlinkSync(context.post.__files.file_data.path);
                update($re[0]['file_md5'],$index);    
            }catch(e){
                await context.use(jsonMsg,0,'上传失败');
                return;
            }
            if($index === $total){
                await context.use(jsonMsg,2,'上传完成',$url,$index,$name);
                return;
            }
            await context.use(jsonMsg,1,'正在上传','',$index);
        }else{
            if($index === $total){
                await context.use(jsonMsg,2,'上传完成',$url,$index,$name);
                return;
            }
            await context.use(jsonMsg,1,'正在上传','',$index);
        }
    }else{
        try{
            fs.mkdirSync(UP_PATH_String,{recursive:true});
            let $content = fs.readFileSync(context.post.__files.file_data.path);
            fs.appendFileSync($newfile,$content);
            fs.unlinkSync(context.post.__files.file_data.path);
            add($datas);    
        }catch(e){
            await context.use(jsonMsg,0,'上传失败');
        }
        if($index === $total){
            await context.use(jsonMsg,2,'上传完成',$url,$index,$name);
            return;
        }
        await context.use(jsonMsg,1,'正在上传','',$index);
    }
}
