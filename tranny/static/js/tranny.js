//@ sourceMappingURL=tranny.map
// Generated by CoffeeScript 1.6.1
(function() {
  var OK, btn_save, feed_delete, feed_save, filter_add, filter_remove, handle_response, label_formatter, msg_cur_id, msg_user, parse_json, render_pie_chart, render_section_totals, render_service_totals, render_service_type_totals, settings_save, user_messages;

  OK = 0;

  label_formatter = function(label, series) {
    var pct;
    pct = Math.round(series.percent);
    return "<div class=\"pie_label\">" + label + "<br/>" + pct + "% (" + series.data[0][1] + ")</div>";
  };

  parse_json = function(json_string) {
    return JSON && JSON.parse(json_string || jQuery.parseJSON(json_string));
  };

  msg_cur_id = 0;

  /*
    This function will place a user oriented message at the top of the page
  
    @param {string} Message text to show
    @param {string} Message type, one of: 'success', 'alert', ''
    @param {number} Message timeout in seconds. Fades message out after N seconds
  */


  msg_user = function(msg, msg_type, timeout) {
    var html, icon_class, _ref;
    if (msg_type == null) {
      msg_type = '';
    }
    if (timeout == null) {
      timeout = 5;
    }
    if ((_ref = !msg_type) === 'success' || _ref === 'alert' || _ref === '') {
      msg_type = '';
    }
    if (msg_type === "success") {
      icon_class = "foundicon-checkmark";
    } else if (msg_type === "alert") {
      icon_class = "foundicon-remove";
    } else {
      icon_class = "foundicon-idea";
    }
    html = "<div id=\"msgid_" + msg_cur_id + "\" class=\"rounded alert-box [success " + msg_type + " secondary]\" style=\"display:none;\">\n<i class=\"" + icon_class + "\"></i>" + msg + " <a href=\"\" class=\"close\">&times;</a> </div>";
    user_messages.append(html);
    jQuery("#msgid_" + msg_cur_id).show(500);
    if (timeout && timeout > 0) {
      setTimeout("jQuery('#msgid_" + msg_cur_id + "').fadeOut(500)", timeout * 1000);
    }
    return msg_cur_id++;
  };

  user_messages = jQuery('#user_messages');

  /*
    Parse the AJAX json response and show any messages to the user before returning the
    parsed object
  */


  handle_response = function(response, callable) {
    if (callable == null) {
      callable = false;
    }
    response = parse_json(response);
    response.ok = function() {
      return this['status'] === OK;
    };
    if ((response['msg'] != null) && response['msg'] !== "") {
      if (response['status'] === OK) {
        msg_user(response['msg'], "success", 10);
      } else {
        msg_user(response['msg'], "error", 10);
      }
    }
    if (typeof callable === "function") {
      callable(response);
    }
    return response;
  };

  /*
      Render a pie chart
  */


  render_pie_chart = function(dataset, element_id) {
    var options;
    options = {
      series: {
        pie: {
          show: true,
          radius: 1,
          label: {
            show: true,
            radius: 0.65,
            formatter: label_formatter,
            background: {
              opacity: 0
            }
          }
        }
      },
      legend: {
        show: true
      }
    };
    return jQuery.plot(element_id, dataset, options);
  };

  /*
      Fetch source totals and render in a pie graph
  */


  render_service_totals = function() {
    return jQuery.get("/stats/service_totals", function(response) {
      var leader_dataset;
      leader_dataset = parse_json(response);
      return render_pie_chart(leader_dataset, "#service_totals");
    });
  };

  render_section_totals = function() {
    return jQuery.get("/stats/section_totals", function(response) {
      var section_dataset;
      section_dataset = parse_json(response);
      return render_pie_chart(section_dataset, "#section_totals");
    });
  };

  render_service_type_totals = function() {
    return jQuery.get("/stats/service_type_totals", function(response) {
      var type_dataset;
      type_dataset = parse_json(response);
      return render_pie_chart(type_dataset, "#service_type_totals");
    });
  };

  filter_remove = function(evt) {
    var args, element;
    evt.preventDefault();
    element = jQuery(this);
    try {
      args = {
        title: element.data("title"),
        quality: element.data("quality"),
        section: element.data("section")
      };
    } catch (Err) {
      return false;
    }
    return jQuery.post("/filters/delete", args, function(response) {
      if (handle_response(response).ok()) {
        return element.parent().fadeOut(500);
      }
    });
  };

  filter_add = function(evt) {
    var args, element, input_element, quality, section, title;
    evt.preventDefault();
    console.log("got add");
    element = jQuery(this);
    try {
      quality = element.data("quality");
      section = element.data("section");
      input_element = jQuery("#input_" + section + "_" + quality);
      title = input_element.val();
      args = {
        title: title,
        quality: quality,
        section: section
      };
    } catch (Err) {
      return false;
    }
    return jQuery.post("/filters/add", args, function(response) {
      if (handle_response(response).ok()) {
        console.log("added ok");
        return input_element.val("");
      }
    });
  };

  feed_save = function(evt) {
    var data, feed_name;
    evt.preventDefault();
    feed_name = jQuery(this).data("feed");
    data = {
      feed: feed_name,
      url: jQuery("#" + ("" + feed_name + "_url")).val(),
      interval: jQuery("#" + ("" + feed_name + "_interval")).val(),
      enabled: !jQuery("#" + ("" + feed_name + "_enabled")).is(':checked')
    };
    return jQuery.post("/rss/save", data, handle_response);
  };

  feed_delete = function(evt) {
    var feed_name;
    evt.preventDefault();
    if (!confirm("Are you sure you want to delete this RSS feed? This is a non reversable action.")) {
      return false;
    }
    feed_name = jQuery(this).data("feed");
    return jQuery.post("/rss/delete", {
      feed: feed_name
    }, function(response) {
      if (handle_response(response).ok()) {
        return jQuery("#feed_" + feed_name).fadeOut(500);
      }
    });
  };

  btn_save = function(evt) {
    var data;
    evt.preventDefault();
    data = {
      btn_api_token: jQuery("#btn_api_token").val(),
      btn_interval: jQuery("#btn_interval").val(),
      btn_enabled: !jQuery("#btn_enabled").is(":checked"),
      btn_url: jQuery("#btn_url").val()
    };
    return jQuery.post("/services/btn/save", data, handle_response);
  };

  settings_save = function(evt) {
    var option, settings, _i, _len, _ref;
    evt.preventDefault();
    settings = {};
    _ref = jQuery("#settings_form").serializeArray();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      settings[option['name']] = option['value'];
    }
    return jQuery.post("/settings/save", settings, handle_response);
  };

  jQuery(function() {
    if (window.location.pathname.indexOf("home") !== -1) {
      render_service_totals();
      render_section_totals();
      render_service_type_totals();
    } else if (window.location.pathname.indexOf("filters") !== -1) {
      jQuery(".filter_remove").on("click", filter_remove);
      jQuery(".filter_add").on("click", filter_add);
    } else if (window.location.pathname.indexOf("services") !== -1) {
      jQuery(".btn_save").on("click", btn_save);
    } else if (window.location.pathname.indexOf("settings") !== -1) {
      jQuery(".settings_save").on("click", settings_save);
    } else if (window.location.pathname.indexOf("rss") !== -1) {
      jQuery(".feed_save").on("click", feed_save);
      jQuery(".feed_delete").on("click", feed_delete);
    }
    return jQuery(document).foundation();
  });

}).call(this);
