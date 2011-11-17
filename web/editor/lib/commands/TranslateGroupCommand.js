/* 
 * This is triggered when a figure was moved
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function TranslateGroupCommand(groupId, x, y){
    this.oType = 'TranslateGroupCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.groupId = groupId;
    this.x = x;
    this.y = y;    
    
    //compute the translation matrix
    this.matrix = generateMoveMatrix(stack.groupGetById(this.groupId), this.x,this. y);
        
    //compute the reverse matrix
    this.reverseMatrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
    ];
    this.reverseMatrix[0][2] = -this.matrix[0][2];
    this.reverseMatrix[1][2] = -this.matrix[1][2];
        
}


TranslateGroupCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        var group = stack.groupGetById(this.groupId);                
        group.transform(this.matrix);        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        var group = stack.groupGetById(this.groupId);
        group.transform(this.reverseMatrix);
    }
}


