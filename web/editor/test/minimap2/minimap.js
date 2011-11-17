/*
  * @constructor
  * @this {Minimap}
  * @param {HTMLObject} domMap The current present DOM Object of the map (ex: image), must currently belong to a parent.
  * @param {HTMLObkect} domMiniMap The minimap DOM Object
  * @param {Number} width The width of the minimap, can be 0 if relative to height
  * @author Zack Newsham <zack_newsham@yahoo.co.uk>
  * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function Minimap(domMap, domMiniMap, width){
    this.selected = false;
    this.map = domMap; // you can get it also by document.getElementById('map');
    this.minimap = domMiniMap; //you can get it also by document.getElementById('minimap');


    this.selection = document.createElement("div");
    this.selection.id = "selection";

    //create a canvas to paint the minimap on
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";

    //the size has to be specified so we get a minimap that has the same proportions as the map
    this.minimap.style.height = 0 + "px"; //initially it's zero
    this.minimap.style.width = width + "px";

    this.minimap.appendChild(this.canvas);
    this.minimap.appendChild(this.selection);


    //Map container scrolling --effect--> update minimap position
    this.map.parentNode.onscroll = function (scrollObject){
        return function(event){
            scrollObject.updateMinimapPosition();
        }
    }(this);

        
    //Minimap move mouse --effect--> 
    this.minimap.onmousemove = function(aMinimapObject){
        return function(event){
            aMinimapObject.onScrollMinimap(event);
            return false;
        }
    }(this);


    //Selection mouse down --effect--> select minimap
    this.selection.onmousedown = function(aMinimapObject){
        return function(event){
            /*prevent Firefox to allow canvas dragg effect. By default FF allows you
             * to drag the canvas out of it's place, similar to drag an image*/
            event.preventDefault(); 
            aMinimapObject.selected = true;
        }
    }(this);      
      
    //Canvas mouse down --effect--> center selection  
    this.canvas.onmousedown = function(aMinimapObject){
        return function(event){
            aMinimapObject.selected = true;
            aMinimapObject.onScrollMinimap(event);
        }
    }(this); 


    this.ratio = 0;
    
    this.updateMap();
}


/*19 the width added to a scollable area (Zack discovered this into Chrome)
 *We might compute this dimension too but for now it's fine
 *even if we are wrong by a pixel or two
 **/
Minimap.scrollBarWidth = 19;


