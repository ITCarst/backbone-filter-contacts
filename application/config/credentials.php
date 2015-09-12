<?php
$isLive = false;


if ($isLive) 
    $credentials = [ 
        "user"  => "root",
        "pass"  => "root",
        "db"    => "backbone_contacts",
        "host"  => "localhost:8889"
    ];
else
    $credentials = [
        "user"  => "root",
        "pass"  => "root",
        "db"    => "backbone_contacts",
        "host"  => "localhost:8889"
    ];

return $credentials;

?>
