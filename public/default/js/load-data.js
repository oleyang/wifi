var miso = window.miso || {};
function initMiso() {
	destroyScroll(miso.searchScroll);
	destroyScroll(miso.hadsearchScroll);
	if(miso.tabScrollObject) {
		for(var i in miso.tabScrollObject) {
			destroyScroll(miso.tabScrollObject[i]);
		};
	}
	miso = {
		cache: { '': 'cache', len: 0 }, //页面缓存
		tabScroll: { contents: {} }, //滚动条缓存
		setData: function(data) { this.data = data; },
		getData: function() {return this.data; }
	};
	miso.tabScrollObject = [];
	miso.searchScroll = new iScroll('ajax_search', {checkDOMChanges: true, hScroll: false, scrollbarClass: 'myScrollbar'});
	miso.hadsearchScroll = new iScroll('ajax_hadsearch', {
		checkDOMChanges: true, 
		hScroll: false, 
		scrollbarClass: 'myScrollbar',
		topOffset: $('#pullDown')[0].offsetHeight,
		onRefresh: function() {
			scrollRefresh($('#pullDown'), $('#pullUp'));
		},
		onScrollMove: function() {
			scrollMove(this, $('#pullDown'), $('#pullUp'));
		},
		onScrollEnd: function() {
			scrollEnd(this, $('#pullDown'), $('#pullUp'));
		}
	});
	//ajax数据请求回调函数
	miso.hashCallback = function(mod, data) {
		switch(mod) {
			case 'hadsearch': showSearch(data);
			break;
			case 'goods': showGoods(data);
			break;
			case 'store': showStore(data);
			break;
		}		
	};
}

initMiso();

function scrollRefresh(pullDown, pullUp) {
	if(pullDown.hasClass('loading')) {
		pullDown.removeClass('loading').html('下拉可以刷新...');
	}else if(pullUp.hasClass('loading')) {
		pullUp.removeClass('loading').html('上拉可以刷新...');
	}	
}

function scrollMove(iscroll, pullDown, pullUp) {
	if(iscroll.y > 5 && !pullDown.hasClass('flip')) {
		pullDown.addClass('flip').html('松开可以刷新...');
		iscroll.minScrollY = 0;
	}else if(iscroll.y < 5 && pullDown.hasClass('flip')) {
		pullDown.removeClass('flip').html('下拉可以刷新...');
		iscroll.minScrollY = -pullDown[0].offsetHeight;
	}else if(iscroll.y < (iscroll.maxScrollY - 5) && !pullUp.hasClass('flip')) {
		pullUp.addClass('flip').html('松开可以刷新...');
		iscroll.maxScrollY = iscroll.maxScrollY;
	}else if(iscroll.y > (iscroll.maxScrollY + 5) && pullUp.hasClass('flip')) {
		pullUp.removeClass('flip').html('上拉可以刷新...');
		iscroll.maxScrollY = pullUp[0].offsetHeight;
	}
}

function scrollEnd(iscroll, pullDown, pullUp) {
	if(pullDown.hasClass('flip')) {
		pullDown.removeClass('flip').addClass('loading').html('loading...');
		hadsearchPullDownAction();
		iscroll.refresh();
	}else if(pullUp.hasClass('flip')) {
		pullUp.removeClass('flip').addClass('loading').html('loading...');
		hadsearchPullUpAction();
		iscroll.refresh();
	}	
}

function hadsearchPullDownAction() {
	$(window).trigger( 'hashchange' );
}

function hadsearchPullUpAction() {
	$(window).trigger( 'hashchange' );
}

function destroyScroll(iscroll) {  //销毁iscroll对象
	if(iscroll) {
		iscroll.destroy();
		iscroll = null;
	}
}

function tabScrollLoad(url) {
	var visibleMod = $('.hashchangeCache:visible');
	var wrapper = visibleMod.find('.tab_wrapper')[0];
	var tabs = visibleMod.closest('.iscroll').prev();
	if(wrapper) {
		if(!miso.tabScroll[url]) {
			miso.tabScroll['contents'][url] = [];
			miso.tabScroll[url] = new iScroll(wrapper, {
				snap: true,
				momentum: false,
				hScrollbar: false,
				checkDOMChanges: true,
				vScroll: false,
				scrollbarClass: 'myScrollbar',
				onSnapStart: function() {
					var bdWidth = visibleMod.width(),
						page = visibleMod.find('.tab_content');
					page.width(bdWidth);
					visibleMod.find('.tab_contents').width(page.width() * page.length);
					for(var i = 0; page[i] ; i++) {
						miso.tabScroll['contents'][url][i] = new iScroll(page[i], {checkDOMChanges: true, hScroll: false, scrollbarClass: 'myScrollbar'});
						miso.tabScrollObject.push(miso.tabScroll['contents'][url][i]);
					}
				},
				onScrollEnd: function () {
					tabs.find('.choose').removeClass('choose');
					tabs.find('.tab:nth-child(' + (this.currPageX+1) + ')').addClass('choose');
				}
			});
			miso.tabScrollObject.push(miso.tabScroll[url]);
		}
		tabs.find('.choose').removeClass('choose').end().eq(1).addClass('choose');
		miso.tabScroll[url].refresh();
		miso.tabScroll[url].scrollToPage(1, 0, 100);
		tabs.find('.tab').unbind('click');
		tabs.find('.tab').bind({
			'click':function() {
				var that = $(this);
				if(miso.tabScroll[url]) miso.tabScroll[url].scrollToPage(that.index());
			}
		});
	}
}



