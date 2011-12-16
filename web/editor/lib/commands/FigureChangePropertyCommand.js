/**
 * Object that is used to undo actions when the property editor is used
 * @this {FigureChangePropertyCommand} 
 * @constructor
 * @param figureId {Numeric} -  the id of the object
 * @param property {String} - property name that is being edited on the figure
 * @param previousValue {Object} - the value to set the property to
 * @param currentValue {Object} - the value to set the property to
 * @author Alex
 */
function FigureChangePropertyCommand(figureId, property, previousValue, currentValue){
    this.figureId = figureId;
    this.property = property;
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.oType = "FigureChangePropertyCommand";
}

FigureChangePropertyCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        this._doAction(this.currentValue);
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        this._doAction(this.previousValue);
    },
    
    _doAction:function(value){
        var shape = STACK.figureGetById(this.figureId);

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


