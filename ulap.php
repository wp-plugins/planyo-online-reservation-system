<?php
define ('USE_ARC', 0); // set this to 1 to use arc.planyo.com (archived version), or 0 for planyo.com
define ('USE_SANDBOX', 0); // set this to 1 to use sandbox.planyo.com (test version), or 0 for planyo.com

if (!isset($header_written)) {
  if (isset ($_POST ['html_content_type']) || isset ($_GET ['html_content_type']))
    @header("Content-Type: text/html; charset=UTF-8");
  else
    @header("Content-Type: text/plain; charset=UTF-8");
}

// Ultra Light AJAX Proxy -- PHP implementation
// Used by the Planyo reservation system: see more at http://www.planyo.com/

/////////////////////////////////////////////////////////////////////////////
//
// get_client_ip
//
// returns user's IP address

function get_client_ip () {
  $ip = null;	
  if (!empty($_SERVER ['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER ['HTTP_CLIENT_IP'];
  }
  elseif (!empty($_SERVER ['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER ['HTTP_X_FORWARDED_FOR'];
  }
  elseif (!empty($_SERVER ['HTTP_X_FORWARDED'])) {
    $ip = $_SERVER ['HTTP_X_FORWARDED'];
  }
  elseif (!empty($_SERVER ['HTTP_FORWARDED_FOR'])) {
    $ip = $_SERVER ['HTTP_FORWARDED_FOR'];
  }
  elseif (!empty($_SERVER ['HTTP_FORWARDED'])) {
    $ip = $_SERVER ['HTTP_FORWARDED'];
  }
  else {
    $ip = $_SERVER['REMOTE_ADDR'];
  }
  return $ip;
}

/////////////////////////////////////////////////////////////////////////////
//
// send_http_post
//
// posts data to given URL

function send_http_post($url, &$fields) {
  $parts = parse_url($url);
  $host = $parts['host'];

  if (constant('USE_SANDBOX'))
    $url = str_replace("http://www.planyo.com", "http://sandbox.planyo.com", $url);
  else if (constant('USE_ARC'))
    $url = str_replace("http://www.planyo.com", "http://arc.planyo.com", $url);

  if ($host != "www.planyo.com" && $host != "arc.planyo.com" && $host != "sandbox.planyo.com" && $host != "localhost")
    return "Error: Call to $url not allowed";

  $params = '';
  if ($fields && count($fields) > 0) {
    foreach (array_keys($fields) as $key) {
      $params = $params . "$key=" . rawurlencode($fields[$key]);
      $params .= '&';
    }
  }
  $params .= 'modver=2.6';
  $ip = get_client_ip();
  if ($ip)
    $params .= "&client_ip=$ip";

  $context_options = array(
			   'http'=>array(
					 'method'=>"POST",
					 "Content-length: " . strlen($params) . "\r\n" .
					 "Content-type:application/x-www-form-urlencoded\r\n",
					 'content'=> $params)
			   );
  $context_options['https'] = $context_options['http'];
  $context = @stream_context_create($context_options);
  if (function_exists('curl_init')) {
    $cs = @curl_init($url);
    if ($cs) {
      @curl_setopt ($cs, CURLOPT_POST, 1);
      @curl_setopt ($cs, CURLOPT_POSTFIELDS, $params);
      @curl_setopt ($cs, CURLOPT_FOLLOWLOCATION, 1);
      @curl_setopt ($cs, CURLOPT_RETURNTRANSFER, 1); 
      $response = @curl_exec ($cs);
      @curl_close ($cs);
      if ($response && strlen($response) > 0)
        return $response;
    }
  }
  $fp = @fopen($url, 'r', false, $context);
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
  if ($fp !== false) {
    while (!feof($fp)) {
      $response .= fread($fp, 8192);
    }
  }
  fclose($fp);
  error_reporting($old_error_reporting);
  return $response;
}

if (isset ($_POST ['ulap_url']))
  echo send_http_post ($_POST ['ulap_url'], $_POST);
else if (isset ($_GET ['ulap_url']))
  echo send_http_post ($_GET ['ulap_url'], $_GET);

?>