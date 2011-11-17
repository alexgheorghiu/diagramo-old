/**
 * Used to undo actions when the canvas is resized
 * @this {CanvasResizeCommand} 
 * @constructor
 */
function CanvasResizeCommand(objectId, typeOfObject, property, previousValue, currentValue){
    this.objectId = objectId;
    this.typeOfObject = typeOfObject;
    this.property = property;
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.oType = "Canvas Resize Action";
}

CanvasResizeCommand.prototype = {
    /**This method got called every time the Command must execute*/
    redo : function(){
        this._doAction(this.currentValue);
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        this._doAction(this.previousValue);
    },
    
    
    /**This method is a hidden one.
     *The methods engine should call are only execute() and undo()
     **/
    _doAction:function(value){
        Log.info("Property name is: " + this.property + " previous value: " + this.previousValue + " current value: " + this.currentValue);
        if(this.property == 'Width'){
            canvasProps.setWidth(value);
        }

        if(this.property == 'Height'){
            canvasProps.setHeight(value);
        }

        canvasProps.sync();
        setUpEditPanel(canvasProps);
    }    

}


