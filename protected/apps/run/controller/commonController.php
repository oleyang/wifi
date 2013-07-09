<?php
//公共类
class commonController extends memberController
{
	public $layout = 'layout';
	public function __construct()
	{
		//parent::__construct();              		
		@session_start();//开启session
	}
}
?>