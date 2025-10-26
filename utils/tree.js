/**
 * The `familytree` function takes an array of objects and an ID, and returns an array of all the
 * parent elements of the object with the given ID. 从某个节点元素开始查找所有父级元素
 * @param {Array} arr - The arr parameter is an array of objects representing the family tree. Each object in
 * the array represents a person and has the following properties:
 * @param {Number} id - The id parameter is the unique identifier of the starting node in the family tree.
 * @returns {Array} The function `familytree` returns an array `listFamily` which contains all the parent
 * elements of the given `id` in the `arr` array.
 */
function familytree (arr,id){
    let listFamily = [];
    let findParent = function(arr,id){
        arr.forEach(item=>{
            if(item.id===id){
                listFamily.unshift(item);
                findParent(arr,item.pid);
            }
        });
    };
    findParent(arr,id);
    return listFamily;
}
/**
 * The function `findson` takes an array of objects and an optional `id` parameter, and returns an
 * array of objects that have a matching `id` value. //查找某个元素的子元素
 * @param {Array} arr - The arr parameter is an array of objects. Each object represents an element and has an
 * id property.
 * @param {number} [id=0] - The id parameter is the identifier of the element whose child elements you want to
 * find.
 * @returns {Array} The function `findson` returns an array containing the elements that have a matching `id`
 * value with the provided `id` parameter.
 */
function findson (arr,id=0) {
    let arrRst = [];
    arr.forEach(item=>{
        if(item.pid === id){
            arrRst.push(item);
        }
    });
    return arrRst;
}
/**
 * The function `subtree` is used to find all the descendants of a given node in a tree-like data
 * structure represented by an array.//查找子孙树
 * @param {Array} arr - The arr parameter is an array of objects representing nodes in a tree. Each object in
 * the array should have the following properties:
 * @param {number} [pid=0] - The `pid` parameter is the parent ID of the nodes you want to find in the subtree.
 * By default, it is set to 0, which means it will find the subtree starting from the root node.
 * @param {number} [level=0] - The level parameter represents the depth or level of the current node in the
 * tree. It starts with 0 for the root node and increments by 1 for each level down the tree.
 * @returns {Array} The function `subtree` returns an array containing the subtree of the given array `arr`
 * based on the specified `pid` (parent ID) and `level` (depth).
 */
function subtree (arr,pid=0,level=0){
    let arrRst = [];
    let getSubtree = function(arr,pid=0,level=0){
        arr.forEach(function(item){
            let levelCurr = level;
            if(item.pid===pid){
                item.level = levelCurr;
                arrRst.push(item);
                levelCurr++;
                getSubtree(arr, item.id, levelCurr);
            }
        });          
    }
    getSubtree(arr,pid,level);
   // console.log(arrRst);
    return arrRst;
}
module.exports = {
    familytree,
    findson,
    subtree
}