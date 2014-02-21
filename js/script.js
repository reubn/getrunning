var overop;
var directionClick = 0;
$("#routeDistance").click(function () {
    if (directionClick % 2 == 0) {
        showDirections()
    } else if (directionClick % 2 != 0) {
        hideDirections();
    }
    directionClick++;
});
$("#subit").click(function () {
    submit()
});
$("#refreshbut").click(function () {
    refreshdir()
});

function overtoggle() {
    $("#googleMap").css({
        "-webkit-filter": "none"
    });
    $("#googleMap").css({
        filter: "none"
    });
    $("#over").addClass("hide");
    setTimeout(function () {
        $("#over").css({
            display: "none"
        })
    }, 600)
}
var pastpr;
pastpr = 0;
var maplat;
var maplon;
maplat = 52.056398;
maplon = -2.715974;
var lat;
var lon;
var yes = "https://github.com/reubn/getrunning";
var no = "Forever alone";
console.log("Checking up under the hood eh?");

function convertToHHMM(f) {
    var d = parseInt(Number(f));
    var c = Math.round((Number(f) - d) * 60);
    if (c < 10) {
        var e = "0" + c
    } else {
        var e = c
    }
    return d + ":" + e
}
initialize("", "", false);
window.onload = function () {
    $("#infopbut").css("display", "none");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (c) {
            lat = c.coords.latitude;
            lon = c.coords.longitude;
            maplat = c.coords.latitude;
            maplon = c.coords.longitude;
            initialize(lat, lon, true)
        }, function () {
            initialize("", "", false)
        })
    } else {
        initialize("", "", false)
    }
};
google.maps.visualRefresh = true;
var routeTimeW;
var routeTimeR;
var routeTimeC;
var routeDist;
var routecoords;
var kmlWhole;
var kmlFirst = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>GetRunning Route</name><description>GetRunning Route</description><Style id="routeStyle"><LineStyle><color>ff0000ff</color><width>2</width></LineStyle></Style><Placemark><name>GetRunning Route</name><description>GetRunning Route</description><styleUrl>#routeStyle</styleUrl><LineString><coordinates>';
var kmlData;
var kmlLast = '</coordinates></LineString></Placemark></Document></kml>';
var kmlLink;
var dista;
var dist;
var map;
var directionsDisplay;
var directionsMarker;
var directionChange = 0;
var directionIcon = {
    url: 'http://mt.google.com/vt/icon/name=icons/spotlight/ad_tier1_L_8x.png&scale=1',
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(5, 10)
};
var directionsService = new google.maps.DirectionsService();
var tolerance;
var counter = 0;
var LatLng1;
var LatLng2;
var LatLng3;
var smooth_bool;
var mode;
var markers = [];
$("#closeinfop").click(function () {
    $("#infopbut").css("display", "inline")
});

function infoptoggle() {
    $("#infop").addClass("infout");
    $("#infop").css("left", "0px")
}

function buttoggle() {
    $("#directbut").removeClass("nsh")
}

function initialize(h, f, g) {
    if (pastpr === 0) {
        if (g === true) {
            document.getElementById("location").value = h + " , " + f;
            document.getElementById("location").placeholder = "Your Current Location!"
        }
        var d = [
            {
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
    ]
  }, {
                "featureType": "landscape",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
    ]
  }, {
                "featureType": "administrative",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
    ]
  }, {
                "featureType": "poi",
                "stylers": [
                    {
                        "visibility": "off"
                    }
    ]
  }, {
                "featureType": "poi.medical",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
    ]
  }, {
                "featureType": "poi.park",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
    ]
  }, {
                "featureType": "landscape",
                "stylers": [
                    {
                        "hue": "#f5f9f1"
                    },
                    {
                        "saturation": 18
                    },
                    {
                        "lightness": 64
                    },
                    {
                        "visibility": "on"
                    }
    ]
  },
            {
                "featureType": "landscape",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
    ]
  }
];
        var c = {
            center: new google.maps.LatLng(maplat, maplon),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            panControl: false,
            zoomControl: false,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            overviewMapControl: false
        };
        directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: false,
            suppressMarkers: true
        });
        map = new google.maps.Map(document.getElementById("googleMap"), c);
        directionsDisplay.setMap(map);
        map.setOptions({
            styles: d
        });
        google.maps.event.addListener(directionsDisplay, "directions_changed", function () {
            if (directionChange >= 1) {
                directionsMarker.setMap(null);
            }
            directionChange++;
            directionsMarker = new google.maps.Marker({
                position: directionsDisplay.directions.routes[0].legs[0].start_location,
                map: map,
                icon: directionIcon,
                title: '',
            });
            routeDist = Math.round(directionsDisplay.directions.routes[0].legs[0].distance.value / 100) / 10 + " <span class='km'>km</span>";
            routecoords = directionsDisplay.directions.routes[0].overview_path;
            var j = document.getElementById("distance").value;
            var i = Math.round(directionsDisplay.directions.routes[0].legs[0].distance.value / 100) * 0.1;
            document.getElementById("routeDistance").innerHTML = routeDist;
            routeTimeW = convertToHHMM(directionsDisplay.directions.routes[0].legs[0].distance.value / 5632.7);
            routeTimeR = convertToHHMM(directionsDisplay.directions.routes[0].legs[0].distance.value / 11070.1);
            routeTimeC = convertToHHMM(directionsDisplay.directions.routes[0].legs[0].distance.value / 20358.8);
            $(".running").text(routeTimeR);
            $(".walking").text(routeTimeW);
            $(".cycling").text(routeTimeC);
            for (i = 0; i < routecoords.length; i++) {

                point = "" + routecoords[i] + "";
                swap = point.split(",");
                swapped = swap[1] + "," + swap[0];
                kmlData = kmlData + swapped + '\n';
            }
            kmlData = kmlData.replace("undefined", "").split("(").join("").split(")").join("").split(" ").join("");;
            kmlWhole = kmlFirst + kmlData + kmlLast;
            kmlLink = "data:application/octet-stream," + encodeURIComponent(kmlWhole);
            if (i > j) {} else {
                if (i < j) {} else {
                    if (i == j) {}
                }
            }
        })
    }
}

