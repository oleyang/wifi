/*!
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,l,m){function n(a){a=a||location.href;return"#"+a.replace(/^[^#]*#?(.*)$/,"$1")}var a="hashchange",e,c=b.event.special,g=document.documentMode,h="on"+a in l&&(g===m||7<g);b.fn[a]=function(b){return b?this.bind(a,b):this.trigger(a)};b.fn[a].delay=50;c[a]=b.extend(c[a],{setup:function(){if(h)return!1;b(e.start)},teardown:function(){if(h)return!1;b(e.stop)}});e=function(){function e(){var c=n(),d=h(k);c!==k?(g(k=c,d),b(l).trigger(a)):d!==k&&(location.href=location.href.replace(/#.*/,"")+
d);f=setTimeout(e,b.fn[a].delay)}var d={},f,k=n(),c=function(a){return a},g=c,h=c;d.start=function(){f||e()};d.stop=function(){f&&clearTimeout(f);f=m};return d}()})(jQuery,this);
/**
 *	jQuery hash cache - v1.0 - 2013.6.25
 */
(function ($, window, undefined) {
	var ohm = window.ohm = window.ohm || {}; //定义ohm命名空间
	ohm.cache = {
		MAX: 20,
		current: null,
		latest: null,
		keyArray: []
	}; //初始化cache
	ohm.setData = function (data) {
		this.data = data;
	}; //设置数据
	ohm.getData = function () {
		return this.data;
	}; //获取数据
	ohm.callback = { //回调方法
		setMod: null,	//设置模块规则
		noHash: null,	//没有hash
		hasCache: null,	//已有缓存
		onCacheBeforeClear: null,	//清除缓存前
		onNewPageBeforeSend: null,	//加载新模块前
		onNewPageSuccess: null,	//加载新模块成功
		onNewPageComplete: null,	//加载新模块完成
		onNewPageError: null	//加载新模块出错
	};

	$(window).bind('hashchange', function (e) { //绑定hashchange事件
		var hash = location.hash;	//获取hash
		var url = hash ? hash.split('#')[1] : '';

		var mod = 'index'; // 得到模块名
		
		if(ohm.callback.setMod) {	//根据地址获取模块
			ohm.callback.setMod.call(this, mod, url);
		}else {	//默认获取模块
			url.indexOf('&') > 0 ? mod = url.split("&")[0].split("/")[1] : mod = url.split("/")[1];
		}
		
		if(ohm.cache.keyArray.length > ohm.cache.MAX) {
			if(ohm.callback.onCacheBeforeClear) {
				ohm.callback.onCacheBeforeClear.call(this, url, mod);
			}
			ohm.cache[ohm.cache.keyArray[0]].remove();
			ohm.cache[ohm.cache.keyArray[0]] = null;
			ohm.cache.keyArray.shift();
		}
		
		if(url === '') {	//无hash
			if(ohm.callback.noHash) {
				ohm.callback.noHash.call(this);
			}
		}else if (ohm.cache[url]) { // 如果 url 已经缓存，则显示对应的内容
			if(ohm.cache.current) {
				ohm.cache.current.hide();
			}
			if(ohm.callback.hasCache) {
				ohm.callback.hasCache.call(this, url, mod);
			}
			ohm.cache[url].show();
			ohm.cache.current = ohm.cache[url];
		} else {	// 载入新页面
			$.ajax({
				url : url,
				beforeSend : function () {
					if (ohm.callback.onNewPageBeforeSend) {
						ohm.callback.onNewPageBeforeSend.call(this, url, mod);
					}
				},
				success : function (data) {
					if(ohm.cache.current) {
						ohm.cache.current.hide();
					}
					if (ohm.callback.onNewPageSuccess) {
						ohm.callback.onNewPageSuccess.call(this, url, mod, data);
					}
					if(ohm.getData()) {
						ohm.cache.current = ohm.cache.latest = ohm.cache[url] = ohm.getData();
						ohm.cache.keyArray.push(url);
					}
				},
				complete : function (data) {
					if (ohm.callback.onNewPageComplete) {
						ohm.callback.onNewPageComplete.call(this, url, mod, ohm.cache.latest);
					}
				},
				error : function (error) {
					if (ohm.callback.onNewPageError) {
						ohm.callback.onNewPageError.call(this, url, mod, error);
					}
				},
				statusCode: {
					404: function() {
						ohm.cache.current = ohm.cache.latest = null;
					}
				}
			});
		}
	});

})(jQuery, this);