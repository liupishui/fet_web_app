let paramProps = {
    sort:{
        type:'string',
        default:'id'
    },
    order:{
        type:'string',
        default:'desc'
    },
    offset:{
        type:'number',
        default:0
    },
    limit:{
        type:'number',
        default:20
    }
}
module.exports= async function(context,app,param,setup){
    let enterprise = require('../../utils/enterprise');
    let enterpriseInstance = new enterprise(context, app);
    setup(paramProps);
    if(context.isAjax){
        let postProps = {
            delid:{
                type:'number',
                default:-1    
            }
        }
        setup(context.post,postProps);
        if(context.post.delid!==-1){
            app.tables['clientssay'].delete({id:context.post.delid,domain_id:context.session.get('user').domain_id});
            return context.toSTRING('删除成功');
        }else{
            /**
             * condition, params, offset, limit
             */
            let condition = '';
            let params = {};
            let offset = param.offset;
            let limit = param.limit;
            let data = await enterpriseInstance.clientssay_list(
                condition
                ,params
                ,offset
                ,limit
                )
            return context.toJSON(data);
        }
    }
    return context.render('/view/admin/clientSay_list.ejs',context.body.data);
}
/**
<?php
    include $_SERVER['DOCUMENT_ROOT'].'/admin/class/common.php';
    if(ISAJAX){
        if(isset($_POST['clientSay'])){
            //删除用户评价
            $clientssay = new \core\model\clientssay;
            echo $clientssay->delete('id='.$_POST['clientSay']);
            exit();
        }
        $pageoperater = new \core\lib\pageoperater;
        $pageoperater -> sqlStr = 'select * from clientssay where 1=1 order by id desc';
        $pageoperater -> pageSize = $_GET['limit'];
        $pageoperater -> pageCurrent = ceil($_GET['offset']/$_GET['limit'])+1;
        //当前行
        $returnBoot->rows = $pageoperater -> getDataList();
        $tree = new \core\lib\tree;

        $returnBoot->rows = $tree->subtree($returnBoot->rows,0,0);
        //总数据量
        $returnBoot->total = $pageoperater -> rowSize;
        //总页数
        $returnBoot->page = $pageoperater -> pageTotal;
        // $returnBoot=new stdClass();    
        echo json_encode($returnBoot);
        exit();

    }
?>
**/