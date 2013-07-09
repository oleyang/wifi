<?php
class indexController extends commonController
{
    public function index(  ) 
    {
		//$this->layout = ''; 去掉注释，不通过 layout.html 直接加载对应页面
        $this->display(  );
    }
    
}
