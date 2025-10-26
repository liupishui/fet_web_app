// fcup文件上传
module.exports = async (context,app,param)=>{
    let path = require('node:path');
    let {jsonMsg,UP_PATH,UP_URL}  = app.require(__dirname + '/utils');
    $name  = context.post["file_name"] ? context.post["file_name"]:null; // 文件名

    $md5   = context.post["file_md5"] ? context.post['file_md5'] :''; //文件的md5值

    $size   = context.post["file_size"] ? context.post['file_size'] :''; //文件大小
    
    if($md5===''){
        await context.use(jsonMsg,1,'没有文件');
        return;
    }
    let $re = app.tables.files.get({file_md5: $md5});
    if($re.length>0){
        $path = $re[0]['path'];
        $file_size = $re[0]['file_size'];
        $file_index = $re[0]['file_index'];
        $file_total = $re[0]['file_total'];
        // 片数对比,如果一样,说明已经上传过了
        if($file_index == $file_total){
            $url =  $path;
            await context.use(jsonMsg,2,'已经上传过了',$url,$file_total,$name);
            return;
        }else{
            // 片数不对等,那么继续上传
            await context.use(jsonMsg,0,'','',$file_index-0+1,$name);
            return;
        }
    }
    // 简单的判断文件类型
    // 获取文件后缀
    let $ext = path.extname($name);
    
    // 判断文件类型
    let fileAcceptArr = ['.jpeg','.jpg','.png','.gif','.ico','.zip','.rar','.xls','.xlsx','.doc','.pdf'];

    if(fileAcceptArr.includes($ext)===false){
        await context.use(jsonMsg,1,'文件类型不支持');
        return;
    }
    await context.use(jsonMsg,0,'','',1);
}


 
