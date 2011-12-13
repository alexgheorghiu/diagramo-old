/**This is the main JavaScript module.
 *We move it here so it will not clutter the index.php with a lot of JavaScript
 *
 *ALL VARIABLES DEFINED HERE WILL BE VISIBLE IN ALL OTHER MODULES AND INSIDE INDEX.PHP
 *SO TAKE CARE!
 **/

var debugSolutions = null; 

/**Set it on true if you want visual debug clues.
 * Note: See to set the Connector's visualDebug (Connector.visualDebug) to false too
 **/
var visualDebug = true; 

/**Activate or deactivate the undo feature
 *@deprecated
 ***/
var doUndo = true; 

/**Usually an instance of a Command (see /lib/commands/*.js)*/
var currentMoveUndo = null; 

var CONNECTOR_MANAGER = new ConnectorManager();
var GRIDWIDTH = 20;
var fillColor=null;
var strokeColor='#000000';
var currentText=null;
var FIGURE_ESCAPE_DISTANCE = 30; /**the distance by which the connectors will escape Figure's bounds*/

/*It will store a reference to the function that will create a figure( ex: figureForKids:buildFigure3()) will be stored into this
 *variable so upon click on canvas this function will create the object*/
var createFigureFunction = null;

/**A variable that will tell us if we are in IE*/
var IE = false;

/**A variable that tells us if CTRL is pressed*/
var CNTRL_PRESSED = false;

/**A variable that tells us if SHIFT is pressed*/
var SHIFT_PRESSED = false;

/**Current connector. It is null if no connector selected
 * @deprecated
 * TODO: we should base ONLY on selectedConnectorId
 **/
var connector = null;


/**Connector type
 * TODO: this should not be present here but retrieved from Connector object
 **/
var connectorType = '';

document.onselectstart = stopselection;



/**Supposelly stop any selection from happening
 *@deprecated
 *TODO: as with IE9 we have proper DOM event support....maybe we should use that
 *and get rid of window.event
 **/
function stopselection(ev){
    if(!ev){
        ev = window.event;
    }
    //If we are selecting text within anything with the className text, we allow it
    //This gives us the option of using textareas, inputs and any other item we
    //want to allow text selection in.
    if((IE && ev.srcElement.className == "text")  /*IE code*/
        || (!IE && ev.target.className == "text") /*Non IE code*/){
        return true;
    }
    return false;

}
var STACK  = new Stack();


/**keeps track if the MLB is pressed*/    
var mousePressed = false; 

/**the default application state*/
var STATE_NONE = 'none'; 

/**we have figure to be created**/
var STATE_FIGURE_CREATE = 'figure_create'; 

/**we selected a figure (for further editing for example)*/
var STATE_FIGURE_SELECTED = 'figure_selected'; 

/**we are selecting the start of a connector*/
var STATE_CONNECTOR_PICK_FIRST = 'connector_pick_first'; 

/**we are selecting the end of a connector*/
var STATE_CONNECTOR_PICK_SECOND = 'connector_pick_second'; 

/**we selected a connector (for further editing for example)*/
var STATE_CONNECTOR_SELECTED = 'connector_selected';

/**move a connection point of a connector*/
var STATE_CONNECTOR_MOVE_POINT = 'connector_move_point';

/**we are dragging the mouse over a group of figures.*/
var STATE_SELECTING_MULTIPLE = 'selecting_multiple';

/**we have a group selected (either temporary or permanent)*/
var STATE_GROUP_SELECTED = 'group_selected';

/**Keeps current state*/
var state = STATE_NONE;

/**The (current) selection area*/
var selectionArea = new Polygon(); 
selectionArea.points.push(new Point(0,0));
selectionArea.points.push(new Point(0,0));
selectionArea.points.push(new Point(0,0));
selectionArea.points.push(new Point(0,0));
    selectionArea.style.strokeStyle = 'grey';
    selectionArea.style.lineWidth = '1';

/**Toggle grid visible or not*/
var gridVisible = false;

/**Makes figure snap to grid*/
var snapTo = false;

/**Keeps last coodinates while dragging*/
var lastClick = [];

/**Default line width*/
var defaultLineWidth = 2;

/**Current selected figure id ( -1 if none selected)*/
var selectedFigureId = -1;

/**Current selected group (-1 if none selected)*/
var selectedGroupId = -1;

/**Current selecte connector (-1 if none selected)*/
var selectedConnectorId = -1;

/**Currently selected ConnectionPoint (if -1 none is selected)*/
var selectedConnectionPointId = -1;

/**Set on true while we drag*/
var dragging = false;

/**Holds a wrapper around canvas object*/
var canvasProps = null; //



/**Return current canvas.
 * Current canvas will ALWAYS have the 'a' as DOM id
 * @author Alex Gheorghiu <alex@scriptoid.com>
 **/
function getCanvas(){
    var canvas = document.getElementById("a");
    return canvas;
}


/**Return the 2D context of current canvas
 * @author Alex Gheorghiu <alex@scriptoid.com>
 **/
function getContext(){
    var canvas = getCanvas();
    if(canvas.getContext){
        return canvas.getContext("2d");
    }
    else{
        alert('You need a HTML5 web browser. Any Safari,Firefox, Chrome or Explorer supports this.');
    }
}

/**Keeps current figure set id*/
var currentSetId = 'basic';

/**
 * Reveals the figure set named by 'name' and hide previously displayed set
 * @param {String} id - the (div) id value of the set
 * @author Alex
 **/
function setFigureSet(id){
    Log.info("main.js id = " + id);
    
    //alert(name);
    var div = document.getElementById(id);
    if(div != null){
        if(currentSetId != null){
            Log.info("main.js currentSetId = " + currentSetId);
            var currentFigureSet = document.getElementById(currentSetId);
            currentFigureSet.style.display = 'none';
        }
        div.style.display = 'block';
        currentSetId = id;
    }
}


/**Update an object (Figure or Connector)
 *@param {Number} figureId - the id of the updating object
 *@param {String} property - (or an {Array} of {String}s). The 'id' under which the property is stored
 *TODO: is there any case where we are using property as an array ?
 *@param {String} newValue - the new value of the property
 *@author Zack, Alex
 **/
function updateFigure(figureId, property, newValue){
    //Log.group("main.js-->updateFigure");
    //Log.info("updateFigure() figureId: " + figureId + " property: " + property + ' new value: ' + newValue);
    
    /*Try to guess the object type*/
    var objType = null;
    var obj = STACK.figureGetById(figureId); //try to find it inside {Figure}s
    
    if(obj){ //try to find it inside {Connector}s
        objType = History.OBJECT_FIGURE;        
    }
    else{ //no in Figures
        obj = CONNECTOR_MANAGER.connectorGetById(figureId); //search in Connectors
        //Log.info("updateFigure(): it's a connector 1");
        
        if(obj){ //see if it's a Canvas
            objType = History.OBJECT_CONNECTOR;            
        }
        else{ //no in connectors
            if(figureId == "canvasProps"){
                obj = canvasProps;
            //Log.info("updateFigure(): it's the canvas");
            }
        }
    }

    

    var objSave = obj; //keep a reference to initial shape

    /*Example of property 'primitives.1.str' */
    var props = property.split(".");
    //Log.info("Splitted props: " + props);


    /*Going down the object's hierarchy down to the property's parent
     *Example:
     *  for props = ['primitives','1','str'] 
     *  figure
     *      |_primitives
     *          |_1 (it's a Text)
     *             |_str
     */
    //Log.info("Object before descend: " +  obj.oType);
    var figure = obj; //TODO: Why this variable when we already have objSave?
    for(var i = 0; i<props.length-1; i++){
        obj = obj[props[i]];
    }

    //the property name
    var propName = props[props.length -1];
    //Log.info("updateFigure(): last property: " + propName);
    //Log.info("updateFigure(): last object in hierarchy: " + obj.oType);


    /*Now we are located at Figure level or somewhere in a primitive or another object.
     *Here we will search for setXXX (where XXX is the property name) method first and if we find one we will use it
     *if not we will simply update the property directly.
     **/
    
    /**Compute setXXX and getXXX*/
    var propSet = "set" + Util.capitaliseFirstLetter(propName);
    var propGet = "get" + Util.capitaliseFirstLetter(propName);
    
    if(propSet in obj){ //@see https://developer.mozilla.org/en/JavaScript/Reference/Operators/Special_Operators/in_Operator
        /*If something is complicated enough to need a function,
         *  likelyhood is it will need access to its parent figure.
         *So we will let the parent to do the update as it likes, if it has
         * a method of form set<property_name> in place
         */
        
        if(newValue != obj[propGet]()){ //update ONLY if new value differ from the old one
            //Log.info('updateFigure() : penultimate propSet: ' +  propSet);
            if(doUndo && obj[propGet]() != newValue){
                var undo = new PropertyCommand(figureId, objType, property, obj[propGet](), newValue)
                History.addUndo(undo);
            }
            //Log.info('updateFigure() : call setXXX on object: ' +  propSet + " new value: " + newValue);
            //            obj[propSet](figure,newValue);
            obj[propSet](newValue);
        }
    }
    else{
        if(obj[propName] != newValue){ //try to change it ONLY if new value is different than the last one
            if(doUndo && obj[propName] != newValue){
                var undo = new PropertyCommand(figureId, objType, property, obj[propName], newValue)
                History.addUndo(undo);
            }
            obj[propName] = newValue;
        }
    }

    //connector's text special case
    if(objSave instanceof Connector && propName == 'str'){
        //Log.info("updateFigure(): it's a connector 2");
        objSave.updateMiddleText();
    }
    
    //Log.groupEnd();

    draw();
}


/**Setup the editor panel for a special shape. 
 *@param shape - can be either Connector or Figure. If null is provided the
 *editor panel will be disabled
 **/
