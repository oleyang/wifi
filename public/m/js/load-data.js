Do(function(){
	$('#ajax_search').find('.load_html').click(function() {
		var data = $(this).data('data-json');
		var searchResult = eval('('+data+')');
		var status = searchResult.code;
		if(status == 1) {
			var hot = searchResult.data.hot;
			if(hot) {
				var bt=baidu.template;
				var html = '';
				html = bt('search:hot', searchResult.data);
				$('#hot_keywords').find('.hashchangeCache').remove();
				var cache = $('<div class="hashchangeCache" />').appendTo('#hot_keywords').html(html);
				//Do.setData('cache',cache);
				$('.box_no_search').show();
				$('.box_hasSearch').hide();	
			}else{
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
				$('#listOut').find('.hashchangeCache').remove();
				var cache = $('<div class="hashchangeCache" />').appendTo('#listOut').html(html);
				//Do.setData('cache',cache);
				$('.box_no_search').hide();
				$('.box_hasSearch').show();
			}
		}else if(status == 0) {
			$('.mod_nodata').show();
		}
		
	});
	$('.mod_searchBox .search .toSearch').click(
		function(){
			var that = $(this);
			$('.box_no_search').hide();
			$('.box_hasSearch').show();
			$('.mod_searchBox .search .inputBox input').blur();
			var keyword = $('.mod_searchBox .search .inputBox input').val();
			if (keyword){
				var surl = '#index.php?r=default/search/index&keyword=' + keyword;
				//$.bbq.pushState( surl );
				that.attr('href', surl);
				$('#ajax_search').find('.load_html').click();
			}else{ alert('请输入搜索关键字')}
		}
	);
	
	//热门搜索
	$('#hot_keywords').delegate('a','click',function() {
		var that = $(this);
		var keyword = that.text();
		$('#index_search_box').val(keyword);
		var surl = '#index.php?r=default/search/index&keyword=' + keyword;
		that.attr('href', surl);
	});
	
	$('.clearInput').click(function() {
		$('#index_search_box').val('');
	});

	
	$('#ajax_goods').children('.load_html').click(function() {
		var that = $(this);
		var data = that.data('data-json');
		var goodsResult = eval('('+data+')');
		var status = goodsResult.code;
		if(status == 1) {
			var goods = goodsResult.data.goods;
			var bt=baidu.template;
			bt.ESCAPE = false;
			var html = '';
			html = bt('goods:detail', goods);
			$('#ajax_goods_data').find('.hashchangeCache').remove();
			var cache = $('<div class="hashchangeCache" />').appendTo('#ajax_goods_data').html(html);
			//Do.setData('cache',cache);
			$("#goods_tabs").tab({num:1});
		}else if(status == 0) {
			alert("亲，您访问的地址不存在");
		}
		
	});
	$('#ajax_store').children('.load_html').click(function() {
		var that = $(this);
		var data = that.data('data-json');
		var storeResult = eval('('+data+')');
		var status = storeResult.code;
		if(status == 1) {
			var bt=baidu.template;
			bt.ESCAPE = false;
			var html = '';
			html = bt('store:detail', storeResult.data);
			$('#ajax_store_data').find('.hashchangeCache').remove();
			var cache = $('<div class="hashchangeCache" />').appendTo('#ajax_store_data').html(html);
			//Do.setData('cache',cache);
			$("#store_tabs").tab({num:1});
		}else if(status == 0) {
			alert("亲，您访问的地址不存在");
		}
	});
});