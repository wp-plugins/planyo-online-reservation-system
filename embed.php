<?php
function planyo_code() {
?>
<div id='planyo_plugin_code'>
<script type="text/javascript">
		// change the following values to match your settings
		var ulap_script="ulap.php"; // file name to one of the ULAP scripts, e.g. ulap.php
		var planyo_site_id='<?php echo get_option('site_id');?>'; // ID of your planyo site
		var planyo_files_location='<?php echo WP_PLUGIN_URL.'/planyo';?>'; // relative or absolute directory where the planyo files are kept
		var extra_search_fields='<?php echo get_option('extra_search_fields');?>'; // comma-separated extra fields in the search box
		var planyo_language='<?php echo get_option('planyo_language');?>'; // you can optionally change the language here, e.g. 'FR' or 'ES'
		var sort_fields='<?php echo get_option('sort_fields');?>'; // comma-separated sort fields -- a single field will hide the sort dropdown box
		var presentation_mode=<?php echo get_option('default_mode') == 'resources' ? "true" : "false";?>; // false: show the search box by default, true: show resource list by default
</script>

<script type="text/javascript">
function get_param (name) {name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS = "[\\?&]"+name+"=([^&#]*)";var regex = new RegExp (regexS);var results = regex.exec (window.location.href);if (results == null) return null;else  return results[1];}
if (get_param('mode'))planyo_embed_mode = get_param('mode');
function get_full_planyo_file_path(name) {if(planyo_files_location.length==0||planyo_files_location.lastIndexOf('/')==planyo_files_location.length-1)return planyo_files_location+name; else return planyo_files_location+'/'+name;}
document.write("<link rel='stylesheet' href='"+get_full_planyo_file_path("planyo-styles.css")+"' type='text/css' />");
document.write("<div id='planyo_content'><img src='"+get_full_planyo_file_path("hourglass.gif")+"' align='middle' /></div>");
document.write("<sc"+"ript type='text/javascript' src='"+get_full_planyo_file_path("mootools-1.2-core.js")+"'></sc"+"ript>");
document.write("<sc"+"ript type='text/javascript' src='"+get_full_planyo_file_path("mootools-1.2-more.js")+"'></sc"+"ript>");
document.write("<sc"+"ript src='"+get_full_planyo_file_path("utils.js")+"' type='text/javascript'></sc"+"ript>");
document.write("<sc"+"ript src='"+get_full_planyo_file_path("planyo-reservations.js")+"' type='text/javascript'></sc"+"ript>");
</script>

<noscript>
<a href='http://www.planyo.com/about-calendar.php?calendar=<?php echo get_option('site_id');?>'>Make a reservation</a><br/><br/><a href='http://www.planyo.com/'>Reservation system powered by Planyo</a>
</noscript>
</div>
<?php
}

planyo_code();
?>