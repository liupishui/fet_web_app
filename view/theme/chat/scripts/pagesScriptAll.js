var pagesScriptAll = {
    account: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    address_book: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    avatar_upload: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    bank: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    chat: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    chat1: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    chat_background: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    chat_box: {
        show: function (param) {
            var that = this;
            console.log(that, param);
            setTimeout(function(){
                $(".list-chat_box").scrollTop($(".list-chat_box")[0].scrollHeight);
            },100);
            document.getElementById('textareaChatInput').addEventListener('input',function(){
                document.getElementById('textareaChatInputTxt').innerText = document.getElementById('textareaChatInput').value;
                if(document.getElementById('textareaChatInputTxt').innerText==''){
                $(".form-chat_box .btn-send").removeClass('active'); 
                $(".form-chat_box .btn-upload").show(0);  
                }else{
                    $(".form-chat_box .btn-upload").hide(0);  
                    $(".form-chat_box .btn-send").addClass('active');   
                }
                $(".list-chat_box").scrollTop($(".list-chat_box")[0].scrollHeight);
            })
            //初始化表情
            var EmojiHtmls = '';EmojiHtmlsTemp = '<div class="swiper-slide">';
            emojiArr.forEach((emoji,index)=>{
                EmojiHtmlsTemp += '<button class="btn-emoji">' + emoji.unicode + '</button>';
                if((index+1)%27==0){
                    EmojiHtmlsTemp += '</div>';
                    EmojiHtmls += EmojiHtmlsTemp;
                    EmojiHtmlsTemp = '<div class="swiper-slide">';
                }
                if((index+1)%27 > 0){
                    if (index === emojiArr.length-1) {
                        EmojiHtmlsTemp += '</div>';
                        EmojiHtmls += EmojiHtmlsTemp;
                    }
                }
            })
            $(".swiper-emoji .swiper-wrapper").html(EmojiHtmls);
            var swiper = new Swiper(".swiper-emoji", {
                                loop:false,
                                autoplay: false,
                                pagination: {
                                el: ".tool-emoji .swiper-pagination",
                                clickable: true,
                                renderBullet: function (index, className) {
                                    return '<span class="' + className + '">' + (index + 1) + "</span>";
                                },
                                },
                            });
            //初始化表情结束
            //表情输入
            $(".tool-emoji").delegate('.btn-emoji','click',function(e){
                    var emojiTxt = $.trim($(this).text());
                    const start = $("#textareaChatInput")[0].selectionStart;
                    const end = $("#textareaChatInput")[0].selectionEnd;
                    $("#textareaChatInput").val($("#textareaChatInput").val().slice(0, start) + emojiTxt + $("#textareaChatInput").val().slice(end));
                    $("#textareaChatInput").focus();
                    $("#textareaChatInput")[0].selectionEnd = start + emojiTxt.length;
                    // 创建一个 InputEvent 对象
                    const inputEvent = new InputEvent('input', {
                        bubbles: true,
                        cancelable: true
                    });
                    // 使用 dispatchEvent() 方法触发 input 事件
                    $("#textareaChatInput")[0].dispatchEvent(inputEvent);
            });
            //表情删除
            $(".tool-emoji .btn-emoji_del").click(function(){
                const start = $("#textareaChatInput")[0].selectionStart;
                const end = $("#textareaChatInput")[0].selectionEnd;
                if(start===0){
                    $("#textareaChatInput").focus();
                    $("#textareaChatInput")[0].selectionEnd = start;
                    return;
                }
                var inputText = $("#textareaChatInput").val();
                var preInputArr = Array.from(inputText.slice(0, start));
                var delText = preInputArr.pop();
                $("#textareaChatInput").val(preInputArr.join('') + inputText.slice(end));
                $("#textareaChatInput").focus();
                $("#textareaChatInput")[0].selectionEnd = start-delText.length;
                // 创建一个 InputEvent 对象
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true
                });
                // 使用 dispatchEvent() 方法触发 input 事件
                $("#textareaChatInput")[0].dispatchEvent(inputEvent);
            });
            //表情列表显示隐藏
            $(".form-chat_box .btn-expression").click(function(){
                $(".tool-more").removeClass('show');
                if($(".tool-emoji").hasClass('show')){
                    $(".tool-emoji").removeClass('show');
                }else{
                    $("#textareaChatInput").focus();
                    $(".tool-emoji").addClass('show');
                }
    
                $(".list-chat_box").scrollTop($(".list-chat_box")[0].scrollHeight);
    
            });
            $(document).delegate('*','click',function(e){
                if ($(".form-chat_box .textarea_wp").find(e.target).length>0||$(".form-chat_box .btn-expression").find(e.target).length>0||$(".form-chat_box .btn-expression")[0]==e.target) {
                    return;
                }
                if($(".form-chat_box .tool-emoji").find(e.target).length==0){
                    $(".form-chat_box .tool-emoji").removeClass('show');
                }
            })
    
            //其他工具显示隐藏
            $(".form-chat_box .btn-upload").click(function(){
                $(".tool-emoji").removeClass('show');
                $(".tool-more").toggleClass('show');
                $(".list-chat_box").scrollTop($(".list-chat_box")[0].scrollHeight);
            });
            $(document).delegate('*','click',function(e){
                if ($(".form-chat_box .btn-upload").find(e.target).length>0||$(".form-chat_box .btn-upload")[0]==e.target) {
                    return;
                }
                if($(".form-chat_box .tool-more").find(e.target).length==0){
                    $(".form-chat_box .tool-more").removeClass('show');
                }
            })
    
        }
    },
    chat_box_group: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    comment: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    find: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    friend_add: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    friend_group: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    friend_grouping: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    friend_remark: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    get_pay_password: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    group_ann_modify: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    group_desc_modify: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    group_grouping: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    group_info: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    group_list: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    group_make: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    group_manage: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    group_manager_set: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    group_name_modify: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    login: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    login_pasword_modify: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    login_pasword_reset: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    login_pasword_reset1: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    main: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    member: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    mobile_reset: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    moments: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    moments_publish: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    nickname_reset: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    pay_password_confirm: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    pay_password_modify: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    pay_password_set: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    person_info: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    profile: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    qianming_reset: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    qrcode: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    qrcode_group: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    register: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    setting: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    sex_reset: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    sign: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    start: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    wallet: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    wallet_record: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
    withdraw: {
        show: function (param) {
            var that = this;
            console.log(that, param);
        }
    },
}
