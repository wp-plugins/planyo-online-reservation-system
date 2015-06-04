function planyo_isset (obj, d1, d2, d3, d4, d5) {
  try {
    if (d5 != null)
      return obj [d1][d2][d3][d4][d5] != undefined;
    if (d4 != null)
      return obj [d1][d2][d3][d4] != undefined;
    if (d3 != null)
      return obj [d1][d2][d3] != undefined;
    if (d2 != null)
      return obj [d1][d2] != undefined;
    if (d1 != null)
      return obj [d1] != undefined;
    return obj != undefined;
  }
  catch (err) {
  }
  return false;
}

function dump(arr,level) {
  var dumped_text = "";
  if(!level) level = 0;
  
  //The padding given at the beginning of the line.
  var level_padding = "";
  for(var j=0;j<level+1;j++) level_padding += "    ";
  
  if(typeof(arr) == 'object') { //Array/Hashes/Objects
    for(var item in arr) {
      var value = arr[item];
      
      if(typeof(value) == 'object') { //If it is an array,
	dumped_text += level_padding + "'" + item + "' ...\n";
	dumped_text += dump(value,level+1);
      } else {
	dumped_text += level_padding + "'" + item + "' = \"" + value + "\" || ";
      }
    }
  } else { //Strings/Chars/Numbers etc.
    dumped_text = "==="+arr+"===("+typeof(arr)+")";
  }
  return dumped_text;
}

function planyo_get_next_month (month, year) {
  var next_month = parseInt(month) + 1;
  var next_year = parseInt(year);
  if (next_month == 13) {
    next_month = 1;
    next_year++;
  }
  return new Array (next_month, next_year);
}

function planyo_get_prev_month (month, year) {
  var prev_month = parseInt(month) - 1;
  var prev_year = parseInt(year);
  if (prev_month == 0) {
    prev_month = 12;
    prev_year--;
  }
  return new Array (prev_month, prev_year);
}

function planyo_get_month_specs (month, year) {
  // returns an array: (offset of the first day of month, # of days in last month, # of days in current month, month, year)
      
  var d = new Date ();
  if (!month || !year)
    d.setFullYear (d.getFullYear (), d.getMonth (), 1);
  else
    d.setFullYear (year, month - 1, 1);
  var first_weekday = planyo_isset(document.first_weekday) ? document.first_weekday : 1;
  var first_offset = (7 - first_weekday + d.getDay()) % 7;
  var last_month_last_date = new Date (d);
  last_month_last_date.setDate (d.getDate()-1);
  var prev_month_count = last_month_last_date.getDate ();
  var this_month_last_date = new Date (d);
  this_month_last_date.setMonth (d.getMonth()+1);
  this_month_last_date.setDate (this_month_last_date.getDate()-1);
  var this_month_count = this_month_last_date.getDate();
  return new Array (first_offset, prev_month_count, this_month_count, month, year);
}

