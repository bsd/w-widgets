<?php
$host = $_SERVER['HTTP_HOST'];

if(strpos($host, 'widget.which') !== false) { $env = 'prod'; }
else if(strpos($host, 'test.which') !== false) { $env = 'testing'; }
else if(strpos($host, 'staging.which') !== false) { $env = 'staging'; }
else { $env = 'local'; }

if($env === 'prod')
{
    $config = array(
            'username' => 'widget-generator',
            'secret' => '16a5024e331bf5ed07606bf31dde455abb26496e',
            'dbuser' => 'widget',
            'dbpass' => '83HEiVqPNCw7',
            'dbhost' => 'db.which.co.uk',
            'dbname' => 'widget'
        );
}
elseif($env === 'staging') {
    $config = array(
            'username' => 'widget-generator',
            'secret' => '16a5024e331bf5ed07606bf31dde455abb26496e',
            'dbuser' => 'widget',
            'dbpass' => 'U3qonZplenbD',
            'dbhost' => 'db.staging.which-testing.co.uk',
            'dbname' => 'widget'
        );
}
elseif($env === 'testing') {
    $config = array(
            'username' => 'widget-generator',
            'secret' => '16a5024e331bf5ed07606bf31dde455abb26496e',
            'dbuser' => 'widget',
            'dbpass' => 'SRTe89VG973R',
            'dbhost' => 'db.test.which-testing.co.uk',
            'dbname' => 'widget'
        );
}
else {
$config = array(
            'username' => 'widget-generator',
            'secret' => '16a5024e331bf5ed07606bf31dde455abb26496e',
        'dbuser' => 'root',
        'dbpass' => 'abc123',
        'dbhost' => '127.0.0.1',
        'dbname' => 'widgets'
    );
}
?>