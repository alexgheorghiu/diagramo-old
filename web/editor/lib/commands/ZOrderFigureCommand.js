/**
 * Object that is used to undo actions when figures are moved from front to back
 * @this {ZOrderFigureCommand} 
 * @constructor
 * @param figureId {Number} - {Figure}'s id
 * @param newPosition {Number} index
 */
function ZOrderFigureCommand(figureId, newPosition){
    this.figureId = figureId;
    this.oType = "ZOrderFigureCommand";
    
    this.oldPosition = stack.idToIndex[figureId];
    this.newPosition = newPosition;
}

ZOrderFigureCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.oldPosition + 1 == this.newPosition || this.oldPosition - 1 == this.newPosition){
            stack.swapToPosition(this.figureId, this.newPosition);
        }
        else{
            stack.setPosition(this.figureId, this.newPosition);
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        if(this.newPosition + 1 == this.oldPosition || this.newPosition - 1 == this.oldPosition){
            stack.swapToPosition(this.figureId, this.oldPosition);
        }
        else{
            stack.setPosition(this.figureId, this.oldPosition);
        }
    }
    
}


