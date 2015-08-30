<?php
error_reporting( E_ALL | E_STRICT );
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
//error_reporting(E_ALL ^ E_DEPRECATED);

require_once("./credentials.php");

class contactManager 
{
    //create private var to keep mysqli db info
    private $dbResponse;
    
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
     * Repalce $u with your database uername
     * Repalce $p with your db password
     * @var {$u} - string, db username
     * @var {$p} - string, db password
     * @var {db} - string, databse name
    */
    private function connect () 
    {
        $u = $GLOBALS["credentials"]["user"]; //repalce 
        $p = $GLOBALS["credentials"]["pass"]; //replace
        $db = "backbone_contacts";
        //create database connection and select the needed db
       $data = mysqli_connect('localhost:8889', $u, $p, $db);
       //throw error message if there is something with the db connt 
       if ($data->connect_errno) {
           printf("Connection failed: %s\n" , $data->connection_errno);
           exit();
       }
       //assign the db conn to the private var
       $this->dbResponse = $data;
    }

    /*
     * SELECT data from the database based on the request GET method
     * DELETE data based on DELETE request
     * INSERT new entry based on PUT request
    */
    private function dbData () 
    {
        $http_host = $_SERVER["REQUEST_METHOD"];
        //get the url path
        $request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

        switch($http_host) 
        {
            case "GET":
                $arg = $_GET;
                
                //if the request is missing the GET param exit
                if (empty($arg)) {
                    echo "Pleace add params to your url";
                    exit();
                }
                $data = [];

                if (array_key_exists("type", $arg))
                    //select from db
                    $data = $this->selectFromDb("*", "type='" . ucfirst($arg["type"]) . "'" );
                else 
                    $data = $this->selectFromDb("*", $arg["contacts"]);

                //return the data in jSON format
                echo json_encode($data);
                break;

            case "POST": //update
                print_r("DOES POST\n");
                break;

            case "DELETE":
                //check for request that is delete and that there is an 
                if ($request[0] == "delete" && 
                    !empty($request[1]) && intval($request[1])) {
                        $delete = "DELETE FROM contacts WHERE id=". intval($request[1]);
                        //delete the entry and return response
                        if ($result = mysqli_query($this->dbResponse, $delete)) 
                            echo "Entry deleted";
                        else 
                            echo "Could not delete the entry";
                    }
                break;
            case "PUT":
                //grab the put data
                parse_str(file_get_contents('php://input'), $data);
                $data = json_decode($data["model"]);
                
                $updateContact = "UPDATE contacts SET name='" .$data->name ."', 
                    address= '" . $data->address . "', 
                    tel= '" . $data->tel . "', 
                    type= '" . $data->type . "', email= '" . $data->email . "'
                    WHERE id= '" . $data->id . "'";

                if (mysqli_query($this->dbResponse, $updateContact))
                    echo "Entry update succesfully";
                else 
                    echo "Sorry something went wrong";

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
            $selectAll = "SELECT " . $select. " FROM contacts WHERE " . $type;

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
