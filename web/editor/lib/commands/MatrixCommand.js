/**
 * Object that is used to undo actions when anything is moved, rotated or resized
 * @this {MatrixCommand} 
 * @constructor
 * @param property {Number}  History.MATRIX
 * @param previousValue {Matrix} the matrix to revert to
 * @param currentValue {Matrix} the matrix we now have
 * @deprecated
 */
function MatrixCommand(objectId, typeOfObject, property, previousValue, currentValue){
    this.objectId = objectId;
    this.typeOfObject = typeOfObject;
    this.property = property;
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.oType = "Matrix Action";
}

MatrixCommand.prototype = {
        /**This method got called every time the Command must execute*/
    redo : function(){
        this._doAction(this.currentValue);
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        this._doAction(this.previousValue);
    },
    
    _doAction:function(value){
        var figure;
        if(this.typeOfObject == History.OBJECT_FIGURE){
            figure = stack.figureGetById(this.objectId);
        }
        else if(this.typeOfObject == History.OBJECT_GROUP){
            figure = stack.groupGetById(this.objectId);
        }
        else if(this.typeOfObject == History.OBJECT_CONNECTION_POINT){
            figure = CONNECTOR_MANAGER.connectionPointGetById(this.objectId);
            var con = CONNECTOR_MANAGER.connectorGetById(figure.parentId);
            if(con.turningPoints[0].equals(this.property)){
                con.turningPoints[0] = this.property;
            }
            if(con.turningPoints[con.turningPoints.length - 1].equals(this.property)){
                con.turningPoints[con.turningPoints.length - 1] = this.property;
            }
            if(this.property != null && this.previousValue == value){//only for undoing
                CONNECTOR_MANAGER.glueCreate(this.property[0], this.property[1]);
            }
            else if(this.property != null && this.currentValue == value){//only for redoing
                CONNECTOR_MANAGER.glueRemoveByIds(this.property[0], this.property[1]);
            }
        }
        
        for(var i = 0; i < value.length; i++){
            if(this.property instanceof Point){
                this.property.transform(value[i]);
            }
            figure.transform(value[i]);
        }
                
        if(this.typeOfObject == History.OBJECT_CONNECTION_POINT){
            //var connector = CONNECTOR_MANAGER.connectorGetByConnectionPointId(this.objectId);
            //if(connector != null && connector.type == Connector.TYPE_JAGGED){
            CONNECTOR_MANAGER.connectorAdjustByConnectionPoint(this.objectId, value[0][0][2], value[0][1][2])
        //}
        }
    //figure.transform(Matrix.translationMatrix(value[0]-figure.getBounds()[0],value[1]-figure.getBounds()[1]));
    }
}

