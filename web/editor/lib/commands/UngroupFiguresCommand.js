/**
 * Object that is used to undo actions when figures are grouped or ungrouped
 * @this {UngroupFiguresCommand} 
 * @constructor
 * @param groupId {Numeric} - the id of the group
 */
function UngroupFiguresCommand(groupId){
    this.groupId = groupId;
    
    this.figuresIds = stack.figureGetIdsByGroupId(groupId);
    
    this.firstExecute = true;
    this.oType = "UngroupFiguresCommand";            
}

UngroupFiguresCommand.prototype = {
    
    /**Split group apart*/
    execute : function(){
        stack.groupDestroy(this.groupId);
        
        selectedGroupId = -1;
        state = STATE_NONE;
    },
    
    
    /**Group figures back*/
    undo : function(){
        
        //recreate create group
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
        
        state = STATE_GROUP_SELECTED;
        selectedGroupId = this.groupId;       
    }
}

