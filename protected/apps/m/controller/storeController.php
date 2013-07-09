<?php
class storeController extends commonController
{
     public $m;
    
    function __construct(  )
    {
        $this->m = model( 'store' );
    }
    
    public function index(  )
    {
		$this->layout='';
        $id = in( $_GET['id'] );
        $result = array( 'code' => 0, 'data'=> array(  ));
        if ( empty( $id ) ) {
            /* 显示店铺列表 */
        } else {
            if ( $storeInfo = $this->m->getInfo( $id ) ) {
                $goodsInfo = $this->m->getGoods( $id );
                $result['code'] = 1;
                $result['data'] = array('store'=>$storeInfo, 'goods'=>$goodsInfo);
            }
        }
        echo json_encode($result);
    }
}