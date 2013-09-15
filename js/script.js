//Toggle About Panel
function togabout() {
    $('#ab').toggleClass("nsh");
    setTimeout(function () {
        $('#ab').toggleClass("noop");
    }, 600);
    Midway();
}
$('#infopbut').addClass('nsh');
var maplat;
var maplon;
maplat = 52.056398;
maplon = -2.715974;
var lat;
var lon;

//Dev
var yes = "https://github.com/reubn/getrunning";
var no = "Forever alone";
console.log('Checking up under the hood eh? Well yes or no?');

function convertToHHMM(info) {
    var hrs = parseInt(Number(info));
    var min = Math.round((Number(info) - hrs) * 60);
    return hrs + ':' + min;
}
//Geolocation
window.onload = function () { // Check to see if the browser supports the GeoLocation API.
    $('#infopbut').css("display", "none");
    if (navigator.geolocation) {
        // Get the location
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            maplat = position.coords.latitude;
            maplon = position.coords.longitude;

            // Show the map
            initialize(lat, lon, true);
        }, function () {

            initialize("", "", false);
        });
    } else {
        initialize("", "", false);
    }

}
// Enable the visual refresh
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
$('#closeinfop').click(function () {
    $('#infopbut').css("display", "inline");

});
//Toggle Info Slide
function infoptoggle() {
    $('#infopbut').removeClass('nsh');
    $('#infopbut').css("display", "none");
    $("#infop").toggleClass("infout");
}

//Toggle Info Slide
function buttoggle() {
    $('.timedisp').removeClass('nsh');
    $('#directbut').removeClass('nsh');
}
//Ini
function initialize(lata, lona, usegeo) {
    if (usegeo == true) {
        document.getElementById("location").value = lata + " , " + lona;
        document.getElementById("location").placeholder = "Your Current Location!";
    }
    var gmstyles = [
	{
		featureType: 'landscape',
		elementType: 'geometry',
		stylers: [
			{ hue: '#f9f5f1' },
			{ saturation: 18 },
			{ lightness: 64 },
			{ visibility: 'on' }
		]
	}
];
    var mapProp = {
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
    var polylineOptions = new google.maps.Polyline({
        strokeColor: 'rgba(142, 68, 173, 0.65)',
        strokeOpacity: 0.65,
        strokeWeight: 6
    });
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });

    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    directionsDisplay.setMap(map);
    map.setOptions({styles: gmstyles});
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
        routeDist = directionsDisplay.directions.routes[0].legs[0].distance.text;
        routecoords = directionsDisplay.directions.routes[0].overview_path;
        var disttb = document.getElementById("distance").value;
        var routeADist = Math.round(directionsDisplay.directions.routes[0].legs[0].distance.value / 100) * 0.1;
        document.getElementById("routeDistance").innerHTML = routeDist + " long.";
        routeTimeW = convertToHHMM(directionsDisplay.directions.routes[0].legs[0].distance.value / 5632.7);
        routeTimeR = convertToHHMM(directionsDisplay.directions.routes[0].legs[0].distance.value / 11070.1);
        routeTimeC = convertToHHMM(directionsDisplay.directions.routes[0].legs[0].distance.value / 20358.8);
        $('#time').text("R " + routeTimeR + " C " + routeTimeC + " W " + routeTimeW)
        if (routeADist > disttb) {
            //More To Run
            $('#prefix').text("Unlucky. Your route came out a tad longer mate. It's ");
        } else if (routeADist < disttb) {
            //Less To Run
            $('#prefix').text("Lucky. Your route came out shorter then expected. It's ");
        } else if (routeADist == disttb) {
            //Same
            $('#prefix').text("BOOM. Bang on! It's ");;
        }




    });
}
//Get New Directions
function refreshdir() {
    submit();
    $("#infop").toggleClass("infout");
}

