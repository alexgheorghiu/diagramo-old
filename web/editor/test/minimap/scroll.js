/*
  * @constructor
  * @this {Scroll}
  * @param {HTMLObject} htmlObject The current present HTML Object to be scrolled (ex: image), must currently belong to a parent.
  * @param {Number} width The width of the scrollable area.
  * @param {Number} height The height of the scrollable area.
  * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 */

var mouseDown = false;

function Scroll(htmlObject, width, height){
    this.vSelected = false;
    this.hSelected = false;
    this.minimap = null;
    
    this.subject = htmlObject;
    this.subject.style.display="block"
    this.subject.style.position = "absolute";
    this.parentNode = this.subject.parentNode;
    this.parentNode.removeChild(this.subject);
    

    //vertical scroller
    this.vScroller = document.createElement("div");
    this.vScroller.style.position = "absolute";
    this.vScroller.style.top = "0px";
    this.vScroller.style.height = "20px";
    this.vScroller.style.width = "100%";
    this.vScroller.style.backgroundColor = "#000000";
    this.vScroller.style.cursor = "pointer";
    this.vScroller.onmousedown = function (obj){
        return function(){
            obj.vSelected = true;
            mouseDown = true;
        }
    }(this);
    
    //vertical scroll bar
    this.vScrollBar = document.createElement("div");
    this.vScrollBar.style.height = height - 10 + "px";
    this.vScrollBar.style.width = "10px";
    this.vScrollBar.style.position = "absolute";
    this.vScrollBar.style.right = "0px";
    this.vScrollBar.style.backgroundColor = "#ff0000";
    this.vScrollBar.appendChild(this.vScroller);
    
    
    //horizontal scroller
    this.hScroller = document.createElement("div");
    this.hScroller.style.position="absolute";
    this.hScroller.style.width = "20px";
    this.hScroller.style.height = "100%";
    this.hScroller.style.backgroundColor = "#000000";
    this.hScroller.style.cursor = "pointer";
//    this.hScroller.style.padding
    this.hScroller.onmousedown = function(scrollObject){
        return function(){
            scrollObject.hSelected = true;
            mouseDown = true
            }
        }(this);

    //horizontal scroll bar
    this.hScrollBar = document.createElement("div");
    this.hScrollBar.style.width = width-10 + "px"
    this.hScrollBar.style.height = "10px";
    this.hScrollBar.style.position = "absolute";
    this.hScrollBar.style.bottom = "0px";
    this.hScrollBar.style.backgroundColor = "#ff0000";
    this.hScrollBar.appendChild(this.hScroller);

    
        
    //image to be scrolled
    this.subjectContainer = document.createElement("div");
    this.subjectContainer.style.height = height - 10 + "px";
    this.subjectContainer.style.width = width - 10 + "px";
    this.subjectContainer.style.overflow = "hidden";
    this.subjectContainer.style.position = "absolute";
    this.subjectContainer.appendChild(this.subject);

    //container
    this.container = document.createElement("div");
    this.container.id  = htmlObject.id+".container";
    this.container.style.width = width+"px";
    this.container.style.height = height+"px";
    this.container.style.position = "relative";
    this.container.appendChild(this.subjectContainer);
    this.container.appendChild(this.hScrollBar);
    this.container.appendChild(this.vScrollBar);

    //add container back to DOM
    this.parentNode.appendChild(this.container);

    Scroll.scrollers.push(this);
}

Scroll.scrollers = [];

Scroll.tryScroll = function(event){
    for(var i = 0; i < Scroll.scrollers.length; i++){
        if(Scroll.scrollers[i].onScroll(event)){
            return;
        }
    }
}

