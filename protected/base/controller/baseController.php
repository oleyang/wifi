<?php
class baseController extends controller{
	protected $appConfig = array();
	
	public function __construct(){
		$this->appConfig = config('APP');
		if( $this->_readHtmlCache() ){
			$this->appConfig['HTML_CACHE_ON'] = false;
			exit;
		}
		parent::__construct();
	}
	
	public function __destruct(){
		$this->_writeHtmlCache();
	}
	
	//读取静态缓存
	private function _readHtmlCache() {	
		if ( ($this->appConfig['HTML_CACHE_ON'] == false) || empty($this->appConfig['HTML_CACHE_RULE']) ) {
			$this->appConfig['HTML_CACHE_ON'] = false;
			return false;
		}
		if( isset($this->appConfig['HTML_CACHE_RULE'][APP_NAME][CONTROLLER_NAME][ACTION_NAME]) ){
			$expire = $this->appConfig['HTML_CACHE_RULE'][APP_NAME][CONTROLLER_NAME][ACTION_NAME];
		}else if(isset($this->appConfig['HTML_CACHE_RULE'][APP_NAME][CONTROLLER_NAME]['*'])){
			$expire = $this->appConfig['HTML_CACHE_RULE'][APP_NAME][CONTROLLER_NAME]['*'];
		}else{
			$this->appConfig['HTML_CACHE_ON'] = false;
			return false;
		}
		return HtmlCache::read($this->appConfig['HTML_CACHE_PATH'], $expire);
	}
	
	//写入静态页面缓存
	private function _writeHtmlCache() {	
		if ( $this->appConfig['HTML_CACHE_ON'] ) {
			HtmlCache::write();
		}	
	}
     //会员密码加密
     protected  function codepwd($password)
      {
          return md5(substr(md5($password),7,-7));
      }
}