/**
 * Object that is used to undo actions when figures are grouped or ungrouped
 * @this {GroupFiguresCommand} 
 * @constructor
 * @param groupId {Numeric} - the id of the group
 */
function GroupFiguresCommand(groupId){
    this.groupId = groupId;
    this.oType = "GroupFiguresCommand";            
}

GroupFiguresCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        stack.groupGetById(this.groupId).permanent = true; //transform this group into a permanent one
        state = STATE_GROUP_SELECTED;
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        stack.groupDestroy(this.groupId);
        state = STATE_NONE;
    }
}

