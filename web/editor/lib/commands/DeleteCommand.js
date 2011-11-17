/**
 * Object that is used to undo actions when figures/groups/connectors are deleted
 * @this {DeleteCommand} 
 * @constructor
 * @param property {Null}
 * @param previousValue {Figure}/{Connector}/{Group} the item being deleted
 * @param currentValue {Event} the event that caused the delete
 */
function DeleteCommand(objectId, typeOfObject, property, previousValue, currentValue){
    this.objectId = objectId;
    this.typeOfObject = typeOfObject;
    this.property = property;
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.oType = "Delete Action";
}

DeleteCommand.prototype = {
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
            if(stack.figureGetById(this.objectId)){//we are re-deleting
                selectedFigureId = this.objectId;
                state = STATE_FIGURE_SELECTED;
                value.noAddUndo = true;
                value.KEY = KEY.DELETE;
                onKeyDown(value);
                selectedFigureId = -1;
            }
            else{
                stack.figureAdd(this.previousValue);
                selectedFigureId = this.previousValue.figureId;
            }
        }
        else if(this.typeOfObject == History.OBJECT_CONNECTOR){
            if(value instanceof Connector){//we are undoing
                state = STATE_CONNECTOR_PICK_FIRST;
                connectorType = this.property;

                //create the connector
                connectorPickFirst(value.turningPoints[0].x,value.turningPoints[0].y,null);
                var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
                con.type = value.type;
                state = STATE_CONNECTOR_PICK_SECOND;
                connectorPickSecond(value.turningPoints[value.turningPoints.length - 1].x,value.turningPoints[value.turningPoints.length - 1].y,null);

                con.id = this.objectId;
                var conPoints = CONNECTOR_MANAGER.connectionPointGetAllByParent(selectedConnectorId);

                //re-id the connection points
                for(var i = 0; i < conPoints.length; i++){
                    conPoints[i].parentId = this.objectId;
                }

                //
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
                state = STATE_CONNECTOR_SELECTED;
                selectedConnectorId = this.objectId;
            }
            else
            {
                CONNECTOR_MANAGER.connectionPointRemoveAllByParent(this.objectId)
                CONNECTOR_MANAGER.connectorRemoveById(this.objectId, true);
                selectedConnectorId = -1;
                state = STATE_NONE;
            }
        }
        else if(this.typeOfObject == History.OBJECT_GROUP){
            if(value instanceof Array){
                state = STATE_GROUP_SELECTED;
                var figureIds = [];
                for(var i = 0; i < value.length; i++){
                    stack.figureAdd(value[i]);
                    figureIds.push(value[i].id);
                }
                this.objectId = stack.groupCreate(figureIds);
                stack.groupGetById(this.objectId).permanent = this.currentValue;
                selectedGroupId = this.objectId;
                state = STATE_GROUP_SELECTED;
            }
            else{
                var figures = stack.figureGetByGroupId(this.objectId);
                stack.groupDestroy(this.objectId);
                for(var i = 0; i < figures.length; i++){
                    stack.figureRemoveById(figures[i].id);
                }
                selectedGroupId = -1;
                state = STATE_NONE;
            }
        }
    }
}

