<?php
session_start();
require_once("twitteroauth/twitteroauth.php"); //Path to twitteroauth library
 
$twitteruser = "nickjvm";
$notweets = 1;
$consumerkey = "sskZywPW8KMFpEvw2P3dlQ";
$consumersecret = "5ANeasDTbBC1Phq31HYgMCJw6RP06kLT0HrBTJQINw";
$accesstoken = "23658577-aU54KwHdepOPW5LjqCHBxN6GOZcoerQOJJ2EdFR1s";
$accesstokensecret = "WntNkw7pkhsrPT2ewAs7SbalJtAp4Nn9wDhN9EHByo";
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
  
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets."&include_entities=true");
 
echo json_encode($tweets);
?>