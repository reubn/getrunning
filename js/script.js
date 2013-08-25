$('#infopbut').addClass('nsh');
var maplat;
var maplon;
maplat = 52.056398;
maplon = -2.715974;
var lat;
var lon;
var yes ="https://github.com/reubn/getrunning";
var no ="Forever alone";
console.log('Checking up under the hood eh? Well yes or no?');
function convertToHHMM(info) {
  var hrs = parseInt(Number(info));
  var min = Math.round((Number(info)-hrs) * 60);
  return hrs+':'+min;
}
window.onload = function() {// Check to see if the browser supports the GeoLocation API.
    $('#infopbut').css("display", "none"); 
	if (navigator.geolocation) {
		// Get the location
		navigator.geolocation.getCurrentPosition(function(position) {
			lat = position.coords.latitude;
			lon = position.coords.longitude;
                        maplat = position.coords.latitude;
			maplon = position.coords.longitude;

			// Show the map
			initialize(lat, lon, true);
		}, function(){
        
        initialize("","", false);
        });
	} else {
		initialize("","", false);
	}

}
// Enable the visual refresh
google.maps.visualRefresh = true;
//var location;
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
var tolerance; //remap if route is too short or too long
var counter = 0; //number of remaps because of UTurns
var LatLng1;
var LatLng2;
var LatLng3;
var smooth_bool; //has route been smoothed
var mode; //mode of transportation, needed to correct international errors
//var reason;
var markers = [];
$('#closeinfop').click(function() {
   $('#infopbut').css("display", "inline"); 
    
});
function infoptoggle(){
$('#infopbut').removeClass('nsh');
$('#infopbut').css("display", "none"); 
$("#infop").toggleClass("infout");

} 

