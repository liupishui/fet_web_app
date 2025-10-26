function getNormalSize({ width, height, orientation }) {
    return (orientation || 0) >= 5
      ? { width: height, height: width }
      : { width, height };
  }
let fs = require('node:fs');
let path = require('node:path');
    /*
    * 图片加水印
    * $source  string  图片资源
    * $target  string  添加水印后的名字
    * $w_pos   int     水印位置安排（1-10）【1:左头顶；2:中间头顶；3:右头顶...值空:随机位置】
    * $w_img   string  水印图片路径
    * $w_text  string  显示的文字
    * $w_font  int     字体大小
    * $w_color string  字体颜色
   */
let watermark = async (context,app,$source, $target = '', $w_pos = '', $w_img = '', $w_text = '',$w_font = 10, $w_color = '#CC0000')=>{
    // console.log(__dirname,this);
    let sharp = app.lib.sharp();
    let gravity = '';
    switch ($w_pos){
        case 1:gravity = 'northwest';
        break;
        case 2:gravity = 'north';
        break;
        case 3:gravity = 'northeast';
        break;
        case 4:gravity = 'west';
        break;
        case 5:gravity = 'center';
        break;
        case 6:gravity = 'east';
        break;
        case 7:gravity = 'southwest';
        break;
        case 8:gravity = 'south';
        break;
        case 9:gravity = 'southeast';
        break;
        case 10:gravity = Math.ceil(9*Math.random());
        break;
    }
    let compositeImgs=[];
    if($w_img&&fs.existsSync($w_img)){
        compositeImgs.push({input:$w_img,gravity:gravity});
    }
    if($w_text){
        compositeImgs.push({input:{text:{text:`<span foreground="${$w_color}">${$w_text}</span>`,font:"Simsun",rgba:true,blend:"cover"}},gravity:gravity});
    }

    if($source===$target){
        let imgData = await sharp($source).composite(compositeImgs).toBuffer();
        fs.unlinkSync($source);//sharp 目标文件和源文件不能是同一个文件
        fs.writeFileSync($target,imgData);
    }else{
        let imgData = await sharp($source).composite(compositeImgs).toFile($target);
        fs.writeFileSync($target,imgData);
    }
   
    return $target;

}
let size = async function(context,app,$filepath){
    let sharp = app.lib.sharp();
    let metadata = await sharp($filepath).metadata();
    return getNormalSize(metadata);
}
module.exports = {
    watermark,
    size
}
