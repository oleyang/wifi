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
        $keyword = in( $_GET['keyword'] );

        $result = array( 'code' => 0, 'data'=> array(  ));
        if ( empty( $keyword ) ) {
            $result['code'] = 1;
            $result['data'] = array( 'hot'=>array( '巧克力', '饼干', '牛肉干', '薯片', '酒', '糖', '鱼', '蛋糕', '果冻' ));
        } else {
            $where = "if_show=1 AND goods_name like '%" . $keyword . "%' OR tags like '%" . $keyword . "%'";
            $currentPage = isset($_GET['p']) ? intval(in($_GET['p'])) : 0;
            $pageSize = 100;
            $fields = "goods_id, store_id, goods_name, description, tags, default_image, price ";
            $mysort = "price asc";
            $limit = "$currentPage, $pageSize";
            
            if ($goodsInfo = $this->m->select( $where, $fields, $mysort, $limit )) {
                $storeIds = array(  );                
                foreach ( $goodsInfo as $k=>$v ) {
                    if ( is_numeric( $v['store_id'] ) ) {
                        $comment = $this->m->getCommentCount( $v['goods_id'] ); 
                        $goodsInfo[$k]['comment'] = empty($comment) ? 0 : $comment;
                        $storeIds[] = $v['store_id'];
                    }
                }
                
                $tmpArr = $tmpArr2 = array(  );
                if ($storeArr = model( 'store' )->select( 'store_id in(' . join( ',', $storeIds ) . ' )', 'store_id, store_name, tel, store_logo, store_banner' )) {
                    foreach ( $storeArr as $v ) {
                        /* 搜索中有商品的店铺显示在前面 */
                        if ( isset( $info[$v['store_id']] ) ) {
                            $tmpArr[] = $v;
                        } else {
                            $tmpArr2[] = $v;
                        }
                        $info[$v['store_id']]['store'] = $v;    
                    }
                    $storeInfo = array_merge($tmpArr, $tmpArr2);
                    $result['code'] = 1;
                    $result['data'] = array('goods'=>$goodsInfo,'store' => $storeInfo );
                }                
            }            
        }
        echo json_encode($result);
        exit;        
    }

}