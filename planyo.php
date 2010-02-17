<?php
/*
Plugin Name: Planyo online reservation system
Plugin URI: http://www.planyo.com/wordpress-reservation-system
Description: This plugin embeds the Planyo.com online reservation system. Before using it, you'll need to create an account at planyo.com. Please see <a href='http://www.planyo.com/wordpress-reservation-system'>http://www.planyo.com/wordpress-reservation-system</a> for more info.
Version: 1.1.1
Author: Xtreeme GmbH
Author URI: http://www.planyo.com/
*/

/*  Copyright 2010 Xtreeme GmbH  (email : planyo@xtreeme.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

function planyo_menu() {
  add_options_page('Planyo Options', 'Planyo', 'administrator', 'planyo', 'planyo_options');
  add_action('admin_init', 'register_planyo_settings');
}

function register_planyo_settings() {
  register_setting('planyo-settings-group', 'site_id');
  register_setting('planyo-settings-group', 'extra_search_fields');
  register_setting('planyo-settings-group', 'sort_fields');
  register_setting('planyo-settings-group', 'planyo_language');
  register_setting('planyo-settings-group', 'default_mode');
}

function planyo_output_select_option ($value, $text, $option, $selected = false) {
  echo "<option value='$value' ";
  echo (get_option($option)==$value || ($selected && !get_option($option))) ? "selected='selected'" : "";
  echo ">$text</option>";
}

function planyo_options() {
?>
<div class="wrap">
<h2>Planyo Plugin Settings</h2>

<form method="post" action="options.php">
    <?php settings_fields( 'planyo-settings-group' ); ?>
    <table class="form-table">
        <tr valign="top">
        <th scope="row">Planyo site ID</th>
        <td><input type="text" name="site_id" value="<?php echo get_option('site_id') ? get_option('site_id') : 'demo'; ?>" /><br/>
        <span class='description'>ID of your planyo site. If you don't have a planyo site yet, create one first at www.planyo.com. The default value (demo) will use a demonstration site.</span>
        </td>
        </tr>

        <tr valign="top">
        <th scope="row">Additional fields of the search box</th>
        <td><input type="text" name="extra_search_fields" value="<?php echo get_option('extra_search_fields'); ?>" /><br/>
        <span class='description'>Comma-separated extra fields of the search box. Can be left empty.</span>
        </td>
        </tr>

        <tr valign="top">
        <th scope="row">Sort-by field choices</th>
        <td><input type="text" name="sort_fields" value="<?php echo get_option('sort_fields') ? get_option('sort_fields') : 'name,price'; ?>" /><br/>
        <span class='description'>Comma-separated possible sort fields. A single value will hide this parameter, more than one value will give the user a choice in form of a drop-down box. Can be left empty.</span>
        </td>
        </tr>
         
        <tr valign="top">
        <th scope="row">Language of Planyo interface</th>
        <td><select name='planyo_language'>
		    <?php planyo_output_select_option('EN', 'English', 'planyo_language', true);?>
		    <?php planyo_output_select_option('FR', 'French', 'planyo_language');?>
		    <?php planyo_output_select_option('IT', 'Italian', 'planyo_language');?>
		    <?php planyo_output_select_option('ES', 'Spanish', 'planyo_language');?>
		    <?php planyo_output_select_option('DE', 'German', 'planyo_language');?>
		    <?php planyo_output_select_option('PL', 'Polish', 'planyo_language');?>
		    <?php planyo_output_select_option('SE', 'Swedish', 'planyo_language');?>
		    <?php planyo_output_select_option('FI', 'Finnish', 'planyo_language');?>
		    <?php planyo_output_select_option('IS', 'Icelandic', 'planyo_language');?>
		    <?php planyo_output_select_option('DK', 'Danish', 'planyo_language');?>
        </select><br/>
        <span class='description'>Choose of the supported languages.</span>
        </td>
        </tr>

        <tr valign="top">
        <th scope="row">Default mode</th>
        <td><select name='default_mode'>
		    <?php planyo_output_select_option('search', 'Search box', 'default_mode', true);?>
		    <?php planyo_output_select_option('resources', 'Resource list', 'default_mode');?>
		    <?php planyo_output_select_option('empty', 'Do nothing', 'default_mode');?>
        </select><br/>
        <span class='description'>Choose the initial (default) mode: 'Search box' to allow clients to search for available dates or 'Resource list' to display a list of all resources (in such case search must be initiated by embedding an extra search box -- see last step of integration in Planyo's admin panel). Choosing 'Do nothing' will not display anything by default but will require you to either pass the resource ID to the module as URL parameter or add an external search box or calendar preview.</span>
        </td>
        </tr>

    </table>
    
    <p class="submit">
    <input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
    </p>

</form>
</div>
<?php
}

function planyo_init() {
  add_action('admin_menu', 'planyo_menu');
}

add_action('init', 'planyo_init');

?>