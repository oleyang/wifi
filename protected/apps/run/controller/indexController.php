<?php
class indexController extends commonController
{
    public function index(  )
    {
        $this->display(  );
    }
    public function main(  )
    {
		$this->layout='';
        $this->display(  );
    }
}