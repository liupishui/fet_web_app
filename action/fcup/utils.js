module.exports = {
    jsonMsg:(context,app,$status,$message,$url='',$index=0,$name='')=>{
        let $arr = {};
        $arr['status'] = $status;
        $arr['message'] = $message;
        $arr['url'] = $url;
        $arr['name'] = $name;
        $arr['file_index'] = $index;
        context.toJSON($arr);
    },
    UP_PATH:(context,app)=>{
        return app.serverPath+'/view/public/fcup_upload/'+ app.getNowTime().date + '/';
    },
    UP_URL:(context,app)=>{
        return '/public/fcup_upload/'+ app.getNowTime().date + '/';
    }
}