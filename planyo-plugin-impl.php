<?php

if (!isset($planyo_set_content_type))
  @header("Content-Type: text/html; charset=UTF-8");  
$header_written = true;

require_once(dirname(__FILE__).'/ulap.php');

function planyo_get_param($name) {
  global $_GET;
  global $_POST;
  if (isset ($_GET [$name]))
    return $_GET [$name];
  if (isset ($_POST [$name]))
    return $_POST [$name];
  return null;
}

function planyo_get_contents($url, $params) {
  return send_http_post($url, $params);
}

function planyo_output_resource_list() {
  global $planyo_site_id, $planyo_metasite_id, $planyo_feedback_url, $planyo_default_mode, $planyo_language, $planyo_files_location, $planyo_resource_ordering, $planyo_login_info;
  $planyo_default_mode = 'empty';
  $language = $planyo_language;
  if (planyo_get_param('lang'))
    $language = planyo_get_param('lang');
  if ($planyo_metasite_id && planyo_get_param('site_id')) {
    $site_id_used = planyo_get_param('site_id');
    $metasite_id_used = $planyo_metasite_id;
  }
  else if ($planyo_site_id && !$planyo_metasite_id) {
    $site_id_used = $planyo_site_id;
    $metasite_id_used = '';
  }
  else {
    $site_id_used = '';
    $metasite_id_used = $planyo_metasite_id;
  }
  $params = array('modver'=>'1.7','site_id'=>$site_id_used,'metasite_id'=>$metasite_id_used, 'mode'=>'display_resource_list_code','feedback_url'=>$planyo_feedback_url, 'language'=>$language ? $language : '', 'sort'=>planyo_get_param('sort') ? planyo_get_param('sort') : $planyo_resource_ordering, 'res_filter_name'=>planyo_get_param('res_filter_name'), 'res_filter_value'=>planyo_get_param('res_filter_value'), 'planyo_files_location'=>$planyo_files_location);
  if (planyo_get_param('res_filter_name') && planyo_get_param('res_filter_value')) {
    $params['res_filter_name'] = planyo_get_param('res_filter_name');
    $params['res_filter_value'] = planyo_get_param('res_filter_value');
  }
  if (is_array($planyo_login_info)) {
    $params['login_cs'] = $planyo_login_info['login_cs'];
    $params['login_email'] = $planyo_login_info['login_email'];
  }
  $params['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
  echo planyo_get_contents(((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? "https" : "http")."://www.planyo.com/rest/planyo-reservations.php", $params);
  echo "<script type='text/javascript'>\nvar force_empty_mode=true;\n</script>\n";
}

function planyo_output_site_list() {
  global $planyo_metasite_id, $planyo_feedback_url, $planyo_default_mode, $planyo_language, $planyo_files_location, $planyo_login_info;
  $planyo_default_mode = 'empty';
  $language = $planyo_language;
  if (planyo_get_param('lang'))
    $language = planyo_get_param('lang');
  $params = array('modver'=>'1.7','site_id'=>"",'metasite_id'=> $planyo_metasite_id, 'mode'=>'display_site_list_code','feedback_url'=>$planyo_feedback_url, 'language'=>$language ? $language : '', 'sort'=>planyo_get_param('sort'), 'cal_filter_name'=>planyo_get_param('cal_filter_name'), 'cal_filter_value'=>planyo_get_param('cal_filter_value'), 'planyo_files_location'=>$planyo_files_location);
  if (planyo_get_param('cal_filter_name') && planyo_get_param('cal_filter_value')) {
    $params['cal_filter_name'] = planyo_get_param('cal_filter_name');
    $params['cal_filter_value'] = planyo_get_param('cal_filter_value');
  }
  if (is_array($planyo_login_info)) {
    $params['login_cs'] = $planyo_login_info['login_cs'];
    $params['login_email'] = $planyo_login_info['login_email'];
  }
  $params['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
  echo planyo_get_contents(((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? "https" : "http")."://www.planyo.com/rest/planyo-reservations.php", $params);
  echo "<script type='text/javascript'>\nvar force_empty_mode=true;\n</script>\n";
}

function planyo_output_resource_details() {
  global $planyo_site_id, $planyo_metasite_id, $planyo_feedback_url, $planyo_default_mode, $planyo_language, $planyo_files_location, $planyo_resource_id;
  $planyo_default_mode = 'empty';
  $language = $planyo_language;
  if (planyo_get_param('lang'))
    $language = planyo_get_param('lang');
  echo planyo_get_contents((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? "https" : "http")."://www.planyo.com/rest/planyo-reservations.php", array('modver'=>'1.7','site_id'=>($planyo_site_id && !$planyo_metasite_id ? $planyo_site_id : ""),'metasite_id'=>($planyo_metasite_id ? $planyo_metasite_id : ""), 'resource_id'=>($planyo_resource_id ? $planyo_resource_id : planyo_get_param('resource_id')), 'mode'=>'display_single_resource_code','feedback_url'=>$planyo_feedback_url, 'language'=>$language ? $language : '', 'user_agent'=>$_SERVER['HTTP_USER_AGENT'], 'planyo_files_location'=>$planyo_files_location));
  echo "<script type='text/javascript'>\nvar force_empty_mode=true;\n</script>\n";
}

function planyo_is_presentation_mode() {
  if (planyo_get_param ('submitted') || planyo_get_param ('prefill') || planyo_get_param('mode'))
    return false;
  if (planyo_get_param('presentation_mode') == '0')
    return false;
  return true;
}

function planyo_setup() {
  global $planyo_feedback_url, $planyo_always_use_ajax, $planyo_site_id, $planyo_metasite_id, $planyo_default_mode, $planyo_resource_id, $planyo_files_location, $planyo_language, $planyo_sort_fields, $planyo_extra_search_fields, $planyo_js_library_used, $planyo_include_js_library, $planyo_login_info, $planyo_resource_ordering;

  if ($planyo_default_mode == 'empty' && (planyo_get_param('resource_id') || $planyo_resource_id))
    $planyo_default_mode = 'reserve';
  $planyo_metasite_id = null;
  if (!$planyo_site_id || $planyo_site_id == 'demo')
    $planyo_site_id = 11;  // demo site
  else if (substr($planyo_site_id, 0, 1) == 'M')
    $planyo_metasite_id = substr($planyo_site_id, 1);  // metasite ID: set only for metasites

  if (!$planyo_always_use_ajax && ($planyo_default_mode == 'resources' || $planyo_default_mode == 'sites')) {
    $planyo_feedback_url = planyo_get_param('feedback_url');
    if (!$planyo_feedback_url)
      $planyo_feedback_url = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? "https" : "http")."://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
    
    if (planyo_is_presentation_mode()) {
      if (planyo_get_param('resource_id') || $planyo_resource_id)
        planyo_output_resource_details();
      else if ($planyo_metasite_id && $planyo_default_mode != 'resources' && !planyo_get_param('site_id'))
        planyo_output_site_list();
      else
        planyo_output_resource_list();
    }
  }

?>
<script type="text/javascript">
// these values are copied from the PHP settings; please update the original values above and leave these unchanged
var ulap_script="ulap.php"; // file name to one of the ULAP scripts, e.g. ulap.php
var planyo_site_id='<?php echo $planyo_site_id;?>'; // ID of your planyo site
var planyo_resource_id='<?php if ($planyo_resource_id) echo $planyo_resource_id;?>'; // optional: ID of the resource being reserved
var planyo_files_location='<?php echo $planyo_files_location;?>'; // relative or absolute directory where the planyo files are kept (usually '/planyo-files')
var planyo_language='<?php echo $planyo_language;?>'; // you can optionally change the language here, e.g. 'FR' or 'ES' or pass the languge in the 'lang' parameter
var sort_fields='<?php echo $planyo_sort_fields;?>'; // comma-separated sort fields -- a single field will hide the sort dropdown box
var planyo_resource_ordering='<?php if (isset($planyo_resource_ordering)) echo $planyo_resource_ordering;?>'; // optional sort criterium for resource list
var extra_search_fields='<?php echo $planyo_extra_search_fields;?>'; // comma-separated extra fields in the search box
var presentation_mode=<?php echo ($planyo_default_mode == 'resources') ? "true" : "false";?>; // false: show the search box by default, true: show resource list by default
var empty_mode=<?php echo ($planyo_default_mode == 'empty') ? "true" : "false";?>; // if true, don't show anything by default
var planyo_use_https=<?php echo (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? "true" : "false";?>; // set this to true if embedding planyo on a secure website (SSL)
<?php
    if (is_array($planyo_login_info)) {
      echo "var planyo_login=new Array();\n";
      foreach($planyo_login_info as $key=>$val) {
      if ($val)
        echo "planyo_login['".$key."']=\"".$val."\";\n";
      }
    }
?>
</script>

<script type="text/javascript">
function get_param (name) {name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS = "[\\?&]"+name+"=([^&#]*)";var regex = new RegExp (regexS);var results = regex.exec (window.location.href);if (results == null) return null;else  return results[1];}
if (get_param('mode'))planyo_embed_mode = get_param('mode');
function get_full_planyo_file_path(name) {if(planyo_files_location.length==0||planyo_files_location.lastIndexOf('/')==planyo_files_location.length-1)return planyo_files_location+name; else return planyo_files_location+'/'+name;}
document.write("<link rel='stylesheet' href='"+get_full_planyo_file_path("planyo-styles.css")+"' type='text/css' />");
document.write("<div id='planyo_content'><img src='"+get_full_planyo_file_path("hourglass.gif")+"' align='middle' /></div>");
<?php
if ($planyo_js_library_used == 'jquery' || $planyo_js_library_used == 'jQuery') {
    if ($planyo_include_js_library) {
?>
document.write("<sc"+"ript type='text/javascript' src='"+get_full_planyo_file_path("jquery.js")+"'></sc"+"ript>");
<?php
    }
?>
document.write("<sc"+"ript src='"+get_full_planyo_file_path("planyo-jquery-utils.js")+"' type='text/javascript'></sc"+"ript>");
document.write("<sc"+"ript src='"+get_full_planyo_file_path("planyo-jquery-reservations.js")+"' type='text/javascript'></sc"+"ript>");
<?php
}
else {
    if ($planyo_include_js_library) {
?>
document.write("<sc"+"ript type='text/javascript' src='"+get_full_planyo_file_path("mootools-1.2-core.js")+"'></sc"+"ript>");
document.write("<sc"+"ript type='text/javascript' src='"+get_full_planyo_file_path("mootools-1.2-more.js")+"'></sc"+"ript>");
<?php
    }
?>
document.write("<sc"+"ript src='"+get_full_planyo_file_path("utils.js")+"' type='text/javascript'></sc"+"ript>");
document.write("<sc"+"ript src='"+get_full_planyo_file_path("planyo-reservations.js")+"' type='text/javascript'></sc"+"ript>");
<?php
}
?>
</script>
<noscript>
<a href='http://www.planyo.com/about-calendar.php?calendar=<?php echo $planyo_site_id;?>'>Make a reservation</a><br/><br/><a href='http://www.planyo.com/'>Reservation
  system powered by Planyo</a>
</noscript>
<?php
}
?>