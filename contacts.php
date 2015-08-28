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
        //db connection
        $this->connect();

        //make surethere is a response from the sb
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
       //assign the db conn to the private var
       $this->dbResponse = $data;
    }

    private function dbData () 
    {
        switch($_SERVER["REQUEST_METHOD"]) 
        {
            case "GET":
                $arg = $_GET;
                $data = $this->selectFromDb("name, address, tel, type, email", $arg["c"]);
                echo json_encode($data);
                break;

            case "POST":
                print_r($_POST);
                break;

            case "DELETE":
                print_r("delete");
                break;

            case "PUT":
                print_r("insert");
                break;
        } 
        mysqli_close($this->dbResponse);
    }

    private function selectFromDb ($select,  $type) 
    {
        $db = $this->dbResponse;
        $resultArray = [];

        if ($type == "all")
            $selectAll = "SELECT " . $select. " FROM contacts ";
        else 
            $selectAll = "SELECT " . $select. " FROM contacts WHERE type='" . ucfirst($type) . "'";

        //get all the entries from db
        if ($result = mysqli_query($db, $selectAll)) 
        {   
            while ($row = $result->fetch_assoc()) 
            {   
                if (!empty($row)) 
                    $resultArray[] = $row;
            }   
            return $resultArray;

        } else {
            return "No results found";
        }   
    }
}


$contactManger = new ContactManager();