///// ajax加载页面 开始
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

	$('.ajax_box .hashchangeCache:visible').hide();
	// 所有的非当前的模块隐藏
	
	$('.ajax_box').not( $( '#ajax_' + mod ) ).hide();
	$('#ajax_search_box').show();
	if(!mod) {
		$('#ajax_search').show();
		$('#ajax_hadsearch').hide();
		$('.clearInput').click();
		miso.searchScroll.refresh();
	}
	if(miso.cache.len > 20) { //初始化miso对象达到清除缓存功能
		//window.location.reload();
		initMiso();
		$('.hashchangeCache').remove();  //删除缓存的html
	}
	// 如果 url 已经缓存，则显示对应的内容
	if ( miso.cache[url] ) {
		$('#ajax_search').hide();
		$('#ajax_hadsearch').show();
		if(mod == undefined){
			//alert('无hash');
			$('#ajax_search').show();
			$('#ajax_hadsearch').hide();
			return;
		}else if (mod == 'search' || mod == 'hadsearch') {
			//$('#ajax_search_box').show();
		}else {
			//$('#ajax_search_box').hide();
		}
		miso.cache[url].closest('#ajax_' + mod).show();
		miso.cache[url].show();
		miso.searchScroll.refresh();
		miso.hadsearchScroll.refresh();
		tabScrollLoad(url);
	}else {// 否则在知道的 div 中载入新的内容;
		// 判断 欢迎模块是否显示
		var isShow_welcome = ( $(".box_welcome").css('display') == 'none');
		if(isShow_welcome)
		{
			$( '#ajax_' + mod ).find('.mod_loading').show();
		}
		// 载入新页面
		$.ajax({
			url: url,
			beforeSend: function() {
				$('#new_page_loading').show();	
			},
			complete: function() {
				miso.cache.len += 1;
				miso.cache[url] = miso.getData();
				miso.searchScroll.refresh();
				miso.hadsearchScroll.refresh();
				tabScrollLoad(url);
			},
			success: function(data) {
				miso.hashCallback.call(this, mod, data);
				$('.box_welcome').fadeOut();
				$( '#ajax_' + mod ).find('.mod_loading').fadeOut();
				$('#new_page_loading').hide();
			}	
		});
		$('#ajax_' + mod).fadeIn();
	}
})

$(window).trigger( 'hashchange' );

// 后退
$('.js_back').click(function(){
	history.back();
});
//搜索按钮
$('.mod_searchBox .search .toSearch').click(
	function(){
		var that = $(this);
		$('.mod_searchBox .search .inputBox input').blur();
		var keyword = $('.mod_searchBox .search .inputBox input').val();
		if (keyword){
			var surl = '#index.php?r=default/hadsearch/index&keyword=' + keyword;
			that.attr('href', surl);
		}else{ alert('请输入搜索关键字')}
	}
);
//热门搜索
$('#hot_keywords').delegate('a','click',function() {
	var that = $(this);
	var keyword = that.text();
	$('#index_search_box').val(keyword);
	var surl = '#index.php?r=default/hadsearch/index&keyword=' + keyword;
	that.attr('href', surl);
});

$('.clearInput').click(function() {
	$('#index_search_box').val('');
});

//显示搜索结果
function showSearch(data) {
	var searchResult = eval('('+data+')');
	var status = searchResult.code;
	if(status == 1) {
		var goods = searchResult.data.goods;
		var store = searchResult.data.store;
		var bt=baidu.template;
		var html = '';
		for(var i in goods) {
			html += bt('search:goods', goods[i]);
		}
		for(var j in store) {
			html += bt('search:store', store[j]);
		}
		var cache = $('<div class="hashchangeCache" />').appendTo('#listOut').html(html);
		miso.setData(cache);
	}else if(status == 0) {
		$('.mod_nodata').show();
	}
	$('#ajax_search').hide();
	$('#ajax_hadsearch').show();
}
//显示商品
function showGoods(data) {
	var goodsResult = eval('('+data+')');
	var status = goodsResult.code;
	if(status == 1) {
		var goods = goodsResult.data.goods;
		var bt=baidu.template;
		bt.ESCAPE = false;
		var html = '';
		html = bt('goods:detail', goods);
		var cache = $('<div class="hashchangeCache" />').appendTo('#ajax_goods_data').html(html);
		miso.setData(cache);
	}else if(status == 0) {
		alert("亲，您访问的地址不存在");
	}
}
//显示商家
function showStore(data) {
	var storeResult = eval('('+data+')');
	var status = storeResult.code;
	if(status == 1) {
		var bt=baidu.template;
		bt.ESCAPE = false;
		var html = '';
		html = bt('store:detail', storeResult.data);
		var cache = $('<div class="hashchangeCache" />').appendTo('#ajax_store_data').html(html);
		miso.setData(cache);
	}else if(status == 0) {
		alert("亲，您访问的地址不存在");
	}
}