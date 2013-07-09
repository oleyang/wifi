<?php
class goodsModel extends baseModel
{    
    protected $table = 'goods';

    function __construct(  )
    {
        parent::__construct(  );
    }

    function getInfo( $gid ) {
        $result = $this->find( "goods_id=$gid AND if_show=1" );
        $storeInfo = $this->getStoreInfo( $gid );
        $comment = $this->getComment( $gid );
        return array_merge( array('goods'=>$result, 'store'=>$storeInfo, 'comment'=> $comment)  );
    }

    /* 通过商品id取得评论的条数 */
    public function getCommentCount( $gid )
    {
        if ( empty( $gid ) || ! is_numeric( $gid ) ) return '';
        return $this->count( "goods_id='{$gid}'" );
    }

    public function getComment( $gid )
    {
        if ( empty( $gid ) || ! is_numeric( $gid ) ) return '';
        return $this->select( "goods_id='{$gid}'" );
    }

    public function getStoreInfo( $gid )
    {
        if ( empty( $gid ) || ! is_numeric( $gid ) ) return '';
        $sid = $this->find( "goods_id='{$gid}'", 'store_id' );        
        return model( 'store' )->getInfo( $sid['store_id'] );
    }

    
}