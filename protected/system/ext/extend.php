<?php
/*
此文件extend.php在App.class.php中默认会加载，不再需要手动加载
用户自定义的函数，建议写在这里


可自行实现功能，如果不需要，可以不去实现


*/

/*
//模块执行结束之后，调用的接口函数
function app_end()
{
	//在这里写代码实现你要实现的功能
}
*/

/*
//自定义模板标签解析函数
function tpl_parse_ext($template)
{
	require_once(dirname(__FILE__)."/template_ext.php");
	$template=template_ext($template);
	return $template;

}
*/

/*
//自定义网址解析函数
function url_parse_ext()
{
	App::$module=trim($_GET['m']);
	App::$action=trim($_GET['a']);
}
*/

//下面是用户自定义的函数

?>