<?php
require "config.php";

define("api_secret", $config['secret']); // set the api_secret
define("app_id", $config['username']); // set the API app_id
define("domain", "https://https://whichcouk.bsd.net"); // set the API domain.
class BSDAPI {

    public $id_to_field_map = array();
    private $signup_form_fields;

    private function _curl($url, $post = false) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        if ($post) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            curl_setopt ($ch, CURLOPT_HTTPHEADER, Array("Content-Type: text/xml"));
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, "$post");
        }
        $response     = array(); //will hold the http_code response and body of the response
        $tempResponse = curl_exec($ch); //request the URL
        if ($tempResponse) {
            $response['body'] = $tempResponse;
        } else {
            $response['body'] = false;
        }
        $requestInfo           = curl_getinfo($ch); //information about response codes, time, content type, etc...
        $response['http_code'] = $requestInfo['http_code'];
        curl_close($ch);
        return $response;
    }

    private function make_api_call($module, $call, $post = false, $get = false) {
        $ts = time();
        $slug = "/page/api/" . $module . "/" . $call;
        $querystring = "api_ver=2&api_id=" . app_id . "&api_ts=$ts";
        if ($get) {
            if (is_array($get)) {
                $querystring .=  "&" . http_build_query($get);
            } else {
                $querystring .= "&$get";
            }
        }
        $signing_array  = array(
            app_id,
            $ts,
            $slug,
            $querystring
        );
        $signing_string = implode("\n", $signing_array);
        $api_mac        = hash_hmac("sha1", $signing_string, api_secret);
        $api_url        = domain . $slug . "?$querystring&api_mac=$api_mac";
        return $this->_curl($api_url, $post);
    }

    public function post($module, $call, $post) {
        return $this->make_api_call($module, $call, $post);
    }
    public function get($module, $call,  $get) {
        return $this->make_api_call($module, $call, false, $get);
    }

    public function xml_to_array($xml_string){
        return json_decode(json_encode(simplexml_load_string($xml_string)), true);
    }

    public function process_signup_xml($signup_form_id, $fields_array) {
        $xml = "<api>";
        $xml .= '<signup_form id="' . $signup_form_id . '">';
        foreach ($fields_array as $id => $value) {
            $xml .= '<signup_form_field id="' . $id . '">' . htmlspecialchars($value, ENT_NOQUOTES) . '</signup_form_field>';
        }
        if(isset($_REQUEST["source"])){
            $xml .= '<source>' . htmlspecialchars($_REQUEST["source"], ENT_NOQUOTES) . '</source>';
        }
        if(isset($_REQUEST["subsource"])){
            $xml .= '<subsource>' . htmlspecialchars($_REQUEST["subsource"], ENT_NOQUOTES) . '</subsource>';
        }
        $xml .= "</signup_form>";
        $xml .= "</api>";
        return $xml;
    }

    public function map_post_to_form($signup_form_fields){
        $fields = array();
        $this->signup_form_fields = $signup_form_fields;
        for ($i = 0; $i < count($signup_form_fields); $i++) {
            $name = str_replace(" ", "", trim(strtolower($signup_form_fields[$i]["description"])));
            if ($name === "state/province/region") {
                $name = "state_cd";
            }
            if ($name === "postalcode" || $name === "zipcode"){
                        $name = "zip";
                    }
            $id = $signup_form_fields[$i]["@attributes"]["id"];
            $this->id_to_field_map[$id] = strlen($name)>0 ? $name  : $signup_form_fields[$i]["label"];
            if ($signup_form_fields[$i]["is_custom_field"] === "1"){
               $fields[$id] = $_REQUEST["custom-".$id];
            }
            else if($name==="address" && isset($_REQUEST["addr1"])){
                $fields[$id] =  $_REQUEST["addr1"]  .   ( isset($_REQUEST["addr2"]) ? ", " . $_REQUEST["addr2"]:"" );
            }
            else if (isset($_REQUEST[$name])) {
                $fields[$id] = $_REQUEST[$name];
            }
        }
        return $fields;
    }

    public function sendResponse($resp){
        if ($resp["http_code"] == 200 && !$resp["body"]){
            $resp["body"] = array("success"=>true);
        }
        else{
            $resp["body"] = $this->xml_to_array($resp["body"]);
            if(is_array($resp["body"]["error"]) ){
                if(isset($resp["body"]["error"][0])){
                    for($i= 0; $i<count($resp["body"]["error"]); $i++){
                            $field = $resp["body"]["error"][$i]["signup_form_field_id"];
                        if($field){
                            $resp["body"]["error"][$i]["field"] = $this->id_to_field_map[$field];
                        }
                    }
                }
                else{
                    $resp["body"]["error"]["field"] = $this->id_to_field_map[$resp["body"]["error"]["signup_form_field_id"]];

                }
            }
        }
        if (!isset($_GET["callback"])) {
            header(':', true, $resp["http_code"]);
            header("Content-type: application/json");
            return json_encode($resp["body"]);
        } else {
            header("Content-type: application/javascript");
            return $_GET["callback"] . "(" . json_encode($resp["body"]) . ");";
        }
    }

 }
$bsdapi = new BSDAPI();
$list_form_fields = $bsdapi->get("signup", "list_form_fields", array(
    "signup_form_id" => $_REQUEST["signup_form_id"]
));
if($list_form_fields["http_code"]>=400){
    echo $bsdapi->sendResponse($list_form_fields);
    exit();
}
$signup_form_fields = $bsdapi->xml_to_array($list_form_fields["body"]);
$fields = $bsdapi->map_post_to_form($signup_form_fields["signup_form_field"]);
$xml = $bsdapi->process_signup_xml($_REQUEST["signup_form_id"], $fields);
$resp = $bsdapi->post("signup", "process_signup", $xml);
echo $bsdapi->sendResponse($resp);
?>
