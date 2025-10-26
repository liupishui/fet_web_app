/*
 * metismenu - v1.1.3
 * Easy menu jQuery plugin for Twitter Bootstrap 3
 * https://github.com/onokumus/metisMenu
 *
 * Made by Osman Nuri Okumus
 * Under MIT License
 */
;(function($, window, document, undefined) {

    var pluginName = "metisMenu",
        defaults = {
            toggle: false,
            doubleTapToGo: false
        };

    function Plugin(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            var $this = this.element,
                $toggle = this.settings.toggle,
                obj = this;
                $this.find('.dropdown-menu').mouseleave(function(){
                    $this.find('.profile-element').removeClass('open');
                })
            if (this.isIE()&&this.isIE()<10) {
                if(this.isIE()<8){//ie7 scroll not smothing
                    var setRelativeParent=function(ele){
                        if(ele.tagName.toLowerCase()!='html'){
                            if($(ele).css('position')!='absolute'&&$(ele).css('position')!='fixed'){
                                $(ele).css('position','relative');
                                setRelativeParent($(ele).parent()[0]);
                            }
                        }
                    }
                    setRelativeParent($("#side-menu")[0]);
                }
                $('a').prop('hideFocus',true);
               //$this.find("li.active").has("ul").children("ul").collapse("show");
               // $this.find("li").not(".active").has("ul").children("ul").collapse("hide");
               $avator=$('li:first',$this);
               $this.delegate('li','click',function(e){
                if($(this)[0]!=$avator[0]){
                    var $that=$(this);
                    $(this).siblings().removeClass('active');
                    $(this).siblings().filter(function(){
                        return !$(this).hasClass('nav-header');
                    }).each(function(){
                        $('ul',this).slideUp(200);
                    });
                    $(this).children().each(function(){
                        if($(this)[0].tagName.toLowerCase()=='ul'){
                            $that[$(this).css('display')=='none'?'addClass':'removeClass']('active');
                            if(obj.isIE()<8){
                                $that.children('a').find('.arrow').html($(this).css('display')=='none'?'&#xf107;':'&#xf104;');
                            }
                            $(this)[$(this).css('display')=='none'?'slideDown':'slideUp'](200);
                        };
                    });
                };
                e.stopPropagation();
               });
                $('*',$this).click(function(e){
                    if($(e.target).hasClass('J_menuItem')){
                        $(this).parent().siblings().removeClass('active').find('ul').css('display','none');
                    }else{
                        if($('li:first .dropdown-toggle',$this).find($(e.target)).length>0){
                            $('li:first .profile-element',$this)[$('li:first .profile-element',$this).hasClass('open')?'removeClass':'addClass']('open');
                        }else{
                            e.preventDefault();
                        }
                    };
                });
               $('li:gt(0) ul',$this).css('display','none');
            } else {
                $this.find("li.active").has("ul").children("ul").addClass("collapse in");
                $this.find("li").not(".active").has("ul").children("ul").addClass("collapse");

                //add the "doubleTapToGo" class to active items if needed
                if (obj.settings.doubleTapToGo) {
                    $this.find("li.active").has("ul").children("a").addClass("doubleTapToGo");
                }
                $this.find("li").has("ul").children("a").on("click" + "." + pluginName, function(e) {
                    e.preventDefault();
                    //Do we need to enable the double tap
                    if (obj.settings.doubleTapToGo) {

                        //if we hit a second time on the link and the href is valid, navigate to that url
                        if (obj.doubleTapToGo($(this)) && $(this).attr("href") !== "#" && $(this).attr("href") !== "") {
                            e.stopPropagation();
                            document.location = $(this).attr("href");
                            return;
                        }
                    }

                    $(this).parent("li").toggleClass("active").children("ul").collapse("toggle");

                    if ($toggle) {
                        $(this).parent("li").siblings().removeClass("active").children("ul.in").collapse("hide");
                    }
                });
            }
        },
        isMobile:function(){
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))){
                return true;
            }else{
                return false;
            }
        },
        isIE: function() { //https://gist.github.com/padolsey/527683
            var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
            while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
            return v > 4 ? v : false;
        },

        //Enable the link on the second click.
        doubleTapToGo: function(elem) {
            var $this = this.element;

            //if the class "doubleTapToGo" exists, remove it and return
            if (elem.hasClass("doubleTapToGo")) {
                elem.removeClass("doubleTapToGo");
                return true;
            }

            //does not exists, add a new class and return false
            if (elem.parent().children("ul").length) {
                //first remove all other class
                $this.find(".doubleTapToGo").removeClass("doubleTapToGo");
                //add the class on the current element
                elem.addClass("doubleTapToGo");
                return false;
            }
        },

        remove: function() {
            this.element.off("." + pluginName);
            this.element.removeData(pluginName);
        }

    };

    $.fn[pluginName] = function(options) {
        this.each(function () {
            var el = $(this);
            if (el.data(pluginName)) {
                el.data(pluginName).remove();
            }
            el.data(pluginName, new Plugin(this, options));
        });
        return this;
    };

})(jQuery, window, document);
