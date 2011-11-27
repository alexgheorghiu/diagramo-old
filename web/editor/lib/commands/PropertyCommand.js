/**
 * Object that is used to undo actions when the property editor is used
 * @this {PropertyCommand} 
 * @constructor
 * @param objectId {Numeric} -  the id of the object
 * @param typeOfObject {Numberic} -  the type of the object as number (ex: History.OBJECT_FIGURE)
 * @param property {String} - property name that is being edited on the figure
 * @param previousValue {Object} - the value to set the property to
 * @param currentValue {Object} - the value to set the property to
 */
function PropertyCommand(objectId, typeOfObject, property, previousValue, currentValue){
    this.objectId = objectId;
    this.typeOfObject = typeOfObject;
    this.property = property;
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.oType = "Property Action";
}

PropertyCommand.prototype = {
    /**This method got called every time the Command must execute*/
    redo : function(){
        this._doAction(this.currentValue);
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        this._doAction(this.previousValue);
    },
    
    _doAction:function(value){
        var shape = null;
        switch(this.typeOfObject){
            case History.OBJECT_FIGURE:
                shape = STACK.figureGetById(this.objectId);
                break;
            case History.OBJECT_CONNECTOR:
                shape = CONNECTOR_MANAGER.connectorGetById(this.objectId);
                break;
            case History.OBJECT_GROUP:
                shape = STACK.groupGetById(this.objectId);
                break;
        }
        
        
        var propertyObject = shape;
        var propertyAccessors = this.property.split(".");
        for(var i = 0; i<propertyAccessors.length-1; i++){
            propertyObject = propertyObject[propertyAccessors[i]];
        }
        
        if(propertyObject[propertyAccessors[propertyAccessors.length -1]] === undefined){
            //if something is complicated enough to need a function, likelyhood is it will need access to its parent figure
            propertyObject["set"+propertyAccessors[propertyAccessors.length -1]](shape,value);
        }
        else{
            propertyObject[propertyAccessors[propertyAccessors.length -1]] = value;
        }            
        
        setUpEditPanel(shape);
    }
}


