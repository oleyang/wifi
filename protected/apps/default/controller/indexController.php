<?php
class indexController extends commonController
{
    public function index(  ) 
    {
		$this->layout = '';
        $this->display(  );
    }
    
    public function content(  )
    {
		$this->layout='';
        $this->display(  );
    }
}
