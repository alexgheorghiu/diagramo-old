/**
 * An facade to add Commands, undo and redo them.
 * It keeps a stack of commands and can tigger undo actions in the system.
 * @this {History} 
 * @constructor
 * @author Zack Newsham zack_newsham@yahoo.co.uk
 * @author Alex <alex@scriptoid.com>
 */
function History(){
}

/**Object is a figure*/
History.OBJECT_FIGURE = 0; 

/**Object is a connector*/
History.OBJECT_CONNECTOR = 1;

/**Object is a connection point*/
History.OBJECT_CONNECTION_POINT = 2;

/**Object is a generic object*/
History.OBJECT_STATIC = 3;

/**Object is a group
 *@deprecated
 **/
History.OBJECT_GROUP = 4;

/**Object is a glue*/
History.OBJECT_GLUE = 5;

/**Where the {Array} or commands is stored*/
History.COMMANDS = [];

/**The current command inde within the vector of undoable objects. At that position there will be a Command*/
History.CURRENT_POINTER = -1;



/* Add an action to the stack of undoable actions.
 * We position at current pointer, remove everything after it and then add the new
 * action
 * @param {Command} command -  the command History must store
 */
History.addUndo = function(command){
    if(doUndo){
        /**As we are now positioned on CURRENT_POINTER(where current Command is stored) we will
         *delete anything after it, add new Command and increase CURRENT_POINTER
         **/
        
        //remove commands after current command 
        History.COMMANDS.splice(History.CURRENT_POINTER +1, History.COMMANDS.length);
         
        //add new command 
        History.COMMANDS.push(command);
        
        //increase the current pointer
        History.CURRENT_POINTER++;
    }
}

/**Undo current command
 *TODO: nice to compress/merge some actions like many Translate in a row
 **/
History.undo = function(){
    if(History.CURRENT_POINTER >= 0){
        Log.info('undo()->Type of action: ' + History.COMMANDS[History.CURRENT_POINTER].oType);
        History.COMMANDS[History.CURRENT_POINTER].undo();
                        
        History.CURRENT_POINTER --;
    }
}

/**Redo a command
 *TODO: nice to compress/merge some actions like many Translate in a row
 **/
History.redo = function(){
    if(History.CURRENT_POINTER + 1 < History.COMMANDS.length){
        Log.info('redo()->Type of action: ' + History.COMMANDS[History.CURRENT_POINTER+1].oType);
        History.COMMANDS[History.CURRENT_POINTER + 1].execute();
                       
        History.CURRENT_POINTER++;
    }
}

/**Pack identical commands into a single, equivalend command.
 *It will pack only consecutive and same type commands (until a TurningPointCommand is founded)
 **/
History.pack = function(){
    //TODO: implement
}


