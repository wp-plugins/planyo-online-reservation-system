<?php

// Ultra Light AJAX Proxy -- PHP implementation
// Used by the Planyo reservation system: see more at http://www.planyo.com/

/////////////////////////////////////////////////////////////////////////////
//
// send_http_post
//
// posts data to given URL

function send_http_post($url, &$fields) {
  $parts = parse_url($url);
  $host = $parts['host'];
  if ($host != "www.planyo.com")
    return "Error: Call to $url not allowed";

  $urlencoded = '';
  if ($fields && count($fields) > 0) {
    foreach (array_keys($fields) as $key) {
      $urlencoded = $urlencoded . "$key=" . rawurlencode($fields[$key]);
      $urlencoded .= '&';
    }
  }
  $context_options = array(
			   'http'=>array(
					 'method'=>"POST",
					 "Content-length: " . strlen($urlencoded) . "\r\n" .
					 "Content-type:application/x-www-form-urlencoded\r\n",
					 'content'=> $urlencoded)
			   );
  $context_options['https'] = $context_options['http'];
  $context = stream_context_create($context_options);
  $fp = @fopen($url, 'r', false, $context);
  if (!$fp) {
    $cs = @curl_init($url);
    if ($cs) {
      curl_setopt ($cs, CURLOPT_POST, 1);
      curl_setopt ($cs, CURLOPT_POSTFIELDS, $urlencoded);
      curl_setopt ($cs, CURLOPT_FOLLOWLOCATION, 1);
      curl_setopt ($cs, CURLOPT_RETURNTRANSFER, 1); 
      $response = curl_exec ($cs);
      curl_close ($cs);
      return $response;
    }
    return null;
  }
  $response = '';
  $old_error_reporting = error_reporting();
  error_reporting($old_error_reporting & ~E_WARNING);
  $meta_data = stream_get_meta_data($fp);
  foreach($meta_data['wrapper_data'] as $response_header) {
    if (substr($response_header,0,5) == 'HTTP/') {
      $bits = explode(' ', $response_header);
      $httpstatus = (int) $bits[1];
      $httpstatusmessage = $response_header;
    }
  }
  while (!feof($fp)) {
    $response .= fread($fp, 8192);
  }
  fclose($fp);
  error_reporting($old_error_reporting);
  return $response;
}

if (isset ($_POST ['ulap_url']))
  echo send_http_post ($_POST ['ulap_url'], $_POST);
else
  echo send_http_post ($_GET ['ulap_url'], $_GET);

?>