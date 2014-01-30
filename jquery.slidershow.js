/*
 * Slider Show jQuery plugin v1.1.0
 *
 * Copyright (c) 2014 Ryszard Narkiewicz @RyszardRudy
 * Licensed under MIT licence
 *  
 */
(function($) {

    var sliderTimer;
    // Plugin methods
    var methods = {
        /**
         * Initialize the sliderShow
         * @param {boject} options for the initialization
         * @returns {unresolved}
         */
        init: function(options) {
            return $(this).each(function() {
                var $this = $(this);
                var settings = $.extend({
                    animation_timeout: 3000,
                    child_selector: ".slide",
                    pager_selector: ".pager",
                    pager_item: ".pager-item",
                    switch_speed: 300
                }, options);
                var childrenCount = $this.find(settings.child_selector).length;
                if (childrenCount < 2 || $this.hasClass("slider-show")) {
                    $this.find(settings.pager_selector).hide();
                    return;
                }

                $this.addClass("slider-show");
                $this.data("sliderShow", {
                    child_selector: settings.child_selector,
                    pager_item: settings.pager_item,
                    slide_count: childrenCount,
                    active_slide_index: -1,
                    animation_timeout: settings.animation_timeout,
                    switch_speed: settings.switch_speed,
                    can_continue: true
                });
                $this.sliderShow('applyEvents');
                $this.sliderShow('loopItems');
            });
        },
        applyEvents: function() {
            return $(this).each(function() {
                var $this = $(this);
                $this.on("mouseenter.sliderShow", function() {
                    $this.sliderShow("holdAnimation");
                });
                $this.on("mouseleave.slider-show", function() {
                    $this.sliderShow("resumeAnimation");
                });
                $this.on("click.sliderShow", $this.data('sliderShow').pager_item, function() {
                    var $pagerItem = $(this);
                    var data = $this.data("sliderShow");
                    var itemIndex = $pagerItem.index();
                    if (itemIndex !== data.active_slide_index) {
                        $this.sliderShow('showSlide', itemIndex);
                    }
                });
            });
        },
        holdAnimation: function() {
            return $(this).each(function() {
                $(this).data("sliderShow").can_continue = false;
                clearTimeout(sliderTimer);
            });
        },
        resumeAnimation: function() {
            return $(this).each(function() {
                var $this = $(this);
                $this.data("sliderShow").can_continue = true;
                sliderTimer = setTimeout(function() {
                    $this.sliderShow('loopItems');
                }, $this.data("sliderShow").animation_timeout);
            });
        },
        showSlide: function(slideIndex) {
            return this.each(function() {
                $(this).sliderShow('setActiveSlide', slideIndex);
                $(this).sliderShow('unsetActive');
                $(this).sliderShow('setActivePager', slideIndex);
                $(this).sliderShow('processSlideshow');
            });
        },
        setActiveSlide: function(index) {
            return this.each(function() {
                $(this).data("sliderShow").active_slide_index = index;
                //we could add some class to it, 
                //but I'm just being lazy and relying on data
            });
        },
        setActivePager: function(index) {
            return this.each(function() {
                var $this = $(this);
                var data = $this.data("sliderShow");
                var $nextPager = $this.find(data.pager_item + ":eq(" + index + ")");
                $nextPager.addClass("active");
            });
        },
        unsetActive: function() {
            return this.each(function() {
                var $this = $(this);
                var data = $this.data("sliderShow");
                var $previousItem = $this.find(data.pager_item + ".active");
                $previousItem.removeClass("active");
            });
        },
        processSlideshow: function() {
            return this.each(function() {
                $(this).sliderShow('hideInactiveSlides');
                $(this).sliderShow("showActiveSlide");
            });
        },
        hideInactiveSlides: function() {
            return $(this).each(function() {
                var $this = $(this);
                var data = $this.data("sliderShow");
                var $slide = $this.find(data.child_selector).not(":eq(" + data.active_slide_index + ")");
                $slide.css({'z-index': 1});
                $slide.stop().animate({
                    opacity: 0
                }, data.switch_speed);
            });
        },
        showActiveSlide: function() {
            return $(this).each(function() {
                var $this = $(this);
                var data = $this.data("sliderShow");
                var $slide = $this.find(data.child_selector + ":eq(" + data.active_slide_index + ")");
                $slide.css({'z-index': 2});
                $slide.stop().animate({
                    opacity: 1
                }, data.switch_speed);
            });
        },
        loopItems: function() {
            var $this = $(this);
            var data = $this.data("sliderShow");
            if (data.can_continue) {
                var activeIndex = data.active_slide_index;
                activeIndex = (activeIndex + 1) % data.slide_count;
                $this.sliderShow('hideInactiveSlides');
                $this.sliderShow('showSlide', activeIndex);

                sliderTimer = setTimeout(function() {
                    if ($this !== undefined && data.can_continue) {
                        return $this.sliderShow('loopItems');
                    }
                }, data.animation_timeout);
            }
        }
    };
    /**
     * Initialize the side slider
     * 
     * @param {string} method to run
     * @returns {unresolved|@exp;methods@pro;init@call;apply}
     */
    $.fn.sliderShow = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.sliderShow');
        }
    };
})(jQuery);
