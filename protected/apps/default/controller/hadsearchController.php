<?php
class hadsearchController extends commonController
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

		$currentPage = isset($_GET['p']) ? intval(in($_GET['p'])) : 1;
        $pageSize = isset($_GET['pageSize']) ? intval(in($_GET['pageSize'])) : 5;
		$pageSize = $pageSize < 1 ? 10 : $pageSize;
		$mysort = "price asc";
		$start = $curentPage - 1;
		$start = $start < 0 ? 0 : $start;
        $start = $start * $pageSize;
		$limit = "$start, $pageSize";
        $sqlCount = "SELECT count( * ) as total FROM  " . config( 'DB_PREFIX' ) . "goods g LEFT JOIN ".config( 'DB_PREFIX' )."store s ON g.store_id = s.store_id WHERE g.if_show = 1 AND g.closed = 0 AND s.state = 1 AND (g.goods_name LIKE '%" . $keyword . "%') AND s.region_id > 0";
        $goodsCount = model( 'goods' )->query( $sqlCount );
        if ( $goodsCount > 0 ) {
           		$sql = "SELECT g.goods_id, g.goods_name, g.default_image, g.price, g.store_id, s.region_id, s.region_name FROM  " . config( 'DB_PREFIX' ) . "goods g LEFT JOIN ".config( 'DB_PREFIX' )."store s ON g.store_id = s.store_id WHERE g.if_show = 1 AND g.closed = 0 AND s.state = 1 AND (g.goods_name LIKE '%" . $keyword . "%') AND s.region_id > 0 ORDER BY {$mysort} limit {$limit}";
                $goodsInfo = model( 'goods' )->query( $sql );            
                if ($goodsInfo) {
                    $storeIds = array(  );                
                    foreach ( $goodsInfo as $k=>$v ) {
                        if ( is_numeric( $v['store_id'] ) ) {
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
                        $result['data'] = array('goods'    => $goodsInfo,
                                                'store'    => $storeInfo,
                                                'news'     => file_get_contents( 'http://www.100msh.cn/search?q='.urlencode( $keyword ). '&format=json&p='.$currentPage ),
                                                'nextPage' => $nextPage,
                                                'totalPage'=> $totalPage,
                                                'time'     => $time,
                            );
                    }                
                }
        }
		echo json_encode($result);
		exit;
        
    }

}