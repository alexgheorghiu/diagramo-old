/*
 * A wrapper for canvas element. This should only used to save / store canvas' properties
 * @param {Number} width - the width of the {Canvas}
 * @param {Number} height - the height of the {Canvas}
 * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function CanvasProps(width, height){    
    this.width = width;
    this.height = height;
    
    this.id = "canvasProps"; //used in main.js:updateFigure() to see what object we have
    
    this.oType = 'CanvasProps';
}

CanvasProps.DEFAULT_HEIGHT = 600; //default height for canvas
CanvasProps.DEFAULT_WIDTH = 800; //default width for canvas

/*
 *We only ever have one instance of this class (like stack)
 *but we need the creation of the Canvas to appear AFTER the page exists,
 *otherwise we would not be able to add it dinamically to the document.
 *@param {JSONObject} o
 *@return new {Canvas}
 *@author Zack Newsham <zack_newsham@yahoo.co.uk>
 */
CanvasProps.load = function(o){
    var canvasprops = new CanvasProps();

    canvasprops.height = o.height;
    canvasprops.width = o.width;

    return canvasprops;
}


CanvasProps.prototype = {
    
    /**Get width of the canvas*/
    getWidth:function(){
        return this.width;
    },


    /*
     * Set the width of the canvas
     * @param {Numeric} width - the new width
     */
    setWidth:function(width){//required for undo
        this.width = width;

        var canvas = getCanvas();
        canvas.width = this.width;
        minimap.updateMap();
        //var container1 = document.getElementById("container1");
        //container1.style.width = this.width  + 'px';
    },

    /**Return the height of the canvas*/
    getHeight:function(){
        return this.height;
    },


    /*
     * Set the height of the canvas
     *  @param {Numeric} height - the new height
     */

    setHeight:function(height){//required for undo
        this.height = height;

        var canvas = getCanvas();
        canvas.height = this.height;
        //var container1 = document.getElementById("container1");
        //container1.style.height = this.height + 'px';
        minimap.updateMap();
    },


    /**
     *Update the Canvas to current values
     **/
    sync:function() {
        var canvas = getCanvas();
        
        canvas.height = this.height;
        canvas.width = this.width;

        var container1 = document.getElementById("container1");

        container1.style.height = this.height + 'px';
        container1.style.width = this.width  + 'px';
    },

    
    toString: function(){
       return "CanvasProp [width: " + this.width + " height: " + this.height + ' ]';
    }
}