function submit() {
    var location = document.getElementById("location").value;
    //reason=[0, 0, 0, 0, 0, 0];
    clearMarkers(); //only necessary if already showing map
    counter = 0;
    tolerance = 0.15;
    mode = google.maps.TravelMode.WALKING;
    var geocoder = new google.maps.Geocoder();
    var GeoReq = {
        address: location
    };
    geocoder.geocode(GeoReq, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK && document.getElementById("distance").value > 0.999 && document.getElementById("distance").value < 1001) {
            var LatLng = results[0].geometry.location;
            map.setCenter(LatLng);
            findPts(LatLng);
            plotRoute();
            overtoggle();
            buttoggle();
            console.log("EvOK");
        } else if (status == google.maps.GeocoderStatus.OK) {
            console.log("DisNO");
            $("#subit").val("Sorry. There's a problem!"); //+ status);
            $("#subit").removeClass("btn-whist");
            $("#subit").addClass("btn-danger");
            $("#subit").addClass("animated shake");
            //$("#ok").css("display", "inline");
            $("#distance").addClass("noval");
            setTimeout(function () {
                $("#distance").removeClass("noval");

            }, 990);
            $("#location").addClass("gdval");
            setTimeout(function () {
                $("#location").removeClass("gdval");
            }, 990);

            setTimeout(function () {
                $('#subit').val("Run");
                $("#subit").removeClass("btn-danger");
                $("#subit").addClass("btn-whist");
                $("#subit").removeClass("animated shake");
            }, 1000);



        } else if (document.getElementById("distance").value > 0.999 && document.getElementById("distance").value < 1001) {
            console.log("LocNO");
            $("#subit").val("Sorry. There's a problem!"); //+ status);
            $("#subit").removeClass("btn-whist");
            $("#subit").addClass("btn-danger");
            $("#subit").addClass("animated shake");
            //$("#ok").css("display", "inline");
            $("#location").addClass("noval");
            setTimeout(function () {
                $("#location").removeClass("noval");
            }, 990);
            $("#distance").addClass("gdval");
            setTimeout(function () {
                $("#distance").removeClass("gdval");
            }, 990);

            setTimeout(function () {
                $('#subit').val("Run");
                $("#subit").removeClass("btn-danger");
                $("#subit").addClass("btn-whist");
                $("#subit").removeClass("animated shake");
            }, 1000);




        } else {
            console.log("NoNO");
            $("#subit").val("Sorry. There's a problem!"); //+ status);
            $("#subit").removeClass("btn-whist");
            $("#subit").addClass("btn-danger");
            $("#subit").addClass("animated shake");
            //$("#ok").css("display", "inline");
            $(".overval").addClass("noval");
            setTimeout(function () {
                $(".overval").removeClass("noval");
            }, 990);

            setTimeout(function () {
                $('#subit').val("Run");
                $("#subit").removeClass("btn-danger");
                $("#subit").addClass("btn-whist");
                $("#subit").removeClass("animated shake");
            }, 1000);




        }
    });
}

function findPts(LatLng) {
    //alert('finding points');
    smooth_bool = false;
    LatLng1 = LatLng; //can't do this above because can't modify global variables in anonymous function
    var Lat1 = LatLng1.lat() * Math.PI / 180; //LatLong in degrees; trig in radians
    var Long1 = LatLng1.lng() * Math.PI / 180;
    var dista = document.getElementById("distance").value * 0.609344;
    var dist = document.getElementById("distance").value * 0.609344;
    //var phi = Math.PI/180*((150-30)*Math.random()+30); //angle between leg1 and leg3
    var phi = Math.PI / 180 * ((120 - 60) * Math.random() + 60); //angle between leg1 and leg3
    var scale = 0.85; //straitline_distance/actual_distance
    var legDist = scale * dist / (2 + 2 * Math.sin(phi / 2));
    var r = 4000 * Math.cos(Lat1); //horizontal radius at given latitude
    var theta = 2 * Math.random() * Math.PI;
    var Lat2 = legDist * Math.cos(theta) / 4000 + Lat1;
    var Long2 = Long1 + legDist * Math.sin(theta) / r;
    var Lat3 = legDist * Math.cos(theta + phi) / 4000 + Lat1;
    var Long3 = Long1 + legDist * Math.sin(theta + phi) / r;
    LatLng2 = new google.maps.LatLng(Lat2 * 180 / Math.PI, Long2 * 180 / Math.PI);
    LatLng3 = new google.maps.LatLng(Lat3 * 180 / Math.PI, Long3 * 180 / Math.PI);
}


function plotRoute() {
    //alert('plotRoute');
    var request = {
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
    directionsService.route(request, function (result, status) {
        //alert(status);
        if (status == google.maps.DirectionsStatus.OK) {
            var routeDistFt = result.routes[0].legs[0].distance.value;
            var distFt = 1609344 * dista; //convert to ft

            if ((routeDistFt - distFt) / distFt > tolerance) { //if route is too long, try smoothing
                //alert('too long, try smoothing');
                if (smooth(result)) {
                    //reason[0]+=1;
                    findPts(LatLng1);
                    plotRoute();
                } else {
                    //reason[1]+=1;
                    tolerance *= 1.1; //increase tolerance to ensure eventually will get route
                    plotRoute();
                }
            } else if ((distFt - routeDistFt) / distFt > tolerance) { //if route is too short, find new points
                //alert('too short, finding new points');
                //reason[2]+=1;
                tolerance *= 1.1; //increase tolerance to ensure eventually will get route
                findPts(LatLng1);
                plotRoute();
            } else if (!(smooth_bool) && !(smooth(result))) { //remove short turns at end
                //note: won't evaluate smooth(result) of smooth_bool is true b/c JS has short circuit evaulation
                //alert('smoothing because haven\'t before');
                //reason[3]+=1;
                plotRoute();
            } else if (counter >= 10) {
                //reason[4]+=1;
                document.getElementById("allowUTurns").checked = true;
                counter = 0;
                alert("Unable to find a route without U-Turns after 10 attempts.\n" + "To keep trying, deselect [Allow U-Turns] and press [map] again.\n");
            } else if (hasUTurn(result) && !(1 == 2)) {
                //alert('replotting because has uturn');
                //reason[5]+=1;
                tolerance *= 1.1; //increase tolerance to ensure eventually will get route
                counter += 1;
                findPts(LatLng1);
                plotRoute();
            }
            //alert('plotting, mode:'+mode);
            else {
                //alert('plotting!');
                //alert(reason);
                infoptoggle();

                directionsDisplay.setDirections(result);
                showMarkers();
                //alert(Object.keys(map));
            }
        } else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            console.log('Query limit reached, waiting 3 seconds');
            setTimeout(plotRoute, 3000);
        } else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
            findPts(LatLng1);
            plotRoute();
        } else {
            alert(status);
            mode = google.maps.TravelMode.WALKING; //assume error was because google doesn't support bike directions
            plotRoute(); //in requested country
        }
    });
}


