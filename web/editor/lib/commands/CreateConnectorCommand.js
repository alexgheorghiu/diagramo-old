/** 
 * An 'interface' for undoable actions, implemented by classes that specify 
 * how to handle action
 * 
 * 
 * @this {CreateConnectorCommand} 
 * @constructor
 * @author Alex <alex@scriptoid.com>
 */
function CreateConnectorCommand(connectorId){
    this.oType = 'CreateConnectorCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    
    this.connectorId = connectorId;
}


CreateConnectorCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){ 
        
    }
}