/* 
 * This is triggered when a figure was moved
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function TranslateFigureCommand(figureId, x, y){
    this.oType = 'TranslateFigureCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.figureId = figureId;
    this.x = x;
    this.y = y;    
    
    //compute the translation matrix
    this.matrix = generateMoveMatrix(stack.figureGetById(figureId), this.x,this. y);
        
    //compute the reverse matrix
    this.reverseMatrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
    ];
    this.reverseMatrix[0][2] = -this.matrix[0][2];
    this.reverseMatrix[1][2] = -this.matrix[1][2];
        
}


TranslateFigureCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        var fig = stack.figureGetById(this.figureId);                
        fig.transform(this.matrix);        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        var fig = stack.figureGetById(this.figureId);
        fig.transform(this.reverseMatrix);
    }
}