Minimap.prototype = {
    
    /**Update the minimap's canvas with a scalled down version of the map*/
    updateCanvas:function(){
        //this part should be moved somewhere more relevant, only here for testing
        var canvas = this.map;
        var ctx = canvas.getContext("2d");

        //recreate a new image from encoded data
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var thisCtx = this.canvas.getContext("2d");
        thisCtx.beginPath();
        thisCtx.clearRect(0,0,this.canvas.width,this.canvas.height)
        thisCtx.closePath();
        thisCtx.stroke();
        thisCtx.save();

        /*@see http://stackoverflow.com/questions/3448347/how-to-scale-an-imagedata-in-html-canvas*/
        thisCtx.scale(1/100 * this.ratio, 1/100 * this.ratio);
        thisCtx.drawImage(canvas, 0,0);
        thisCtx.restore();
    },



    /**
     *Update the big map by repositioning it
     **/
    //when we change the width/height of the subject
    updateMap:function(){

        var width = parseInt(this.minimap.style.width.replace("px",""));
        this.ratio = 100 / ($(this.map).width() + Minimap.scrollBarWidth) * width; //horizontal ratio
        this.minimap.style.height = $(this.map).height() / 100 * (100/$(this.map).width() * width)+"px";


        var width = ($(this.map.parentNode).width() - Minimap.scrollBarWidth) / 100 * this.ratio;
        var height = ($(this.map.parentNode).height() - Minimap.scrollBarWidth) / 100 * this.ratio;
        if(width > $(this.minimap).width()){
            width = $(this.minimap).width();
        }
        if(height > $(this.minimap).height()){
            height = $(this.minimap).height();
        }
        this.canvas.width = $(this.minimap).width();
        this.canvas.height = $(this.minimap).height();

        this.selection.style.width = width + "px";
        this.selection.style.height = height + "px";

        this.updateMapPosition();
    },


    //called from Minimap
    updateMapPosition:function(){
        var x = parseInt(this.selection.style.left.replace("px",""));//+border
        var y = parseInt(this.selection.style.top.replace("px",""));//+border

        this.map.parentNode.scrollLeft = x/this.ratio*100;
        this.map.parentNode.scrollTop = y/this.ratio*100;
    },



    /*
     *Called whenever we scroll the big map/canvas. It will update the minimap
     *@author Zack
     */
    updateMinimapPosition:function(){
        //get big map's offset
        var x = parseInt(this.map.parentNode.scrollLeft);
        var y = parseInt(this.map.parentNode.scrollTop);

        //compute minimap's offset
        x = x * this.ratio / 100 ;
        y = y * this.ratio / 100 ;

        //apply the offset        
        this.selection.style.left = x + "px";
        this.selection.style.top = y + "px";
    },



    /*Called when we move over the minimap and the 'minimap' was previously
     *selected
     *@author Zack
     **/
    onScrollMinimap:function(event){
        if(this.selected == true){
            
            //try to reposition the selection
            var mousePos = this.getInternalXY(event);
            
            var containerWidth = this.minimap.style.width.replace("px","");
            var containerHeight = this.minimap.style.height.replace("px","");
            var width = this.selection.style.width.replace("px","");
            var height = this.selection.style.height.replace("px","");

            //if we are scrolling outside the area, put us back in
            if(mousePos[0] - width/2 < 0){
                mousePos[0] = width/2;
            }
            if(mousePos[1] - height/2 < 0){
                mousePos[1] = height/2;
            }
            if(mousePos[0] + width/2 > containerWidth){
                mousePos[0] = containerWidth - width/2;
            }
            if(mousePos[1] + height/2 > containerHeight){
                mousePos[1] = containerHeight - height/2;
            }

            //update our minimap
            if(mousePos[0] != undefined){
                this.selection.style.left = mousePos[0] - width/2 + "px";
                this.selection.style.top = mousePos[1] - height/2 + "px";
            }

            //update the actual area
            this.updateMapPosition();
        }
        else{
            this.selected = false;
        }
    },


    /**
     *Compute the boundary of minimap relative to the whole page
     *@author Zack
     *@author (comments) Alex
     *@see http://www.quirksmode.org/js/findpos.html
     **/
    getBounds:function(){
        var thisMinX = 0;
        var thisMinY = 0;
        var obj = this.minimap;
        
        /**Go recursively up in the hierarchy (parent) and find the minx and min y*/
        do{
            thisMinX += obj.offsetLeft;
            thisMinY += obj.offsetTop;
            
            /**offsetParent - Returns a reference to the object that is the current 
             *element's offset positioning context*/
        }while(obj = obj.offsetParent);
        
        /*Add minimap's width and height*/
        var thisMaxX = thisMinX + parseInt(this.minimap.style.width.replace("px",""));
        var thisMaxY = thisMinY + parseInt(this.minimap.style.height.replace("px",""));
        
        return [thisMinX, thisMinY, thisMaxX, thisMaxY];
    },


    /**Get the (x, y) position relative to 
     *current DOM object (minimap div in our case)
     *@return {Array} of [x, y] relative position inside DOM object
     *@author Zack
     *@author (comments) Alex
     **/
    getInternalXY:function(event){
        var position = [];
        
        var thisBounds = this.getBounds();
        if(event.pageX >= thisBounds[0] && event.pageX <= thisBounds[2] //if event inside [Ox bounds
            && event.pageY >= thisBounds[1] && event.pageY <= thisBounds[3]) //if event inside [Oy bounds
            {
            position = [event.pageX - thisBounds[0], event.pageY - thisBounds[1]];
        }

        return position;
    }
}