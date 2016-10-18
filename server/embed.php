<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
//This script inserts the generated markup and JS into the DB on W? server and assigns it a token so that it can retrieved
function is_local() {
    if($_SERVER['HTTP_HOST'] == 'localhost'
        || substr($_SERVER['HTTP_HOST'],0,3) == '10.'
        || $_SERVER['HTTP_HOST'] == 'which-widgets-build.app.local'
        || substr($_SERVER['HTTP_HOST'],0,7) == '192.168') return true;
    return false;
}

$localEnv = is_local();

if($localEnv) {
//local
define('DB_MAIN', '127.0.0.1|root|abc123|widgets');
}
else {
//live
define('DB_MAIN', 'db.test.which-testing.co.uk|widget|SRTe89VG973R|widget');
}
// Connect to database db1
$db = new my_db(DB_MAIN);

//retrieve token
$token = $_GET['tkn'];
$rows = $db->fetchAll('SELECT * FROM embed WHERE token="'.$token.'"');

//get signup count from the tools
$count = file_get_contents("https://whichcouk.cp.bsd.net/utils/cons_counter/signup_counter.ajax.php?signup_form_id=".$rows[0]->form_ID);
$count = $count + 10000;
$count = number_format($count);

//add signup count to the db rows returned
array_push($rows, array('signup' => $count));
echo json_encode($rows);

class my_db{

    private static $databases;
    private $connection;

    public function __construct($connDetails){
        if(!is_object(self::$databases[$connDetails])){
            list($host, $user, $pass, $dbname) = explode('|', $connDetails);
            $dsn = "mysql:host=$host;dbname=$dbname";
            self::$databases[$connDetails] = new PDO($dsn, $user, $pass);
        }
        $this->connection = self::$databases[$connDetails];
    }

    public function fetchAll($sql){
        $args = func_get_args();
        array_shift($args);
        $statement = $this->connection->prepare($sql);
        $statement->execute($args);
         return $statement->fetchAll(PDO::FETCH_OBJ);
    }
}

?>
