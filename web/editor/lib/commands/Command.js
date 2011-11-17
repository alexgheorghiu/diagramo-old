/** 
 * An 'interface' for undoable actions, implemented by classes that specify 
 * how to handle action
 * 
 * QUESTION: Should we have something like no undoable actions (ex: delete a group)
 * @this {Command} 
 * @constructor
 * @author Alex <alex@scriptoid.com>
 */
function Command(objectId, typeOfObject, property, previousValue, currentValue){
    this.oType = 'RotateFigureCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    /*........*/
}


Command.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
    }
}