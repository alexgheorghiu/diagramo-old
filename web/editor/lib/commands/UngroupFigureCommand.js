/**
 * Object that is used to undo actions when figures are grouped or ungrouped
 * @this {UngroupFiguresCommand} 
 * @constructor
 * @param groupId {Numeric} - the id of the group
 */
function UngroupFiguresCommand(groupId){
    this.groupId = groupId;
    this.oType = "UngroupFiguresCommand";            
}

UngroupFiguresCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        //TODO: implement it
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
       //TODO: implement it
    }
}

