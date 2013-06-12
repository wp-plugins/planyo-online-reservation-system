<?php

// change the following values to match your settings
$site_id = 'demo';  // ID of your planyo site. It can be a number or the default value ('demo') to see demonstration of the plugin
$planyo_files_location = '/planyo-files';  // relative or absolute directory where the planyo files are kept (usually '/planyo-files')
$planyo_language = 'EN';  // you can optionally change the language here, e.g. 'FR' or 'ES' or pass the languge in the 'lang' parameter
$always_use_ajax = false;  // set to true to use AJAX to display resource list and resource details views
$sort_fields = 'name,price';  // comma-separated sort fields -- a single field will hide the sort dropdown box
$extra_search_fields = '';  // comma-separated extra fields in the search box
$default_mode = 'resource_list';  // initial (defualt) plugin mode; one of: 'resource_list', 'search', 'empty', 'upcoming_availability'
$dont_include_mootools = false;  // set to true only if mootools is already included

include_once('planyo-plugin-impl.php');

planyo_setup();

?>