function setUpEditPanel(shape){
    //var propertiesPanel = canvas.edit; //access the edit div
    var propertiesPanel = document.getElementById("edit");
    propertiesPanel.innerHTML = "";
    if(shape == null){
    //do nothing
    }
    else{
        switch(shape.oType){
            case 'Group':
                //do nothing. We do not want to offer this to groups
                break;
            case 'CanvasProps':
                Builder.constructCanvasPropertiesPanel(propertiesPanel, shape);
                break;
            default:
                Builder.contructPropertiesPanel(propertiesPanel, shape);
        }
    }
}


/**Setup the creation function (that -later, upon calling - will create the actual {Figure}
 * Note: It will also set the current state to STATE_FIGURE_CREATE
 * @param  {Function} fFunction - the function used to create the figure
 **/
function createFigure(fFunction){
    //alert("createFigure() - You ask me to create a figure? How dare you?");
    createFigureFunction = fFunction;

    selectedFigureId = -1;
    selectedConnectorId = -1;
    selectedConnectionPointId = -1;
    state = STATE_FIGURE_CREATE;
    draw();

}

/**Activate snapToGrip  option*/
function snapToGrid(){
    if(gridVisible == false && snapTo == false){
        showGrid();
    }
    snapTo =! snapTo;
    document.getElementById("snapCheckbox").checked=snapTo;
}


/**Makes grid visible or invisible, depedinding of previous value*/
function showGrid(){
    var canvas = getCanvas();
    gridVisible = !gridVisible;

    if(gridVisible){
        canvas.style.backgroundImage="url(assets/images/gridTile1.png)";
    }
    else {
        canvas.style.backgroundImage="";
        document.getElementById("snapCheckbox").checked = false;
    }
    document.getElementById("gridCheckbox").checked = gridVisible;
}


/**Click is disabled because we need to handle mouse down and mouse up....etc etc etc*/
function onClick(ev){
    var coords = getCanvasXY(ev);
    var x = coords[0];
    var y = coords[1];

//here is the problem....how do we know we clicked on canvas
/*var fig=STACK.figures[STACK.figureGetMouseOver(x,y,null)];
    if(CNTRL_PRESSED && fig!=null){
        TEMPORARY_GROUP.addPrimitive();
        STACK.figureRemove(fig);
        STACK.figureAdd(TEMPORARY_GROUP);
    }
    else if(STACK.figureGetMouseOver(x,y,null)!=null){
        TEMPORARY_GROUP.primitives=[];
        TEMPORARY_GROUP.addPrimitive(fig);
        STACK.figureRemove(fig);
    }*/
//draw();
}


/**Receives the ASCII character code but not the keyboard code
 *@param {Event} ev - the event generated when kay is pressed
 *@see <a href="http://www.quirksmode.org/js/keys.html">http://www.quirksmode.org/js/keys.html</a>
 **/
function onKeyPress(ev){
    if(!ev){ //get event for IE
        ev = window.event;
    }

    //ignore texts
    if((IE && ev.srcElement.className == "text") //IE code. In IE the ev has srcElement member
        || (!IE && ev.target.className == "text")/*non IE code. In normal JS the ev has the target member*/){
        return;
    }

    switch(ev.charCode){
        case KEY.NUMPAD4: //Numpad 4
            if(CNTRL_PRESSED && STACK.figureGetSelected()){ //clone a figure
                /*TODO: right now the newly created figure belongs to the Group with Id = -1 (supposelly no group)
                 *So this might not be a good ideea
                 **/

                /*Creates a clone of currently selected figure and
                 * move it a little right (10 pixels) and down (10 pixels)
                 * */
                var createdFigure = STACK.figureGetSelected().clone();
                STACK.figureAdd(createdFigure);
                STACK.figureSelect(STACK.figures.length-1);
                createdFigure.transform(Matrix.translationMatrix(10,10));
                getCanvas().style.cursor="default";
            }
            break;
    }//end switch


    draw();
    return false;
}


/**
 *Receives the key code of keyboard but not the ASCII
 *Treats the key pressed event
 *@param {Event} ev - the event generated when key is down
 *@see <a href="http://www.quirksmode.org/js/keys.html">http://www.quirksmode.org/js/keys.html</a>
 **/
function onKeyDown(ev){
    
    Log.info("main.js->onKeyDown()->function call. Event = " + ev.type + " IE = " + IE );
    
    //1 - OLD IE browsers
    if(typeof ev == 'undefined' || ev == null){
        ev = window.event;
    }
    
    //2 - avoid text elements (if you are on a text area and you press the arrow you do not want the figures to move on canvas)
    if((IE && ev.srcElement.className == "text")  /*IE code*/
        || (!IE && ev.target.className == "text") /*Non IE code*/){
        return true;
    }
    
    
    //3 - "enhance" event TODO: I'm not sure this is really necessary
    ev.KEY = ev.keyCode;
        
    
    Log.info("e.keyCode = " + ev.keyCode + " ev.KEY = " + ev.KEY);
    
    
    switch(ev.KEY){
        case KEY.ESCAPE: //Esc
            //alert('So do you want to escape me');
            //cancel any figure creation
            createFigureFunction = null;

            if(selectedFigureId != -1 || selectedConnectionPointId != -1 || selectedConnectorId!=-1){
                redraw = true;
            }
            
            //deselect any figure
            selectedFigureId = -1;
            selectedConnectionPointId = -1;
            selectedConnectorId = -1;

            
            state = STATE_NONE;
            break;

        case KEY.DELETE: //Delete
            //delete any Figure or Group
            //            alert('Delete pressed' + this);
            switch(state){

                case STATE_FIGURE_SELECTED: //delete a figure ONLY when the figure is selected
                    if(selectedFigureId != -1){
                        var cmdDelFig = new DeleteFigureCommand(selectedFigureId);
                        cmdDelFig.execute();
                        History.addUndo(cmdDelFig);
                    }                    
                    break;
                    
                case STATE_GROUP_SELECTED:
                    if(selectedGroupId != -1){
                        var cmdDelGrp = new DeleteGroupCommand(selectedGroupId);
                        cmdDelGrp.execute();
                        History.addUndo(cmdDelGrp);
                    }

                    break;    

                case STATE_CONNECTOR_SELECTED:
                    Log.group("Delete connector");
                    if(selectedConnectorId != -1){
                        var cmdDelCon = new DeleteConnectorCommand(selectedConnectorId);
                        cmdDelCon.execute();
                        History.addUndo(cmdDelCon);                                                
                    }
                    Log.groupEnd();
                    break;                                    
            }
            break;

        case KEY.SHIFT: //Shift
            SHIFT_PRESSED = true;
            break;

        case KEY.CTRL: //Ctrl
        case KEY.COMMAND:
        case KEY.COMMAND_FIREFOX:
            CNTRL_PRESSED = true;
            break;

        case KEY.LEFT://Arrow Left
            action("left");
            return false;
            break;

        case KEY.UP://Arrow Up
//            alert('up');
            action("up");
            return false;
            break;

        case KEY.RIGHT://Arrow Right
            action("right");
            return false;
            break;

        case KEY.DOWN://Arrow Down
            action("down");
            return false;
            break;

        case KEY.Z:
            if(CNTRL_PRESSED){
                action('undo');
            }
            break;

//        case KEY.Y:
//            if(CNTRL_PRESSED){
//                action('redo');
//            }
//            break;
            
        case KEY.G:
            if(CNTRL_PRESSED){
                action('group');
            }
            break;

        case KEY.U:
            if(CNTRL_PRESSED){
                action('ungroup');
            }
            break;

        case KEY.S:
            if(CNTRL_PRESSED){
                //Log.info("CTRL-S pressed  ");
                save();
            }
            break;
    }
    draw();
    return false;
}


/**
 *Treats the key up event
 *@param {Event} ev - the event generated when key is up
 **/
function onKeyUp(ev){
    if(!ev){ //IE special code
        ev = window.event;
    }
    switch(ev.keyCode){
        case KEY.SHIFT: //Shift
            SHIFT_PRESSED = false;
            break;

        case KEY.ALT: //Alt
            CNTRL_PRESSED = false;
            break;

        case KEY.CTRL: //Ctrl
            CNTRL_PRESSED = false;
            break;
    }
    return false;
}


/**
 *Treats the mouse down event
 *@param {Event} ev - the event generated when button is pressed
 **/
