/** 
 * Created once the Connector changed one of the edges ( {ConnectionPoint} )
 * 
 * @this {ConnectorMovePointCommand} 
 * @constructor
 * @author Alex <alex@scriptoid.com>
 */
function ConnectorMovePointCommand(connectorId){
    this.oType = 'ConnectorMovePointCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    
    this.firstExecute = true;
    
    this.connectorId = connectorId;
    
    var con = CONNECTION_MANAGER.connectorGetById(this.connectorId);
    
    
    
    //-------------------store previous state-------------------------------
    
    //turning points
    this.turningPoints = Point.cloneArray(con.turningPoints);
    
    //connection points
    
    
    //glues
    
    
}


ConnectorMovePointCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        throw "Not implemented";
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){ 
        throw "Not implemented";
    }
}