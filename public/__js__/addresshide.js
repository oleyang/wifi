// 隐藏手机浏览器地址栏
window.onload=function(){  
	if(document.documentElement.scrollHeight <= document.documentElement.clientHeight) {  
		bodyTag = document.getElementsByTagName('body')[0];  
		bodyTag.style.height = document.documentElement.clientWidth / screen.width * screen.height + 'px';  
	}  
	setTimeout(function() {  
		window.scrollTo(0, 1)  
	}, 0);  
};