function onMouseDown(ev){
    var coords = getCanvasXY(ev);
    var HTMLCanvas = getCanvas();
    var x = coords[0];
    var y = coords[1];
    lastClick = [x,y];
    //alert('lastClick: ' + lastClick + ' state: ' + state);

    mousePressed = true;
    //alert("onMouseDown() + state " + state + " none state is " + STATE_NONE);
    
    switch(state){
        case STATE_NONE:
            //alert("onMouseDown() - STATE_NONE");
            snapMonitor = [0,0];
            
            
            /*Description:
             * We are in None state when no action was done....yet.  Here is what can happen:
             * - if we clicked a Connector than that Connector should be selected  (Connectors are more important than Figures :p)
             * - if we clicked a Figure:
             *      - does current figure belong to a group? If yes, select that group
             * - if we did not clicked anything....
             *      - we will stay in STATE_NONE
             *      - allow to edit canvas
             *      
             */
            
            //find Connector at (x,y)
            var cId = CONNECTOR_MANAGER.connectorGetByXY(x, y);
            if(cId != -1){ //Clicked a Connector
                selectedConnectorId = cId;
                state = STATE_CONNECTOR_SELECTED;
                var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
                setUpEditPanel(con);
                Log.info('onMouseDown() + STATE_NONE  - change to STATE_CONNECTOR_SELECTED');
                redraw = true;
            } else {                   
                //find figure at (x,y)
                var fId = STACK.figureGetByXY(x, y);
                if(fId != -1){ //Selected a figure
                    if(STACK.figureGetById(fId).groupId != -1){ //if the figure belongs to a group then select that group
                        selectedGroupId = STACK.figureGetById(fId).groupId;
                        var grp = STACK.groupGetById(selectedGroupId);
                        state = STATE_GROUP_SELECTED;
//                        if(doUndo){
//                            currentMoveUndo = new MatrixCommand(selectedGroupId, History.OBJECT_GROUP, History.MATRIX, Matrix.translationMatrix(grp.getBounds()[0],grp.getBounds()[1]), null);
//                        }
                        Log.info('onMouseDown() + STATE_NONE + group selected  =>  change to STATE_GROUP_SELECTED');
                    }
                    else{ //ok, we will select lonely figure
                        selectedFigureId = fId;
                        var f = STACK.figureGetById(fId);
                        setUpEditPanel(f);
                        state = STATE_FIGURE_SELECTED;
//                        if(doUndo){
//                            currentMoveUndo = new MatrixCommand(fId, History.OBJECT_FIGURE, History.MATRIX, Matrix.translationMatrix(f.getBounds()[0],f.getBounds()[1]), null);
//                        }
                        Log.info('onMouseDown() + STATE_NONE + lonely figure => change to STATE_FIGURE_SELECTED');
                    }
                    
                    redraw = true;
                }
                else{
                    //DO NOTHING aka "Dolce far niente"
                    //                    state = STATE_NONE;
                    //                    setUpEditPanel(canvasProps);
                    //                    Log.info('onMouseDown() + STATE_NONE  - no change');
                }
            }
            
            break;


        case STATE_FIGURE_CREATE:
            snapMonitor = [0,0];
            
            //treat new figure
            //do we need to create a figure on the canvas?
            if(createFigureFunction){
                Log.info("onMouseDown() + STATE_FIGURE_CREATE--> new state STATE_FIGURE_SELECTED");
                
                var cmdCreateFig = new CreateFigureCommand(createFigureFunction, x, y);
                cmdCreateFig.execute();
                History.addUndo(cmdCreateFig);
                
                HTMLCanvas.style.cursor = 'default';

                selectedConnectorId = -1;
                createFigureFunction = null;

                mousePressed = false;
                redraw = true;
            }
            break;


        case STATE_FIGURE_SELECTED:
            snapMonitor = [0,0];
            
            /*Description:
             * If we have a figure selected and we do click here is what can happen:
             * - if we clicked a handle of current selected shape (it should be Figure) then just select that Handle
             * - if we clicked a Connector than that Connector should be selected  (Connectors are more important than Figures :p)
             * - if we clicked a Figure:
             *      - did we click same figure? 
             *          - does current figure belong to a group? If yes, select that group
             *      - did we clicked another figure?
             *          - does this new figure belong to a group? If, yes, select that group
             * - if we click no nothing -> State none         
             *      
             */
            
            //CONNECTOR
            if(HandleManager.handleGet(x, y) != null){ //Clicked a handler (of a Figure or Connector)
                Log.info("onMouseDown() + STATE_FIGURE_SELECTED - handle selected");       
                /*Nothing important (??) should happen here. We just clicked the handler of the figure*/
                HandleManager.handleSelectXY(x, y);
            }
            else{ //We did not clicked a handler

                var cId = CONNECTOR_MANAGER.connectorGetByXY(x, y);

                if(cId != -1){ //Ok, we have a connector
                    state = STATE_CONNECTOR_SELECTED;
                    selectedConnectorId = cId;
                    var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
                    HandleManager.shapeSet(con);                                        
                    setUpEditPanel(con);
                    Log.info('onMouseDown() + STATE_FIGURE_SELECTED  - change to STATE_CONNECTOR_SELECTED');
                    redraw = true;
                }
                else{ //No connector
                    
                    //find the figure from (x,y)
                    var fId = STACK.figureGetByXY(x, y);

                    if(fId == -1){ //Clicked outside of anything
                        selectedFigureId = -1;
                        state = STATE_NONE;
                        
                        setUpEditPanel(canvasProps);
                        redraw = true;
                        Log.info('onMouseDown() + STATE_FIGURE_SELECTED  - change to STATE_NONE');
                    }
                    else{ //We are sure we clicked a figure
                        
                        if(fId == selectedFigureId){ //Clicked the same figure
                        //DO NOTHING
                        }
                        else{ //Clicked a different figure
                            var f = STACK.figureGetById(fId);
                            if(f.groupId != -1){ // belongs to a group, so select it
                                
                                selectedFigureId = -1;
                                selectedGroupId = f.groupId;
                                state = STATE_GROUP_SELECTED;
                                setUpEditPanel(null);
                                redraw = true;                                
                                Log.info('onMouseDown() + STATE_FIGURE_SELECTED + group figure => change to STATE_GROUP_SELECTED');                                                                
                            }
                            else{ //single figure
                                selectedFigureId = fId;
                                HandleManager.clear();
                                var f = STACK.figureGetById(fId);
                                setUpEditPanel(f);
                                redraw = true;
                                Log.info('onMouseDown() + STATE_FIGURE_SELECTED + single figure => change to STATE_FIGURE_SELECTED (different figure)');
                            }
                            
                            
                        }
                    }
                }

            }                
            
            break;

        case STATE_GROUP_SELECTED:
            /*Description:
             * If we have a selected group and we pressed the mouse this can happen:
             * - if we clicked a handle of current selected shape (asset: it should be Group) then just select that Handle
             * - if we clicked a Connector than that Connector should be selected  (Connectors are more important than Figures 
             *      or Groups :p) :
             *      - deselect current group
             *      - if current group is temporary (destroy it)
             * - if we clicked a Figure:
             *      - deselect current group
             *      - the figure is from same group? (do nothing)
             *      - the figure is from different group? (select that group)
             *          - if current group is temporary (destroy it)
             *      - the figure does not belong to any group? 
             *           - select that figure
             *           - if current group is temporary (destroy it)
             * - if we clicked on empty space
             *      - if group was temporary, destroy it
             *      - if group was permanent ...just deselect it (state none)  
             */
            
            //GROUPS
            
            //if selected group is temporary and we pressed outside of it's border we will destroy it
            var selectedGroup = STACK.groupGetById(selectedGroupId);
            
            if( HandleManager.handleGet(x,y) != null){ //handle ?
                HandleManager.handleSelectXY(x, y);
                redraw = true;
                Log.info('onMouseDown() + STATE_GROUP_SELECTED  + handle selected => STATE_GROUP_SELECTED');                
            }
            else if(CONNECTOR_MANAGER.connectorGetByXY(x, y) != -1){ //connector?
                //destroy current group (if temporary)
                if(!selectedGroup.permanent){
                    STACK.groupDestroy(selectedGroupId);
                }
                
                //deselect current group
                selectedGroupId = -1;
                
                selectedConnectorId = CONNECTOR_MANAGER.connectorGetByXY(x, y);
                state = STATE_CONNECTOR_SELECTED;
                redraw = true;
                Log.info('onMouseDown() + STATE_GROUP_SELECTED  + handle selected => STATE_CONNECTOR_SELECTED');
            }
            else if(STACK.figureGetByXY(x, y) != -1){
                var fId = STACK.figureGetByXY(x, y);
                var fig = STACK.figureGetById(fId);
                
                if(fig.groupId == -1){ //lonely figure
                    //destroy current group (if temporary)
                    if(!selectedGroup.permanent){
                        STACK.groupDestroy(selectedGroupId);
                    }
                    
                    //deselect current group
                    selectedGroupId = -1;
                    
                    
                    state = STATE_FIGURE_SELECTED;
                    selectedFigureId = fId;
                    Log.info('onMouseDown() + STATE_GROUP_SELECTED  + lonely figure => STATE_FIGURE_SELECTED');
                    
                    setUpEditPanel(fig);
                    redraw = true;
                }
                else{ //group figure
                    if(fig.groupId != selectedGroupId){
                        //destroy current group (if temporary)
                        if(!selectedGroup.permanent){
                            STACK.groupDestroy(selectedGroupId);
                        }
                        
                        
                        selectedGroupId = fig.groupId;
                                                
                        redraw = true;
                        Log.info('onMouseDown() + STATE_GROUP_SELECTED  + (different) group figure => STATE_GROUP_SELECTED');
                    }
                    else{ //figure from same group
                        //do nothing
                    }
                }
            } 
            else{ //mouse down on empty space
                if(!selectedGroup.permanent){
                    STACK.groupDestroy(selectedGroupId);                    
                }
                
                selectedGroupId = -1;
                state = STATE_NONE;
                redraw = true;
                Log.info('onMouseDown() + STATE_GROUP_SELECTED  + mouse on empty => STATE_NONE');
            }
            
            break;

        
        case STATE_CONNECTOR_PICK_FIRST:
            //moved so it can be called from undo action
            connectorPickFirst(x,y,ev);
            break;

        case STATE_CONNECTOR_PICK_SECOND:
            state  = STATE_NONE;
            break;


        case STATE_CONNECTOR_SELECTED:
            /*
             *Description:
             *If we have a connector selected and we press mouse here is what is happening:
             *- mouse down over a connection point?
             *      - select connection point 
             *      - set state to STATE_CONNECTOR_MOVE_POINT 
             *      (and wait mouse move to alter and mouse up to finish the modification)
             *      - store original state of the connector (to be able to create the undo command later)
             *- mouse down over a handler?
             *      - select handle
             *      
             * TODO: implement it
             **/
            var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(selectedConnectorId);
            var start = cps[0];
            var end = cps[1];
            if(start.point.near(x, y, 3)){
                var g = CONNECTOR_MANAGER.glueGetBySecondConnectionPointId(start.id);
                
                Log.info("Picked the start point");
                selectedConnectionPointId = start.id;
                if(g.length != 0 && doUndo == true){//CONNECTOR_MANAGER.connectorGetById(selectedConnectorId).turningPoints[0]
                    currentMoveUndo = new MatrixCommand(selectedConnectionPointId, History.OBJECT_CONNECTION_POINT , [g[0].id1,g[0].id2], Matrix.translationMatrix(start.point.x,start.point.y),null);
                }
                else if(doUndo == true) {
                    currentMoveUndo = new MatrixCommand(selectedConnectionPointId, History.OBJECT_CONNECTION_POINT , null, Matrix.translationMatrix(start.point.x,start.point.y),null);
                }
                state = STATE_CONNECTOR_MOVE_POINT;
                HTMLCanvas.style.cursor = 'move';
            }
            else if(end.point.near(x, y, 3)){
                var g = CONNECTOR_MANAGER.glueGetBySecondConnectionPointId(end.id);

                Log.info("Picked the end point");
                selectedConnectionPointId = end.id;
                if(g.length != 0 && doUndo == true){//CONNECTOR_MANAGER.connectorGetById(selectedConnectorId).turningPoints[CONNECTOR_MANAGER.connectorGetById(selectedConnectorId).turningPoints.length - 1]
                    currentMoveUndo = new MatrixCommand(selectedConnectionPointId, History.OBJECT_CONNECTION_POINT, [g[0].id1,g[0].id2], Matrix.translationMatrix(end.point.x,end.point.y),null);
                }
                else if(doUndo == true){
                    currentMoveUndo = new MatrixCommand(selectedConnectionPointId, History.OBJECT_CONNECTION_POINT, null, Matrix.translationMatrix(end.point.x,end.point.y),null);
                }
                state = STATE_CONNECTOR_MOVE_POINT;
                HTMLCanvas.style.cursor = 'move';
            }
            else{ //no connection point selection

                var newCId = selectedConnectorId;
                if(HandleManager.handleGet(x,y) == null){//we only get a new connector, if we are not currently
                    //over the current connectors handles
                    newCId = CONNECTOR_MANAGER.connectorGetByXY(x, y); //did we picked another connector?
                }
                if(newCId == -1){
                    Log.info('No other connector selected. Deselect all connectors');
                    selectedConnectorId = -1;
                    state = STATE_NONE;
                    setUpEditPanel(canvasProps);
                    redraw = true;

                //START: Quick Select FIGURE
                //                    var fId = STACK.figureGetByXY(x, y);
                //                    if(fId != -1){ //select figure
                //                        Log.info("onMouseDown() + STATE_CONNECTOR_SELECTED - quick select a figure, new state (STATE_FIGURE_SELECTED)");
                //                        selectedFigureId = fId;
                //                        var f = STACK.figureGetById(fId);
                //                        setUpEditPanel(f);
                //                        mousePressed = false;
                //                        state = STATE_FIGURE_SELECTED;
                //                    }
                //END: Quick Select FIGURE
                }
                else if(newCId == selectedConnectorId){ //did we picked the same connector?
                    //do nothing - it's the same connector
                    Log.info("onMouseDown(): Nothing, it's the same connector");
                } else{
                    Log.info('onMouseDown(): Select another connector');
                    selectedConnectorId = newCId;
                    setUpEditPanel(CONNECTOR_MANAGER.connectorGetById(selectedConnectorId));
                    state = STATE_CONNECTOR_SELECTED;
                    redraw = true;
                }
                if(HandleManager.handleGet(x, y) != null){ //select handle
                    Log.info("onMouseDown() + STATE_FIGURE_SELECTED - handle selected");
                    HandleManager.handleSelectXY(x,y);
                    
                }

            //canvas.style.cursor = 'default';
            //state  = STATE_NONE;
            }

            break;

            
        default:
    //alert("onMouseDown() - switch default - state is " + state);
    }

    draw();

    return false;
}