function showDirections() {
    var openWindow = window.open("", "", "width=500, height=600");
    var steps = directionsDisplay.directions.routes[0].legs[0].steps;
    var uniqueSteps = [steps[0]]; //initialize to avoid steps[i-1] --> negative index
    var instructions = [];
    var header =
        '<head><link href="' + window.location.href + 'css/bootstrap.min.css" rel="stylesheet" type="text/css"><link href="' + window.location.href + 'css/flat-ui.css" rel="stylesheet" type="text/css"><link href="' + window.location.href + 'css/style.css" rel="stylesheet" type="text/css"><title>Directions</title><body>';
    for (var i = 1; i < steps.length; i++) {
        if (steps[i] != uniqueSteps[uniqueSteps.length - 1] && steps[i].instructions.split(" ").length > 2 && steps[i].instructions.indexOf('bicycle') == -1) {
            uniqueSteps.push(steps[i]);
        } else {
            uniqueSteps[uniqueSteps.length - 1].distance.value += steps[i].distance.value;
        }
    }
    for (var i = 0; i < uniqueSteps.length; i++) {
        instructions.push(uniqueSteps[i].instructions);
    }

    var routeDist = document.getElementById("routeDistance").innerHTML;
    var footer = "\<br\>\<br\>Total: " + routeDist + "\</body\>";
    openWindow.document.write(header + instructions.join("\<br\>") + footer);
    openWindow.focus();
}

function hasUTurn(result) {
    var ok = false;
    var steps = result.routes[0].legs[0].steps;
    for (var i = 0; i < steps.length; i++) {
        if (steps[i].instructions.indexOf("U-turn") != -1) {
            ok = true;
            break;
        }
    }
    return ok;
}

function smooth(result) {
    //alert('smoothing');
    var steps = result.routes[0].legs[0].steps;
    var minDist1 = 10; //actually dist^2
    var minDist2 = 10;
    var bestStep1;
    var bestStep2;
    for (var i = 0; i < steps.length; i++) {
        var dist1 = Math.pow(LatLng2.lat() - steps[i].end_location.lat(), 2) + Math.pow(LatLng2.lng() - steps[i].end_location.lng(), 2);
        var dist2 = Math.pow(LatLng3.lat() - steps[i].end_location.lat(), 2) + Math.pow(LatLng3.lng() - steps[i].end_location.lng(), 2);
        if (dist1 < minDist1) {
            bestStep1 = i;
            minDist1 = dist1;
        }
        if (dist2 < minDist2) {
            bestStep2 = i;
            minDist2 = dist2;
        }
    }
    a = 0; //used to check if any smoothing was needed
    b = 0;
    while (steps[bestStep1].distance.value < 200) {
        bestStep1 -= 1;
        a += 1;
    }
    while (steps[bestStep2].distance.value < 200) {
        bestStep2 -= 1;
        b += 1;
    }
    //alert('a:b-'+a+':'+b);
    LatLng2 = steps[bestStep1].end_location;
    LatLng3 = steps[bestStep2].end_location;
    smooth_bool = true;
    if (a == 0 && b == 0) {
        return true; //ok to move on
    } else {
        return false; //need to plotRoute again
    }
}

function showMarkers() {
    if (1 == 2) {
        var steps = directionsDisplay.directions.routes[0].legs[0].steps;
        var dist = 0; //distance from last mile marker
        var miles = 0;
        for (var i = 0; i < steps.length; i++) {
            dist += steps[i].distance.value;
            while (dist > 1609344) {
                dist -= 1609344;
                miles += 1;
                var lat = steps[i].start_location.lat() +
                    dist / 1609344 * (steps[i].end_location.lat() - steps[i].start_location.lat());
                var lng = steps[i].start_location.lng() +
                    dist / 1609344 * (steps[i].end_location.lng() - steps[i].start_location.lng());
                markers.push(new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(lat, lng),
                    icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (miles + Math.floor(dist / 1609344)) + "|99B2FF"
                }));
            }
        }
    } else {
        clearMarkers();
    }
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}


$('#abim').attr('src', 'data:image/jpeg;base64,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');