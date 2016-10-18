<?php
$env = 'prod';
if($env === 'prod')
{
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
    	'secret' => 'd1c6e74be0a60754087ce47f9f0435fff15005ba',
    	'dbuser' => 'root',
    	'dbpass' => 'abc123',
    	'dbhost' => '127.0.0.1',
    	'dbname' => 'widgets'
	);
}
?>