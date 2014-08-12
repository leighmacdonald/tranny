// Generated by CoffeeScript 1.6.3
/* Contains a list of currently selected DT_RowId (info_hash's)*/


(function() {
  var action_reannounce, action_recheck, action_remove, action_remove_data, action_start, action_stop, chart_update, chart_update_speed, detail_traffic_chart, endpoint, row_load_cb, row_select_cb, selected_class, selected_detail_id, selected_rows, ts, _rand;

  selected_rows = [];

  /* class defining selected rows in the torrent listing*/


  selected_class = 'selected';

  /* Currently selected torrent that should be used in the detail display*/


  selected_detail_id = false;

  /* Application endpoint prefix*/


  endpoint = '/torrents';

  /* Update interval for the traffic graph in ms*/


  chart_update_speed = 1000;

  /*
      Called for each new row loaded into the data table
  
      @param {string} DT_RowId defined for the row ( which corresponds to the info_hash )
      @param {object} The rows data object
      @param {number} Index of the row in the table
  */


  row_load_cb = function(row, data, displayIndex) {
    if (jQuery.inArray(data.DT_RowId, selected_rows) !== -1) {
      return jQuery(row).addClass(selected_class);
    }
  };

  /*
      Called when a user selects a row with the cursor. Will update the currently selected rows.
      If the user holds ctrl while clicking the row will be added to the selected_rows array. Otherwise
      the row will be "activated" and show more detailed information for that row in another panel.
  */


  row_select_cb = function(e) {
    var existing_row_id, index, row_id, _i, _len;
    row_id = this.id;
    if (e.ctrlKey) {
      index = _.indexOf(selected_rows, row_id);
      if (index === -1) {
        selected_rows.push(row_id);
      } else {
        selected_rows.splice(index, 1);
      }
      return jQuery(this).toggleClass(selected_class);
    } else {
      for (_i = 0, _len = selected_rows.length; _i < _len; _i++) {
        existing_row_id = selected_rows[_i];
        jQuery("#" + existing_row_id).removeClass(selected_class);
      }
      selected_rows = [row_id];
      return jQuery("#" + row_id).addClass(selected_class);
    }
  };

  action_recheck = function() {
    return jQuery.ajax("" + endpoint + "/recheck", {
      data: JSON.stringify(selected_rows),
      contentType: 'application/json',
      type: 'POST'
    });
  };

  action_reannounce = function() {
    return jQuery.ajax("" + endpoint + "/reannounce", {
      data: JSON.stringify(selected_rows),
      contentType: 'application/json',
      type: 'POST'
    });
  };

  action_remove = function() {
    return jQuery.ajax("" + endpoint + "/remove", {
      data: JSON.stringify(selected_rows),
      contentType: 'application/json',
      type: 'POST'
    });
  };

  action_remove_data = function() {
    return jQuery.ajax("" + endpoint + "/remove/data", {
      data: JSON.stringify(selected_rows),
      contentType: 'application/json',
      type: 'POST'
    });
  };

  action_stop = function() {
    return jQuery.ajax("" + endpoint + "/stop", {
      data: JSON.stringify(selected_rows),
      contentType: 'application/json',
      type: 'POST'
    });
  };

  action_start = function() {
    return jQuery.ajax("" + endpoint + "/start", {
      data: JSON.stringify(selected_rows),
      contentType: 'application/json',
      type: 'POST'
    });
  };

  _rand = function() {
    return Math.floor((Math.random() * 1000) + 1);
  };

  chart_update = function() {
    var update_data;
    update_data = [
      {
        time: ts(),
        y: _rand()
      }, {
        time: ts(),
        y: _rand()
      }
    ];
    detail_traffic_chart.push(update_data);
    return setTimeout(chart_update, chart_update_speed);
  };

  /* Return the current unix timestamp in seconds*/


  ts = function() {
    return Math.round(new Date().getTime() / 1000) | 0;
  };

  detail_traffic_chart = null;

  jQuery(function() {
    jQuery('#torrent_table').dataTable({
      processing: true,
      serverSize: true,
      ajax: "" + endpoint + "/list",
      paginate: false,
      searching: false,
      scrollY: 300,
      columns: [
        {
          data: 'name'
        }, {
          data: 'size'
        }, {
          data: 'ratio'
        }, {
          data: 'up_rate'
        }, {
          data: 'dn_rate'
        }, {
          data: 'leechers'
        }, {
          data: 'peers'
        }, {
          data: 'priority'
        }, {
          data: 'is_active'
        }
      ],
      rowCallback: row_load_cb
    });
    jQuery('#torrent_table tbody').on('click', 'tr', row_select_cb);
    jQuery('#action_stop').on('click', action_stop);
    jQuery('#action_start').on('click', action_start);
    jQuery('#action_recheck').on('click', action_recheck);
    jQuery('#action_reannounce').on('click', action_reannounce);
    /* Initialize epoch chart on the traffic tab*/

    detail_traffic_chart = jQuery('#detail-traffic-chart').epoch({
      type: 'time.line',
      data: [
        {
          label: "upload",
          values: []
        }, {
          label: "download",
          values: []
        }
      ],
      axes: ['left', 'right']
    });
    return setTimeout(chart_update, chart_update_speed);
  });

}).call(this);
