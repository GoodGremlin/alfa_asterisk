<?php
header('Content-Type: text/html; charset=utf-8');
$mysqli = new mysqli("172.15.1.250", "valera", "337279707", "Managament");
$result = $mysqli->query("SET NAMES utf8");


if (isset($_POST['id_oper'])) {
	$id_oper = $_POST['id_oper'];
	$query = "SELECT Id, Phone
			  FROM SipPhones
			  WHERE Id = '$id_oper'
			  ";
			  $result = $mysqli->query($query);
			  while ($row = $result->fetch_assoc()) {
			  	echo $row['Phone'];
			  }
}


if (isset($_POST['phone'])) {
	$phone = $_POST['phone'];
	$query = "SELECT ap.Id as id, ap.Sname as name, ap.Phone1 as phone, ap.service_map as service_map, vs.Street as street, vs.Hous as house, ap.flat as flat, vf.Flat as room
			  FROM AbonentsPhones as ap
			  LEFT JOIN ZViewServiceMap as vs ON ap.service_map = vs.id
			  LEFT JOIN ZViewFlat as vf ON ap.flat = vf.id
			  WHERE  Phone1 
			  LIKE '%$phone%'
			  ";
	$result = $mysqli->query($query); 

	while ($row = $result->fetch_assoc()) 
	{
		$name = $row['name'];
		$phone = $row['phone'];
		$service_map = $row['service_map'];
		$street = $row['street'];
		$house = $row['house'];
		$flat = $row['room'];
		$id = $row['id'];
		echo $name.':'.$phone.':'.$street.':'.$house.' кв.'.$flat.':'.$id;
	}

}

?>