/**
 *Treats the mouse up event
 *@param {Event} ev - the event generated when key is up
 **/
function onMouseUp(ev){
    var coords = getCanvasXY(ev);
    x = coords[0];
    y = coords[1];

    lastClick = [];
    mousePressed = true;
    
    switch(state){

        case STATE_NONE:
            /*Description:
             * TODO: Nothing should happen here
             */
            
            if(HandleManager.handleGetSelected()){
                HandleManager.clear();
            }
            break;

        case STATE_FIGURE_SELECTED:
            /*Description:
             * This means that we have a figure selected and just released the mouse:
             * - if we were altering (rotate/resize) the Figure that will stop (Handler will be deselected)
             * - if we were moving the figure .... that will stop (but figure remains selected)
             */
            
            mousePressed = false;
            HandleManager.handleSelectedIndex = -1; //reset only the handler....the Figure is still selected
                       
            break;


        case STATE_GROUP_SELECTED:
            Log.info('onMouseUp() + STATE_GROUP_SELECTED ...');
            
            mousePressed = false;
            HandleManager.handleSelectedIndex = -1; //reset only the handler....the Group is still selected
            
            break;

        case STATE_SELECTING_MULTIPLE:
            /*Description
             *From figures select only those that do not belong to any group
             **/
            Log.info('onMouseUp() + STATE_SELECTING_MULTIPLE => STATE_NONE');
            Log.info('onMouseUp() selection area: ' + selectionArea);
            state = STATE_NONE;
            var figuresToAdd = [];
            for(var i = 0; i < STACK.figures.length; i++){
                if(STACK.figures[i].groupId == -1){ //we only want ungrouped items
                    var points = STACK.figures[i].getPoints();
                    if(points.length == 0){ //if no  point at least to add bounds TODO: lame 'catch all' condition
                        points.push( new Point(STACK.figures[i].getBounds()[0], STACK.figures[i].getBounds()[1]) ); //top left
                        points.push( new Point(STACK.figures[i].getBounds()[2], STACK.figures[i].getBounds()[3]) ); //bottom right
                        points.push( new Point(STACK.figures[i].getBounds()[0], STACK.figures[i].getBounds()[3]) ); //bottom left
                        points.push( new Point(STACK.figures[i].getBounds()[2], STACK.figures[i].getBounds()[1]) ); //top right
                    }
                        
                    for(var a = 0; a < points.length; a++){
                        if( Util.isPointInside(points[a], selectionArea.getPoints()) ){
                            figuresToAdd.push(STACK.figures[i].id);
                            break;
                        }
                    }
                } //end if
            } //end for
                
            if(figuresToAdd.length >= 2){ //if we selected at least 2 figures then we can create a group
                selectedGroupId = STACK.groupCreate(figuresToAdd);
                state = STATE_GROUP_SELECTED;
                Log.info('onMouseUp() + STATE_SELECTING_MULTIPLE  + min. 2 figures => STATE_GROUP_SELECTED');
            }
            else if (figuresToAdd.length == 1){ // if we only select one figure, then it is not a group, it's a simple selection
                selectedFigureId = figuresToAdd[0];
                state = STATE_FIGURE_SELECTED;
                Log.info('onMouseUp() + STATE_SELECTING_MULTIPLE  + 1 figure => STATE_FIGURE_SELECTED');
            }
            break;
            
            
        case STATE_CONNECTOR_PICK_SECOND:

            //store undo command
            var cmdCreateCon = new CreateConnectorCommand(selectedConnectorId);
            History.addUndo(cmdCreateCon);
            
            //reset all {ConnectionPoint}s' color
            CONNECTOR_MANAGER.connectionPointsResetColor();
            
            //select the current connector
            state = STATE_CONNECTOR_SELECTED;
            var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
            setUpEditPanel(con);
            redraw = true;
            break;

        

        case STATE_CONNECTOR_MOVE_POINT:
            /**
             *Description:
             *Simply alter the connector until mouse will be released 
             **/
            
            //reset all {ConnectionPoint}s' color
            CONNECTOR_MANAGER.connectionPointsResetColor();
            
            state = STATE_CONNECTOR_SELECTED; //back to selected connector
            selectedConnectionPointId = -1; //but deselect the connection point
            redraw = true;
            break;
            
            
        case STATE_CONNECTOR_SELECTED:
            if(currentMoveUndo){
                var turns = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId).turningPoints;
                var newTurns = [turns.length];
                for(var i = 0; i < turns.length; i ++){
                    newTurns[i] = turns[i].clone();
                }
                currentMoveUndo.currentValue = newTurns;
                History.addUndo(currentMoveUndo);
                state = STATE_NONE;
                selectedConnectorId = -1;
                HandleManager.clear(); //clear current selection
            }
            break;
    }
    currentMoveUndo = null;
    mousePressed = false;
    draw();
}

/**Remembers last move. Initially it's null but once set it's a [x,y] array*/
var lastMove = null;

/**It will accumulate the changes on either X or Y coordinates for snap effect.
 *As we need to escape the "gravity/attraction" of the grid system we need to "accumulate" more changes
 *and if those changes become greater than a certain threshold we will initiate a snap action
 *Zack : "Because of the snap to grid function we need to move more than a certain amount of pixels
 *so we will not be snapped back to the old location"
 *Initially it's [0,0] but once more and more changes got added a snap effect will be triggered
 *and some of it's elements will be reset to 0.
 *So snapMonitor = [sumOfChagesOnX, sumOfChangesOnY]
 **/
var snapMonitor = [0,0];


/**Treats the mouse move event
 *@param {Event} ev - the event generated when key is up
 **/
