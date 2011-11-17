/**
 * Object that is used to undo actions when a jagged connector changes its path
 * @this {ConnectorHandleCommand} 
 * @constructor 
 * @param property {Null}
 * @param previousValue {Array} of turning points
 * @param currentValue {Array} of turning points
 */
function ConnectorHandleCommand(objectId, typeOfObject, property, previousValue, currentValue){
    this.objectId = objectId;
    this.typeOfObject = typeOfObject;
    this.property = property;
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.oType = "Connector Handle Action";
}

ConnectorHandleCommand.prototype = {
    /**This method got called every time the Command must execute*/
    redo : function(){
        this._doAction(this.currentValue);
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        this._doAction(this.previousValue);
    },
    
    _doAction:function(value){
        CONNECTOR_MANAGER.connectorGetById(this.objectId).turningPoints = value;
    }
}
