CustomOverlay.prototype = new google.maps.OverlayView();

function CustomOverlay(center, dimensions, map) {

    // Initialize all properties.

//   this.upperRightBound = new google.maps.LatLng() ;

   this.bearing = dimensions[2] ; 

   this.center = center ; 

   this.top = this.getOverlayBoundaries(center, dimensions[0]/2, 0) ;

   this.right = this.getOverlayBoundaries(center, dimensions[1]/2, 90) ; 

   this.left = this.getOverlayBoundaries(center, dimensions[1]/2, 270) ;

   this.bottom = this.getOverlayBoundaries(center, dimensions[0]/2, 180) ;

   this.centerNode = -1 ; 

   this.dimensions = dimensions ; 

    this.upperRight = new google.maps.LatLng(this.top.lat(), this.right.lng()) ; 
    this.lowerLeft = new google.maps.LatLng(this.bottom.lat(), this.left.lng()) ;

    this.upperBound = new google.maps.LatLng(this.top.lat(), this.right.lng()) ; 
    this.lowerBound = new google.maps.LatLng(this.bottom.lat(), this.left.lng()) ;

    this.upperLeft = new google.maps.LatLng(this.top.lat(), this.left.lng()) ; 
    this.lowerRight = new google.maps.LatLng(this.bottom.lat(), this.right.lng()) ;

    this.bounds_ = new google.maps.LatLngBounds(this.lowerLeft, this.upperRight);

    if (dimensions.length == 3) {
    this.image_ = "blue.jpg"; 
    } else {
    this.image_ = dimensions[3] ;   
    }
    this.map_ = map;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;

    this.top = this.getOverlayBoundaries(center, this.dimensions[0]/2, this.bearing) ;
    this.bottom = this.getOverlayBoundaries(center, this.dimensions[0]/2, this.bearing + 180) ;
    this.right = this.getOverlayBoundaries(center, this.dimensions[1]/2, this.bearing + 90) ; 
    this.left = this.getOverlayBoundaries(center, this.dimensions[1]/2, this.bearing + 270) ;
    
    this.upperRight = this.getOverlayBoundaries(this.top, this.dimensions[1]/2, this.bearing + 90) ; 
    this.upperLeft = this.getOverlayBoundaries(this.top, this.dimensions[1]/2, this.bearing + 270) ;
    this.lowerRight = this.getOverlayBoundaries(this.bottom, this.dimensions[1]/2, this.bearing + 90) ; 
    this.lowerLeft = this.getOverlayBoundaries(this.bottom, this.dimensions[1]/2, this.bearing + 270) ;


    
    this.centerMarker = new google.maps.Marker({
      position: center,
      map: map,
      title: 'Change Position',
      draggable: true 
    }); 

    this.rightMarker = new google.maps.Marker({
      position: this.right,
      map: map,
      title: 'Adjust size',
      draggable: true 
    }); 

    this.rotationMarker = new google.maps.Marker({
      position: this.top , //new google.maps.LatLng(center.lat()+1, center.lng()),
      map: map,
      title: 'Rotate',
      draggable: true 
    });

    this.bottomMarker = new google.maps.Marker({
      position: this.bottom , //new google.maps.LatLng(center.lat()+1, center.lng()),
      map: map,
      title: 'Adjust Size',
      draggable: true 
    });
    // here
   



    // Explicitly call setMap on this overlay.
    this.setMap(map);

  }
  

  /**
       * onAdd is called when the map's panes are ready and the overlay has been
       * added to the map.
       */

      CustomOverlay.prototype.onAdd = function() {

        var div = document.createElement('div');
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        // Create the img element and attach it to the div.
        var img = document.createElement('img');
        img.src = this.image_;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.position = 'absolute';
        img.style.opacity = "0.5" ; 

        div.appendChild(img);

        this.div_ = div;

        // Add the element to the "overlayLayer" pane.
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div) ; 

        google.maps.event.addDomListener(div, 'click', function() {
          google.maps.event.trigger(this, 'click');
          console.log("hovering") ;
      });
      };

      CustomOverlay.prototype.draw = function() {

        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        var div = this.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';

        //Rotates the object
        div.style.transform = 'rotate(' + this.bearing + 'deg)';
      };

      // The onRemove() method will be called automatically from the API if
      // we ever set the overlay's map property to 'null'.
      CustomOverlay.prototype.onRemove = function() {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      };

      
      CustomOverlay.prototype.updateBounds = function(bounds){
        this.bounds_ = bounds;
        this.draw();
      };

      CustomOverlay.prototype.updateCenter = function(center) {
        this.center = center ;  
       // this.connectedHalls.centerNode.position = center ; 

        var top = this.getOverlayBoundaries(center, this.dimensions[0]/2, 0) ;

        right = this.getOverlayBoundaries(center, this.dimensions[1]/2, 90) ; 

        left = this.getOverlayBoundaries(center, this.dimensions[1]/2, 270) ;

        bottom = this.getOverlayBoundaries(center, this.dimensions[0]/2, 180) ;

        upperRightBound = new google.maps.LatLng(top.lat(), right.lng()) ;
        lowerLeftBound = new google.maps.LatLng(bottom.lat(), left.lng()) ;

        newbounds_ = new google.maps.LatLngBounds(lowerLeftBound, upperRightBound) ; 

        this.updateBounds(newbounds_) ;

        this.top = this.getOverlayBoundaries(center, this.dimensions[0]/2, this.bearing) ;
        this.bottom = this.getOverlayBoundaries(center, this.dimensions[0]/2, this.bearing + 180) ;
        this.right = this.getOverlayBoundaries(center, this.dimensions[1]/2, this.bearing + 90) ; 
        this.left = this.getOverlayBoundaries(center, this.dimensions[1]/2, this.bearing + 270) ;
        
        this.upperRight = this.getOverlayBoundaries(this.top, this.dimensions[1]/2, this.bearing + 90) ; 
        this.upperLeft = this.getOverlayBoundaries(this.top, this.dimensions[1]/2, this.bearing + 270) ;
        this.lowerRight = this.getOverlayBoundaries(this.bottom, this.dimensions[1]/2, this.bearing + 90) ; 
        this.lowerLeft = this.getOverlayBoundaries(this.bottom, this.dimensions[1]/2, this.bearing + 270) ; 
        
        this.rightMarker.setPosition(this.right) ; 
        this.rotationMarker.setPosition(this.top) ;
        this.bottomMarker.setPosition(this.bottom) ;

      }
      

       function toRad(x) {
        return (x * Math.PI / 180) ;
      }

      function toDeg(x) {
        return (x * 180 / Math.PI) ;
      }


    CustomOverlay.prototype.getOverlayBoundaries = function(center, distance, bearing) {
        //width and height are in meters
        lat1 = toRad(center.lat()), lon1 = toRad(center.lng()) ;
        var lat2, lon2 ;

        distance = distance / 6371000 ;

        bearing = toRad(bearing) ;

        lat2 = Math.asin(Math.sin(lat1)*Math.cos(distance) +
                Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing)) ;

        lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(distance) * Math.cos(lat1),
                Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2));

        return new google.maps.LatLng(toDeg(lat2), toDeg(lon2));

    } ; 

  CustomOverlay.prototype.getHallwayLength = function(lower, upper) {
      EARTH_RADIUS = 6378.137 ; //Units are KM
      var dLat, dLon, a, c,d ;

      dLat = toRad(upper.lat()) - toRad(lower.lat()) ;
      dLon = toRad(upper.lng() - lower.lng()) ;

      a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lower.lat() * Math.PI / 180) * Math.cos(upper.lat() * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);

      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      d = EARTH_RADIUS * c ;


      return d * 1000 ;
  }

  CustomOverlay.prototype.getAngle = function(start, end) {
    rightAnglePoint = new google.maps.LatLng(start.lat(), end.lng()) ;
    var hypotenuse, adjacent, angle ;

    hypotenuse = this.getHallwayLength(start, end) ;
    adjacent = this.getHallwayLength(start, rightAnglePoint) ;

    angle = Math.acos(adjacent/hypotenuse) ;

    if (end.lat() > start.lat() && end.lng() > start.lng()) { // case 1
        angle = 90 - toDeg(angle) ;
    } else if (end.lat() > start.lat() && end.lng() < start.lng()) { //case 2
        angle = toDeg(angle) + 270 ;
    } else if (end.lat() < start.lat() && end.lng() > start.lng()) { // case 3
        angle = toDeg(angle) + 90 ;
    } else { // case 4
        angle =  270 - toDeg(angle) ;
    }


    return (angle) ;
}


  CustomOverlay.prototype.rotate = function() {
    this.bearing = this.getAngle(this.centerMarker.getPosition(), this.rotationMarker.getPosition()) ;

    rotationLatLng = this.getOverlayBoundaries(this.center, this.dimensions[0]/2, this.bearing) ;
    this.rotationMarker.setPosition(rotationLatLng) ;

    this.top = this.getOverlayBoundaries(this.center, this.dimensions[0]/2, this.bearing) ;
    this.bottom = this.getOverlayBoundaries(this.center, this.dimensions[0]/2, this.bearing + 180) ;
    this.right = this.getOverlayBoundaries(this.center, this.dimensions[1]/2, this.bearing + 90) ; 
    this.left = this.getOverlayBoundaries(this.center, this.dimensions[1]/2, this.bearing + 270) ;
    
    this.upperRight = this.getOverlayBoundaries(this.top, this.dimensions[1]/2, this.bearing + 90) ; 
    this.upperLeft = this.getOverlayBoundaries(this.top, this.dimensions[1]/2, this.bearing + 270) ;
    this.lowerRight = this.getOverlayBoundaries(this.bottom, this.dimensions[1]/2, this.bearing + 90) ; 
    this.lowerLeft = this.getOverlayBoundaries(this.bottom, this.dimensions[1]/2, this.bearing + 270) ; 

    this.rightMarker.setPosition(this.right) ;
    this.bottomMarker.setPosition(this.bottom) ;

   // console.log(this.bearing) ;

    this.draw() ; 

  }

  CustomOverlay.prototype.adjustRight = function() {
      this.right = this.rightMarker.getPosition() ; 

      this.dimensions[1] = this.getHallwayLength(this.center, this.right)*2 ;

      this.updateCenter(this.center) ;

  }

  CustomOverlay.prototype.adjustBottom = function() {
    this.bottom = this.bottomMarker.getPosition() ; 

    this.dimensions[0] = this.getHallwayLength(this.center, this.bottom)*2 ; 

    this.updateCenter(this.center) ;
  }

  CustomOverlay.prototype.hideMarkers = function() {
    this.rotationMarker.setVisible(false) ; 
    this.rightMarker.setVisible(false) ; 
    this.bottomMarker.setVisible(false) ;
  }

  CustomOverlay.prototype.showMarkers = function() {
    this.rotationMarker.setVisible(true) ;
    this.rightMarker.setVisible(true) ;
    this.bottomMarker.setVisible(true) ;
  }

  




  /*

  CustomOverlay.prototype.adjustUpperRight = function() {

    if (this.upperRightMarker.getPosition().lat() > this.lowerLeft.lat() && this.upperRightMarker.getPosition().lng() > this.lowerLeft.lng()) {
    this.upperRight = this.upperRightMarker.getPosition() ;

    centerLat = (this.lowerLeft.lat() + this.upperRight.lat())/2 ; 
    centerLng = (this.lowerLeft.lng() + this.upperRight.lng())/2 ; 

    this.center = new google.maps.LatLng(centerLat, centerLng) ;
    this.centerMarker.setPosition(this.center) ;

    hyp = this.getHallwayLength(this.lowerLeft, this.upperRight) ;
    rightPoint = new google.maps.LatLng(this.lowerLeft.lat(), this.upperRight.lng()) ;
    
    adj = this.getHallwayLength(this.lowerLeft, rightPoint) ;

    angle1 = Math.acos(toRad(adj/hyp)) ;

    rAdj = hyp * Math.cos(toRad(this.bearing + angle1)) ; 

    this.dimensions[1] = rAdj ; 

    this.dimensions[0] = hyp * Math.sin(toRad(this.bearing + angle1)) ;

    this.updateCenter(this.center) ; 

    } else {
      this.upperRightMarker.setPosition(this.upperRight) ;
    }
  }

  CustomOverlay.prototype.adjustSize = function() {
    if (this.upperRightMarker.getPosition().lat() > this.lowerLeft.lat() && this.upperRightMarker.getPosition().lng() > this.lowerLeft.lng()) {
      this.upperRight = this.upperRightMarker.getPosition() ; 

      hyp = this.getHallwayLength(this.lowerLeft, this.upperRight) ;
      rightPoint = new google.maps.LatLng(this.lowerLeft.lat(), this.upperRight.lng()) ;

      //newPoint = this.getOverlayBoundaries(this.lowerLeft, hyp, this.bearing) ;
    
      adj = this.getHallwayLength(this.lowerLeft, rightPoint) ;

      angle1 = Math.acos(toRad(adj/hyp)) ;

      rAdj = hyp * Math.cos(toRad(this.bearing + angle1)) ; 

      this.dimensions[1] = hyp * Math.sin(toRad(this.bearing + angle1)) ;

      newPoint = this.getOverlayBoundaries(this.lowerLeft, this.dimensions[1], this.bearing + 90) ;

      lowerLeftMarker  = new google.maps.Marker({
        position: newPoint , //new google.maps.LatLng(center.lat()+1, center.lng()),
        map: this.map_,
        title: 'Hello World!',
        draggable: true 
      }); 

      this.dimensions[0] = rAdj ; 

      centerLat = (this.lowerLeft.lat() + this.upperRight.lat())/2 ; 
      centerLng = (this.lowerLeft.lng() + this.upperRight.lng())/2 ;

      this.center = new google.maps.LatLng(centerLat, centerLng) ;

      this.centerMarker.setPosition(this.center) ;

      this.updateCenter(this.center) ; 

      
  
      
  
      } else {
        this.upperRightMarker.setPosition(this.upperRight) ;
      }



    }

    CustomOverlay.prototype.adjustSize2 = function() {
    //  if (this.upperRightMarker.getPosition().lat() > this.lowerLeft.lat() && this.upperRightMarker.getPosition().lng() > this.lowerLeft.lng()) {
        this.upperRight = new google.maps.LatLng(this.upperRightMarker.getPosition().lat(), this.upperRightMarker.getPosition().lng()) ;
  
        hyp = this.getHallwayLength(this.center, this.upperRight) ;
        console.log(hyp) ;
        console.log(this.bearing) ;


        this.dimensions[0] = hyp * Math.sin(toRad(90- this.bearing))*2 ; 
        this.dimensions[1] = hyp * Math.cos(toRad(90- this.bearing))*2 ;

        console.log(this.dimensions[0]) ;
        console.log(this.dimensions[1]) ;

        var top = this.getOverlayBoundaries(center, this.dimensions[0]/2, 0) ;

        right = this.getOverlayBoundaries(center, this.dimensions[1]/2, 90) ; 

        left = this.getOverlayBoundaries(center, this.dimensions[1]/2, 270) ;

        bottom = this.getOverlayBoundaries(center, this.dimensions[0]/2, 180) ;

        upperRightBound = new google.maps.LatLng(top.lat(), right.lng()) ;
        lowerLeftBound = new google.maps.LatLng(bottom.lat(), left.lng()) ;

        newbounds_ = new google.maps.LatLngBounds(lowerLeftBound, upperRightBound) ; 

        this.updateBounds(newbounds_) ;

       // this.updateCenter(this.center) ;
        

      //  } else {
      //    this.upperRightMarker.setPosition(this.upperRight) ;
      //  }



    }

*/