function onMouseMove(ev){
    //    //resize canvas.
    //    if(lastMousePosition != null){
    //        resize(ev);
    //    }
    var redraw = false;
    var coords = getCanvasXY(ev);
    var x = coords[0];
    var y = coords[1];
    var canvas = getCanvas();

    /*change cursor
     *More here: http://www.javascriptkit.com/dhtmltutors/csscursors.shtml
     */
    Log.debug("onMouseMoveCanvas: test if over a figure: " + x + "," + y);


    switch(state){

        case STATE_NONE:
            
            /*Description:
             * We are in None state when no action was done....yet.  Here is what can happen:
             * - if the mouse is pressed, through onMouseDown(), then it's the begining of a multiple selection
             * - if mouse is not pressed then change the cursor type to:
             *      - "move" if  over a figure or connector
             *      - "default" if over "over a connector "empty" space
             */
            if(mousePressed){
                state = STATE_SELECTING_MULTIPLE;
                selectionArea.points[0] = new Point(x,y);
                selectionArea.points[1] = new Point(x,y);
                selectionArea.points[2] = new Point(x,y);
                selectionArea.points[3] = new Point(x,y);//the selectionArea has no size until we start dragging the mouse
                Log.debug('onMouseMove() - STATE_NONE + mousePressed = STATE_SELECTING_MULTIPLE');
            }
            else{
                if(STACK.figureIsOver(x,y)){ //over a figure
                    canvas.style.cursor = 'move';
                    Log.debug('onMouseMove() - STATE_NONE - mouse cursor = move (over figure)');
                }
                else if(CONNECTOR_MANAGER.connectorGetByXY(x, y) != -1){ //over a connector
                    canvas.style.cursor = 'move';
                    Log.debug('onMouseMove() - STATE_NONE - mouse cursor = move (over connector)');
                }
                else{ //default cursor
                    canvas.style.cursor = 'default';
                    Log.debug('onMouseMove() - STATE_NONE - mouse cursor = default');
                }
            }                                    
            
            break;


        case STATE_SELECTING_MULTIPLE:
            selectionArea.points[1].x = x; //top right

            selectionArea.points[2].x = x; //bottom right
            selectionArea.points[2].y = y;
                
            selectionArea.points[3].y = y;//bottom left
            redraw = true;
            break;

            
        case STATE_FIGURE_CREATE:
            if(createFigureFunction){ //creating a new figure
                canvas.style.cursor = 'crosshair';
            }
            break;



        case STATE_FIGURE_SELECTED:
            
            /*Description:
             * We have a figure selected.  Here is what can happen:
             * - if the mouse is pressed
             *      - if over a Figure's Handler then execute Handler's action
             *      - else (it is over the Figure) then move figure
             * - if mouse is not pressed then change the cursor type to :
             *      - "move" if over a figure or connector
             *      - "handle" if over current figure's handle
             *      - "default" if over "nothing"
             */
            
            if(mousePressed){ // mouse is (at least was) pressed
                if(lastMove != null){ //we are in dragging mode
                    /*We need to use handleGetSelected() as if we are using handleGet(x,y) then 
                     *as we move the mouse....it can move faster/slower than the figure and we 
                     *will lose the Handle selection.
                     **/
                    var handle = HandleManager.handleGetSelected();
                    
                    if(handle != null){ //We are over a Handle of selected Figure               
                        canvas.style.cursor = handle.getCursor();
                        handle.action(lastMove,x,y);
                        redraw = true;
                        Log.info('onMouseMove() - STATE_FIGURE_SELECTED + drag - mouse cursor = ' + canvas.style.cursor);
                    }
                    else{
                        /*move figure only if no handle is selected*/
                        canvas.style.cursor = 'move';
                        var translateMatrix = generateMoveMatrix(STACK.figureGetById(selectedFigureId), x, y);
                        var cmdTranslateFigure = new TranslateFigureCommand(selectedFigureId, translateMatrix);
                        History.addUndo(cmdTranslateFigure);
                        cmdTranslateFigure.execute();
                        redraw = true;
                        Log.info("onMouseMove() + STATE_FIGURE_SELECTED + drag - move selected figure");
                    }
                }
            }
            else{ //no mouse press (only change cursor)
                var handle = HandleManager.handleGet(x,y); //TODO: we should be able to replace it with .getSelectedHandle()
                    
                if(handle != null){ //We are over a Handle of selected Figure               
                    canvas.style.cursor = handle.getCursor();
                    Log.info('onMouseMove() - STATE_FIGURE_SELECTED + over a Handler = change cursor to: ' + canvas.style.cursor);
                }
                else{
                    /*move figure only if no handle is selected*/
                    var tmpFigId = STACK.figureGetByXY(x, y); //pick first figure from (x, y)
                    if(tmpFigId != -1){
                        canvas.style.cursor = 'move';                            
                        Log.info("onMouseMove() + STATE_FIGURE_SELECTED + over a figure = change cursor");
                    }
                    else{
                        canvas.style.cursor = 'default';                            
                        Log.info("onMouseMove() + STATE_FIGURE_SELECTED + over nothin = change cursor to default");
                    }
                }
            }
            
            break;


        case STATE_GROUP_SELECTED:
            //Log.info('onMouseMove() - STATE_GROUP_SELECTED ...');
            /*Description:
             *TODO: implement
             * We have a group selected.  Here is what can happen:
             * - if the mouse is pressed
             *      - if over a Group's Handler then execute Handler's action
             *      - else (it is over one of Group's Figures) then move whole group
             * - if mouse is not pressed then change the cursor type to :
             *      - drag group?
             *      - cursor ? 
             *          - "move" if over a figure or connector or group
             *          - "handle" if over current group's handle
             *          - "default" if over "nothing"
             */
            
            if(mousePressed){
                if(lastMove != null){
                    //Log.debug('onMouseMove() - STATE_GROUP_SELECTED + mouse pressed');
                    /*We need to use handleGetSelected() as if we are using handleGet(x,y) then 
                     *as we move the mouse....it can move faster/slower than the figure and we 
                     *will lose the Handle selection.
                     **/
                    var handle = HandleManager.handleGetSelected();
                    
                    if(handle != null){ //over a handle
                        Log.info('onMouseMove() - STATE_GROUP_SELECTED + mouse pressed  + over a Handle');
                        //HandleManager.handleSelectXY(x, y);
                        canvas.style.cursor = handle.getCursor();
                        handle.action(lastMove, x, y);
                        redraw = true;
                    }
                    else{ //not over any handle -so it must be translating
                        Log.info('onMouseMove() - STATE_GROUP_SELECTED + mouse pressed + NOT over a Handle');
                        canvas.style.cursor = 'move';
                        var mTranslate = generateMoveMatrix(STACK.groupGetById(selectedGroupId), x, y);
                        var cmdTranslateGroup = new TranslateGroupCommand(selectedGroupId, mTranslate);
                        cmdTranslateGroup.execute();
                        History.addUndo(cmdTranslateGroup);
                        redraw = true;
                    }
                }
            }
            else{ //mouse not pressed (only change cursor)
                Log.debug('onMouseMove() - STATE_GROUP_SELECTED + mouse NOT pressed');
                if(HandleManager.handleGet(x,y) != null){
                    canvas.style.cursor = HandleManager.handleGet(x,y).getCursor();
                }
                else if(CONNECTOR_MANAGER.connectorGetByXY(x, y) != -1){
                    //nothing for now
                }
                else if(STACK.figureIsOver(x,y)){
                    canvas.style.cursor = 'move';
                }
                else{
                    canvas.style.cursor = 'default';
                }
            }                       

            break;

            
        case STATE_CONNECTOR_PICK_FIRST:
            //change FCP (figure connection points) color
            var fCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP

            if(fCpId != -1){ //we are over a figure's CP
                var fCp = CONNECTOR_MANAGER.connectionPointGetById(fCpId);
                fCp.color = ConnectionPoint.OVER_COLOR;
                //                canvas.style.cursor = 'crosshair';
                selectedConnectionPointId = fCpId;
            }
            else{ //change back old connection point to normal color
                if(selectedConnectionPointId != -1){
                    var oldCp = CONNECTOR_MANAGER.connectionPointGetById(selectedConnectionPointId);
                    oldCp.color = ConnectionPoint.NORMAL_COLOR;
                    //                    canvas.style.cursor = 'normal';
                    selectedConnectionPointId = -1;
                }
            }
            redraw = true;
            break;


        case STATE_CONNECTOR_PICK_SECOND:
            //moved to allow undo to access it
            connectorPickSecond(x,y,ev);
            redraw = true;
            break;


        case STATE_CONNECTOR_SELECTED:
            /*Description:
             *In case you move the mouse and you have the connector selected:
             *  - if adjusting the endpoints
             *      - alter the shape of connector in real time (gluing and unglued it, etc)
             *      (EXTRA option: do as little changes as possible to existing shape
             *  - if adjusting the handlers
             *      - alter the shape of connector in real time
             **/
            
            //alert('Move but we have a connector');
            //change cursor to move if over a connector's CP
            //var connector = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
            var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(selectedConnectorId);
            var start = cps[0];
            var end = cps[1];
            if(start.point.near(x, y, 3) || end.point.near(x, y, 3)){
                canvas.style.cursor = 'move';
            }
            else if(HandleManager.handleGet(x,y) != null){ //over a handle?. Handles should appear only for selected figures
                canvas.style.cursor = HandleManager.handleGet(x,y).getCursor();
            }
            else{
                canvas.style.cursor = 'default';
            }
            
            /*if we have a handle action*/
            if(mousePressed==true && lastMove != null && HandleManager.handleGetSelected() != null){
                Log.info("onMouseMove() + STATE_CONNECTOR_SELECTED - trigger a handler action");
                var handle = HandleManager.handleGetSelected();
                //alert('Handle action');
                
                /*We need completely new copies of the turningPoints in order to restore them,
                 *this is simpler than keeping track of the handle used, the direction in which the handle edits
                 *and the turningPoints it edits*/
                
                //store old turning points
                var turns = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId).turningPoints;
                var oldTurns = [turns.length];
                for(var i = 0; i < turns.length; i++){
                    oldTurns[i] = turns[i].clone();
                }
                
                
                //DO the handle action
                handle.action(lastMove,x,y);
                
                //store new turning points
                turns = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId).turningPoints;
                var newTurns = [turns.length];
                for(var i = 0; i < turns.length; i++){
                    newTurns[i] = turns[i].clone();
                }
                                
                
                //see if old turning points are the same as the new turning points
                var difference = false;
                for(var k=0;k<newTurns.length; k++){
                    if(! newTurns[k].equals(oldTurns[k])){
                        difference = true;
                    }
                }
                
                //store the Command in History
                if(difference && doUndo){
                    currentMoveUndo = new ConnectorHandleCommand(selectedConnectorId, History.OBJECT_CONNECTOR, null, oldTurns, newTurns);
                    History.addUndo(currentMoveUndo);
                }
                    
                redraw = true;
            }
            break;


        case STATE_CONNECTOR_MOVE_POINT:
            /**
             *Description: 
             *Adjust on real time - WYSIWYG
             *-compute the solution
             *-update connector shape
             *-update glues
             *TODO: add description*/
            Log.info("Easy easy easy....it's fragile");
            if(mousePressed){ //only if we are dragging
                


                /*update connector - but not unglue/glue it (Unglue and glue is handle in onMouseUp)
                 *as we want the glue-unglue to produce only when mouse is released*/   
                connectorMovePoint(selectedConnectionPointId, x, y, ev);
//                if(cps[0].id == selectedConnectionPointId){ //start
//                    //alert('start');
//                    cps[0].point.x = x;
//                    cps[0].point.y = y;
//                    con.turningPoints[0].x = x;
//                    con.turningPoints[0].y = y;
//                } else{ //end
//                    //alert('end');
//                    cps[1].point.x = x;
//                    cps[1].point.y = y;
//                    con.turningPoints[con.turningPoints.length - 1].x = x;
//                    con.turningPoints[con.turningPoints.length - 1].y = y;
//                }
                redraw = true;
            }
            break;
    }


    lastMove = [x, y];
    
    if(redraw){
        draw();
    }
    return false;
}


