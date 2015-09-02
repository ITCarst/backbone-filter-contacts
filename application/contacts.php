<?php
error_reporting( E_ALL | E_STRICT );
ini_set('display_errors',1);
ini_set('display_startup_errors',1);

require_once("../config/credentials.php");

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
        $db = $this->dbResponse; 

        switch($http_host) 
        {
            case "GET": //READ
                $arg = $_GET;
                
                //if the request is missing the GET param exit
                if (empty($arg)) {
                    echo "Pleace add params to your url";
                    exit();
                }
                $data = [];
                if (array_key_exists("type", $arg))
                    //select from db
                    $data = $this->selectFromDb("*",  $arg["type"] );
                else 
                    $data = $this->selectFromDb("*", $arg["contacts"]);

                //return the data in jSON format
                echo json_encode($data);
                break;

            case "POST": //CREATE
                $data = json_decode(file_get_contents("php://input"));
                $insert = "INSERT INTO contacts (name, address, tel, type, email)
                    VALUES (?, ?, ?, ?, ?)";

                if($stmt = $db->prepare($insert)) 
                {
                    $type = strtolower($data->type);

                    $stmt->bind_param("sssss", $data->name, $data->address, 
                        $data->tel, $type, $data->email);

                    if ($stmt->execute()) 
                    {
                        header('Content-Type: application/json');
                        echo json_encode("Entry Saved");
                        exit;
                    } else {
                        echo "Something went wrong";
                    }  

                   $stmt->close(); 
                }
                break;

            case "DELETE":
                //check for request that is delete and that there is an 
                if ($request[0] == "delete" && 
                    !empty($request[1]) && intval($request[1])) 
                {
                    $delete = "DELETE FROM contacts WHERE id=?";
                    if ($stmt = $db->prepare($delete)) 
                    {
                        $id = intval($request[1]);
                        $stmt->bind_param("d", $id);
                        //delete the entry and return response
                        if ($stmt->execute()) 
                            echo "Entry deleted";
                        else 
                            echo "Could not delete the entry";
                    }
                }
                break;
            case "PUT"://UPDATE
                //grab the put data
                $data = json_decode(file_get_contents("php://input"));
                //create the update query 
                $updateContact = "UPDATE contacts SET name=?, 
                    address=?, tel=?, type=?, email=?
                    WHERE id=?";
                if ($stmt = $db->prepare($updateContact)) 
                {
                    $type = strtolower($data->type);
                    $stmt->bind_param("sssssd", $data->name, $data->address, 
                        $data->tel, $type, $data->email, $data->id);     

                    if ($stmt->execute())
                        echo "Entry update succesfully";
                    else 
                        echo "Sorry something went wrong";
                    
                    $stmt->close();
                }
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
            $selectAll = "SELECT " . $select. " FROM contacts WHERE type = ?";

        $stmt = $db->prepare($selectAll);
        if ($type !== "all") 
            $stmt->bind_param('s', $type);
        $stmt->execute();
        $result = $stmt->get_result();
        //get all the entries from db
        if ($result) 
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
