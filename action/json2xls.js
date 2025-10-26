const { resolve } = require('path');

module.exports = async (context,app,param)=>{
    let jexcel = require('json2excel');
    let data = {
        sheets: [{
            header: {
                'id': 'id',
                'link': 'link',
                'title': 'title',
                'author': 'author',
                'time': 'time',
                'avatar': 'avatar',
                'favouriteVideo': 'favouriteVideo',
                'fans': 'fans',
                'favouriteAuthor': 'favouriteAuthor',
            },
            items: [
            ],
            sheetName: 'sheet1',
        }],
        filepath: 'j2x.xlsx'
    };
    data.sheets[0].items = app.sqlite.DB('douyin').tables.douyin1.getAll();
    console.log(data.items);
    let json2excel = function(){
        return new Promise((resolve,reject)=>{
            jexcel.j2e(data,function(err){ 
                resolve(true);
            });        
        });
    }
    await json2excel();
    return context.toSTRING('结束');
}