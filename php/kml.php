<?php
$points = $_GET['points'];
$pointsa = str_replace("","", $points);
$pointsb = explode("),", $pointsa);
echo str_replace(")", "", str_replace("(", "", implode("<br />", $pointsb)));

?>
