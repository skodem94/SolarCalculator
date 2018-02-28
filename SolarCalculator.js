var arr =[];
var markers = [];
var nominal_power = [];
var array = [];
function searchBox() {
     
        //hybrid map initially having bounds to boston
            var map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: 42.361145, lng: -71.057083},
              zoom: 20,
              mapTypeId: google.maps.MapTypeId.HYBRID
            });

            // Create the search box and link it to the UI element.
            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function() {
              searchBox.setBounds(map.getBounds());
            });

           
            
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {
              document.getElementById("path").disabled = false;

                  var places = searchBox.getPlaces();
                  if (places.length == 0) {
                    return;
                  }

                  // Clear out the old markers.
                markers.forEach(function(marker) {
                    marker.setMap(null);
                  });
                  markers = [];

                  // For each place, get the icon, name and location.

                  var bounds = new google.maps.LatLngBounds();
                  places.forEach(function(place) {
                          
                          if (!place.geometry) {
                            console.log("Returned place contains no geometry");
                            return;
                            
                          }
                               // Create a marker for each place.
                    markers.push(new google.maps.Marker({
                            map: map,
                            draggable: true,
                            title: place.name,
                            position: place.geometry.location
                          }));

                    /*nominal_power.push({
                        maxLoad: 55,
                        minLoad: 15,
                        position: place.geometry.location
                    })*/
                          //get the latitude and longitude values of searched place
                         lat = place.geometry.location.lat();
                         long = place.geometry.location.lng();
                          
                          //store them into an array
                          var latlon = [lat,long];                         
                          var len = arr.length;
                          arr[len] = latlon;
                          
                          if (place.geometry.viewport) {
                            // Only geocodes have viewport
                            
                            bounds.union(place.geometry.viewport);
                          } else {
                            bounds.extend(place.geometry.location);
                          }
                          
                    });
                
                    

                  map.fitBounds(bounds);
                  
              //set up the properties of the polygon

                  pol = new google.maps.Polygon({
                  strokeColor: '#FF0000',
                  strokeOpacity: 1.0, 
                  fillOpacity: 0.25,
                  fillColor: "#FF0000",
                  strokeWeight: 6,
                  map: map,
                });
                  
                path = [];   

            //get the values for drawing the path   
                for(i=0;i<=path.length;i++){
                  
                  path[i] = {lat: arr[i][0], lng: arr[i][1]};
  
                }
            });

            map.addListener('click', function(e) {
                placeMarkerAndPanTo(e.latLng, map);
               
              });
            

         
  }
  

  function placeMarkerAndPanTo(latLng, map) {
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
    map.panTo(latLng);
    var ltln = latLng;                         
    var l = array.length;
    array[l] = ltln;
  }
    
    

//get the values for drawing the path   
  /*for(i=0;i<=array.length;i++){
    
  }
*/

  function drawPolygon(){
    document.getElementById("cal_area").disabled = false;
    pol.setPath(array);
   

  }
  var area;

  function calculateArea(){
    document.getElementById("nominal").disabled = false;
    area = google.maps.geometry.spherical.computeArea(pol.getPath());
    document.getElementById('getarea').value = area;
  }

  function calculateNominalArea(){
    var nom_value = area*1000;
    document.getElementById('nom_val').value = nom_value;
  }

 
