<?php  header("Access-Control-Allow-Origin: *");
$json = json_decode(file_get_contents('mapcountries.json'),true);
echo json_encode($json);	