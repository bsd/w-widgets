<?php
    require "vendor/autoload.php";
    require "config.php";
    use Blue\Tools\Api\Client;

    $client = new Client($config['username'], $config['secret'], $_GET['branch']);

    $formID = $_GET['formID'];

    /** @var ResponseInterface $response */
    $response = $client->get('signup/get_form?signup_form_id='.$formID);
    $json = $response->getBody();


    $variables = json_encode(simplexml_load_string($json));
    print_r($variables);

?>