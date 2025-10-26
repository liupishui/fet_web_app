$(function(){
    $(".form-pay_password .input_text").on('keyup',function(){
        $(".form-pay_password .item").text('');
        if($(this).val()==''){
            return;
        }
        $(this).val($(this).val().match(/\d+/)-0);
        $(this).val($(this).val().toString().substr(0,6)-0)
        var passwordTxt = $(this).val();
        for(i = 0;i<passwordTxt.toString().length;i++){
            $(".form-pay_password .item").eq(i).text($(this).parent().hasClass('password_show')?$(this).val().toString().substring(i,i+1):'·');
        }
    });

    //withdraw
    $(".form-widthdraw .input_text").on('keyup',function(e){
        if(e.keyCode==110||e.keyCode==229){
            $(".input_text_show",$(this).parent()).text($(this).val()+'.');
        }else{
            $(".input_text_show",$(this).parent()).text($(this).val());
        };
        $(this).width($(".input_text_show",$(this).parent()).width());
    })
    $(".form-widthdraw .input_text").trigger('keyup');
    
    //wallet
    $(".panel-wallet .hd .key").click(function(){
        var isShow = $(".icon-show",this).length;
        if(isShow){
            $(".icon-show",this).addClass('icon-hidden').removeClass('icon-show');
            $(this).next().text("******");
        }else{
            $(".icon-hidden",this).addClass('icon-show').removeClass('icon-hidden');
            $(this).next().text($(this).next().attr('data-value'));
        }
    });

    //find
    $(".list-find").delegate('.toolbar .btn-collect','click',function(){
        $(".iconfont",this)[0].className = $(".iconfont",this).hasClass('icon-collect')? "iconfont icon-collect_active":"iconfont icon-collect";
    })
    $(".list-find").delegate('.toolbar .btn-favorite','click',function(){
        $(".iconfont",this)[0].className = $(".iconfont",this).hasClass('icon-favorite')? "iconfont icon-favorite_active":"iconfont icon-favorite";
    })
    //群分组管理，设置分组
    $(".panel-group_grouping .btn-blue").click(function(){
        $(".panel-group_grouping .form").fadeIn(200);
    });
    $(".panel-group_grouping .btn-cancel").click(function(){
        $(".panel-group_grouping .form").fadeOut(200);
    });
    //分组管理，设置分组
    $(".panel-friend_grouping .btn-blue").click(function(){
        $(".panel-friend_grouping .form").fadeIn(200);
    });
    $(".panel-friend_grouping .btn-cancel").click(function(){
        $(".panel-friend_grouping .form").fadeOut(200);
    });

})
var renderWordIndex = function () {
    //address book
    var isTouchStart = false;
    var startIndex = 0;
    var currIndex = 0;
    var startPositionTop = 0;
    var runderIndexAddressBook = function(index) {
        $(".aside_bar_index .item").removeClass('curr');
        $(".aside_bar_index .item").eq(index).addClass('curr');
        var targetEl = $("#"+$(".aside_bar_index .item").eq(index).attr('data-target'));
        var positionTop = targetEl.position().top;
        if(positionTop == 0 ){
            return;
        }
        $('.list-address_book .container').stop(true,true).animate({scrollTop:$('.list-address_book .container').scrollTop()+positionTop - $(".list-address_book .container").offset().top-10},0)
    }
    $(".aside_bar_index").delegate('.item','touchstart',function(e){
        e.preventDefault();
        isTouchStart = true;
        startIndex = $(this).index();
        currIndex = $(this).index();
        startPositionTop = e.originalEvent.targetTouches[0].pageY;
        runderIndexAddressBook(currIndex);
    });
    $(".aside_bar_index").delegate('.item','touchmove',function(e){
        var moveLength = Math.round(e.originalEvent.targetTouches[0].pageY-startPositionTop);
        currIndex = startIndex + Math.round(moveLength/$(".aside_bar_index .item").height());
        if(currIndex<0){
            currIndex = 0;
        }
        if (currIndex > $(".aside_bar_index .item").length-1) {
            currIndex = $(".aside_bar_index .item").length-1;
        }
        runderIndexAddressBook(currIndex);
    })
    $(document).delegate('*','touchend',function(){
        isTouchStart = false;
        startIndex = 0;
        currIndex = 0;
        startPositionTop = 0;
        $(".aside_bar_index .item").removeClass('curr');
    });
}
//所有页面弹窗处理
$(".list-frend_group .item-hd").click(function(){
    $(this).parent().toggleClass('curr');
});


