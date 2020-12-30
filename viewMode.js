

      var viewInput ; 
      var viewStartMarker = null, viewStartPosition ; 
      var viewEndPosition ; 
      var mapListenerTag ;
      var route = null; 

      function beginViewMode() {
        palette.style.display = "none" ; 
        header.style.display = "none" ; 
        document.getElementById("viewNavBar").style.display = "block" ; 
        document.getElementById("viewRightDiv").style.display = "block" ; 

        mapDiv = document.getElementById("map") ;
        mapDiv.style.width = "100%" ;

        for (const i of hallwayArray.keys()) {
          hallwayArray.get(i).hideMarkers() ;
          hallwayArray.get(i).centerMarker.setVisible(false) ; 
        }

        for (const i of placeMap.keys()) {
          placeMap.get(i).placeMarker.setDraggable(false) ; 
        }





        

      }

      function exitViewMode() {
        palette.style.display = "block" ; 
        header.style.display = "block" ; 
        document.getElementById("viewNavBar").style.display = "none" ; 
        document.getElementById("viewRightDiv").style.display = "none" ; 

        mapDiv = document.getElementById("map") ;
        mapDiv.style.width = "70%" ;

        for (const i of hallwayArray.keys()) {
          hallwayArray.get(i).centerMarker.setVisible(true) ; 
        }
        if (currentHallway != -1) {
          hallwayArray.get(currentHallway).centerMarker.setVisible(true) ; 
        }

        for (const i of placeMap.keys()) {
          placeMap.get(i).placeMarker.setDraggable(true) ; 
        }

        cancelPlaceSearch() ; 
        
    
      }

      function startPlaceSearch() {
        alert("Click anywhere on the map to indicate your current location") ;
        document.getElementById("viewCancelButton").style.display = "none" ;

        map.setOptions({draggableCursor: 'pointer'});

        mapListenerTag = google.maps.event.addListener(map, 'click', function(event) {
        
        viewStartPosition = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()) ;

        if (locatePoint(viewStartPosition) == false) {
          alert("Start is not in building") ;
          cancelPlaceSearch() ; 
          return ; 
        }

        viewStartMarker = new google.maps.Marker({
          map: map, 
          position: viewStartPosition
        }) ;

          map.setOptions({draggableCursor: 'default'}) ; 
          createDefaultPlaceSuggestions() ;
          document.getElementById("viewSearchInput").style.display = "block" ; 
          document.getElementById("startSearchButton").style.display = "none" ; 
          document.getElementById("viewCancelButton").style.display = "block" ; 

          google.maps.event.removeListener(mapListenerTag) ;
        }) ; 
       


      }

      function completePlaceSearch(place) {
        viewEndPosition = placeMap.get(place).position ; 
        if (route != null) {
          route.setMap(null) ;
        } 
        pathway = dijkstrasAlgorithm(viewStartPosition, viewEndPosition) ;

        if (pathway != null) {
          route = new google.maps.Polyline({
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
        } 

      }

      function cancelPlaceSearch() {
        document.getElementById("viewSearchInput").style.display = "none" ; 
        document.getElementById("startSearchButton").style.display = "block" ; 
        document.getElementById("viewCancelButton").style.display = "none" ;
        google.maps.event.removeListener(mapListenerTag) ;


        if (route != null) { 
          route.setMap(null) ; 
        }
        pathway = null ; 
        if (viewStartMarker != null) { 
          viewStartMarker.setMap(null) ;
        }
        viewEndPosition = null ; 
        map.setOptions({draggableCursor: 'default'}) ; 
        placeSuggestions = document.getElementById("viewPlaceSuggestions") ; 

        while(placeSuggestions.firstChild) placeSuggestions.removeChild(placeSuggestions.firstChild);





      }

      function handleViewSearchChange() {
        
        viewInput = document.getElementById("viewSearchInput").value.toLowerCase().trim() ;
        console.log("viewInput: " + viewInput) ;
        var placeSuggestions = document.getElementById("viewPlaceSuggestions") ;

        while(placeSuggestions.firstChild) placeSuggestions.removeChild(placeSuggestions.firstChild);

       if (viewInput != "") { 
        for (const i of placeMap.keys()) {
            createSearchDiv(i) ;
        }
      } else {
        createDefaultPlaceSuggestions() ;
      }


      }

      function createSearchDiv(place) {
          var keyWordsTag = "";
          var result ;  
          var placeTemp = placeMap.get(place) ; 
          
          var keyWordStack = [] ;
          var highestScore = -1, keyWordsFound = 0 ; 
          var newNode ; 
          var subInKeyWords = false ; 

            for (keyWord of placeTemp.words) {
                result = findSubstring(keyWord, viewInput) ;

                if (result[0] > -1 && keyWordsFound < 3) {
                    subInKeyWords = true ; 
                    keyWordStack.push(result) ;
                    keyWordsFound++ ; 
                }
            }

        for (i = 0; i < keyWordStack.length; i++) {
            keyWordsTag += keyWordStack[i][1] + "," ; 

        }

        var keyWordSection = document.createElement("h2") ; 
        keyWordSection.innerHTML = keyWordsTag ; 

        result = findSubstring(placeTemp.name, viewInput) ;

        if (result[0] > -1 || subInKeyWords) {
            newNode = document.createElement("li") ; 

            if (result[0] > -1) {
                nameSection = document.createElement("h1") ; 
                nameSection.innerHTML = result[1] ; 
                newNode.append(nameSection) ; 
            } else {
                nameSection = document.createElement("h1") ; 
                nameSection.innerHTML = placeTemp.name ; 
                newNode.append(nameSection) ;
            }

            if (subInKeyWords) {
                keyWordSection = document.createElement("h2") ; 
                keyWordSection.innerHTML = keyWordsTag ; 
                newNode.append(keyWordSection) ;
            }

            newNode.onclick = function() {
              completePlaceSearch(place) ; 
            }


            document.getElementById("viewPlaceSuggestions").appendChild(newNode) ;


        }
      }

      function findSubstring(word, subs) {
        temp = word.toLowerCase().trim().indexOf(subs) ;
        var nameTag ; 

        if (temp > -1 && subs != "") {
           // console.log("here")
            substringFound = true ;

            chunk1 = word.substring(0, temp) ; 
            chunk2 = "<mark>" + word.substring(temp, temp + subs.length) + "</mark>" ;
            chunk3 = word.substring(temp + subs.length, word.length) ;
            
            nameTag = chunk1 + chunk2 + chunk3 ; 


            return [subs.length, nameTag] ; 

        } else {
            return [-1] ; 
        }
      }

      function createDefaultPlaceSuggestions() {
        console.log("In place suggestions") ;
        var newNode ; 
        var nameSection ; 
        var keywordsSection, keywordString = "" ; 
        var placeTemp ; 

        for (const i of placeMap.keys()) {
          placeTemp = placeMap.get(i) ; 
          newNode = document.createElement("li") ; 

          nameSection = document.createElement("h1") ; 
          nameSection.innerHTML = placeTemp.name ; 
          newNode.append(nameSection) ;

          for (x = 0; x < 3 && x < placeTemp.words.length; x++) {
            keywordString += placeTemp.words[x] + ", "; 
          }

          keywordsSection = document.createElement("h2") ; 
          keywordsSection.innerHTML = keywordString ;
          keywordString = "" ;  

          newNode.append(keywordsSection) ; 

          document.getElementById("viewPlaceSuggestions").appendChild(newNode) ; 

          newNode.onclick = function() {
            completePlaceSearch(i) ; 
          }


        }

      }

    