/**Pick the first connector we can get at (x,y) position
 *@param {Number} x - the x position 
 *@param {Number} y - the y position 
 *@param {Event} ev - the event triggered
 **/
function connectorPickFirst(x, y, ev){
    Log.group("connectorPickFirst");
    //create connector
    var conId = CONNECTOR_MANAGER.connectorCreate(new Point(x, y),new Point(x+10,y+10) /*fake cp*/, connectorType);
    selectedConnectorId = conId;
    var con = CONNECTOR_MANAGER.connectorGetById(conId);
    

    //TRY TO GLUE IT
    //1.get CP of the connector
    var conCps = CONNECTOR_MANAGER.connectionPointGetAllByParent(conId);

    //see if we can snap to a figure
    var fCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP
    if(fCpId != -1){
        var fCp = CONNECTOR_MANAGER.connectionPointGetById(fCpId);

        //update connector' cp
        conCps[0].point.x = fCp.point.x;
        conCps[0].point.y = fCp.point.y;

        //update connector's turning point
        con.turningPoints[0].x = fCp.point.x;
        con.turningPoints[0].y = fCp.point.y;

        var g = CONNECTOR_MANAGER.glueCreate(fCp.id, conCps[0].id);
        Log.info("First glue created : " + g);
        //alert('First glue ' + g);
    }
    state = STATE_CONNECTOR_PICK_SECOND;
    Log.groupEnd();
}


/**Pick the second {ConnectorPoint}  we can get at (x,y) position
 *@param {Number} x - the x position 
 *@param {Number} y - the y position 
 *@param {Event} ev - the event triggered
 **/
function connectorPickSecond(x, y, ev){
    Log.group("main: connectorPickSecond");
    
    //current connector
    var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId) //it should be the last one
    var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(con.id);
    
    //TODO: remove 
    //play with algorithm
    {
        //start point
        var rStartPoint = con.turningPoints[0].clone();
        var rStartFigure = STACK.figureGetAsFirstFigureForConnector(con.id);
        if(rStartFigure){
            Log.info(":) WE HAVE A START FIGURE id = " + rStartFigure.id);
        }
        else{
            Log.info(":( WE DO NOT HAVE A START FIGURE");
        }
        
        //end point
        var rEndPoint = new Point(x, y);
        var rEndFigure = null;
        
        var r_fCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP at (x,y)
        if(r_fCpId != -1){            
            var r_figureConnectionPoint = CONNECTOR_MANAGER.connectionPointGetById(r_fCpId);
            Log.info("End Figure's ConnectionPoint present id = " + r_fCpId);
            
            //As we found the connection point by a vicinity (so not exactly x,y match) we will adjust the end point too
            rEndPoint = r_figureConnectionPoint.point.clone();
            
            rEndFigure = STACK.figureGetById(r_figureConnectionPoint.parentId);
            Log.info(":) WE HAVE AN END FIGURE id = " + rEndFigure.id);
        }
        else{
            Log.info(":( WE DO NOT HAVE AN END FIGURE " );
        }
        
        var rStartBounds = rStartFigure ? rStartFigure.getBounds() : null;
        var rEndBounds = rEndFigure ? rEndFigure.getBounds() : null;
        
        debugSolutions = CONNECTOR_MANAGER.connector2Points(con.type, rStartPoint, rEndPoint, rStartBounds, rEndBounds);
    }
    
    //end remove block

    //COLOR MANAGEMENT FOR {ConnectionPoint} 
    //Find any {ConnectionPoint} from a figure at (x,y). Change FCP (figure connection points) color
    var fCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP

    if(fCpId != -1){
        var fCp = CONNECTOR_MANAGER.connectionPointGetById(fCpId);
        fCp.color = ConnectionPoint.OVER_COLOR;
        cps[1].color = ConnectionPoint.OVER_COLOR;
        selectedConnectionPointId = fCpId;
    }
    else{//change back old connection point to normal color
        if(selectedConnectionPointId != -1){
            var oldCp = CONNECTOR_MANAGER.connectionPointGetById(selectedConnectionPointId);
            oldCp.color = ConnectionPoint.NORMAL_COLOR;
            cps[1].color = ConnectionPoint.NORMAL_COLOR;
            selectedConnectionPointId = -1;
        }
    }

    
    var secConPoint = CONNECTOR_MANAGER.connectionPointGetSecondForConnector(selectedConnectorId);
    //adjust connector
    Log.info("connectorPickSecond() -> Solution: " + debugSolutions[0][2]);
    
    con.turningPoints = Point.cloneArray(debugSolutions[0][2]);
    //CONNECTOR_MANAGER.connectionPointGetFirstForConnector(selectedConnectorId).point = con.turningPoints[0].clone();
    secConPoint.point = con.turningPoints[con.turningPoints.length-1].clone();
        
        
        
    //GLUES MANAGEMENT
    //remove all previous glues to {Connector}'s second {ConnectionPoint}
    CONNECTOR_MANAGER.glueRemoveAllBySecondId(secConPoint.id);
    
    //recreate new glues if available
    var fCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP
    if(fCpId != -1){ //we are over a figure's cp
        var fCp = CONNECTOR_MANAGER.connectionPointGetById(fCpId);        
        var g = CONNECTOR_MANAGER.glueCreate(fCp.id, CONNECTOR_MANAGER.connectionPointGetSecondForConnector(selectedConnectorId).id);
    }
    
    
    Log.groupEnd();
}


/**
 *Alter the {Connector}  in real time
 *@param {Number} connectionPointId - the id of the current dragged {ConnectionPoint} 
 *@param {Number} x - the x position 
 *@param {Number} y - the y position 
 *@param {Event} ev - the event triggered
 **/
function connectorMovePoint(connectionPointId, x, y, ev){
    Log.group("main: connectorMovePoint");


    //current connector
    var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId) 
    var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(con.id);
    
    
    //MANAGE COLOR
    //update cursor if over a figure's cp
    var fCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x,y, ConnectionPoint.TYPE_FIGURE);
    if(fCpId != -1){
        //canvas.style.cursor = 'default';
        if(cps[0].id == selectedConnectionPointId){
            cps[0].color = ConnectionPoint.OVER_COLOR;
        }
        else{
            cps[1].color = ConnectionPoint.OVER_COLOR;
        }
    }
    else{
        //canvas.style.cursor = 'move';
        if(cps[0].id == selectedConnectionPointId){
            cps[0].color = ConnectionPoint.NORMAL_COLOR;
        }
        else{
            cps[1].color = ConnectionPoint.NORMAL_COLOR;
        }
    }
    
    //variables used in finding solution
    var rStartPoint = con.turningPoints[0].clone();
    var rStartFigure = null;
    var rEndPoint = con.turningPoints[con.turningPoints.length-1].clone();
    var rEndFigure = null;
    
    if(cps[0].id == connectionPointId){ //FIRST POINT
        var figCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP at (x,y)
        if(figCpId != -1){            
            var r_figureConnectionPoint = CONNECTOR_MANAGER.connectionPointGetById(figCpId);
                
            //start point and figure
            rStartPoint = r_figureConnectionPoint.point.clone();                
            rStartFigure = STACK.figureGetById(r_figureConnectionPoint.parentId);
        }     
        else{
            rStartPoint = new Point(x, y);
        }
         
        //end figure
        rEndFigure = STACK.figureGetAsSecondFigureForConnector(con.id);


        var rStartBounds = rStartFigure ? rStartFigure.getBounds() : null;
        var rEndBounds = rEndFigure ? rEndFigure.getBounds() : null;

        //solutions
        debugSolutions = CONNECTOR_MANAGER.connector2Points(con.type, rStartPoint, rEndPoint, rStartBounds, rEndBounds);


        //UPDATE CONNECTOR 
        var firstConPoint = CONNECTOR_MANAGER.connectionPointGetFirstForConnector(selectedConnectorId);
        //adjust connector
        Log.info("connectorMovePoint() -> Solution: " + debugSolutions[0][2]);

        con.turningPoints = Point.cloneArray(debugSolutions[0][2]);
        
        firstConPoint.point = con.turningPoints[0].clone();



        //GLUES MANAGEMENT
        //remove all previous glues to {Connector}'s second {ConnectionPoint}
        CONNECTOR_MANAGER.glueRemoveAllBySecondId(firstConPoint.id);

        //recreate new glues if available
        var fCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP
        if(fCpId != -1){ //we are over a figure's cp
            var fCp = CONNECTOR_MANAGER.connectionPointGetById(fCpId);        
            var g = CONNECTOR_MANAGER.glueCreate(fCp.id, firstConPoint.id);
        }            
            
        
    }     
    else if (cps[1].id == connectionPointId){ //SECOND POINT
        var figCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP at (x,y)
        if(figCpId != -1){            
            var r_figureConnectionPoint = CONNECTOR_MANAGER.connectionPointGetById(figCpId);
                
            //start point and figure
            rEndPoint = r_figureConnectionPoint.point.clone();                
            rEndFigure = STACK.figureGetById(r_figureConnectionPoint.parentId);
        }     
        else{
            rEndPoint = new Point(x, y);
        }
         
        //start figure
        rStartFigure = STACK.figureGetAsFirstFigureForConnector(con.id);


        var rStartBounds = rStartFigure ? rStartFigure.getBounds() : null;
        var rEndBounds = rEndFigure ? rEndFigure.getBounds() : null;

        //solutions
        debugSolutions = CONNECTOR_MANAGER.connector2Points(con.type, rStartPoint, rEndPoint, rStartBounds, rEndBounds);


        //UPDATE CONNECTOR 
        var secondConPoint = CONNECTOR_MANAGER.connectionPointGetSecondForConnector(selectedConnectorId);
        
        //adjust connector
        Log.info("connectorMovePoint() -> Solution: " + debugSolutions[0][2]);

        con.turningPoints = Point.cloneArray(debugSolutions[0][2]);
        
        secondConPoint.point = con.turningPoints[con.turningPoints.length - 1].clone();



        //GLUES MANAGEMENT
        //remove all previous glues to {Connector}'s second {ConnectionPoint}
        CONNECTOR_MANAGER.glueRemoveAllBySecondId(secondConPoint.id);

        //recreate new glues if available
        var fCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP
        if(fCpId != -1){ //we are over a figure's cp
            var fCp = CONNECTOR_MANAGER.connectionPointGetById(fCpId);        
            var g = CONNECTOR_MANAGER.glueCreate(fCp.id, secondConPoint.id);
        } 
    } else{
        throw "main:connectorMovePoint() - this should never happen";
    }   
    
    
    Log.groupEnd();
}