function initialize(lata, lona, usegeo) {
    if(usegeo == true){
    document.getElementById("location").value=lata + " , " + lona;
    document.getElementById("location").placeholder="Your Current Location!";
    }
var mapProp = {
    center: new google.maps.LatLng(maplat,maplon),
    zoom: 12,
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
  directionsDisplay = new google.maps.DirectionsRenderer({draggable:true});
  
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  directionsDisplay.setMap(map);
  google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
    routeDist = directionsDisplay.directions.routes[0].legs[0].distance.text;
    routecoords = directionsDisplay.directions.routes[0].overview_path;
    var disttb = document.getElementById("distance").value;
    var routeADist = Math.round(directionsDisplay.directions.routes[0].legs[0].distance.value/100)*0.1;
    document.getElementById("routeDistance").innerHTML = routeDist + " long.";
      routeTimeW = convertToHHMM(directionsDisplay.directions.routes[0].legs[0].distance.value/5632.7);
      routeTimeR = convertToHHMM(directionsDisplay.directions.routes[0].legs[0].distance.value/11070.1);
      routeTimeC = convertToHHMM(directionsDisplay.directions.routes[0].legs[0].distance.value/20358.8);
      $('#time').text("R " + routeTimeR + " C " + routeTimeC + " W " + routeTimeW)
      if (routeADist > disttb){
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
function refreshdir() {
submit();
$("#infop").toggleClass("infout");
}
function submit() {
    var location=document.getElementById("location").value;
  //reason=[0, 0, 0, 0, 0, 0];
  clearMarkers(); //only necessary if already showing map
  counter = 0;
  tolerance = 0.15;
  mode = google.maps.TravelMode.WALKING;
  var geocoder=new google.maps.Geocoder();
  var GeoReq={ address:location };
  geocoder.geocode(GeoReq, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK && document.getElementById("distance").value > 0.999 && document.getElementById("distance").value < 1001) {
      var LatLng=results[0].geometry.location;
      map.setCenter(LatLng);
      findPts(LatLng);
      plotRoute();
    overtoggle();
        console.log("EvOK");
      }
    else if(status == google.maps.GeocoderStatus.OK){
        console.log("DisNO");
        $("#subit").val("Sorry. There's a problem!" );//+ status);
        $("#subit").removeClass("btn-whist" );
        $("#subit").addClass("btn-danger" );
        $("#subit").addClass("animated shake" );
        //$("#ok").css("display", "inline");
        $("#distance").addClass("noval" );
        setTimeout(function () {
            $("#distance").removeClass("noval" );
            
}, 990);
        $("#location").addClass("gdval" );
        setTimeout(function () {
            $("#location").removeClass("gdval" );
}, 990);
      
        setTimeout(function () {
            $('#subit').val("Run");
            $("#subit").removeClass("btn-danger" );
            $("#subit").addClass("btn-whist" );
            $("#subit").removeClass("animated shake" );
}, 1000);
        
        
        
      } else if(document.getElementById("distance").value > 0.999 && document.getElementById("distance").value < 1001){
          console.log("LocNO");
          $("#subit").val("Sorry. There's a problem!" );//+ status);
        $("#subit").removeClass("btn-whist" );
        $("#subit").addClass("btn-danger" );
        $("#subit").addClass("animated shake" );
        //$("#ok").css("display", "inline");
        $("#location").addClass("noval" );
        setTimeout(function () {
            $("#location").removeClass("noval" );
}, 990);
          $("#distance").addClass("gdval" );
        setTimeout(function () {
            $("#distance").removeClass("gdval" );
}, 990);
      
        setTimeout(function () {
            $('#subit').val("Run");
            $("#subit").removeClass("btn-danger" );
            $("#subit").addClass("btn-whist" );
            $("#subit").removeClass("animated shake" );
}, 1000);
        
        
        
          
      } else {
          console.log("NoNO");
          $("#subit").val("Sorry. There's a problem!" );//+ status);
        $("#subit").removeClass("btn-whist" );
        $("#subit").addClass("btn-danger" );
        $("#subit").addClass("animated shake" );
        //$("#ok").css("display", "inline");
        $(".overval").addClass("noval" );
        setTimeout(function () {
            $(".overval").removeClass("noval" );
}, 990);
      
        setTimeout(function () {
            $('#subit').val("Run");
            $("#subit").removeClass("btn-danger" );
            $("#subit").addClass("btn-whist" );
            $("#subit").removeClass("animated shake" );
}, 1000);
        
        
        
          
          
      }
    });
}

function findPts(LatLng) {
  //alert('finding points');
  smooth_bool = false;
  LatLng1 = LatLng; //can't do this above because can't modify global variables in anonymous function
  var Lat1 = LatLng1.lat()*Math.PI/180; //LatLong in degrees; trig in radians
  var Long1 = LatLng1.lng()*Math.PI/180;
  var dista = document.getElementById("distance").value*0.609344;
  var dist = document.getElementById("distance").value*0.609344;
  //var phi = Math.PI/180*((150-30)*Math.random()+30); //angle between leg1 and leg3
  var phi = Math.PI/180*((120-60)*Math.random()+60); //angle between leg1 and leg3
  var scale = 0.85; //straitline_distance/actual_distance
  var legDist = scale*dist/(2+2*Math.sin(phi/2));
  var r = 4000*Math.cos(Lat1); //horizontal radius at given latitude
  var theta = 2*Math.random()*Math.PI;
  var Lat2 = legDist*Math.cos(theta)/4000+Lat1;
  var Long2 = Long1+legDist*Math.sin(theta)/r;
  var Lat3 = legDist*Math.cos(theta+phi)/4000+Lat1;
  var Long3 = Long1+legDist*Math.sin(theta+phi)/r;
  LatLng2 = new google.maps.LatLng(Lat2*180/Math.PI, Long2*180/Math.PI);
  LatLng3 = new google.maps.LatLng(Lat3*180/Math.PI, Long3*180/Math.PI);
}


function plotRoute() {
  //alert('plotRoute');
  var request = {
    origin: LatLng1,
    destination: LatLng1,
    waypoints: [
      {
        location: LatLng2,
        stopover: false
      },
      {
        location: LatLng3,
        stopover: false
      }],
    travelMode: mode,
    avoidHighways: true,
    optimizeWaypoints: true
    };
  directionsService.route(request, function(result, status) {
    //alert(status);
    if (status == google.maps.DirectionsStatus.OK) {
      var routeDistFt = result.routes[0].legs[0].distance.value;
      var distFt = 1609344 * dista; //convert to ft
      
      if ((routeDistFt-distFt)/distFt > tolerance) { //if route is too long, try smoothing
        //alert('too long, try smoothing');
        if (smooth(result)) {
          //reason[0]+=1;
          findPts(LatLng1);
          plotRoute();
        }
        else {
          //reason[1]+=1;
          tolerance *= 1.1; //increase tolerance to ensure eventually will get route
          plotRoute();
        }
      }
      else if ((distFt-routeDistFt)/distFt > tolerance) { //if route is too short, find new points
        //alert('too short, finding new points');
        //reason[2]+=1;
        tolerance *= 1.1; //increase tolerance to ensure eventually will get route
        findPts(LatLng1);
        plotRoute();
      }
      else if (!(smooth_bool)&&!(smooth(result))) { //remove short turns at end
        //note: won't evaluate smooth(result) of smooth_bool is true b/c JS has short circuit evaulation
        //alert('smoothing because haven\'t before');
        //reason[3]+=1;
        plotRoute();
      }
      else if (counter>=10) {
        //reason[4]+=1;
        document.getElementById("allowUTurns").checked=true;
        counter=0;
        alert("Unable to find a route without U-Turns after 10 attempts.\n"
          +"To keep trying, deselect [Allow U-Turns] and press [map] again.\n");
      }
      else if (hasUTurn(result)&&!(1==2)) {
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
    }
    else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
      console.log('Query limit reached, waiting 3 seconds');
      setTimeout(plotRoute, 3000);
    }
    else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
        findPts(LatLng1);
        plotRoute();
    }
    else {
      alert(status);
      mode = google.maps.TravelMode.WALKING; //assume error was because google doesn't support bike directions
      plotRoute();                           //in requested country
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
  for (var i=1; i<steps.length; i++) {
    if (steps[i] != uniqueSteps[uniqueSteps.length-1]
        && steps[i].instructions.split(" ").length>2
        && steps[i].instructions.indexOf('bicycle')==-1) {
      uniqueSteps.push(steps[i]);
    }
    else {
      uniqueSteps[uniqueSteps.length-1].distance.value += steps[i].distance.value;
    }
  }
  for (var i=0; i<uniqueSteps.length; i++) {
    instructions.push(uniqueSteps[i].instructions);
  }

  var routeDist = document.getElementById("routeDistance").innerHTML;
  var footer = "\<br\>\<br\>Total: "+routeDist+"\</body\>";
  openWindow.document.write(header+instructions.join("\<br\>")+footer);
  openWindow.focus();
}

function hasUTurn(result) {
  var ok = false;
  var steps = result.routes[0].legs[0].steps;
  for (var i=0; i<steps.length; i++) {
    if (steps[i].instructions.indexOf("U-turn") != -1) {
      ok=true;
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
  for (var i=0; i<steps.length; i++) {
    var dist1 = Math.pow(LatLng2.lat()-steps[i].end_location.lat(),2)
                +Math.pow(LatLng2.lng()-steps[i].end_location.lng(),2);
    var dist2 = Math.pow(LatLng3.lat()-steps[i].end_location.lat(),2)
                +Math.pow(LatLng3.lng()-steps[i].end_location.lng(),2);
    if (dist1 < minDist1) {
      bestStep1 = i;
      minDist1 = dist1;
    }
    if (dist2 < minDist2) {
      bestStep2 = i;
      minDist2 = dist2;
    }
  }
  a=0; //used to check if any smoothing was needed
  b=0;
  while (steps[bestStep1].distance.value<200) {
    bestStep1 -= 1;
    a+=1;
  }
  while (steps[bestStep2].distance.value<200) {
    bestStep2 -= 1;
    b+=1;
  }
  //alert('a:b-'+a+':'+b);
  LatLng2 = steps[bestStep1].end_location;
  LatLng3 = steps[bestStep2].end_location;
  smooth_bool=true;
  if (a==0&&b==0) {
    return true; //ok to move on
  }
  else {
    return false; //need to plotRoute again
  }
}

function showMarkers() {
  if (1==2) {
    var steps = directionsDisplay.directions.routes[0].legs[0].steps;
    var dist = 0; //distance from last mile marker
    var miles = 0;
    for (var i=0; i<steps.length; i++) {
      dist += steps[i].distance.value;
      while (dist>1609344) {
        dist -= 1609344;
        miles += 1;
        var lat = steps[i].start_location.lat()+
          dist/1609344*(steps[i].end_location.lat()-steps[i].start_location.lat());
        var lng = steps[i].start_location.lng()+
          dist/1609344*(steps[i].end_location.lng()-steps[i].start_location.lng());
        markers.push(new google.maps.Marker({
        map:map,
        position:new google.maps.LatLng(lat,lng),
        icon:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+
          (miles+Math.floor(dist/1609344))+"|99B2FF"
        }));
      }
    }
  }
  else {
    clearMarkers();
  }
}

function clearMarkers() {
  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}


  
//google.maps.event.addDomListener(window, 'load', initialize);
