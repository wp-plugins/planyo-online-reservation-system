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
	dumped_text += level_padding + "'" + item + "' => \"" + value + "\" || ";
      }
    }
  } else { //Strings/Chars/Numbers etc.
    dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
  }
  return dumped_text;
}

function planyo_get_next_month (month, year) {
  var next_month = month + 1;
  var next_year = year;
  if (next_month == 13) {
    next_month = 1;
    next_year++;
  }
  return new Array (next_month, next_year);
}

function planyo_get_prev_month (month, year) {
  var prev_month = month - 1;
  var prev_year = year;
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
  var first_offset = (d.getDay() + 6) % 7;
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
  var arr = planyo_isset (document.s_weekdays_short) ? (is_short ? document.s_weekdays_short : document.s_weekdays_med) :
    (is_short ? new Array ("M", "T", "W", "T", "F", "S", "S") : new Array ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"));
  return arr [n % 7];
}

function planyo_get_month_name (n, is_short) {
  var arr = planyo_isset (document.s_months_short) ? (is_short ? document.s_months_short : document.s_months_long) :
    (is_short ? new Array ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec") : new Array ("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"));
  return arr [n - 1];
}

function planyo_output_hour_only(hour, european_style_postfix) {
  if (document.time_format && document.time_format.indexOf('a') != -1)
    return ((hour % 12) == 0 ? 12 : hour % 12) +' '+ ((hour < 12 || hour == 24) ? 'am' : 'pm');
  return hour+(european_style_postfix ? european_style_postfix : '');
}

function planyo_output_time(hour, minute) {
  var time_str = document.time_format;
  if (!time_str) time_str = "H:i";
  time_str = time_str.replace("H", hour);
  time_str = time_str.replace("h", (hour % 12) == 0 ? 12 : hour % 12);
  time_str = time_str.replace("a", (hour < 12 || hour == 24) ? 'am' : 'pm');
  time_str = time_str.replace("i", minute<10 ? '0'+minute : minute);
  return time_str;
}

function planyo_output_date(year, month, day) {
  var date = document.date_format;
  if (!date) date = "Y-m-d";
  date = date.replace("Y", year);
  date = date.replace("m", month < 10 ? '0'+month : month);
  date = date.replace("M", planyo_get_month_name(month, true));
  date = date.replace("d", day < 10 ? '0'+day : day);
  return date;
}

function planyo_parse_date (date_str, format) {
  //works with the following formats: Y/m/d, Y-m-d, d.m.Y, d M Y(EN), M d, Y(EN), m/d/Y
  var parsed = Date.parse(date_str);
  if ((!parsed || parsed == 'undefined' || format =="d/m/Y") && format) {
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
  return parsed;
}

function planyo_get_day_info_for_month (month, year) {
  var now = new Date();

  var day_info = new Array();
  
  var month_specs = planyo_get_month_specs (month, year);
  var day_iterator = month_specs [1] - month_specs [0] + 1;
  var days_in_month_left = month_specs [0] - 1;
  var month_iterator = -1; // starting last month unless day_iterator is 1
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
  if (month == null && year == null) {
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
  
  var div_code = "<table class='calpicker'><caption><a class='nav' href=\"javascript:planyo_show_calendar_picker("+(month-1)+", "+year+", '"+div_id+"','"+date_fun+"');\">&#160;&laquo;&#160;</a><a class='nav' href=\"javascript:planyo_show_calendar_picker("+(month+1)+","+year+", '"+div_id+"','"+date_fun+"');\">&#160;&raquo;&#160;</a> "+ planyo_get_month_name (month, false) +" " + year + "</caption><thead><tr>";
  for (var i = 0; i < 7; i++) {
    div_code += "<th>" + planyo_get_day_name (i, true) + "</th>";
  }
  div_code += "</thead><tbody>";
  for (var y = 0; y < 6; y++) {
    div_code += "<tr>";
    for (var x = 0; x < 7; x++) {
      div_code += "<td class='" + day_info [y][x]['type'] + "' onclick='" + date_fun + "(" + day_info [y][x]['day'] + ","+day_info [y][x]['month']+","+day_info [y][x]['year']+")'>" + day_info [y][x]['day'] + "</td>";
    }
    div_code += "</tr>";
  }
  div_code += "</tr>";
  div_code += "</tbody></table>";
  document.getElementById (div_id).innerHTML = div_code;
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
      js_nav(null,month, year);
    else if (document.current_picker == 'one_date')
      js_nav(day, month, year);
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
  if (document.previous_year_picked != 'undefined' && document.previous_month_picked != 'undefined') {
    month = document.previous_month_picked;
    year = document.previous_year_picked;
  }
  if (old_date != 'undefined' && old_date > 0) {
    var old_date_obj = new Date();
    old_date_obj.setTime (old_date);
    month = old_date_obj.getMonth() + 1;
    year = old_date_obj.getFullYear();
  }
  var cal_cal_el = document.getElementById(cal+'cal');
  if(cal_cal_el.parentNode != document.body) document.body.appendChild(cal_cal_el);
  planyo_show_calendar_picker (month, year, cal+'cal', 'planyo_calendar_date_chosen');
  cal_cal_el.style.left = coords.left+'px';
  cal_cal_el.style.top = (coords.bottom+5)+'px';
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













