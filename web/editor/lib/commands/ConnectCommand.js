/**
 * Object that is used to undo actions when a figure is connected to a connector
 * @this {ConnectCommand} 
 * @constructor
 * 
 * @param objectId {Object} the object/number to identify the object upon the connect will act.
 * In this case is an array for the composite key of a glue [id1, id2] 
 * @param typeOfObject {Number} - the type of Command, usually History.OBJECT_GLUE. For more see History.OBJECT_etc.
 * @param property {String} - the property that changed
 * @param previousValue {Object} - previous object value
 * @param currentValue {Object} - current object value
 * @author Zack Newsham zack_newsham@yahoo.co.uk
 * @author Alex <alex@scriptoid.com>
 */
function ConnectCommand(objectId, typeOfObject, property, previousValue, currentValue){
    this.objectId = objectId;
    this.typeOfObject = typeOfObject;
    this.property = property;
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.oType = "Connect Action";
}

ConnectCommand.prototype = {
    
    /**This method should be called every time an Undo is requested.
     * Redo means to recreate the Glue
     **/
    undo : function(){
        //delete the glue
        CONNECTOR_MANAGER.glueRemoveByIds(this.objectId[0], this.objectId[1]);
        
        //remove previous create :p
        History.CURRENT_POINTER--;
        History.undo();
        
        //move back up as the Hostory.undo() will decrease pointer again
        History.CURRENT_POINTER++;
    },    
    
    
    /**This method got called every time the Redo is requested.
     *Undo for Connecting means that we need to delete the glue
     **/
    redo : function(){
        //try to recreate the glue
        var glues = CONNECTOR_MANAGER.glueGetAllByIds(this.objectId[0], this.objectId[1]);
        
        if(glues.length == 0){ //avoid recreating it if already exists :p
            CONNECTOR_MANAGER.glueCreate(this.objectId[0], this.objectId[1]);        
        }
    }
    
}