function planyo_get_day_name (n, is_short) {
  var first_weekday = planyo_isset(document.first_weekday) ? document.first_weekday : 1;
  var arr = planyo_isset (document.s_weekdays_short) ? (is_short ? document.s_weekdays_short : document.s_weekdays_med) :
    (is_short ? new Array ("M", "T", "W", "T", "F", "S", "S") : new Array ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"));
  return arr [(n + first_weekday + 6) % 7];
}

function planyo_get_month_name (n, is_short) {
  var arr = planyo_isset (document.s_months_short) ? (is_short ? document.s_months_short : document.s_months_long) :
    (is_short ? new Array ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec") : new Array ("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"));
  return arr [n - 1];
}

function planyo_output_hour_only(hour, european_style_postfix) {
  if (document.time_format && document.time_format.indexOf('a') != -1)
    return ((hour % 12) == 0 ? 12 : hour % 12) +' '+ ((hour < 12 || hour == 24) ? 'am' : 'pm');
  if (document.noh && european_style_postfix == 'h')
      return (document.noh=='range') ? (hour+'-'+(hour+1)) : (hour+':00');
  else
    return hour+(european_style_postfix ? european_style_postfix : '');
}

function planyo_output_time_from_format(hour, minute, format) {
  var time_str = format;
  time_str = time_str.replace("H", hour);
  time_str = time_str.replace("h", (hour % 12) == 0 ? 12 : hour % 12);
  time_str = time_str.replace("a", (hour < 12 || hour == 24) ? 'am' : 'pm');
  time_str = time_str.replace("i", minute<10 ? '0'+minute : minute);
  return time_str;
}

function planyo_output_time(hour, minute) {
  var time_str = document.time_format;
  if (!time_str) time_str = "H:i";
  return planyo_output_time_from_format(hour, minute, time_str);
}

function planyo_output_date_from_format(year, month, day, format) {
  var date = format;
  date = date.replace("Y", year);
  date = date.replace("m", month < 10 ? '0'+month : month);
  date = date.replace("M", planyo_get_month_name(month, true));
  date = date.replace("d", day < 10 ? '0'+day : day);
  return date;
}

function planyo_output_date(year, month, day) {
  var date = document.date_format;
  if (!date) date = "Y-m-d";
  return planyo_output_date_from_format(year, month, day, date);
}

function planyo_parse_date (date_str, format) {
  //works with the following formats: Y/m/d, Y-m-d, d.m.Y, d M Y(EN), M d, Y(EN), m/d/Y
  if (!date_str) return 0;

  var parsed = Date.parse(date_str);
  if ((!parsed || parsed == undefined || format =="d/m/Y" || format == "d.m.Y") && format) {
    switch (format) {
      case "d.m.Y":
        var parts = date_str.split('.');
        if (parts.length >= 2)
          parsed = Date.parse(parts[2]+'/'+parts[1]+'/'+parts[0]);
        break;
      case "Y-m-d":
        var parts = date_str.split('-');
        if (parts.length >= 2)
          parsed = Date.parse(parts[0]+'/'+parts[1]+'/'+parts[2]);
        break;
      case "d/m/Y":
        var parts = date_str.split('/');
        if (parts.length >= 2)
          parsed = Date.parse(parts[2]+'/'+parts[1]+'/'+parts[0]);
        break;
    }
  }
  if (!parsed || (parsed.getFullYear && parsed.getFullYear() < 2000))
    parsed = 0;
  return parsed;
}

function planyo_get_day_info_for_month (month, year) {
  var now = new Date();

  var day_info = new Array();
  
  var month_specs = planyo_get_month_specs (month, year);
  var day_iterator = month_specs [1] - month_specs [0] + 1;
  var days_in_month_left = month_specs [0] - 1;
  var month_iterator = -1;
  if (days_in_month_left == -1) {
    month_iterator = 0;
    days_in_month_left = month_specs [2] - 1;
    day_iterator = 1;
  }
  for (var y = 0; y < 6; y++) {
    day_info [y] = new Array();
    for (var x = 0; x < 7; x++) {
      day_info [y][x] = new Array();
      var day_class;
      if (month - 1 == now.getMonth() && month_iterator == 0 && day_iterator == now.getDate() && year == now.getFullYear ())
	day_class = 'active_day';
      else
	day_class = (month_iterator == 0 ? 'cur_month_day' : 'ext_month_day');

      day_info [y][x]['type'] = day_class;
      day_info [y][x]['day'] = day_iterator;
      day_info [y][x]['month'] = month + month_iterator;
      day_info [y][x]['year'] = year;
      if (month + month_iterator == 0) {
	day_info [y][x]['month'] = 12;
	day_info [y][x]['year'] = year - 1;
      } else if (month + month_iterator == 13) {
	day_info [y][x]['month'] = 1;
	day_info [y][x]['year'] = year + 1;
      }
      
      if (days_in_month_left == 0) {
	month_iterator++;
	days_in_month_left = month_specs [2];
	day_iterator = 0;
      }
      days_in_month_left--;
      day_iterator++;
    }
  }

  return day_info;
}

function planyo_show_calendar_picker (month, year, div_id, date_fun) {
  var now = new Date();
  if (year < 2000) {
    month = now.getMonth() + 1;
    year = now.getFullYear();
  }
  else if (month == 0) {
    month = 12;
    year--;
  }
  else if (month == 13) {
    month = 1;
    year++;
  }
  var day_info = planyo_get_day_info_for_month (month, year);
  document.current_picked_month = month;
  document.current_picked_year = year;
  document.current_picked_id = div_id;
  
  var cal_ref_el = document.getElementById(div_id+'ref');
  var extra_class = (cal_ref_el && cal_ref_el.className.indexOf('float-date-icon')!=-1) ? ' float-calpicker' : '';

  var div_code = "<table class='calpicker "+extra_class+"'><caption><a class='nav "+(extra_class||document.new_scheme ? ' navleft' : '')+"' target='_self' href=\"javascript:planyo_show_calendar_picker("+(month-1)+", "+year+", '"+div_id+"','"+date_fun+"');\">&#160;&laquo;&#160;</a> "+ planyo_get_month_name (month, false) +" " + year + " <a class='nav "+(extra_class||document.new_scheme ? ' navright' : '')+"' target='_self' href=\"javascript:planyo_show_calendar_picker("+(month+1)+","+year+", '"+div_id+"','"+date_fun+"');\">&#160;&raquo;&#160;</a></caption><thead><tr>";
  for (var i = 0; i < 7; i++) {
    div_code += "<th>" + planyo_get_day_name (i, true) + "</th>";
  }
  div_code += "</thead><tbody>";
  var cellno = 0;
  var prev_day_is_av = null;
  for (var y = 0; y < 6; y++) {
    div_code += "<tr>";
    for (var x = 0; x < 7; x++) {
      var is_av = true;
      var extra_data_read = false;
      var resource = null;
      if (window.planyo_resource_id && document.resources && (document.picker_preview_sync === null || document.picker_preview_sync === undefined || document.picker_preview_sync === 1)) {
        resource = document.resources[window.planyo_resource_id];
        if (!planyo_isset (document.fetched_data, year, month)) {
          if (cellno == 0) {
            if (document.preview_sync_src)
              document.preview_sync_src.postMessage('FCH' + planyo_output_date_from_format(year, month, 1, 'Y-m-d'),'*');
            else if (window.js_fetch_calendar_data)
              js_fetch_calendar_data (month, year);
          }
        }
        else {
          is_av = planyo_get_day_status(day_info [y][x]['year'], day_info [y][x]['month'], day_info [y][x]['day'], resource);
          extra_data_read = true;
          if (prev_day_is_av === null && resource && resource['night_reservation'] == '1') {
            var prev_day = planyo_get_prev_day (day_info [y][x]['day'], day_info [y][x]['month'], day_info [y][x]['year'], 1);
            prev_day_is_av = planyo_get_day_status (prev_day[2], prev_day[1], prev_day[0], resource);
          }
        }
      }
      var div_type = day_info [y][x]['type'];
      if (resource && resource['min_rental_time'] >= 24) {
        if (div_type == 'cur_month_day' || div_type == 'ext_month_day' || div_type == 'active_day') {
          div_type += "_nox";
        }
        if (!is_av) {
	        if (div_type == 'ext_month_day_nox')
	          div_type += "_r";
          else
            div_type = 'reserved_nox';
          if (prev_day_is_av && resource && resource['night_reservation'] == '1') {
            div_type += " morning_av_nox";
          }
        }
        else {
          var start_day_status = null;
          if (planyo_isset(document.start_day_restrictions, day_info[y][x]['year'], day_info[y][x]['month'], resource['id'], day_info[y][x]['day'])) {
            start_day_status = document.start_day_restrictions[day_info[y][x]['year']][day_info[y][x]['month']][resource['id']][day_info[y][x]['day']];
          }
          if (div_id.indexOf('end_date') == -1 && planyo_isset(document.start_day_restrictions, day_info[y][x]['year'], day_info[y][x]['month'], resource['id'])) {
            if (start_day_status == 2)
              div_type += " no_start";
            else
              div_type += " arrival_day";
          }
        }
        if (resource && resource['night_reservation'] == '1' && prev_day_is_av === false && is_av) {
          div_type += " morning_occ_nox";
        }
      }
      div_code += "<td style='cursor:pointer' class='" + div_type + "' onclick='" + date_fun + "(" + day_info [y][x]['day'] + ","+day_info [y][x]['month']+","+day_info [y][x]['year']+")'>" + day_info [y][x]['day'] + "</td>";
      prev_day_is_av = is_av;
      cellno++;
    }
    div_code += "</tr>";
  }
  div_code += "</tr>";
  div_code += "</tbody></table>";
  document.getElementById (div_id).innerHTML = div_code;
  if(document.getElementById(div_id).table_width && document.getElementById(div_id).firstChild)
    document.getElementById(div_id).firstChild.style.width = document.getElementById(div_id).table_width;
}

function planyo_set_event(obj,event,fun,bubble) {
  if (obj) {
    if (obj.addEventListener)
      obj.addEventListener (event,eval(fun),bubble);
    //else
    //  eval("obj.on"+event+"="+fun);
    else if (obj.addEvent)
      obj.addEvent(event,eval(fun));
    else
      obj.attachEvent('on'+event, eval(fun));
  }
}

function planyo_get_prev_day (day, month, year, offset) {
  // returns an array: (day, month, year)
  // note: offset must be < 28
  
  var specs = planyo_get_month_specs (month, year);

  var ret_val = new Array ();
  if (!offset) offset = 1;
  if (day - offset <= 0) {
    ret_val [0] = specs [1] - offset + day;
    ret_val [1] = month - 1;
    ret_val [2] = year;
    if (ret_val [1] == 0) {
      ret_val [1] = 12;
      ret_val [2] = year - 1;
    }
  }
  else {
    ret_val [0] = day - offset;
    ret_val [1] = month;
    ret_val [2] = year;
  }
  return ret_val;
}

function planyo_get_next_day (day, month, year, offset) {
  // returns an array: (day, month, year)
  // note: offset must be < 28
  
  var specs = planyo_get_month_specs (month, year);

  var ret_val = new Array ();
  if (!offset) offset = 1;
  if (day + offset > specs [2]) {
    ret_val [0] = day + offset - specs [2];
    ret_val [1] = month + 1;
    ret_val [2] = year;
    if (ret_val [1] == 13) {
      ret_val [1] = 1;
      ret_val [2] = year + 1;
    }
  }
  else {
    ret_val [0] = day + offset;
    ret_val [1] = month;
    ret_val [2] = year;
  }
  return ret_val;
}

// returns an array (min, max) of min and max values of array
// if array's values are an array of properties, property to be used can be specified
// otherwise, leave property null
function planyo_get_array_min_max(arr, property) {
  var min;
  var max;
  var n = 0;
  for (var it in arr) {
    var val = (property ? it [property] : it);
    if (n == 0 || val < min)
      min = val;
    if (n == 0 || val > max)
      max = val;
    n++;
  }
  return new Array(min,max);
}

function elbyid (id) {
  return document.getElementById (id);
}

function planyo_get_item_coordinates (item) {
  var left=0;
  var top=0;
  var right=0;
  var bottom=0;
  var par=item;
  while(par){
    left=left+parseInt(par.offsetLeft);
    top=top+parseInt(par.offsetTop);
    if(par.offsetParent==par || par.offsetParent==document.body)break;
    par=par.offsetParent;
  }
  right=left+parseInt(item.offsetWidth);
  bottom=top+parseInt(item.offsetHeight);
  return {left:left, top:top, right:right, bottom:bottom};
}

function planyo_dummy (e) {
  if(!e) e=event;
  if (e) e.cancelBubble=true;
}

function planyo_close_calendar () {
  if (document.current_picker) {
    var el = document.getElementById(document.current_picker+'cal');
    el.style.visibility = 'hidden';
    el.style.left=-1000;
    document.current_picked_id = null;
  }
}

function convert_entities_to_utf8 (str) {
  var i = str.indexOf ("&#");
  while (i != -1) {
    var iSC = str.indexOf (";", i);
    if (iSC != -1 && (iSC - i - 2) > 0 && (iSC - i - 2) <= 5) {
      var decimal = str.substr (i + 2, iSC - i - 2);
      if (!isNaN (decimal) && decimal == parseInt (decimal)) {
        str = str.substr (0, i) + String.fromCharCode (decimal) + ((str.length > iSC + 1) ? str.substr (iSC + 1) : '');
      }
    }
    i = str.indexOf ("&#", i + 1);
  }  
  return str;
}

function planyo_calendar_date_chosen (day, month, year) {
  var picker = document.getElementById(document.current_picker);
  if (picker.exclude_year)
    picker.value = convert_entities_to_utf8 (day+' '+planyo_get_month_name (month, false));
  else
    picker.value = convert_entities_to_utf8 (planyo_output_date(year, month, day));
  if (document.current_picker_onchange)
    eval(document.current_picker_onchange);
  document.previous_month_picked = month;
  document.previous_year_picked = year;
  planyo_close_calendar();
  if(window.js_nav) {
    if (document.current_picker == 'start_date')
      js_nav(day,month, year);
    else if (document.current_picker == 'one_date')
      js_nav(day, month, year);
  }
  else if (document.preview_sync_src && document.current_picker != 'end_date') {
    document.preview_sync_src.postMessage('NAV' + planyo_output_date_from_format(year, month, day, 'Y-m-d'),'*');
  }
}

function planyo_show_calendar (cal,onchange) {
  var cal_el = document.getElementById(cal);
  var cal_ref_el = document.getElementById(cal+'calref');
  var coords = cal_ref_el.getCoordinates ? cal_ref_el.getCoordinates() : planyo_get_item_coordinates(cal_ref_el);
  if (document.is_mobile)
    coords.left = '20';
  var old_date = planyo_parse_date(cal_el.value, document.date_format);
  if (!cal_el.value) {
    if (!document.current_picker) {
      if (document.getElementById ('start_date'))
	      document.current_picker = 'start_date';
      else if (document.getElementById ('one_date'))
	      document.current_picker = 'one_date';
    }
    var picker = document.getElementById(document.current_picker);
    if (picker)
      old_date = planyo_parse_date(picker.value, document.date_format);
  }
  document.current_picker = cal;
  document.current_picker_onchange = onchange;
  var month = null;
  var year = null;
  if (document.previous_year_picked != undefined && document.previous_month_picked != undefined) {
    month = document.previous_month_picked;
    year = document.previous_year_picked;
  }
  if (old_date != undefined && old_date > 0) {
    var old_date_obj = new Date();
    old_date_obj.setTime (old_date);
    month = old_date_obj.getMonth() + 1;
    year = old_date_obj.getFullYear();
  }
  var cal_cal_el = document.getElementById(cal+'cal');
  if(cal_cal_el.parentNode != document.body) document.body.appendChild(cal_cal_el);
  planyo_show_calendar_picker (month, year, cal+'cal', 'planyo_calendar_date_chosen');
  if (cal_ref_el && cal_ref_el.className.indexOf('float-date-icon')!=-1) {
    var cal_el_par = document.getElementById('par_'+cal);
    coords_par = cal_el_par.getCoordinates ? cal_el_par.getCoordinates() : planyo_get_item_coordinates(cal_el_par);
    cal_cal_el.style.left = (coords_par.left-1)+'px';
    cal_cal_el.style.top = (coords_par.bottom-1)+'px';
    var tab_width = (coords.right-coords_par.left)+'px';
    cal_cal_el.table_width = tab_width;
    cal_cal_el.firstChild.style.width = tab_width;
  }
  else {
    if (document.is_mobile||document.new_scheme) {
      var cal_cal_coords = cal_cal_el.getCoordinates ? cal_cal_el.getCoordinates() : planyo_get_item_coordinates(cal_cal_el);
      cal_cal_el.style.left = (coords.right-cal_cal_coords.right+cal_cal_coords.left)+'px';
      cal_cal_el.style.top = (coords.bottom+2)+'px';
    }
    else {
      cal_cal_el.style.left = coords.left+'px';
      cal_cal_el.style.top = (coords.bottom+5)+'px';
    }
  }
  cal_cal_el.style.visibility = 'visible';
}

function js_set_event(obj,event,fun,bubble) {
  return planyo_set_event(obj,event,fun,bubble);
}

function js_dummy (e) {
  return planyo_dummy (e);
}

function js_close_calendar () {
  return planyo_close_calendar ();
}

function js_show_calendar (cal,onchange) {
  return planyo_show_calendar (cal,onchange);
}

function show_product_images (parent, id) {
  var box = document.getElementById ('product_box_' + id);
  if (box && parent) {
    var coords = parent.getCoordinates ? parent.getCoordinates () : planyo_get_item_coordinates (parent);    
    box.style.top = coords.top + 'px';
    box.style.left = (coords.left + 30) + 'px';
    box.style.display = '';    
  }  
}

function hide_product_images (id) {
  var box = document.getElementById ('product_box_' + id);
  if (box) {
    box.style.display = 'none';
  }
}

function js_mark_fetching_data (month, year, is_fetching) {
  if (!document.fetching_data)
    document.fetching_data = new Array ();
  if (!planyo_isset (document.fetching_data, year))
    document.fetching_data [year] = new Array ();
  document.fetching_data [year][month] = is_fetching;
}

function js_save_fetched_data (month, year, data_root) {
  if (!planyo_isset (document.fetched_data)) {
    document.fetched_data = new Array(); // ajax-fed data
    document.fetching_data = new Array(); // let's not send multiple ajax requests for the same time period
    document.resource_usage = new Array(); // gives complete data over resource usage
    document.vacations = new Array(); // resource vacations
    document.prices = new Array();
    document.time_data_month = new Array();
    document.time_data_day = new Array();
    document.start_day_restrictions = new Array();
    document.season_colors = new Array();
    document.event_times = new Array();
    document.first_av = new Array();
  }
  js_mark_fetching_data (year, month, false);
  if (!planyo_isset (document.fetched_data, year))
    document.fetched_data [year] = new Array ();
  document.fetched_data [year][month] = data_root ['db_data'];
  if (!planyo_isset (document.time_data_month, year))
    document.time_data_month [year] = new Array ();
  document.time_data_month [year][month] = data_root ['day_items'];
  if (!planyo_isset (document.time_data_day, year))
    document.time_data_day [year] = new Array ();
  document.time_data_day [year][month] = data_root ['hour_items'];
  if (!planyo_isset (document.resource_usage, year))
    document.resource_usage [year] = new Array ();
  document.resource_usage [year][month] = data_root ['res_usage'];
  if (planyo_isset(data_root, 'first_av')) {
    if (!planyo_isset (document.first_av, year))
      document.first_av[year] = new Array();
    document.first_av[year][month] = data_root ['first_av'];
  }
  if (!planyo_isset (document.vacations, year))
    document.vacations [year] = new Array ();
  document.vacations [year][month] = data_root ['vacations'];
  if (planyo_isset (data_root, 'prices')) {
    if (!planyo_isset (document.prices, year))
      document.prices [year] = new Array ();
    document.prices [year][month] = data_root ['prices'];
  }
  if (data_root ['start_days']) {
    if (!planyo_isset (document.start_day_restrictions, year))
      document.start_day_restrictions [year] = new Array ();
    document.start_day_restrictions [year][month] = data_root ['start_days'];
  }
  if (data_root ['season_colors']) {
    if (!planyo_isset (document.season_colors, year))
      document.season_colors [year] = new Array ();
    document.season_colors [year][month] = data_root ['season_colors'];
  }
  if (data_root ['event_times']) {
    if (!planyo_isset (document.event_times, year))
      document.event_times [year] = new Array ();
    document.event_times [year][month] = data_root ['event_times'];
  }
}

function planyo_get_day_status(year, month, day, resource) {
  if (!resource || resource['min_rental_time'] < 24)
    return true;
  var resource_id = resource.id;
  var usage_data = null;

  var now_obj = new Date();
  if (now_obj.getFullYear() > year || (now_obj.getFullYear() == year && now_obj.getMonth() + 1 > month) || (now_obj.getFullYear() == year && now_obj.getMonth() + 1 == month && now_obj.getDate() > day))
    return false; // past

  if (planyo_isset (document.resource_usage, year, month))
    usage_data = document.resource_usage [year][month][day];
  var vacations = null;
  if (planyo_isset (document.vacations, year, month))
    vacations = document.vacations [year][month][day];
  var vacation_count = 0;
  var vacations_set = planyo_isset (vacations, resource_id, 'ad');
  if (vacations_set) {
    if (vacations [resource_id]['ad']['v'] != null)
      vacation_count += parseInt(vacations [resource_id]['ad']['v']);
  }
  if (vacation_count < 0) // negative vacation scenarios possible via manual override
    vacation_count = 0;
    
  var full_usage = 0;
  if (planyo_isset (usage_data, 'ad', resource_id))
    full_usage = usage_data ['ad'][resource_id];
  var diff = resource.quantity - full_usage - vacation_count;
  if (diff > 0)
    return true;
  return false;
}

function planyo_check_av_hours(datestr) {
  var curdate = planyo_parse_date(datestr, document.date_format);
  if (!curdate)
     return;
  var curdate_obj = new Date();
  curdate_obj.setTime (curdate);
  var month = curdate_obj.getMonth() + 1;
  var year = curdate_obj.getFullYear();
  var day = curdate_obj.getDate();
  if(!window.planyo_resource_id || !document.resources)
      return;
  var resource=document.resources[window.planyo_resource_id];
  if (!resource || !document.getElementById('start_time'))
    return;
  var resource_id = resource.id;
  var usage_data = null;
  var stobj = document.getElementById('start_time');

  var prevval = stobj.value;

  var now_obj = new Date();
  if (now_obj.getFullYear() > year || (now_obj.getFullYear() == year && now_obj.getMonth() + 1 > month) || (now_obj.getFullYear() == year && now_obj.getMonth() + 1 == month && now_obj.getDate() > day)) {
    if (document.planyo_all_start_hours) {
        stobj.options.length = 0;
        for(var i=0;i<document.planyo_all_start_hours.length;i++) {
            var opt = document.createElement('option');
            opt.text = document.planyo_all_start_hours[i][0];
            opt.value = document.planyo_all_start_hours[i][1];
            stobj.options.add(opt);
        }
    }
    return; // past
  }

    if (planyo_isset (document.resource_usage, year, month))
        usage_data = document.resource_usage [year][month][day];
    var vacations = null;
    if (planyo_isset (document.vacations, year, month))
        vacations = document.vacations [year][month][day];
    
    if (!document.planyo_all_start_hours && (vacations || usage_data)) {
      document.planyo_all_start_hours = new Array();
        for(var i=0; i<stobj.options.length;i++) {
            document.planyo_all_start_hours.push(new Array(stobj.options[i].text,stobj.options[i].value));
        }
    }

    if (!document.planyo_all_start_hours)
        return;

    stobj.options.length = 0;
    var selindex = -1;
    var numopts = 0;
    for(var i=0;i<document.planyo_all_start_hours.length;i++) {
        var min=0;
        var h=parseFloat(document.planyo_all_start_hours[i][1]);
        if(parseInt(h)!=parseFloat(h)) {
            min=parseFloat(h);
            h=parseInt(h);
            min=(min-h)*60;
        }
        var vacation_count = 0;
        if (planyo_isset (vacations, resource_id, h)) {
            if (planyo_isset (vacations, resource_id, h, min))
                vacation_count = parseInt(vacations [resource_id][h][min]['v']);
            if (vacations [resource_id][h]['v'] != null)
                vacation_count += parseInt(vacations [resource_id][h]['v']);
        }
        if (planyo_isset (vacations, resource_id, 'ad'))
            vacation_count += Math.max (vacation_count, parseInt (vacations [resource_id]['ad']['v']));
        if (vacation_count < 0) // negative vacation scenarios possible via manual override
            vacation_count = 0;
        var full_usage = 0;
        if (planyo_isset(usage_data,h,'qs',min,resource_id))
            full_usage = usage_data[h]['qs'][min][resource_id];
        if (planyo_isset(usage_data,h,resource_id))
            full_usage += usage_data[h][resource_id];
        if (planyo_isset (usage_data, 'ad', resource_id))
            full_usage += usage_data ['ad'][resource_id];
        var diff = resource.quantity - full_usage - vacation_count;
        var opt = document.createElement('option');
        opt.text = document.planyo_all_start_hours[i][0];
        opt.value = document.planyo_all_start_hours[i][1];
        if (diff <= 0) {
            opt.text += "[X]";
            opt.className = 'picker_unav_h';
        }
        stobj.options.add(opt);
        if (opt.value == prevval)
            selindex = numopts;
        numopts++;
    }
    if(selindex!=-1)
        stobj.selectedIndex = selindex;
}
