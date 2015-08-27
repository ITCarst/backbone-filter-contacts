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
       
       if ($data->connect_errno) 
       {
           printf("Connection failed: %s\n" , $data->connection_errno);
           exit();
       }

       $this->dbResponse = $data;
    }

    private function dbData () 
    {

        $db = $this->dbResponse;
        $resultArray = [];

        if ($_SERVER["REQUEST_METHOD"] == "GET") 
        {
           switch($_SERVER["REQUEST_METHOD"]) 
           {
                case "GET":
                    $arg = $_GET;

                    if($arg["c"]) {
                        //select all query
                        $selectAll = "SELECT name, address, tel, type, email FROM contacts";

                        //get all the entries from db
                        if ($result = mysqli_query($db, $selectAll)) 
                        {
                            while ($row = $result->fetch_assoc()) 
                            {
                                if (!empty($row)) 
                                    $resultArray[] = $row;
                            }
                            echo json_encode($resultArray);

                        } else {
                            echo "No results found";
                        }
                    }
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

                default:
                    echo "get all";
           } 
       }
            
    }

}


$contactManger = new ContactManager();
