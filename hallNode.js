function HallNode(position, connections, index, hall = -1) {

    this.position = position ; 
    this.connections = connections ; 
    this.index = index ; 
    this.hall = hall ; 

}

HallNode.prototype.addConnection = function(node) {
    this.connections.push(node) ;
}