Scroll.prototype = {
    onScroll:function(event){
        if(mouseDown && this.hSelected){
            return this.onHScroll(event);
        }
        else if(mouseDown && this.vSelected){
            return this.onVScroll(event);
        }
        else{
            this.vSelected = false;
            this.hSelected = false;
        }
        return false;
    },

    //called when we click and drag the scrollable area
    onHScroll:function(event){
        var mouseX = this.getInternalXY(event)[0];
        var scrollBarWidth = parseInt(this.hScrollBar.style.width.replace("px",""));
        var scrollerWidth = (parseInt(this.hScroller.style.width.replace("px",""))/2);
        if(mouseX > scrollBarWidth - scrollerWidth){
            mouseX = (scrollBarWidth - scrollerWidth);
        }
        else if(mouseX < 0 + scrollerWidth){
            mouseX = 0 + scrollerWidth;
        }
        this.hScroller.style.left = mouseX - scrollerWidth +"px";
        this.scrollTo(parseInt(this.hScroller.style.left.replace("px","")), parseInt(this.vScroller.style.top.replace("px","")));

        //update minimap
        if(this.minimap != null){
            this.minimap.updatePosition();
        }
        return true;
    },

    //called when we click and drag the scrollable area
    onVScroll:function(event){
        var mouseY = this.getInternalXY(event)[1];
        var scrollBarHeight = parseInt(this.vScrollBar.style.height.replace("px",""));
        var scrollerHeight = parseInt(this.vScroller.style.height.replace("px",""));
        
        //if values fall outside of interval then normalize them
        if(mouseY > scrollBarHeight - scrollerHeight / 2){
            mouseY = (scrollBarHeight - scrollerHeight / 2);
        }
        else if(mouseY < 0 + scrollerHeight / 2 ){
            mouseY = 0 + scrollerHeight / 2;
        }
        
        //move scroller
        this.vScroller.style.top = mouseY - scrollerHeight / 2 +"px";
        
        //scroll image
        this.scrollTo(parseInt(this.hScroller.style.left.replace("px","")), parseInt(this.vScroller.style.top.replace("px","")));

        //update minimap
        if(this.minimap != null){
            this.minimap.updatePosition();
        }
        
        return true;
    },


    /**
     *Computes the bounds of the container
     *@return {Array} with [top-left-x, top-left-y, buttom-right-x, bottom-right-y]
     *@see http://www.quirksmode.org/js/findpos.html for a similar example
     *@author Zack
     **/
    getBounds:function(){
        var thisMinX = 0; //top left X value
        var thisMinY = 0; //top left Y value
        var obj = this.container;
        do{
            thisMinX += obj.offsetLeft;
            thisMinY += obj.offsetTop;
        }while(obj = obj.offsetParent);
        
        var thisMaxX = thisMinX + parseInt(this.container.style.width.replace("px",""));
        var thisMaxY = thisMinY + parseInt(this.container.style.height.replace("px",""));
        
        return [thisMinX, thisMinY, thisMaxX, thisMaxY];
    },


    getInternalXY:function(event){
        var position = [];
        var thisBounds = this.getBounds();
        position = [event.pageX - thisBounds[0], event.pageY - thisBounds[1]];

        return position;
    },


    //set the minimap
    setMinimap:function(minimap){
        this.minimap = minimap;
    },


    //called from Minimap
    updatePosition:function(){
        var selectionWidth = parseInt(this.minimap.selection.style.width.replace("px",""));
        var selectionHeight = parseInt(this.minimap.selection.style.height.replace("px",""));
        
        var x = parseInt(this.minimap.selection.style.left.replace("px",""));
        var y = parseInt(this.minimap.selection.style.top.replace("px",""));

        var containerWidth = parseInt(this.minimap.container.style.width.replace("px",""));
        var containerHeight = parseInt(this.minimap.container.style.height.replace("px",""));

        x += selectionWidth/100*(100/(containerWidth-(selectionWidth+4))*x);
        y += selectionHeight/100*(100/(containerHeight-(selectionHeight+2))*y);

        var scrollWidth = parseInt(this.hScrollBar.style.width.replace("px",""));
        var scrollHeight = parseInt(this.vScrollBar.style.height.replace("px",""));

        //x range: 0 => scrollBarWidth - scrollerWidth/2
        this.hScroller.style.left = (scrollWidth - this.hScroller.scrollWidth)/100*(100/containerWidth*x) + "px";
        this.vScroller.style.top = (scrollHeight - this.vScroller.scrollHeight)/100*(100/containerHeight*y) + "px";

        this.scrollTo(parseInt(this.hScroller.style.left.replace("px","")), parseInt(this.vScroller.style.top.replace("px","")));
    },


    /*Does the moving of the subject, called when we scroll (by drag) scroll (by clicking, coming soon) and scroll minimap
     *@author Zack
     **/
    scrollTo:function(x,y){
        var containerWidth = parseInt(this.subjectContainer.style.width.replace("px",""));
        var containerHeight = parseInt(this.subjectContainer.style.height.replace("px",""));
                
        var hScrollBarWidth = parseInt(this.hScrollBar.style.width.replace("px",""));
//        this.subject.style.left = "-"+ (this.subject.scrollWidth-containerWidth) / 100 * (100 / (hScrollBarWidth - this.hScroller.scrollWidth) * x ) + "px";
        this.subject.style.left = "-" + (this.subject.scrollWidth-containerWidth)  * x / (hScrollBarWidth - this.hScroller.scrollWidth) + "px";
        
        var vScrollBarHeight= parseInt(this.vScrollBar.style.height.replace("px",""));
        this.subject.style.top = "-" + (this.subject.scrollHeight-containerHeight) / 100 * (100/(vScrollBarHeight-this.vScroller.scrollHeight)*y) + "px";
    }
}
