// Generated by CoffeeScript 1.6.3
(function() {
  var fetch_torrents;

  fetch_torrents = function() {
    return jQuery.getJSON("/torrents/list").done(function(data) {
      speed_up.innterHTML = data[0];
      speed_dn.innerHTML = data[1];
      return console.log("updating");
    });
  };

  jQuery(function() {
    return jQuery('#torrent_table').dataTable({
      processing: true,
      serverSize: true,
      ajax: "/torrents/list",
      paginate: false,
      scrollY: 300,
      columns: [
        {
          data: 'name'
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
        }
      ]
    });
  });

}).call(this);
