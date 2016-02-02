<?php
    require "vendor/autoload.php";
    use Blue\Tools\Api\Client;

    $client = new Client('widget-generator', '16a5024e331bf5ed07606bf31dde455abb26496e', $_GET['branch']);
    $formID = $_GET['formID'];


    /** @var ResponseInterface $response */
    $response = $client->get('signup/get_form?signup_form_id='.$formID);
    $json = $response->getBody();


    $variables = json_encode(simplexml_load_string($json));
    print_r($variables);

?>
