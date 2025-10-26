async function stock_zh_a_hist(stock_code){
    let aktools = this.require('/utils/aktools.js');
    let aktoolsInstance = new aktools(this.context,this.app);
    return aktoolsInstance.stock_zh_a_hist(stock_code);
}
module.exports  = {stock_zh_a_hist}