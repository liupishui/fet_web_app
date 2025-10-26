var resetForm = function(){
   $("form")[0].reset();
   if(typeof(ue)!='undefined'){
        ue.setContent('');
   }
}

var uploadImgFcup = function(domid){
    var upload = new fcup({
        id: domid, // 绑定id

            url: "/admin/scripts/fcup/server/fet/upload.ejs", // url地址
            
            check_url: "/admin/scripts/fcup/server/fet/check.ejs", // 检查上传url地址

            type: "jpg,png,jpeg,gif,ico", // 限制上传类型，为空不限制

            shard_size: "0.2", // 每次分片大小，单位为M，默认1M

            min_size: '', // 最小文件上传M数，单位为M，默认为无

            max_size: "20", // 上传文件最大M数，单位为M，默认200M
            
            // headers: {"version": "fcup-v2.0"}, // 附加的文件头,默认为null, 请注意指定header头时将不能进行跨域操作
            
            // apped_data: {}, //每次上传的附加数据
            
            // 定义错误信息
            error_msg: {
                1000: "未找到上传id",
                1001: "类型不允许上传",
                1002: "上传文件过小",
                1003: "上传文件过大",
                1004: "上传请求超时"
            },
            
            // 错误提示
            error: (msg) => {
                layer.msg(msg,{time:3000});
            },      

            // 初始化事件                
            start: () => {
                //Progress(0);
            },

            // 等待上传事件，可以用来loading
            before_send: () => {
                //console.log('等待请求中');
            },

            // 上传进度事件
            progress: (num, other) => {
                $("#" + domid + " span").text('已经上传：'+num+'%');
                if(num==100){
                    $("#" + domid + " span").text('点击更换');
                };
            },
            
            // 检查地址回调,用于判断文件是否存在,类型,当前上传的片数等操作
            check_success: (res) => {
            
                let data = res ? eval('(' + res + ')') : '';
                
                let status = data.status;
                
                let url = data.url;
                
                let msg = data.message;
                
                // 错误提示
                if (status == 1 ) {
                    layer.msg(msg,{time:600});
                    return false;
                }
                
                // 已经上传
                if (status == 2) {
                    if (typeof ($("#" + domid)[0].dataset.cropperOption)!='undefined'){
                        $("#" + domid).prev().html($('<img style="max-width:150px;" class="cropper" data-org="' + url + '" data-width="' + $.parseJSON($("#" + domid)[0].dataset.cropperOption).width + '" data-height="' + $.parseJSON($("#" + domid)[0].dataset.cropperOption).height + '" class="poster" src="' + url + '" alt="">'));
                    }else{
                        $("#" + domid).prev().html($('<img style="max-width:150px;" class="poster" src="' + url + '" alt="">'));
                    }
                    //layer.msg('图片已存在',{time:2000});
                    return false;
                }
                
                // 如果提供了这个参数,那么将进行断点上传的准备
                if(data.file_index){
                // 起始上传的切片要从1开始
                let file_index = data.file_index ? parseInt(data.file_index) : 1;
                // 设置上传切片的起始位置		   
                upload.set_shard(file_index);
                }
                
                // 如果接口没有错误，必须要返回true，才不会终止上传
                return true;
            },
            
            // 上传成功回调，回调会根据切片循环，要终止上传循环，必须要return false，成功的情况下要始终返回true;
            success: (res) => {

                let data = res ? eval('(' + res + ')') : '';

                let url = data.url + "?" + Math.random();
                
                let file_index = data.file_index ? parseInt(data.file_index) : 1;

                if (data.status == 2) {
                    if (typeof ($("#" + domid)[0].dataset.cropperOption) != 'undefined') {
                        $("#" + domid).prev().html($('<img style="max-width:150px;" class="cropper" data-org="' + url + '" data-width="' + $.parseJSON($("#" + domid)[0].dataset.cropperOption).width + '" data-height="' + $.parseJSON($("#" + domid)[0].dataset.cropperOption).height + '" class="poster" src="' + url + '" alt="">'));
                    } else {
                        $("#" + domid).prev().html($('<img style="max-width:150px;" class="poster" src="' + url + '" alt="">'));
                    }
                    layer.msg('上传完成',{time:2000});
                }

                // 如果接口没有错误，必须要返回true，才不会终止上传循环
                return true;
            }

    });
}
var attached_file_Upload = function(domid){
    var attached_file_link_Upload = new fcup({
            id: domid, // 绑定id
    
            url: "/admin/scripts/fcup/server/fet/upload.ejs", // url地址
            
            check_url: "/admin/scripts/fcup/server/fet/check.ejs", // 检查上传url地址
    
            type: "zip,rar,pdf,doc,xls,xlsx", // 限制上传类型，为空不限制
    
            shard_size: "0.2", // 每次分片大小，单位为M，默认1M
    
            min_size: '', // 最小文件上传M数，单位为M，默认为无
    
            max_size: "201", // 上传文件最大M数，单位为M，默认200M
            
            // headers: {"version": "fcup-v2.0"}, // 附加的文件头,默认为null, 请注意指定header头时将不能进行跨域操作
            
            // apped_data: {}, //每次上传的附加数据
            
            // 定义错误信息
            error_msg: {
                1000: "未找到上传id",
                1001: "类型不允许上传",
                1002: "上传文件过小",
                1003: "上传文件过大",
                1004: "上传请求超时"
            },
            
            // 错误提示
            error: (msg) => {
                layer.msg(msg,{time:3000});
            },      
    
            // 初始化事件                
            start: () => {
                //Progress(0);
            },
    
            // 等待上传事件，可以用来loading
            before_send: () => {
                //console.log('等待请求中');
            },
    
            // 上传进度事件
            progress: (num, other) => {
                $("#" + domid + " span").text('已经上传：'+num+'%');
                if(num==100){
                    $("#" + domid + " span").text('点击更换');
                };
            },
            
            // 检查地址回调,用于判断文件是否存在,类型,当前上传的片数等操作
            check_success: (res) => {
            
                let data = res ? eval('(' + res + ')') : '';
                
                let status = data.status;
                
                let url = data.url;
                
                let msg = data.message;
                
                // 错误提示
                if (status == 1 ) {
                    layer.msg(msg,{time:600});
                    return false;
                }
                
                // 已经上传
                if (status == 2) {
                    $("#" + domid).prev().html($("<a href='" + data.url + "' class='btn btn-error'><span class='fa fa-file fw m-r'></span>" + data.name + "</a>"));
                    //layer.msg('图片已存在',{time:2000});
                    return false;
                }
                
                // 如果提供了这个参数,那么将进行断点上传的准备
                if(data.file_index){
                // 起始上传的切片要从1开始
                let file_index = data.file_index ? parseInt(data.file_index) : 1;
                // 设置上传切片的起始位置		   
                attached_file_link_Upload.set_shard(file_index);
                }
                
                // 如果接口没有错误，必须要返回true，才不会终止上传
                return true;
            },
            
            // 上传成功回调，回调会根据切片循环，要终止上传循环，必须要return false，成功的情况下要始终返回true;
            success: (res) => {
    
                let data = res ? eval('(' + res + ')') : '';
    
                let url = data.url + "?" + Math.random();
                
                let file_index = data.file_index ? parseInt(data.file_index) : 1;
    
                if (data.status == 2) {
                    $("#" +domid).prev().html($("<a href='" + data.url + "' download='"+ data.name +"' class='btn btn-error'><span class='fa fa-file fw m-r'></span>" + data.name + "</a>"));
                    layer.msg('上传完成',{time:2000});
                }
    
                // 如果接口没有错误，必须要返回true，才不会终止上传循环
                return true;
            }
    
    });
}
// 图片裁剪
var cropperImg = '', cropperImgLayer='';

