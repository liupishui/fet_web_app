let paramProps = {
    modify:{
        type:'number',
        default:-1
    }
}

module.exports = async (context, app, param, setup)=> {
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    context.body.data.news_categories_all = await enterpriseInstance.news_categories_son({id:0}); 
    if(context.isAjax){
        let postProps = {
            modify:{
                type:'number',
                default:0
            },
            sort:{
                type:'number',
                default:99
            },
            id:{
                type:'number',
                default:0
            },
            pid:{
                type:'number',
                default:0
            }
        }
        setup(context.post,postProps);
        if(context.post.modify!==-1){
            //修改
            context.post.id = context.post.modify;
            //不能改分类到子分类下
                //获取子分类
            let nodeSon = await enterpriseInstance.news_categories_son({id:context.post.id});
            for(let i=0;i<nodeSon.length;i++){
                if(nodeSon[i].id === context.post.pid){
                    return context.toSTRING('不能将分类移动到子分类下面');
                }
            }
            //修改到的分类不能有同名分类
            let category = app.tables['news_categories'].get({name:context.post.name,pid:context.post.pid});
            if(category.length > 0){
                //如果有同名分类
                return context.toSTRING('此分类下有同名分类,禁止添加');
            }
            setup(context.post,{id:{type:'number',default:-1}});
            app.tables['news_categories'].update(context.post,`id=${context.post.id} and domain_id=${context.session.get('user').domain_id}`)
            return context.toSTRING('修改成功');
        }else{
            //添加
            //不能添加重名分类
            let category = app.tables['news_categories'].get([{domain_id:context.session.get('user').domain_id,name:context.post.name,pid:context.post.pid},{name:context.post.name,pid:context.post.pid,is_system:1}]);
            if(category.length > 0){
                //如果有同名分类
                return context.toSTRING('此分类下有同名分类,禁止添加');
            }
            delete context.post.id;
            context.post.domain_id = context.session.get('user').domain_id;
            app.tables['news_categories'].add(context.post);
            return context.toSTRING('添加成功');            
        }
    }
    context.body.data.modify = param.modify;
    if(param.modify!==-1){
        context.body.data.categoryMofify = app.tables.news_categories.get({id:param.modify,domain_id:context.session.get('user').domain_id})[0];
        if(typeof(context.body.data.categoryMofify)==='undefined'){
            return context.toSTRING('您无修改此分类的权限');
        };
    }
    return context.render('/view/admin/category_add.ejs',context.body.data);
}
/**
 * <?php
    include $_SERVER['DOCUMENT_ROOT'].'/admin/class/common.php';

    $news_categories = new \core\model\news_categories;
    $news_categories_all = $news_categories->get_all();

    $tree = new \core\lib\tree;
    $news_categories_all = $tree->subtree($news_categories_all,0,1);
    if($_GET['modify']){
        $categoryMofify = $news_categories->get_one('id='.$_GET['modify']);
    }
    if(ISAJAX){
        //判断插入和修改
        if(empty($_POST[':sort'])){
            $_POST[':sort']=99;
        }
        if($_POST['modify']==0){
            //插入
            $news_categories->insert($_POST);
            echo "添加成功";
        }else{
            //修改
             //不能修改到子级目录下
            $tree = new \core\lib\tree;
            $son = $tree->findson($news_categories_all,$_POST['modify']);
            $canModify = true;
            foreach($son as $key=>$val){
                if($val['id']==$_POST['pid']){
                    $canModify = false;
                }
            }
            if($canModify){
                $news_categories -> update($_POST,'id='.$_POST['modify']);
                echo '修改成功';
            }else{
                echo '修改失败';
            }
        }
        exit();
    }
?>
 */