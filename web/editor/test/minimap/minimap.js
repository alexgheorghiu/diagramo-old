/*
  * @constructor
  * @this {Minimap}
  * @param {HTMLObject} htmlObject The current present HTML Object to represent the minimap, must currently belong to a parent.
  * @param {Scroll} scrollSubect The object that will handle the scrolling
  * @param {Number} width The width of the scrollable area.
  * @param {Number} height The height of the scrollable area.
  * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 */
function Minimap(subject, scrollSubject, width, height){
    this.selected = false;
    this.container = subject;
    this.container.style.position = "relative";
    this.container.style.border = "1px solid #000000";
    this.scrollSubject = scrollSubject;
    
    //set up relative width and height
    this.ratio = 0;
    if(width == 0){
        this.container.style.height = height + "px";
        this.ratio = 100 / scrollSubject.subject.scrollHeight * this.container.style.height.replace("px","");
        this.container.style.width = scrollSubject.subject.scrollWidth / 100 * (100/scrollSubject.subject.scrollHeight * height)+"px";
    }
    else{
        this.container.style.width = width + "px";
        this.ratio = 100 / scrollSubject.subject.scrollWidth * this.container.style.width.replace("px","");
        this.container.style.height = scrollSubject.subject.scrollHeight / 100 * (100/scrollSubject.subject.scrollWidth * width)+"px";
    }

    //create a selection area that is the same proportion of the minimap, as is visible of the subject
    this.selection = document.createElement("div");
    this.selection.style.position = "absolute";
    this.selection.style.left = "0px";
    this.selection.style.top = "0px";
    this.selection.style.width = scrollSubject.subjectContainer.style.width.replace("px","") / 100 * this.ratio + "px";
    this.selection.style.height = scrollSubject.subjectContainer.style.height.replace("px","") / 100 * this.ratio + "px";
    this.selection.style.border = "1px solid #ff0000";
    this.selection.style.cursor = "pointer";
    this.selection.onmousedown = function(minimapObject){ return function(){minimapObject.selected = true;  mouseDown = true}}(this);
    this.container.appendChild(this.selection);
    Minimap.maps.push(this);
}

//so we can have multiple maps on the screen
Minimap.maps = [];
Minimap.tryScroll = function(event){
    for(var i = 0; i < Minimap.maps.length; i++){
        if(Minimap.maps[i].onScroll(event)){
            return;
        }
    }
}

Minimap.prototype = {

    //called from Scroll whenever we scroll the scrollable area, updates the minimap
    updatePosition:function(){
        var x = parseInt(this.scrollSubject.subject.style.left.replace("px",""));
        var y = parseInt(this.scrollSubject.subject.style.top.replace("px",""));

        x = x / 100 * this.ratio;
        y = y / 100 * this.ratio;

        this.selection.style.left = 0-x + "px";
        this.selection.style.top = 0-y + "px";
    },

    //called when we scroll the minimap
    onScroll:function(event){
        if(this.selected == true && mouseDown){

            //set up our widths and heights
            var mousePos = this.getInternalXY(event);
            var containerWidth = this.container.style.width.replace("px","");
            var containerHeight = this.container.style.height.replace("px","");
            var width = this.selection.style.width.replace("px","") / 2;
            var height = this.selection.style.height.replace("px","") / 2;

            //if we are scrolling outside the area, put us back in
            if(mousePos[0] - width < 0){
                mousePos[0] = width;
            }
            if(mousePos[1] - height < 0){
                mousePos[1] = height;
            }
            if(mousePos[0] + width > containerWidth){
                mousePos[0] = containerWidth - width;
            }
            if(mousePos[1] + height > containerHeight){
                mousePos[1] = containerHeight - height;
            }

            //update our minimap
            if(mousePos[0] != undefined){
                this.selection.style.left = mousePos[0] - width + "px";
                this.selection.style.top = mousePos[1] - height+ "px";
            }

            //update the actual area
            this.scrollSubject.updatePosition();
            return true;
        }
        else{
            this.selected = false;
            return false;
        }
    },
    
    getBounds:function(){
        var thisMinX = 0;
        var thisMinY = 0;
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
        if(event.pageX >= thisBounds[0] && event.pageX <= thisBounds[2]
            && event.pageY >= thisBounds[1] && event.pageY <= thisBounds[3])
            {
            //alert('Inside canvas');
            position = [event.pageX - thisBounds[0], event.pageY - thisBounds[1]];
        //alert("getXT : " + position);
        }

        return position;
    }
}

