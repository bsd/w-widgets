<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');

//local
//define('DB_MAIN', '127.0.0.1|root|abc123|widgets');

//live
define('DB_MAIN', 'db.test.which-testing.co.uk|widget|SRTe89VG973R|widget');

// Connect to database db1
$db = new my_db(DB_MAIN);

// Request "SELECT * FROM table1 WHERE a=16 AND b=22"
// Get an array of stdClass's


if($_POST['type'] === "insert") {

    //get token


    $sql = "INSERT INTO embed (token, form_id, thankyou_redirect, embed_script, embed_html, date_added) VALUES (:token, :formID, :thankyou, :embedJS, :embedHTML, :dateadded)";

    $query = $db->insert( $sql );

}

$rows = $db->fetchAll('SELECT * FROM widgets');


function crypto_rand_secure($min, $max)
{
    $range = $max - $min;
    if ($range < 1) return $min; // not so random...
    $log = ceil(log($range, 2));
    $bytes = (int) ($log / 8) + 1; // length in bytes
    $bits = (int) $log + 1; // length in bits
    $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
    do {
        $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
        $rnd = $rnd & $filter; // discard irrelevant bits
    } while ($rnd >= $range);
    return $min + $rnd;
}

function getToken($length)
{
    $token = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
    $codeAlphabet.= "0123456789";
    $max = strlen($codeAlphabet) - 1;
    for ($i=0; $i < $length; $i++) {
        $token .= $codeAlphabet[crypto_rand_secure(0, $max)];
    }
    return $token;
}


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

    public function insert($sql){

        $token = getToken(32);
        $timestamp = date( "Y-m-d H:i:s");
        $statement = $this->connection->prepare($sql);

        $statement->bindParam(':token', $token, PDO::PARAM_STR);
        $statement->bindParam(':embedJS', $_POST['JS'], PDO::PARAM_STR);
        $statement->bindParam(':formID', $_POST['signupID'], PDO::PARAM_STR);
        $statement->bindParam(':thankyou', $_POST['thankyouURL'], PDO::PARAM_STR);
        $statement->bindParam(':embedHTML', $_POST['HTML'], PDO::PARAM_STR);
        $statement->bindParam(':dateadded', $timestamp, PDO::PARAM_STR);

        if($statement->execute()) {
          echo $token;
        }

    }
}



?>
