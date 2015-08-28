<?php
error_reporting( E_ALL | E_STRICT );
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
//error_reporting(E_ALL ^ E_DEPRECATED);

class contactManager 
{
    //create private var to keep mysqli db info
    private $dbResponse;

    /*
    * Main Constructor 
    */
    public function __construct () 
    {
        //db connection
        $this->connect();

        //make surethere is a response from the sb
       if (is_object($this->dbResponse))
           $this->dbData();
    }

    /*
     * Connect to database using user and pass also name the databse
     * Assigns the databse to the private $dbResponse
     * @param {$u} - db username
     * @param {$p} - db password
    */
    private function connect ($u, $p) 
    {
        //create database connection and select the need db
       $data = mysqli_connect('localhost:8889', 'root', 'root', "backbone_contacts");
       
       if ($data->connect_errno) {
           printf("Connection failed: %s\n" , $data->connection_errno);
           exit();
       }
       //assign the db conn to the private var
       $this->dbResponse = $data;
    }

    /*
     * Select data from the database based on the request method
    */
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
        //close the connction 
        mysqli_close($this->dbResponse);
    }
    /*
     * Select the contacts from the database 
     * @param {$select} - string, that includes the asked columns from the table
     * @param {type} - WHERE clause that selects the contact based on 'type' filed
    */
    private function selectFromDb ($select,  $type) 
    {
        $db = $this->dbResponse;
        $resultArray = [];

        //for the $type all grab all the entries
        if ($type == "all")
            $selectAll = "SELECT " . $select. " FROM contacts ";
        else 
            $selectAll = "SELECT " . $select. " FROM contacts WHERE type='" . ucfirst($type) . "'";

        //get all the entries from db
        if ($result = mysqli_query($db, $selectAll)) 
        {   
            //loop through the result using assoc
            while ($row = $result->fetch_assoc()) 
            {   
                //add the entries into the $resultArray
                if (!empty($row)) 
                    $resultArray[] = $row;
            }   
            //return the array with the entries
            return $resultArray;
        } else {
            //return a plain string so that we have something to display if there is no data 
            return "No results found";
        }   
    }
}

//init the ContactManager class
$contactManger = new ContactManager();
