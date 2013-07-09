<?php
class indexController extends commonController
{
    public function index(  )
    {
        $this->display(  );
    }
    
    public function content(  )
    {
		$this->layout='';
        $this->display(  );
    }
}