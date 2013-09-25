<?php

$required = array("name","email","message");

$errors = array();
foreach ($_POST as $key => $value) {
	if(empty($value) || strlen($value) == 0) {
		array_push($errors,$key);
	}
}
if(isset($_POST['email'])) {
	if(!check_email_address($_POST['email'])) {
		array_push($errors,"email");
	}
}

if(count($errors) > 0) {
	print_r(json_encode(array("status"=>false,"code"=>1,"errors"=>$errors)));
} else { 
		$name = trim(strip_tags($_POST['name']));
		$email = trim(strip_tags($_POST['email']));
		$message = strip_tags(nl2br($_POST['message']),"<br>");
		
	  
	    // Your code here to handle a successful verificatio
		$to = 'nick@nickvanmeter.com';
		$subject = "[nickvanmeter.com] ".substr($message,0,10)."...";

		// the message here is HTML, but you could
		// use plain text in the same manner
		// this could also be pulled from a template file
		$msg = "
					<html>
					<head></head>
					<body>
					<ul style='list-style-type:none;padding:0;margin:0 0 1em 0;'>
						<li style='margin-left:0;'><strong>From:</strong> {$name}</li>
						<li style='margin-left:0;'><strong>Email:</strong> {$email}</li>
					</ul>
					<blockquote style='margin-left:0;'>
						{$message}
					</blockquote>
					</body>
					</html>";

		// To send HTML mail, the Content-type header must be set
		$headers  = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
		$headers .= 'From: '.$name.' <noreply@nickvanmeter.com>' . "\r\n";
		$headers .= 'Reply-To: '.$email. "\r\n";

		if(mail($to, $subject, $msg, $headers)) {
			print_r(json_encode(array("status"=>true)));
		} else {
			print_r(json_encode(array("status"=>false,"code"=>2)));
		}
}

function check_email_address($email) {
  // First, we check that there's one @ symbol, 
  // and that the lengths are right.
  if (!preg_match("/^[^@]{1,64}@[^@]{1,255}$/", $email)) {
    // Email invalid because wrong number of characters 
    // in one section or wrong number of @ symbols.
    return false;
  }
  // Split it into sections to make life easier
  $email_array = explode("@", $email);
  $local_array = explode(".", $email_array[0]);
  for ($i = 0; $i < sizeof($local_array); $i++) {
    if
(!preg_match("/^(([A-Za-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-][A-Za-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\.\-]{0,63})|(\"[^(\\|\")]{0,62}\"))$/",
$local_array[$i])) {
      return false;
    }
  }
  // Check if domain is IP. If not, 
  // it should be valid domain name
  if (!preg_match("/^\[?[0-9\.]+\]?$/", $email_array[1])) {
    $domain_array = explode(".", $email_array[1]);
    if (sizeof($domain_array) < 2) {
        return false; // Not enough parts to domain
    }
    for ($i = 0; $i < sizeof($domain_array); $i++) {
      if
(!preg_match("/^(([A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9])|
↪([A-Za-z0-9]+))$/",
$domain_array[$i])) {
        return false;
      }
    }
  }
  return true;
}
