<?php
class goodsModel extends baseModel
{    
    protected $table = 'order_goods';

    function __construct(  )
    {
        parent::__construct(  );
    }

    function getInfo( $gid ) {
        return $this->select( "goods_id=$gid AND is_valid=1", 'comment' );
    }
}