function refreshdir() {
    submit();
    $("#infop").toggleClass("infout");
    $("#directions").addClass("nsh");
    directionClick++;
}

function submit() {
    overop = 1;
    pastpr = 1;
    var c = document.getElementById("location").value;
    counter = 0;
    tolerance = 0.15;
    mode = google.maps.TravelMode.WALKING;
    var e = new google.maps.Geocoder();
    var d = {
        address: c
    };
    e.geocode(d, function (g, f) {
        if (f == google.maps.GeocoderStatus.OK && document.getElementById("distance").value > 0.999 && document.getElementById("distance").value < 1001) {
            var h = g[0].geometry.location;
            map.setCenter(h);
            findPts(h);
            plotRoute();
            overtoggle();
            buttoggle();
            console.log("EvOK")
        } else {
            if (f == google.maps.GeocoderStatus.OK) {
                console.log("DisNO");
                $("#subit").val("Sorry. There's a problem!");
                $("#subit").removeClass("btn-whist");
                $("#subit").addClass("btn-danger");
                $("#subit").addClass("animated shake");
                $("#distance").addClass("noval");
                setTimeout(function () {
                    $("#distance").removeClass("noval")
                }, 990);
                $("#location").addClass("gdval");
                setTimeout(function () {
                    $("#location").removeClass("gdval")
                }, 990);
                setTimeout(function () {
                    $("#subit").val("Run");
                    $("#subit").removeClass("btn-danger");
                    $("#subit").addClass("btn-whist");
                    $("#subit").removeClass("animated shake")
                }, 1000)
            } else {
                if (document.getElementById("distance").value > 0.999 && document.getElementById("distance").value < 1001) {
                    console.log("LocNO");
                    $("#subit").val("Sorry. There's a problem!");
                    $("#subit").removeClass("btn-whist");
                    $("#subit").addClass("btn-danger");
                    $("#subit").addClass("animated shake");
                    $("#location").addClass("noval");
                    setTimeout(function () {
                        $("#location").removeClass("noval")
                    }, 990);
                    $("#distance").addClass("gdval");
                    setTimeout(function () {
                        $("#distance").removeClass("gdval")
                    }, 990);
                    setTimeout(function () {
                        $("#subit").val("Run");
                        $("#subit").removeClass("btn-danger");
                        $("#subit").addClass("btn-whist");
                        $("#subit").removeClass("animated shake")
                    }, 1000)
                } else {
                    console.log("NoNO");
                    $("#subit").val("Sorry. There's a problem!");
                    $("#subit").removeClass("btn-whist");
                    $("#subit").addClass("btn-danger");
                    $("#subit").addClass("animated shake");
                    $(".overval").addClass("noval");
                    setTimeout(function () {
                        $(".overval").removeClass("noval")
                    }, 990);
                    setTimeout(function () {
                        $("#subit").val("Run");
                        $("#subit").removeClass("btn-danger");
                        $("#subit").addClass("btn-whist");
                        $("#subit").removeClass("animated shake")
                    }, 1000)
                }
            }
        }
    })
}

function findPts(j) {
    smooth_bool = false;
    LatLng1 = j;
    var o = LatLng1.lat() * Math.PI / 180;
    var i = LatLng1.lng() * Math.PI / 180;
    var h = document.getElementById("distance").value * 0.609344;
    var m = document.getElementById("distance").value * 0.609344;
    var k = Math.PI / 180 * ((120 - 60) * Math.random() + 60);
    var f = 0.85;
    var p = f * m / (2 + 2 * Math.sin(k / 2));
    var c = 4000 * Math.cos(o);
    var d = 2 * Math.random() * Math.PI;
    var n = p * Math.cos(d) / 4000 + o;
    var g = i + p * Math.sin(d) / c;
    var l = p * Math.cos(d + k) / 4000 + o;
    var e = i + p * Math.sin(d + k) / c;
    LatLng2 = new google.maps.LatLng(n * 180 / Math.PI, g * 180 / Math.PI);
    LatLng3 = new google.maps.LatLng(l * 180 / Math.PI, e * 180 / Math.PI)
}

