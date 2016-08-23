
<?php

$env = 'prod';
if($env === 'prod')
{	
$config = array(
		'username' => 'widget-generator',
    	'secret' => '16a5024e331bf5ed07606bf31dde455abb26496e',
	);
}
else {
$config = array(
		'username' => 'widget-generator',
    	'secret' => 'd1c6e74be0a60754087ce47f9f0435fff15005ba',
	);	
}
?>