var overop;
$("#routeDistance").click(function () {
    showDirections()
});
$("#subit").click(function () {
    submit()
});
$("#refreshbut").click(function () {
    refreshdir()
});

function overtoggle() {
    $("#googleMap").css({
        "-webkit-filter": "blur(0)"
    });
    $("#googleMap").css({
        filter: "blur()"
    });
    $("#over").addClass("hide");
    setTimeout(function () {
        $("#over").css({
            display: "none"
        })
    }, 600)
}
$(function () {
    $("#location").autocomplete({
        open: function () {
            $("#location").css("border-bottom-left-radius", "0px");
            $("#location").css("border-bottom-right-radius", "0px")
        },
        close: function () {
            $("#location").css("border-bottom-left-radius", "6px");
            $("#location").css("border-bottom-right-radius", "6px")
        },
        source: function (d, c) {
            $.ajax({
                url: "http://ws.geonames.org/searchJSON",
                dataType: "jsonp",
                search: function () {},
                data: {
                    maxRows: 3,
                    name_startsWith: d.term,
                    isNameRequired: true,
                    countryBias: "UK",
                    featureClass: "P"
                },
                success: function (e) {
                    c($.map(e.geonames, function (f) {
                        return {
                            label: f.name + (f.adminName1 ? ", " + f.adminName1 : ""),
                            value: f.name + (f.adminName1 ? ", " + f.adminName1 : "")
                        }
                    }))
                }
            })
        }
    })
});
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
var dista;
var dist;
var map;
var directionsDisplay;
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
        var d = [{
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{
                hue: "#f9f5f1"
            }, {
                saturation: 18
            }, {
                lightness: 64
            }, {
                visibility: "on"
            }]
        }];
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
        var e = new google.maps.Polyline({
            strokeColor: "rgba(142, 68, 173, 0.65)",
            strokeOpacity: 0.65,
            strokeWeight: 6
        });
        directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: false
        });
        map = new google.maps.Map(document.getElementById("googleMap"), c);
        directionsDisplay.setMap(map);
        map.setOptions({
            styles: d
        });
        google.maps.event.addListener(directionsDisplay, "directions_changed", function () {
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
    $("#infop").toggleClass("infout")
}

function submit() {
    overop = 1;
    pastpr = 1;
    var c = document.getElementById("location").value;
    clearMarkers();
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
                                showMarkers()
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
    var h = window.open("", "", "width=500, height=600");
    var e = directionsDisplay.directions.routes[0].legs[0].steps;
    var d = [e[0]];
    var c = [];
    var k = '<head><link href="' + window.location.href + 'css/bootstrap.min.css" rel="stylesheet" type="text/css"><link href="' + window.location.href + 'css/flat-ui.css" rel="stylesheet" type="text/css"><link href="' + window.location.href + 'css/style.css" rel="stylesheet" type="text/css"><title>Directions</title><body>';
    for (var f = 1; f < e.length; f++) {
        if (e[f] != d[d.length - 1] && e[f].instructions.split(" ").length > 2 && e[f].instructions.indexOf("bicycle") == -1) {
            d.push(e[f])
        } else {
            d[d.length - 1].distance.value += e[f].distance.value
        }
    }
    for (var f = 0; f < d.length; f++) {
        c.push(d[f].instructions)
    }
    var g = document.getElementById("routeDistance").innerHTML;
    var j = "<br><br>Total: " + g + "</body>";
    h.document.write(k + c.join("<br>") + j);
    h.focus()
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

function showMarkers() {
    if (1 == 2) {
        var c = directionsDisplay.directions.routes[0].legs[0].steps;
        var h = 0;
        var f = 0;
        for (var e = 0; e < c.length; e++) {
            h += c[e].distance.value;
            while (h > 1609344) {
                h -= 1609344;
                f += 1;
                var g = c[e].start_location.lat() + h / 1609344 * (c[e].end_location.lat() - c[e].start_location.lat());
                var d = c[e].start_location.lng() + h / 1609344 * (c[e].end_location.lng() - c[e].start_location.lng());
                markers.push(new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(g, d),
                    icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (f + Math.floor(h / 1609344)) + "|99B2FF"
                }))
            }
        }
    } else {
        clearMarkers()
    }
}

function clearMarkers() {
    for (var c = 0; c < markers.length; c++) {
        markers[c].setMap(null)
    }
    markers = []
};