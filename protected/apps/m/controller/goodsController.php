<?php
class goodsController extends commonController
{
    public $m;
    
    function __construct(  )
    {
        $this->m = model( 'goods' );
    }
    
    public function index(  )
    {
		$this->layout='';
        $id = in( $_GET['id'] );
        $result = array( 'code' => 0, 'data'=> array(  ));
        if ( empty( $id ) ) {
            /* 显示产品列表 */
        } else {
            if ( $goodsInfo = $this->m->getInfo( $id ) ) {
                $result['code'] = 1;
                $result['data'] = $goodsInfo;
            }
        }
        echo json_encode($result);
    }
    
    public function base(  )
    {
		$this->layout='';
        $this->display(  );
    }
    
    public function detail(  )
    {
		$this->layout='';
        $this->display(  );
    }
    
    public function comment(  )
    {
		$this->layout='';
        $this->display(  );
    }
}