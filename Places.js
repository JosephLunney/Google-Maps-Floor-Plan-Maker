function Place(name, position, words, index, map) {
    this.name = name ; 
    this.words = words ;
    this.wordDivs = [] ; 
    
    this.position = position ; 
    this.index = index ; 
    this.map = map ; 

    this.node = -1; 
    this.hallway = false ; 

    this.placeMarker = new google.maps.Marker({
        position: this.position,
        map: map,
        title: 'Change Position',
        draggable: true 
      });

      



}

Place.prototype.setwords = function(newWords) {
    this.words = newWords ; 
}

Place.prototype.addWord = function(newWord) {
    this.words.push(newWord) ;
}

Place.prototype.setPosition = function(position) {
    this.position = position ; 
    this.placeMarker.setPosition(position) ; 
}

function Lift(type, position, bottomFloor, topFloor) {
    this.type = type ; 
    this.position = position ; 
    this.bottomFloor = bottomFloor ; 
    this.topFloor = topFloor ; 
}