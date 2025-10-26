module.exports = async (context, app, param) => {
    if (context.isAjax) {
        let fs = require('node:fs');
        //数据库格式
        //image_org image_new
        try {
            //每次裁剪后都是张新的图片，直接插入即可
            let newImgPathUrlPath = '/public/croper/' + app.getNowTime().date + '/';

            //创建图片存储文件夹
            if (!fs.existsSync(app.serverPath + '/view/' + newImgPathUrlPath)) {
                fs.mkdirSync(app.serverPath + '/view/' + newImgPathUrlPath, { recursive: true });
            }

            //生成图片全URL路径
            let newImgPathUrlPathFull = newImgPathUrlPath + app.lib.uuid().v4() + '-' + context.runtime + '.jpg';

            //保存图片
            let imgBuffer = Buffer.from(context.post.imagedata.split(',')[1], 'base64');
            fs.writeFileSync(app.serverPath + '/view/' + newImgPathUrlPathFull, imgBuffer);

            //保存数据到数据库
            let addData = {
                image_org: context.post.imagename.split('?')[0],
                image_new: newImgPathUrlPathFull,
                domain_id: context.session.get('user').domain_id
            }
            app.tables.cropper.add(addData);
            context.res.write(addData.image_new)
        } catch (e) {
            context.res.write('图片生成失败');
        }
        return;
    }
    return context.render('/view/admin/cropper.ejs')
}