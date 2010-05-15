<?php

$planyo_directory = str_replace(basename(__FILE__),"",plugin_basename(__FILE__));
require_once(WP_PLUGIN_DIR.'/'.$planyo_directory.'planyo-plugin-impl.php');

function planyo_code() {
  global $planyo_always_use_ajax, $planyo_site_id, $planyo_default_mode, $planyo_files_location, $planyo_language, $planyo_sort_fields, $planyo_extra_search_fields, $planyo_dont_include_mootools, $planyo_resource_id, $planyo_directory;
  // change the following values to match your settings
  $planyo_site_id = get_option('site_id');  // ID of your planyo site. It can be a number or the default value ('demo') to see demonstration of the plugin
  $planyo_files_location = WP_PLUGIN_URL.'/'.$planyo_directory; // relative or absolute directory where the planyo files are kept
  $planyo_language = get_option('planyo_language');  // you can optionally change the language here, e.g. 'FR' or 'ES' or pass the languge in the 'lang' parameter
  $planyo_always_use_ajax = get_option('seo_friendly')=='1' ? false : true;  // set to true to use AJAX to display resource list and resource details views
  $planyo_sort_fields = get_option('sort_fields');  // comma-separated sort fields -- a single field will hide the sort dropdown box
  $planyo_extra_search_fields = get_option('extra_search_fields');  // comma-separated extra fields in the search box
  $planyo_default_mode = get_option('default_mode');  // initial (defualt) plugin mode; one of: 'resources', 'search', 'empty'
  $planyo_dont_include_mootools = false;  // set to true only if mootools is already included
  $planyo_resource_id = null;  // optional: ID of the resource being reserved

?>
<div id='planyo_plugin_code'>
<?php planyo_setup();?>
</div>
<?php
}

planyo_code();
?>