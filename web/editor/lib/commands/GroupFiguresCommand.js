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
            
            this.firstExecute = false;
        } 
        else{ //a redo (group was previously destroyed)
            //create group
            var g = new Group();
            g.id = this.groupId; //copy old Id
            g.permanent = true;

            //add figures to group
            for(var i=0; i < this.figuresIds.length; i++){
                var f = stack.figureGetById(this.figuresIds[i]);
                f.groupId = g.id;
            }
            
            var bounds = g.getBounds();
            g.rotationCoords.push(new Point(bounds[0]+(bounds[2]-bounds[0])/2, bounds[1] + (bounds[3] - bounds[1]) / 2));
            g.rotationCoords.push(new Point(bounds[0]+(bounds[2]-bounds[0])/2, bounds[1]));

            //save group to stack
            stack.groups.push(g);
        }
        
        state = STATE_GROUP_SELECTED;
        selectedGroupId = this.groupId;            
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        stack.groupDestroy(this.groupId);
        
        selectedGroupId = -1;
        state = STATE_NONE;
    }
}