/** Creates a moving matrix taking into consideration the snapTo option
 * The strange stuff is that Dia (http://projects.gnome.org/dia/) is using a top/left align
 * but OpenOffice's Draw is using something similar to Diagramo
 * @return {Matrix} - translation matrix
 * @param {Object} fig - could be a figure, or a Connector
 * @param {Number} x - mouse position
 * @param {Number} y - mouse position
 * @author Zack Newsham
 * @author Alex Gheorghiu
 */
function generateMoveMatrix(fig, x,y){
    //    Log.group("generateMoveMatrix");
    var dx = x - lastMove[0];
    var dy = y - lastMove[1];
    //    Log.info("generateMoveMatrix() - delta  " + dx + ',  ' + dy);
    
    var moveMatrix = null;
        
    if(snapTo){ //snap effect
        moveMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
        ];
                    
        //        Log.info("generateMoveMatrix() - old snapMonitor : " + snapMonitor);
        //        Log.info("generateMoveMatrix() - dx : " + dx + " dy: " + dy);
        snapMonitor[0] += dx;
        snapMonitor[1] += dy;
        //        Log.info("generateMoveMatrix() - new snapMonitor : " + snapMonitor);
        //        Log.info("generateMoveMatrix() - figure bounds : " + fig.getBounds());

        //HORIZONTAL
        if(dx > 0){ //dragged to right
            var nextGridX = Math.ceil( (fig.getBounds()[2] + snapMonitor[0]) / GRIDWIDTH ) * GRIDWIDTH;
            if((snapMonitor[0] + fig.getBounds()[2]) % GRIDWIDTH >= GRIDWIDTH/2 ){                
                moveMatrix[0][2] = nextGridX - fig.getBounds()[2];
                //                Log.info("generateMoveMatrix() - drag right, nextGridX: " + nextGridX + " x-adjust: " + (nextGridX - fig.getBounds()[2]) );
                snapMonitor[0] -= nextGridX - fig.getBounds()[2];
            }
        }
        else if(dx < 0){ //dragged to left
            var previousGridX = Math.floor( (fig.getBounds()[0] + snapMonitor[0]) / GRIDWIDTH ) * GRIDWIDTH;

            if( fig.getBounds()[0] + snapMonitor[0] >= previousGridX
                && fig.getBounds()[0] + snapMonitor[0] <= previousGridX + GRIDWIDTH/2
                ){
                moveMatrix[0][2] = -(fig.getBounds()[0] - previousGridX);
                //                Log.info("generateMoveMatrix() - drag left, previousGridX: " + previousGridX + " x-adjust: " + (-(fig.getBounds()[0] - previousGridX)) );
                snapMonitor[0] += fig.getBounds()[0] - previousGridX;
            }
        }

        //VERTICAL
        if(dy > 0){ //dragged to bottom
            var nextGridY = Math.ceil( (fig.getBounds()[3] + snapMonitor[1]) / GRIDWIDTH ) * GRIDWIDTH;
            if( (fig.getBounds()[3] + snapMonitor[1]) % GRIDWIDTH > GRIDWIDTH/2 ){
                //                Log.info("generateMoveMatrix() - drag bottom");
                moveMatrix[1][2] = nextGridY - fig.getBounds()[3];
                snapMonitor[1] -= nextGridY - fig.getBounds()[3];
            }
        }
        else if (dy < 0){ //drag to top
            var previousGridY = Math.floor( (fig.getBounds()[1] + snapMonitor[1]) / GRIDWIDTH ) * GRIDWIDTH;
            if(fig.getBounds()[1] + snapMonitor[1] >= previousGridY
                && fig.getBounds()[1] + snapMonitor[1] <= previousGridY + GRIDWIDTH/2
                ){
                //                Log.info("generateMoveMatrix() - drag top");
                moveMatrix[1][2] = -(fig.getBounds()[1] - previousGridY);
                snapMonitor[1] += fig.getBounds()[1] - previousGridY;
            }
        }

    //        Log.info("generateMoveMatrix() - 'trimmed' snapMonitor : " + snapMonitor);
        
    } else{ //normal move
        moveMatrix = [
        [1, 0, dx],
        [0, 1, dy],
        [0, 0, 1]
        ];
    }

    Log.groupEnd();
    return moveMatrix;
}


/**Computes the bounds of the canvas*/
function getCanvasBounds(){
    var canvasMinX = $("#a").offset().left;
    var canvasMaxX = canvasMinX + $("#a").width();
    var canvasMinY = $("#a").offset().top;
    var canvasMaxY = canvasMinX + $("#a").height();

    return [canvasMinX, canvasMinY, canvasMaxX, canvasMaxY];
}

/**Computes the (x,y) coordinates of an event in page
 *@param {Event} ev - the event
 **/
function getBodyXY(ev){
    return [ev.pageX,ev.pageY];//TODO: add scroll
}


/**
 *Extracts the X and Y from an event (for canvas)
 *@param {Event} ev - the event
 **/
function getCanvasXY(ev){
    var position = [];
    var canvasBounds = getCanvasBounds();
    var tempPageX = null;
    var tempPageY = null;
    
    if(ev.touches){ //iPad 
        if(ev.touches.length > 0){
            tempPageX = ev.touches[0].pageX;
            tempPageY = ev.touches[0].pageY;
        }
    }
    else{ //normal Desktop
        tempPageX = ev.pageX;
        tempPageY = ev.pageY;                
    }
    
    if(tempPageX >= canvasBounds[0] && tempPageX <= canvasBounds[2]
        && tempPageY >= canvasBounds[1] && tempPageY <= canvasBounds[3])
        {
        //alert('Inside canvas');
        position = [tempPageX - $("#a").offset().left, tempPageY - $("#a").offset().top];
    //alert("getXT : " + position);
    }

    return position;
}



/**Cleans up the canvas*/
function reset(){
    var canvas = getCanvas();
    var ctx = getContext();
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.closePath();
    ctx.stroke();
//canvas.width=canvas.width;
}


/**Draws all the stuff on the canvas*/
function draw(){

    var ctx = getContext();

    //    Log.group("A draw started");
    //alert('Paint 1')
    reset();
    //alert('Paint 2')
    STACK.paint(ctx);
    
    minimap.updateMinimap();
//    Log.groupEnd();
//alert('Paint 3')
}




/**
 *Dispatch actions. Detect the action needed and trigger it.
 *@param {String} action - the action name
 **/