$(document).delegate('img.cropper','click',function(){
    cropperImg = $(this);
    $cropperIframe = $("<iframe src='/admin/cropper?url="+ $(this).attr('data-org') +"&width="+ $(this).attr('data-width') +"&height="+ $(this).attr('data-height') +"' style='width:1000px;height:480px;position:fixed;top:50%;left:50%;z-index:1002;margin:-240px 0 0 -500px;box-shadow:0 0 0 1000px rgba(0,0,0,.3)'></iframe>");
    $cropperIframe.appendTo($('body'));
    cropperImgLayer = $cropperIframe;
    $(document).delegate('*', 'click.cropper', function (e) {
        cropperImgLayer.remove();
        $(document).undelegate('click.cropper');
    });
});
//移动到图片上提示裁剪
$(document).delegate('img.cropper', 'mouseenter', function () {
    $(this).wrap("<div class='cropper_wp' style='width:" + $(this).width() +"px;'></div>");
});
$("head").append($("<style>.cropper_wp{position:relative;}.cropper_wp::after{content:'点击图片裁剪';display:flex;align-items:center;justify-content:center;top:0;background:rgba(0,0,0,.3);left:0;height:18px;width:100%;color:#fff;font-size:12px;position:absolute;}</style>"));
$(document).delegate('img.cropper', 'mouseout', function () {
    $(this).unwrap("<div class='cropper_wp'></div>");
});

window.cropper = {};
window.cropper.callback = function(imgurlNew){
    cropperImg.attr('src', imgurlNew);
    cropperImgLayer.remove();
    $(document).undelegate('click.cropper');
}
window.cropper.close = function(){
    cropperImgLayer.remove();
    $(document).undelegate('click.cropper');
}
