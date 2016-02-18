 <?php
    require "vendor/autoload.php";
    use Blue\Tools\Api\Client;

    $client = new Client('widget-generator', '16a5024e331bf5ed07606bf31dde455abb26496e', 'https://whichcouk.cp.bsd.net');
    $formID = $_GET['formID'];
    

    $response = $client->get('signup/list_form_fields?signup_form_id='.$formID);
    $fields = $response->getBody();



        $variables = json_encode(simplexml_load_string($fields));
            print_r($variables);
    ?>