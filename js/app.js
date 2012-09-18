(function() {
  'use strict';
  var drawPoint = function() {
    var path = window.poly.getPath();

    path.insertAt(0, window.coords[window.index]);
    if (path.getLength() > 4) {
      path.pop();
    }

    google.maps.event.addListenerOnce(window.map, 'zoom_changed', function(){
        window.map.panTo(coords[index]);
        google.maps.event.addListenerOnce(window.map, 'idle', function(){
          window.index++;
          if (window.index < window.pathLength) {
            setTimeout(drawPoint, 1000);
          }
        });
    });

    setTimeout(function() {
      window.map.fitBounds(new google.maps.LatLngBounds().extend(coords[index]).extend(coords[index-1]));
    }, 300);
  }
  var init = function() {
    window.coords = [];
    window.index = 1;
    $.ajax({
      url: "https://spreadsheets.google.com/feeds/list/0As123A1LVDgydFJIOGhxbWxaUFNPampLWDYzRkNRbmc/od6/public/basic",
      success: function(data) {
        var $entries = $(data).find("entry");
        $entries.each(function() {
          var content = $(this).find("content").text();
          var latlngs = content.match(/\d{1,3}\.\d+/g);
          window.coords.push(new google.maps.LatLng(latlngs[0],latlngs[1]));
        });
        window.map = new google.maps.Map($("#map")[0], {
          center: window.coords[0],
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false
        });
        window.poly = new google.maps.Polyline({
          map: window.map,
          path: [window.coords[0]],
          strokeOpacity: 0.5,
          strokeColor: "#ff0000"
        });
        window.pathLength = window.coords.length
        drawPoint();
      }
    })
  }();
})();