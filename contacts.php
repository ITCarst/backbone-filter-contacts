<?php
error_reporting( E_ALL | E_STRICT );
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
//error_reporting(E_ALL ^ E_DEPRECATED);

class contactManager 
{
    private $dbResponse;

    public function __construct () 
    {
       $this->connect();


       if (is_object($this->dbResponse))
           $this->dbData();
    }

   private function connect () 
   {
       $data = mysqli_connect('localhost:8889', 'root', 'root', "backbone_contacts");
       
       if ($data->connect_errno) {
           printf("Connection failed: %s\n" , $data->connection_errno);
           exit();
       }

       $this->dbResponse = $data;
    }

    private function dbData () 
    {

       echo "<pre>";

       if ($_SERVER["REQUEST_METHOD"] == "GET")
           echo "we got get";
        
        


/*
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET": 
                brake; 
            case "POST":
                brake;
            default:
                echo "bla";
 */
            
    }

}


$contactManger = new ContactManager();
