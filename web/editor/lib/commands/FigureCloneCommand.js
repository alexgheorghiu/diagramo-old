/** 
 * This command just clones an existing {Figure}. All it needs is an id of
 * cloned {Figure}
 * @this {FigureCloneCommand} 
 * @constructor
 * @param {Number} parentFigureId - the Id of parent {Figure}
 * @author Alex <alex@scriptoid.com>
 */
function FigureCloneCommand(parentFigureId){
    this.oType = 'FigureCloneCommand';
    
    this.firstExecute = true;
    
    /**This will keep the newly created  Figure id*/
    this.figureId = null; 
    
    /**This keeps the cloned figure Id*/
    this.parentFigureId = parentFigureId;    
}


FigureCloneCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.firstExecute){
            //add code
        
            this.firstExecute = false;
        }
        else{ //redo
            throw "Not implemented";
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){ 
        STACK.figureRemoveById(this.figureId);
        state = STATE_NONE;
    }
}