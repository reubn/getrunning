<?php
   
$dbhandle = sqlite_open('../stats.db', 0666, $error);

if (!$dbhandle) die ($error);
    
$stm1 = "INSERT INTO stats VALUES($_GET['loc'], , $_GET['RQ'], $_GET['AT'], $_GET['Atem'], $_GET['LorH'])";
$ok1 = sqlite_exec($dbhandle, $stm1);
if (!$ok1) die("Cannot execute statement.");

echo "Data inserted successfully";

sqlite_close($dbhandle);

?>