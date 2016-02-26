<?php
    require "vendor/autoload.php";
    require "config.php";
    use Blue\Tools\Api\Client;


    $client = new Client($config['username'], $config['secret'], $_GET['branch']);

    $formID = $_GET['formID'];
    
    $response = $client->get('signup/list_form_fields?signup_form_id='.$formID);
    $fields = $response->getBody();

    $variables = json_encode(simplexml_load_string($fields));
    print_r($variables);
?>