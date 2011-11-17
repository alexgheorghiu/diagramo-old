/*
  * @constructor
  * @this {Scroll}
  * @param {HTMLObject} domMap The current present DOM Object of the map (ex: image), must currently belong to a parent.
  * @param {String} dimensionType. Can be px or %
  * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 */
function Scroll(domMap, dimensionType){
    this.map = domMap; // you can get it also by document.getElementById('map');
    this.minimap = null; //you can get it also by document.getElementById('minimap');
    
    this.dimensionType = dimensionType;
    
    this.parentNode = this.map.parentNode;
    this.parentNode.style.overflow = "scroll";

    
    //add listener for scolling
    this.parentNode.onscroll = function (scrollObject){
        return function(){
            Log.info("Scroll->constructor->anonymous function: parentNode scroll left:" + scrollObject.parentNode.scrollLeft);
            scrollObject.minimap.updatePosition();
        }
    }(this);

}

Scroll.scrollBarWidth = 19;//19 the width added to a scollable area
Scroll.scrollers = [];


Scroll.prototype = {


    //set the minimap
    setMinimap:function(minimap){
        this.minimap = minimap;
    },


    //called from Minimap
    updatePosition:function(){
        var x = parseInt(this.minimap.selection.style.left.replace("px",""));//+border
        var y = parseInt(this.minimap.selection.style.top.replace("px",""));//+border

        var ratio = this.minimap.ratio;
        this.ratio = 
        this.parentNode.scrollLeft = x/this.minimap.ratio*100;
        this.parentNode.scrollTop = y/this.minimap.ratio*100;
    }
}
