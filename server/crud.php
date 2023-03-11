<?php

// Connect to the database
$db = new mysqli("localhost", "root", "", "semmandalluwa");

// Check for errors
if($db->connect_error){
  die("Connection failed: " . $db->connect_error);
}



// Set the response header
header("Content-Type: application/json; charset=UTF-8");



// Get the HTTP method, path, and body of the request
$method = $_SERVER['REQUEST_METHOD'];

if (isset($_SERVER['PATH_INFO'])) {
  $request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
	//echo $_SERVER['PATH_INFO'];
} else {
  // Set the request to an empty array if PATH_INFO is not set
  $request = [];
}
//$json = '{"name":"John","email":"john@example.com"}';
$input = json_decode(file_get_contents("php://input"),true);
//$input = json_decode($json);
//echo $input->id;

if (!is_array($input)) {
  $input = array();
}

if ($input === null) {
  // Set $columns and $values to empty arrays
  $columns = [];
  $values = [];
} else {
  $columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
  $values = array_map(function ($value) use ($db) {
    if ($value===null) return null;
    return $db->real_escape_string((string)$value);
  },array_values($input));
}


// Get the table and key from the path
$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
$key = array_shift($request)+0;

// Escape the columns and values from the input object
$columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
$values = array_map(function ($value) use ($db) {
  if ($value===null) return null;
  return $db->real_escape_string((string)$value);
},array_values($input));

// Build the SET part of the SQL command
$set = '';
for ($i=0;$i<count($columns);$i++) {
  $set.=($i>0?',':'').'`'.$columns[$i].'`=';
  $set.=($values[$i]===null?'NULL':'"'.$values[$i].'"');
}

// Create SQL based on HTTP method
switch ($method) {
  case 'GET':
    $sql = "select * from `$table`".($key?" WHERE id=$key":''); break;
  case 'PUT':
    $sql = "update `$table` set $set where id=$key"; break;
  case 'POST':
    $sql = "insert into `$table` set $set"; break;
  case 'DELETE':
    $sql = "delete `$table` where id=$key"; break;
}

// Execute SQL statement
$result = $db->query($sql);

// Die if SQL statement failed
if (!$result) {
  http_response_code(404);
  die(mysqli_error());
}

// Print results, insert id or affected row count
if ($method == 'GET') {
  if (!$key) echo '[';
  for ($i=0;$i<mysqli_num_rows($result);$i++) {
    echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
  }
  if (!$key) echo ']';
} elseif ($method == 'POST') {
  echo mysqli_insert_id($db);
} else {
  echo mysqli_affected_rows($db);
}

// Close MySQL connection
$db->close();


?>