function plotRoute() {
    var c = {
        origin: LatLng1,
        destination: LatLng1,
        waypoints: [{
            location: LatLng2,
            stopover: false
        }, {
            location: LatLng3,
            stopover: false
        }],
        travelMode: mode,
        avoidHighways: true,
        optimizeWaypoints: true
    };
    directionsService.route(c, function (d, f) {
        if (f == google.maps.DirectionsStatus.OK) {
            var e = d.routes[0].legs[0].distance.value;
            var g = 1609344 * dista;
            if ((e - g) / g > tolerance) {
                if (smooth(d)) {
                    findPts(LatLng1);
                    plotRoute()
                } else {
                    tolerance *= 1.1;
                    plotRoute()
                }
            } else {
                if ((g - e) / g > tolerance) {
                    tolerance *= 1.1;
                    findPts(LatLng1);
                    plotRoute()
                } else {
                    if (!(smooth_bool) && !(smooth(d))) {
                        plotRoute()
                    } else {
                        if (counter >= 10) {
                            counter = 0
                        } else {
                            if (hasUTurn(d) && !(1 == 2)) {
                                tolerance *= 1.1;
                                counter += 1;
                                findPts(LatLng1);
                                plotRoute()
                            } else {
                                infoptoggle();
                                directionsDisplay.setDirections(d);
                            }
                        }
                    }
                }
            }
        } else {
            if (f == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                console.log("Query limit reached, waiting 3 seconds");
                setTimeout(plotRoute, 3000)
            } else {
                if (f == google.maps.DirectionsStatus.ZERO_RESULTS) {
                    findPts(LatLng1);
                    plotRoute()
                } else {
                    alert(f);
                    mode = google.maps.TravelMode.WALKING;
                    plotRoute()
                }
            }
        }
    })
}

function showDirections() {
    $('#routeDistance').html('<span class="btn btn-block btn-lg btn-close">Close</span>');
    $("#directions").html("");
    $("#directions").removeClass("nsh");
    var e = directionsDisplay.directions.routes[0].legs[0].steps;
    var d = [e[0]];
    var c = [];
    var j = "<br><span class='btn btn-block btn-lg btn-download'><a href='" + kmlLink + "' download='GetRunningRoute.kml'>Download KML</a></span>";
    for (var f = 0; f < e.length; f++) {
        if (e[f] != d[d.length - 1] && e[f].instructions.split(" ").length > 2 && e[f].instructions.indexOf("bicycle") == -1) {
            d.push(e[f])
        } else {
            d[d.length - 1].distance.value += e[f].distance.value
        }
    }
    for (var f = 0; f < d.length; f++) {
        c.push("<span class='step' data-latlon = '" + d[f].start_location + "'>" + d[f].instructions + "</span>")
    }
    $("#directions").html(c.join("<br>") + j);
    Midway();
    $('.step').click(function () {
        var latLonPre = $(this).data("latlon");
        console.log($(this).data("latlon"));
        var latlon = latLonPre.replace("(", "").replace(")", "").split(", ");
        var gLatLon = new google.maps.LatLng(latlon[0], latlon[1])
        map.setCenter(gLatLon);
        var marker = new google.maps.Marker({
            title: $(this).text(),
            position: gLatLon,
            icon: 'http://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2',
            animation: google.maps.Animation.DROP,
            draggable: false
        });
        hideDirections();
        marker.setMap(map);
        setTimeout(function () {
            marker.setMap(null);
            showDirections()
        }, 3000)
    });
}

function hideDirections() {
    $("#directions").addClass("nsh");
    $('#routeDistance').html(routeDist);
}


function hasUTurn(c) {
    var f = false;
    var d = c.routes[0].legs[0].steps;
    for (var e = 0; e < d.length; e++) {
        if (d[e].instructions.indexOf("U-turn") != -1) {
            f = true;
            break
        }
    }
    return f
}

function smooth(l) {
    var k = l.routes[0].legs[0].steps;
    var e = 10;
    var c = 10;
    var j;
    var h;
    for (var g = 0; g < k.length; g++) {
        var f = Math.pow(LatLng2.lat() - k[g].end_location.lat(), 2) + Math.pow(LatLng2.lng() - k[g].end_location.lng(), 2);
        var d = Math.pow(LatLng3.lat() - k[g].end_location.lat(), 2) + Math.pow(LatLng3.lng() - k[g].end_location.lng(), 2);
        if (f < e) {
            j = g;
            e = f
        }
        if (d < c) {
            h = g;
            c = d
        }
    }
    a = 0;
    b = 0;
    while (k[j].distance.value < 200) {
        j -= 1;
        a += 1
    }
    while (k[h].distance.value < 200) {
        h -= 1;
        b += 1
    }
    LatLng2 = k[j].end_location;
    LatLng3 = k[h].end_location;
    smooth_bool = true;
    if (a === 0 && b === 0) {
        return true
    } else {
        return false
    }
}