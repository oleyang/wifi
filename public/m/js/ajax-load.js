Do.ready('bbq-js', 'iscroll-js', function(){
	
/**
 * jQuery 选项卡
 * Date: 2013-4-18
 */
	(function($) {
		$.fn.tab = function(options) {
			var o = $.extend({
				num: 1,
				contents: ".contents"
			}, options || {});
			var CHOOSE = "choose";
			var HIDE = "ku_thide";
			
			this.each(function() {
				var tab = $(this).children("[data-role=tab]"),
					content = $(".hashchangeCache:visible").find("[data-role=content]");
				tab.eq(o.num).addClass(CHOOSE).siblings().removeClass(CHOOSE);
				
				$(".hashchangeCache:visible").find("[data-role=content]").eq(o.num).removeClass(HIDE).siblings().addClass(HIDE);
				
				tab.bind({
					"click": function() {
						var t = $(this), i = t.index();
						t.addClass(CHOOSE).siblings("." + CHOOSE).removeClass(CHOOSE);
						$(".hashchangeCache:visible").find("[data-role=content]").eq(i).removeClass(HIDE).siblings().addClass(HIDE);
					}
				});
				
			});
		};
	})(jQuery);

	$("#store_tabs").tab();
	$("#goods_tabs").tab();

///// jquery封装iscroll
	(function($){
		$.fn.iscroll = function(options){
			if(this.data('iScrollReady') == null){
				var that = this;
				var options =  $.extend({}, options);
					options.onScrollEnd = function(){
						that.triggerHandler('onScrollEnd', [this]);
					};
				arguments.callee.object  = new iScroll(this.get(0), options);
				// NOTE: for some reason in a complex page the plugin does not register
				// the size of the element. This will fix that in the meantime.
				setTimeout(function(scroller){
					scroller.refresh();
				}, 1000, arguments.callee.object);
				this.data('iScrollReady', true);
			}else{
				arguments.callee.object.refresh();
			}
			return arguments.callee.object;
		};
	})(jQuery);
	
///// ajax加载页面 开始
	var cache = {
		'': $('.bbq-default')
	};
	
	$(window).bind( 'hashchange', function(e) {
		// 得到#号后面的内容
		var url = $.param.fragment();
		// 得到模块名
		var mod;
		// 得到页面名
		var page;
		
		if ( url.indexOf('&') > 0 ){
			mod = url.split("&")[0].split("/")[1];
			page  = url.split("&")[0].split("/")[2];
		} else {
			mod = url.split("/")[1];
			page  = url.split("/")[2];
		}

		$('.ajax_box .hashchangeCache').hide();
		// 所有的非当前的模块隐藏
		$('.ajax_box').not( $( '#ajax_' + mod ) ).hide();
		$( '#ajax_' + mod ).show();
			
		// 如果 url 已经缓存，则显示对应的内容
		if ( cache[ url ] ) {
			if(mod == undefined)
			{
				//alert('无hash');
				//var state = '#index.php'
				//$.bbq.pushState( state );
				$( '#ajax_index' ).show();
				return;
			}
			
			//alert('显示缓存页面');s
			cache[ url ].closest('#ajax_' + mod).show();
			cache[ url ].show();

			// 局部ajax刷新
			ajax_update(mod + '/' + page);
		} 
		// 否则在知道的 div 中载入新的内容
		else 
		{
			//alert('载入新页面');
			// 判断 欢迎模块是否显示
			var isShow_welcome = ( $(".box_welcome").css('display') == 'none');
			if(isShow_welcome)
			{
				$( '#ajax_' + mod ).find('.mod_loading').show();
			}
			// 载入新页面
			$.ajax({
				url: url,
				complete: function() {
					//cache[ url ] = $('.hashchangeCache');
					//console.log(cache[ url ]);
					Do.getData('cache', function(value) {
						cache[ url ] = value;
					});
				},
				success: function(data) {
					$('#ajax_' + mod).find('.load_html').data('data-json',data).click();
					//cache[ url ] = $( '<div class="bbq-item"/>' ).appendTo('#ajax_' + mod).html(data);
					$('.box_welcome').fadeOut();
					$( '#ajax_' + mod ).find('.mod_loading').fadeOut();
					// 页面加载成功后执行页面内函数
					page_function(mod + '/' + page);
				}	
			});
			/*
			cache[ url ] = $( '<div class="bbq-item"/>' )
				.appendTo( '#ajax_' + mod )
				.load( url, function(){
										$('.box_welcome').fadeOut();
										$( '#ajax_' + mod ).find('.mod_loading').fadeOut();
										// 页面加载成功后执行页面内函数
										page_function(mod + '/' + page);
									}
					);
			*/
			// 当前模块滑入视图
			$('#ajax_' + mod).fadeIn();
		}
	})
	
	$(window).trigger( 'hashchange' );
	// ajax加载页面 结束

///// ajax 根据路径更新对应页面的内容 开始
	function ajax_update(e){
		switch(e)
		{ 
			case 'userCenter/index':
			//alert(e);
			break;
			
			default:
			break;
		}
	}
	// ajax 根据路径更新对应页面的内容 结束

///// 页面内函数
	function page_function(e){
		switch(e)
		{ 
			case 'index/content':
			//alert('首页');
			iscroll_index_content();
			js_back();
			break;

			case 'search/index':
			//alert('搜索');
			iscroll_search_index();
			js_back();
			break;

			case 'store/index':
			//alert('店铺');
			iscroll_store_index();
			js_back();
			break;

			case 'goods/index':
			//alert('商品');
			iscroll_goods_index();
			js_back();
			break;
			
			default:
			break;
		}
	}
	// ajax 根据路径更新对应页面的内容 结束
			
			
///// 一个个小函数

	// 后退
	function js_back(){
		$('.js_back').click(function(){
			history.back();
		});
	}
	
///// 页面滚动
	// 首页
	function iscroll_index_content(){	
		$('#js_index_content_wrapper').iscroll({ checkDOMChanges: true, scrollbarClass: 'myScrollbar' });
		$('#js_index_content_wrapper').bind('onScrollEnd', function(){
			//alert( '到底了' );
		});
	}
	iscroll_index_content();
	
	// 搜索
	function iscroll_search_index(){	
		$('#js_search_index_wrapper').iscroll({ checkDOMChanges: true, scrollbarClass: 'myScrollbar' });
		$('#js_search_index_wrapper').bind('onScrollEnd', function(e, iscroll){
			//alert($(this).attr('id') +' - '+ iscroll);
		});
	}
	iscroll_search_index();
	// 商家
	function iscroll_store_index(){	
		$('#js_store_index_wrapper').iscroll({ checkDOMChanges: true, scrollbarClass: 'myScrollbar' });
		
	}
	iscroll_store_index();
	// 商品
	function iscroll_goods_index(){	
		$('#js_goods_index_wrapper').iscroll({ checkDOMChanges: true, scrollbarClass: 'myScrollbar' });
		$('#js_goods_index_wrapper').bind('onScrollEnd', function(e, iscroll){
			//alert($(this).attr('id') +' - '+ iscroll);
		});
	}
	iscroll_goods_index();
});
