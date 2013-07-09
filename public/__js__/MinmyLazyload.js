(function($) {
    $.fn.lazyload = function(options) {
        var settings = {
            threshold: 0,
            failurelimit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            original: "original",
            firstCount: 10, //第一次加载数量
            everyCount: 3,   //以后每次加载
            moveScrollTop: 100//每次移动多少像素加载
        };
        if (options) {
            $.extend(settings, options);
        }
        var elements = this;
        var self = this;
        var count = 0;
        if (settings.placeholder) {
            $(self).attr("src", settings.placeholder);
        }
        for (i = 0; i < settings.firstCount; i++) {
            var trueSrc = $(elements[i]).attr(settings.original);
            $(elements[i]).attr("src", trueSrc);
            $(elements[i]).attr(settings.original, "finish");

        }
        $(window).scroll(function() { 
            elements = $("img@[" + settings.original + "!='finish']"); //获取未加载图片集
            var i = 0;
            for (i = 0; i < settings.everyCount; i++) {
                var trueSrc = $(elements[i]).attr(settings.original);

                $(elements[i]).hide().attr("src", trueSrc)[settings.effect](settings.effectspeed);
                
                
               // $(elements[i]).attr("src", trueSrc);
                $(elements[i]).attr(settings.original, "finish");
                if (elements.length == 0) {
                    $(window).unbind("scroll");
                };
            }
            count++;
        });
        return false;
    };
})(jQuery);