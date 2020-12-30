 /*
      This function implements the haversine equation to calculate the distances between points. 
      It is the only function here that was not written by me. 

      Here is where I found it and yes of course it was stack overflow. 
      https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
      
      */
     function getDistance(lower, upper) {
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
  
  
      /*
      This function takes four LatLngs as parameters. Each pair is meant to represent a straight line. 
      This line finds a point of intersection between these two lines. 
      It returns the location of that point. 
  
      */
        function findPOI(start1, end1, start2, end2) {
          rise1 = end1.lat() - start1.lat() ; 
          run1 = end1.lng() - start1.lng() ; 
  
          slope1 = rise1/run1 ; 
          b1 = end1.lat() - slope1*end1.lng() ; 
  
          rise2 = end2.lat() - start2.lat() ; 
          run2 = end2.lng() - start2.lng() ; 
  
          slope2 = rise2/run2 ; 
          b2 = end2.lat() - slope2*end2.lng() ;
  
          x = (b2-b1)/(slope1-slope2) ; 
          y = slope1*x + b1 ; 
  
          intersection = new google.maps.LatLng(y,x) ; 
  
          if (checkIfPointInBounds(start1, end1, start2, end2, intersection) &&  !isNaN(x) && !isNaN(y)) {
            return intersection ;
          } else {
            return false ; 
          }
        }
        /*
        The findPOI function finds a point of intersection but does not check whether it is within the bounds of the two 
        potentially overlapping hallways. 
  
        Thus, checkIfPointInBounds checks if the point is in between each of the four points. 
  
        Parameters: It takes the four points and the point found by findPOI. 
  
        It returns true or false based on whether the POI is in between the four points. 
  
        */
  
        function checkIfPointInBounds(start1, end1, start2, end2, intersection) {
          ItoS1x = start1.lng() - intersection.lng() ; 
          ItoS1y = start1.lat() - intersection.lat() ; 
  
          ItoE1x = end1.lng() - intersection.lng() ; 
          ItoE1y = end1.lat() - intersection.lat() ;
  
          if (ItoS1x*ItoE1x + ItoS1y*ItoE1y > 0) {
            return false ; 
          }
  
          ItoS2x = start2.lng() - intersection.lng() ; 
          ItoS2y = start2.lat() - intersection.lat() ; 
  
          ItoE2x = end2.lng() - intersection.lng() ; 
          ItoE2y = end2.lat() - intersection.lat() ;
  
          if (ItoS2x*ItoE2x + ItoS2y*ItoE2y > 0) {
           // console.log("false") ;
            return false ; 
          }
          
        //  console.log("true") ;
          return true ; 
        }
  
  
        /*
        This function takes two halls as parameters. 
  
        It then determines whether they are intersecting and finds the points at which they do. 
  
        It returns an array of length 0 or up to 16 depending on the number of possible intersections (16 is impossible however but theoretical). 
        */
        function checkHallOverlap(moving, stationary) {
          intersections = [] ; 
          temp = findPOI(moving.lowerRight, moving.upperRight, stationary.lowerRight, stationary.upperRight) ;
          if (temp != false) {
            intersections[0] = temp ; 
          } 
  
          temp = findPOI(moving.lowerRight, moving.upperRight, stationary.lowerLeft, stationary.upperLeft) ;
          if (temp != false) {
            intersections[1] = temp ; 
            
          } 
  
          temp = findPOI(moving.lowerRight, moving.upperRight, stationary.lowerLeft, stationary.lowerRight) ;
          if (temp != false) {
            intersections[2] = temp ; 
          } 
  
          temp = findPOI(moving.lowerRight, moving.upperRight, stationary.upperLeft, stationary.upperRight) ;
          if (temp != false) {
            intersections[3] = temp ; 
          } 
  
  
          temp = findPOI(moving.lowerLeft, moving.upperLeft, stationary.lowerRight, stationary.upperRight) ;
          if (temp != false) {
            intersections[4] = temp ; 
          } 
  
          temp = findPOI(moving.lowerLeft, moving.upperLeft, stationary.lowerLeft, stationary.upperLeft) ;
          if (temp != false) {
            intersections[5] = temp ; 
          } 
  
          temp = findPOI(moving.lowerLeft, moving.upperLeft, stationary.lowerLeft, stationary.lowerRight) ;
          if (temp != false) {
            intersections[6] = temp ; 
          }
  
          temp = findPOI(moving.lowerLeft, moving.upperLeft, stationary.upperLeft, stationary.upperRight) ;
          if (temp != false) {
            intersections[7] = temp ; 
          } 
  
  
          temp = findPOI(moving.lowerLeft, moving.lowerRight, stationary.lowerRight, stationary.upperRight) ;
          if (temp != false) {
            intersections[8] = temp ; 
          } 
  
          temp = findPOI(moving.lowerLeft, moving.lowerRight, stationary.lowerLeft, stationary.upperLeft) ;
          if (temp != false) {
            intersections[9] = temp ; 
          } 
  
          temp = findPOI(moving.lowerLeft, moving.lowerRight, stationary.lowerRight, stationary.lowerLeft) ;
          if (temp != false) {
            intersections[10] = temp ; 
          } 
  
          temp = findPOI(moving.lowerLeft, moving.lowerRight, stationary.upperRight, stationary.upperLeft) ;
          if (temp != false) {
            intersections[11] = temp ; 
          } 
  
  
          temp = findPOI(moving.upperLeft, moving.upperRight, stationary.lowerRight, stationary.upperRight) ;
          if (temp != false) {
            intersections[12] = temp ; 
          } 
  
          temp = findPOI(moving.upperLeft, moving.upperRight, stationary.lowerLeft, stationary.upperLeft) ;
          if (temp != false) {
            intersections[13] = temp ; 
          } 
  
          temp = findPOI(moving.upperLeft, moving.upperRight, stationary.lowerRight, stationary.lowerLeft) ;
          if (temp != false) {
            intersections[14] = temp ; 
          } 
  
          temp = findPOI(moving.upperLeft, moving.upperRight, stationary.upperRight, stationary.upperLeft) ;
          if (temp != false) {
            intersections[15] = temp ; 
          } 
         // console.log(intersections.length > 0) ;
  
         if (intersections.length > 0) {
          console.log("They interesct") ;
         } else {
           console.log("They do not intersect") ;
         }
  
          return intersections ; 
        }
  
  
        /*
        This function determines whether a point is above or below a straight line. 
  
        Parameters: it takes 2 points that represent the straight line. 
        It also takes the point that is being tested for whether it is above or below the line. 
  
        It returns true if the point is above the line and false if it is below or on the line. 
        */
  
        function getPointToLine(location, point1, point2) {
          rise = point2.lat() - point1.lat() ; 
          run = point2.lng() - point1.lng() ; 
  
          slope = rise/run ; 
          b = point1.lat() - slope*point1.lng() ;
          
          newPointLat = location.lng()*slope + b ;
          
          if (location.lat() > newPointLat) {
            return true ; 
          } else {
            return false ; 
          }
        }
  
        /*
        This function determines whether a point is inside a hallway.
  
        Parameters: it takes the location to be tested and the hIndex of the hallway to be tested. 
  
        It returns true if the point is in the hall or false if it is not. 
        
        */
        function checkIfPointInHall3(location, hall) {
  
          ULtoUR = getPointToLine(location, hallwayArray.get(hall).upperLeft, hallwayArray.get(hall).upperRight) ; 
          URtoLR = getPointToLine(location, hallwayArray.get(hall).upperRight, hallwayArray.get(hall).lowerRight) ;
          LRtoLL = getPointToLine(location, hallwayArray.get(hall).lowerRight, hallwayArray.get(hall).lowerLeft) ;
          LLtoUL = getPointToLine(location, hallwayArray.get(hall).lowerLeft, hallwayArray.get(hall).upperLeft) ;
  
          if (hallwayArray.get(hall).bearing == 0) {
            return LRtoLL && !ULtoUR && location.lng() < hallwayArray.get(hall).upperRight.lng() && location.lng() > hallwayArray.get(hall).upperLeft.lng() ; 
  
          } else if (hallwayArray.get(hall).bearing == 90) {
            return URtoLR && !LLtoUL && location.lng() < hallwayArray.get(hall).upperLeft.lng() && location.lng() > hallwayArray.get(hall).lowerLeft.lng() ;  ;
  
          } else if (hallwayArray.get(hall).bearing == 180) {
            return ULtoUR && !LRtoLL && location.lng() < hallwayArray.get(hall).upperLeft.lng() && location.lng() > hallwayArray.get(hall).lowerRight.lng() ;  ;  ;
  
          } else if (hallwayArray.get(hall).bearing == 270) {
            return !URtoLR && LLtoUL && location.lng() < hallwayArray.get(hall).lowerLeft.lng() && location.lng() > hallwayArray.get(hall).upperLeft.lng() ;  ; ;
          }
  
          if (hallwayArray.get(hall).bearing < 90) {
            return !ULtoUR && URtoLR && LRtoLL && !LLtoUL ; 
  
          } else if (hallwayArray.get(hall).bearing < 180) {
            return ULtoUR && URtoLR && !LRtoLL && !LLtoUL ;
  
          } else if (hallwayArray.get(hall).bearing < 270) {
            return ULtoUR && !URtoLR && !LRtoLL && LLtoUL ;
  
          } else {
            return !ULtoUR && !URtoLR && LRtoLL && LLtoUL ;
          }
  
        }
      
        /*
        This function finds which hall a point is in or determines that it is not in any hall. 
  
        Parameters: it takes one parameter which is the location to be tested. 
  
        It returns the hIndex of the hall if the point is found or false if it is not. 
        
        */
        function locatePoint(location) {
          
          for (const i of hallwayArray.keys()) {
            if (checkIfPointInHall3(location, i)) {
             // console.log(i) ;  
              return i ; 
            }
          }
         // console.log(false) ;
          return false ; 
  
        }

      /*
      This function uses dijkstras algorithm to draw the path between two points in the builindg. It 
      is the cherry on top of the application so far. 
      
      Parameters: the start and end locations of the potential path. 

      It returns null if the points are not in the building. If successful, it returns nothing. 
      
      */
     function dijkstrasAlgorithm(start, end) {
      /*
      m = new google.maps.Marker({
        map: map, 
        position: start
      }) ;

      m = new google.maps.Marker({
        map: map, 
        position: end
      }) ;
      */
      
      startHall = locatePoint(start) ; 
      endHall = locatePoint(end) ;

     // alert( "Latitude: "+ start.lat()+" "+", longitude: "+ start.lng() ); 
     // alert( "Latitude: "+ end.lat()+" "+", longitude: "+end.lng() ); 
      
     //Checks if the points are within the building. 
     
      if (startHall == false) {
        alert("Start is not in building") ; 
        return null ; 
      }

      if (endHall == false) {
        alert("End is not in building") ; 
        return null ; 
      }

      if (graphNotReady) {
        alert("Please hit set up graph") ;
        return null ; 
      }
      

      startHallNode = hallwayArray.get(startHall).centerNode ; 
      endHallNode = hallwayArray.get(endHall).centerNode ;

      
      //Adds start node to the network
      network.set(nIndex, new HallNode(start, [startHallNode], nIndex)) ; 
      network.get(startHallNode).addConnection(nIndex) ; 
      startNode = nIndex ; 
      nIndex++ ;  

      //Adds end node to the network 
      network.set(nIndex,  new HallNode(end, [endHallNode], nIndex)) ; 
      network.get(endHallNode).addConnection(nIndex) ; 
      endNode = nIndex ; 
      nIndex++ ; 
      
      
      var visitied = [] ; 
      var univisited = Array.from(network.keys()) ; 
      var previous = new Map() ; 
      var shortestDist = new Map() ; 
      var distance, totalDistance ; 
      var MAX = 9999999999 ;  
      var max = MAX ; 
      var currentNode, cnPosition, currentConnections ; 
      var x,y,z = 0 ; 

      univisited = [] ; 

      for (const i of network.keys()) {
        univisited.push(i) ; 
      }

      for (const i of univisited) {
        shortestDist.set(i, max) ;  
        
      }
      
      shortestDist.set(startNode, 0) ;
      //console.log(shortestDist.get(startNode) + " " + startNode) ;
      x = 0 ; 
      while (univisited.length != 0 && x < 90) {
       printArray(univisited) ; 
       console.log("x") ; 
       
        for (y = 0; y < univisited.length; y++) {
          if (shortestDist.get(univisited[y]) < max) {
            console.log("in " + univisited[y] + " " + y) ;
            currentNode = univisited[y] ; 
            cnPosition = y ; 
            max = shortestDist.get(univisited[y]) ; 
          }
        }

        console.log(currentNode) ;

       currentConnections = network.get(currentNode).connections ; 

        for (z = 0; z < currentConnections.length; z++) {

         //console.log(currentNode + ":" + i) ; 
         // console.log(i) ; 
          distance = getDistance(network.get(currentNode).position, network.get(currentConnections[z]).position) ;
          totalDistance = distance + shortestDist.get(currentNode) ; 

          if (i in univisited && totalDistance < shortestDist.get(currentConnections[z])) {
            console.log(currentNode + ":" + currentConnections[z]) ; 
            previous.set(currentConnections[z], currentNode) ; 
            shortestDist.set(currentConnections[z], totalDistance) ;
          }
          console.log("a") ;

        }

        visitied.push(currentNode) ; 
        console.log("Before") ;
      
        console.log(cnPosition) ;
        if (cnPosition == 0) {
          univisited.shift() ; 
        } else if (cnPosition == univisited.length - 1) {
          univisited.pop() ; 
        } else {
          univisited.splice(cnPosition, 1) ; 
        }
        
        console.log("after")
      
        max = MAX ; 
      
      }

      var viewedHall = endNode ; 
      var pathway = [network.get(endNode).position] ;

      x = 0 ; 
      while (viewedHall != startNode && x < 90) {
        viewedHall = previous.get(viewedHall) ; 
        pathway.push(network.get(viewedHall).position) ;
        x++ ; 
      }

      return pathway ; 

      /*
      var route = new google.maps.Polyline({
        path: pathway,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        visible: true,
        width: 100,
        color: 'red',
        map: map  
}) ;
*/
} // end of function 

    /*
    This function creates a connecting node between two halls. 

    Parameters: it takes the intersections array from checkHallOverlap as well as the hIndexes of the two halls. 

    It returns nothing. 
    
    */
    function IFGcreateNewNode(intersections, hall1, hall2) {
      var aLat = 0, aLng = 0, counter = 0 ; 
      hall1 = hallwayArray.get(hall1).centerNode ; 
      hall2 = hallwayArray.get(hall2).centerNode ; 
      

      for (z = 0; z < intersections.length; z++) {
        if (intersections[z] != null || NaN) {
          aLat += intersections[z].lat() ; 
          aLng += intersections[z].lng() ;
          counter++ ;  
        }
      }

      midPoint = new google.maps.LatLng(aLat/counter, aLng/counter) ; 
      

      newNode = new HallNode(midPoint, [hall1, hall2], nIndex) ; 

      network.set(nIndex, newNode) ;
      console.log(nIndex) ;
      network.get(hall1).addConnection(nIndex) ;
      network.get(hall2).addConnection(nIndex) ;

      nIndex++ ; 
      
       
     
      console.log("here") ;
      console.log(midPoint.lat()) ;
      console.log(midPoint.lng()) ;
      /*
      m = new google.maps.Marker({
        map: map, 
        position: midPoint
      }) ;
      */
    }

    /*
    This analyzes the floor plan and creates a nodal graph based off of it (pretty cool huh? maybe you should hire the person who made this?) 17jal21@queensu.ca :)
    It checks for every possible intersection (which is somehow still O(n^2) despite being a brutal computation). It then 
    creates nodes based off of those intersections. 
    
    Parameters: none. It does rely on the network, hallwayArray, hIndex and nIndex as globals however. 

    It returns nothing.       
    */
    function initializeFloorGraph() {
      var halls = Array.from(hallwayArray.keys()) ; 
      console.log(halls) ; 
      console.log(halls.length) ;
      var x,y ; 
    
      network = new Map() ;
      nIndex = 0 ; 

      //Initializes the center of each hall as a node
      for (const i of hallwayArray.keys()) {
        newNode = new HallNode(hallwayArray.get(i).center, [], nIndex, i) ;
        hallwayArray.get(i).centerNode = nIndex ;  
        network.set(nIndex, newNode) ; 
        

        nIndex++ ;
      }
      
      console.log("connections") ; 
      for (x = 0; x < halls.length; x++) {
        for (y = x + 1; y < halls.length; y++) {
          
          intersections = checkHallOverlap(hallwayArray.get(halls[x]), hallwayArray.get(halls[y])) ; 

          if (intersections.length > 0) {
            IFGcreateNewNode(intersections, halls[x], halls[y]) ; 
          }
        }
      }

      locatePlaces() ;

      console.log("check up") ; 

      console.log("done")
      graphNotReady = !(checkIfFloorIsConnected()) ; 
      return (graphNotReady) ; 
      console.log("Graph not ready: " + graphNotReady) ; 



    }

    function locatePlaces() {
      var newNode ; 
      
      for (const i of placeMap.keys()) {
        placeMap.get(i).hallway = locatePoint(placeMap.get(i).position) ;

        if (placeMap.get(i).hallway != false) {
          console.log("Place hallway: " + placeMap.get(i).hallway) ;
          hallNode = hallwayArray.get(placeMap.get(i).hallway).centerNode ;  
          network.set(nIndex, new HallNode(placeMap.get(i).position, [hallNode], nIndex)) ; 
          network.get(hallNode).addConnection(nIndex) ; 
          placeMap.get(i).node = nIndex ; 
          nIndex++ ;  
        }

      }

    }

    function checkIfFloorIsConnected() {


      if (hallwayArray.size > 1) {
        for (const i of hallwayArray.keys()) {
          if (hallwayArray.get(i).centerNode == -1 || network.get(hallwayArray.get(i).centerNode).connections.length == 0) {
            alert("Cannot enter view mode: Not all halls are connected!") ;
            return false ; 
          }
        }
      }

      for (const i of placeMap.keys()) {
        if (placeMap.get(i).hallway == false) {
          alert("Cannot enter view mode: All places/locations must be on top of a hall!") ;
          return false ; 
        }

        if (placeMap.get(i).name == null) {
          alert("Cannot enter view mode: All places must be named!") ;
          return false ; 
        }

      }

      return true ; 

    
    }

    function printArray(a) {
         
      for (i in a) {
       
      }
      
       
    }

    
