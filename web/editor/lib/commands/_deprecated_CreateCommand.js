/**
 * Object that is used to undo actions when figures/connectors are created
 * @this {CreateCommand} 
 * @constructor
 * @param property {Null}
 * @param previousValue {Number} the figure/connector ID to delete
 * @param currentValue {Array} [createFigureFunction,Event]
 * @deprecated
 */
function CreateCommand(objectId, typeOfObject, property, previousValue, currentValue){
    this.objectId = objectId;
    this.typeOfObject = typeOfObject;
    this.property = property;
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.oType = "Create Action";
}

CreateCommand.prototype = {
    /**This method got called every time the Command must execute*/
    redo : function(){
        this._doAction(this.currentValue);
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        this._doAction(this.previousValue);
    },
    
    _doAction:function(value){
        if(this.typeOfObject == History.OBJECT_FIGURE){
            if(value instanceof Array){//we are redoing
                createFigureFunction = value[0];
                state = STATE_FIGURE_CREATE;
                value[1].noAddUndo = true;
                onMouseDown(value[1]);
                STACK.figureGetById(selectedFigureId).figureId = this.objectId;
                STACK.figureGetById(selectedFigureId).id = this.objectId;
                selectedFigureId = this.objectId;
            }
            else {
                STACK.figureRemoveById(value);
                selectedFigureId = -1;
                state = STATE_NONE;
            }
        }
        else if(this.typeOfObject == History.OBJECT_CONNECTOR){
            if(value instanceof Array){//we are redoing
                state = STATE_CONNECTOR_PICK_FIRST;
                connectorType = this.property;
                value[0].noAddUndo = true;
                onMouseDown(value[0]);
                var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
                state = STATE_CONNECTOR_PICK_SECOND;
                value[1].noAddUndo = true;
                onMouseUp(value[1]);
                con.id = this.objectId;
                var conPoints = CONNECTOR_MANAGER.connectionPointGetAllByParent(selectedConnectorId);
                for(var i = 0; i < conPoints.length; i++){
                    conPoints[i].parentId = this.objectId;
                }
                for(var i = 0; i < History.COMMANDS.length; i++){
                    if(History.COMMANDS[i].typeOfObject == History.OBJECT_CONNECTION_POINT){
                        if(History.COMMANDS[i].property.equals(con.turningPoints[0])){
                            var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(this.objectId);
                            History.COMMANDS[i].objectId = cps[0].id;
                        }
                        else if(History.COMMANDS[i].property.equals(con.turningPoints[con.turningPoints.length - 1])){
                            var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(this.objectId);
                            History.COMMANDS[i].objectId = cps[cps.length - 1].id;
                        }
                    }
                }
                con.id = this.objectId;
                selectedConnectorId = this.objectId;
                state = STATE_CONNECTOR_SELECTED;
            }
            else
            {
                //CONNECTOR_MANAGER.connectionPointRemoveAllByParent(this.objectId)
                CONNECTOR_MANAGER.connectorRemoveById(this.objectId, true);
                selectedConnectorId = -1;
                state = STATE_NONE;
            }
        }
    }
}