function action(action){
    redraw = false;
    switch(action){
        
        case 'undo':
            Log.info("main.js->action()->Undo. Nr of actions in the STACK: " + History.COMMANDS.length);
            History.undo();
            redraw = true;
            break;
            
//        case 'redo':
//            Log.info("main.js->action()->Redo. Nr of actions in the STACK: " + History.COMMANDS.length);
//            History.redo();
//            redraw = true;
//            break;
            
        case 'group':
            /*After we pressed Ctrl-G any temporary group will became permanent*/
            if(selectedGroupId != -1){
                var group = STACK.groupGetById(selectedGroupId);
                if(!group.permanent){ //group only temporary groups
                    var cmdGroup = new GroupFiguresCommand(selectedGroupId);
                    cmdGroup.execute();
                    History.addUndo(cmdGroup);
                    Log.info("main.js->action()->Group. New group made permanent. Group id = " + selectedGroupId);
                }
                else{
                    Log.info("main.js->action()->Group. Group ALREADY permanent.  Group id = " + selectedGroupId);
                }
                
            }
            redraw = true;
            break;
        
        case 'ungroup':
            if(selectedGroupId != -1){
                var group = STACK.groupGetById(selectedGroupId);
                if(group.permanent){ //split only permanent groups
                    var cmdUngroup = new UngroupFiguresCommand(selectedGroupId);
                    cmdUngroup.execute();
                    History.addUndo(cmdUngroup);
                    Log.info("main.js->action()->Ungroup. New group made permanent. Group id = " + selectedGroupId);
                }
                else{
                    Log.info("main.js->action()->Ungroup. Ignore. Group is not permanent.  Group id = " + selectedGroupId);
                }
                
                redraw = true;
            }
            break;
       
        case 'connector-jagged':
            selectedFigureId = -1;
            state  = STATE_CONNECTOR_PICK_FIRST;
            connectorType = Connector.TYPE_JAGGED;
            redraw = true;
            break;

        case 'connector-straight':
            selectedFigureId = -1;            
            state  = STATE_CONNECTOR_PICK_FIRST;
            connectorType = Connector.TYPE_STRAIGHT;
            redraw = true;
            break;
            
        case 'connector-organic':
            selectedFigureId = -1;            
            state  = STATE_CONNECTOR_PICK_FIRST;
            connectorType = Connector.TYPE_ORGANIC;
            redraw = true;
            break;

        case 'rotate90':
        case 'rotate90A':
            if(selectedFigureId){
                //alert("Selected figure index: " + STACK.figureSelectedIndex);
                var figure = STACK.figureGetById(selectedFigureId);
                var bounds = figure.getBounds();
                var dx = bounds[0] + (bounds[2] - bounds[0]) / 2
                var dy = bounds[1] + (bounds[3] - bounds[1]) / 2
                //alert(dx + '  ' + dy);
                //alert("Selected figure is: " + figure);
                var TRANSLATE = [
                [1, 0, dx * -1],
                [0, 1, dy * -1],
                [0, 0, 1]
                ]
                /*
                var dx = bounds[0] + (bounds[3] - bounds[1]) / 2
                var dy = bounds[1] + (bounds[2] - bounds[0]) / 2
                 */
                //TODO: figure out why we have to -1 off the dx, we have to do this regardless of rotation angle
                var TRANSLATEBACK = [
                [1, 0, dx],
                [0, 1, dy],
                [0, 0, 1]
                ]
                figure.transform(TRANSLATE);
                if(action=="rotate90"){
                    figure.transform(R90);
                }
                else{
                    figure.transform(R90A);
                }
                figure.transform(TRANSLATEBACK);

                redraw = true;
            }
            break;

        case 'up': //decrease Y                                   
            switch(state){
                case STATE_FIGURE_SELECTED:
                    var cmdFigUp = new TranslateFigureCommand(selectedFigureId, Matrix.UP);
                    History.addUndo(cmdFigUp);
                    cmdFigUp.execute();
                    redraw = true;
                    break;
                case STATE_GROUP_SELECTED:
                    var cmdGrpUp = new TranslateGroupCommand(selectedGroupId, Matrix.UP);
                    History.addUndo(cmdGrpUp);
                    cmdGrpUp.execute();
                    redraw = true;
                    break;
            }
                        
            break;

        case 'down':
            switch(state){
                case STATE_FIGURE_SELECTED:
                    var cmdFigDown = new TranslateFigureCommand(selectedFigureId, Matrix.DOWN);
                    History.addUndo(cmdFigDown);
                    cmdFigDown.execute();
                    redraw = true;
                    break;
                    
                case STATE_GROUP_SELECTED:
                    var cmdGrpDown = new TranslateGroupCommand(selectedGroupId, Matrix.DOWN);
                    History.addUndo(cmdGrpDown);
                    cmdGrpDown.execute();
                    redraw = true;
                    break;
            }                        
            break;

        case 'right':
            switch(state){
                case STATE_FIGURE_SELECTED:
                    var cmdFigRight = new TranslateFigureCommand(selectedFigureId, Matrix.RIGHT);
                    History.addUndo(cmdFigRight);
                    cmdFigRight.execute();
                    redraw = true;
                    break;
                    
                case STATE_GROUP_SELECTED:
                    var cmdGrpRight = new TranslateGroupCommand(selectedGroupId, Matrix.RIGHT);
                    History.addUndo(cmdGrpRight);
                    cmdGrpRight.execute();
                    redraw = true;
                    break;
            } 
            break;

        case 'left':
            switch(state){
                case STATE_FIGURE_SELECTED:
                    var cmdFigLeft = new TranslateFigureCommand(selectedFigureId, Matrix.LEFT);
                    History.addUndo(cmdFigLeft);
                    cmdFigLeft.execute();
                    redraw = true;
                    break;
                    
                case STATE_GROUP_SELECTED:
                    var cmdGrpLeft = new TranslateGroupCommand(selectedGroupId, Matrix.LEFT);
                    History.addUndo(cmdGrpLeft);
                    cmdGrpLeft.execute();
                    redraw = true;
                    break;
            }
            break;

        case 'grow':
            if(selectedFigureId != -1){
                //alert("Selected figure index: " + STACK.figureSelectedIndex);
                var figure = STACK.figureGetById(selectedFigureId);
                var bounds = figure.getBounds();
                var dx = bounds[0] + (bounds[2] - bounds[0]) / 2
                var dy = bounds[1] + (bounds[3] - bounds[1]) / 2
                //alert(dx + '  ' + dy);
                //alert("Selected figure is: " + figure);
                var TRANSLATE = [
                [1, 0, dx * -1],
                [0, 1, dy * -1],
                [0, 0, 1]
                ]
                /*
                var dx = bounds[0] + (bounds[3] - bounds[1]) / 2
                var dy = bounds[1] + (bounds[2] - bounds[0]) / 2
                 */
                var TRANSLATEBACK = [
                [1, 0, dx],
                [0, 1, dy],
                [0, 0, 1]
                ]

                var GROW = [
                [1 + 0.2, 0,   0],
                [0,   1 + 0.2, 0],
                [0,   0,   1]
                ]
                figure.transform(TRANSLATE);
                figure.transform(GROW);
                figure.transform(TRANSLATEBACK);
                redraw = true;
            }
            break;

        case 'shrink':
            if(selectedFigureId != -1){
                //alert("Selected figure index: " + STACK.figureSelectedIndex);
                var figure = STACK.figureGetById(selectedFigureId);
                var bounds = figure.getBounds();
                var dx = bounds[0] + (bounds[2] - bounds[0]) / 2
                var dy = bounds[1] + (bounds[3] - bounds[1]) / 2
                //alert(dx + '  ' + dy);
                //alert("Selected figure is: " + figure);
                var TRANSLATE = [
                [1, 0, dx * -1],
                [0, 1, dy * -1],
                [0, 0, 1]
                ]
                /*
                var dx = bounds[0] + (bounds[3] - bounds[1]) / 2
                var dy = bounds[1] + (bounds[2] - bounds[0]) / 2
                 */
                var TRANSLATEBACK = [
                [1, 0, dx],
                [0, 1, dy],
                [0, 0, 1]
                ]
                var SHRINK = [
                [1 - 0.2, 0,   0],
                [0,   1 - 0.2, 0],
                [0,   0,   1]
                ]
                figure.transform(TRANSLATE);
                figure.transform(SHRINK);
                figure.transform(TRANSLATEBACK);
                redraw = true;
            }
            break;
            
        case 'duplicate':
            if(selectedFigureId != -1){
                var createdFigure = STACK.figureGetById(selectedFigureId).clone();
                createdFigure.transform(Matrix.translationMatrix(10,10));
                STACK.figureAdd(createdFigure);
                STACK.figureSelect(STACK.figures.length-1);
                createdFigure=null;
                getCanvas().style.cursor="default";
                redraw = true;
            }
            break;

        case 'back':
            if(selectedFigureId != -1){
                var cmdBack = new ZOrderFigureCommand(selectedFigureId, 0);
                cmdBack.execute();
                History.addUndo(cmdBack);
                //STACK.setPosition(selectedFigureId, 0);
                redraw = true;
            }
            break;

        case 'front':
            if(selectedFigureId != -1){
                var cmdFront = new ZOrderFigureCommand(selectedFigureId, STACK.figures.length-1);
                cmdFront.execute();
                History.addUndo(cmdFront);                
                redraw = true;
            }            
            break;

        case 'moveback':
            if(selectedFigureId != -1){
                var cmdMoveBack = new ZOrderFigureCommand(selectedFigureId, STACK.idToIndex[selectedFigureId] - 1);
                cmdMoveBack.execute();
                History.addUndo(cmdMoveBack);
                redraw = true;
            }
            break;

        case 'moveforward':
            if(selectedFigureId != -1){
                var cmdMoveForward = new ZOrderFigureCommand(selectedFigureId, STACK.idToIndex[selectedFigureId] + 1);
                cmdMoveForward.execute();
                History.addUndo(cmdMoveForward);
                redraw = true;
            }            
            break;

    }//end switch

    if(redraw){
        draw();
    }
}

/**Stores last mouse position. Null initially.*/
var lastMousePosition = null;


//function startResize(ev){
//    lastMousePosition = getBodyXY(ev);
//    currentMoveUndo = new Action(null, null, History.ACTION_CANVAS_RESIZE, null, lastMousePosition, null);
//}
//
//
//function stopResize(ev){
//    if(lastMousePosition != null){
//        currentMoveUndo.currentValue = [lastMousePosition[0],lastMousePosition[1]];
//        History.addUndo(currentMoveUndo);
//        currentMoveUndo = null;
//        lastMousePosition = null;
//    }
//}


//function resize(ev){
//    if(lastMousePosition != null){
//        var currentMousePosition
//        if(ev instanceof Array){
//            //we are undoing this
//            currentMousePosition = ev;
//        }
//        else{
//            currentMousePosition = getBodyXY(ev);
//        }
//        var width = canvas.getwidth() - (lastMousePosition[0] - currentMousePosition[0]);
//        var height = canvas.getheight() - (lastMousePosition[1] - currentMousePosition[1]);
//        canvas.setwidth(canvas,width);
//        canvas.setheight(canvas, height);
//        setUpEditPanel(canvas);
//        lastMousePosition = currentMousePosition;
//        /*if(canvas.width >= document.body.scrollWidth-370){
//        }
//        else {
//            //document.getElementById("container").style.width = "";
//        }*/
//        draw();
//    }
//}


/*======================APPLE=====================================*/
/**Triggered when an touch is initiated (iPad/iPhone).
 *Simply forward to onMouseDown
 *@param {Event} event - the event triggered
 **/
function touchStart(event){
    event.preventDefault();

    onMouseDown(event);                                                
}


/**Triggered while touching and moving is in progress (iPad/iPhone).
 *Simply forward to onMouseMove
 *@param {Event} event - the event triggered
 **/
function touchMove(event){
    event.preventDefault();

    onMouseMove(event);                
}


/**Triggered when touch ends (iPad/iPhone).
 *Simply forward to onMouseUp
 *@param {Event} event - the event triggered
 **/
function touchEnd(event){
    onMouseUp(event);
}

/**Triggered when touch is canceled (iPad/iPhone).
 *@param {Event} event - the event triggered
 **/
function touchCancel(event){
//nothing
}
/*======================END APPLE=================================*/

