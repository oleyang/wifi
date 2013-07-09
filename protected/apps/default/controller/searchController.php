<?php
class searchController extends commonController
{
    public $m;

    function __construct(  )
    {
        $this->m = model( 'goods' );    
    }
    
    public function index(  )
    {
        $this->layout='';
		$this->assign( 'link', url( 'hadsearch/index' ) );
		$this->assign( 'hot', array( '巧克力', '饼干', '牛肉干', '薯片', '酒', '糖', '鱼', '果冻' ));
		$this->display(  );
    }

}