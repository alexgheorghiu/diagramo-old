/** 
 * This command just clones an existing {Group}. All it needs is an id of
 * cloned {Group}
 * @this {GroupCloneCommand} 
 * @constructor
 * @param {Number} parentGroupId - the Id of parent {Group}
 * @author Alex <alex@scriptoid.com>
 */
function GroupCloneCommand(parentGroupId){
    this.oType = 'GroupCloneCommand';
    
    this.firstExecute = true;
    
    /**This will keep the newly created  Group id*/
    this.groupId = null; 
    
    /**This keeps the cloned figure Id*/
    this.parentGroupId = parentGroupId;    
}


GroupCloneCommand.prototype = {
    
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
        //TODO: destroy and delete group?
        state = STATE_NONE;
    }
}