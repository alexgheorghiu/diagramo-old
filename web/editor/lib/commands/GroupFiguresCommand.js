/**
 * It will group a set of figures
 * @this {GroupFiguresCommand} 
 * @constructor
 * @param groupId {Numeric} - the id of the group
 */
function GroupFiguresCommand(groupId){
    this.groupId = groupId;
    
    /**Figures ids that belong to this group*/
    this.figuresIds = stack.figureGetIdsByGroupId(groupId);
    
    this.firstExecute = true;
    
    this.oType = "GroupFiguresCommand";            
}

GroupFiguresCommand.prototype = {
    
    /**This method got called every time the Command must execute.
     *The problem is that is a big difference between first execute and a "redo" execute
     **/
    execute : function(){
        
        if(this.firstExecute){ //first execute
            stack.groupGetById(this.groupId).permanent = true; //transform this group into a permanent one
            state = STATE_GROUP_SELECTED;
            
            this.firstExecute = false;
        } 
        else{ //a redo (group was previously destroyed)
            this.groupId = stack.groupCreate(this.figuresIds);            
            var group = stack.groupGetById(this.groupId);
            group.permanent = true;
            
            state = STATE_GROUP_SELECTED;
            selectedGroupId = this.groupId;
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        stack.groupDestroy(this.groupId);
        selectedGroupId = -1;
        state = STATE_NONE;
    }
}

