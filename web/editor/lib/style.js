/*
 *  Copyright 2010 Scriptoid s.r.l
 */

/**
 * A simple way of setting the style for a context
 * 
 * @this {Style}
 * @constructor
 * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function Style(){
    /**Font used*/
    this.font = null;
    
    /**Stroke/pen style*/
    this.strokeStyle = null;
    
    /**Fill style*/
    this.fillStyle = null
    
    /**Alpha/transparency value*/
    this.globalAlpha = null;
    
    /**Composite value*/
    this.globalCompositeOperation = null;
    
    /**Line width*/
    this.lineWidth = null;
    
    /**
     *Line cap style
     *
     *HTML5 Canvas: 
     *The (Canvas's) lineCap property determines how the end points of every line are drawn.
     *There are three possible values for this property and those are: butt, round and square.
     *By default this property is set to butt.
     *@see https://developer.mozilla.org/en/Canvas_tutorial/Applying_styles_and_colors#A_lineCap_example
     **/
    this.lineCap = this.STYLE_LINE_CAP_BUTT;

    /**
     *Line join style
     *
     *HTML5 Canvas:
     *The (Canvas's) lineJoin property determines how two connecting lines in a shape are joined together.
     *There are three possible values for this property: round, bevel and miter.
     *By default this property is set to miter.
     *@see https://developer.mozilla.org/en/Canvas_tutorial/Applying_styles_and_colors#A_lineJoin_example
     **/
    this.lineJoin = this.STYLE_LINE_JOIN_MITER;
    
    /**Shadow offset x. Not used yet*/
    this.shadowOffsetX = null;
    
    /**Shadow offset y. Not used yet*/
    this.shadowOffsetY = null;
    
    /**Shadow blur. Not used yet*/
    this.shadowBlur = null;
    
    /**Shadow color. Not used yet*/
    this.shadowColor = null;
    
    /**An {Array} of colors used in gradients*/
    this.addColorStop = [];
    
    /**An {Array} used in gradients*/
    this.linearGradient = [];
    
    /**Dash length used for dashed styles*/
    this.dashLength = 0;
    
    /**Image used*/
    this.image = null;
    
    /**Serialization type*/
    this.oType = "Style";
}

/**Loads a style from a JSONObject
 **/
Style.load = function(o){
    var newStyle = new Style();

    newStyle.strokeStyle = o.strokeStyle;
    newStyle.fillStyle = o.fillStyle
    newStyle.globalAlpha = o.globalAlpha;
    newStyle.globalCompositeOperation = o.globalCompositeOperation;
    newStyle.lineWidth = o.lineWidth;
    newStyle.lineCap = o.lineCap;
    newStyle.lineJoin = o.lineJoin;
    newStyle.shadowOffsetX = o.shadowOffsetX;
    newStyle.shadowOffsetY = o.shadowOffsetY;
    newStyle.shadowBlur = o.shadowBlur;
    newStyle.shadowColor = o.shadowColor;
    newStyle.addColorStop = o.addColorStop;
    newStyle.linearGradient = o.linearGradient;
    newStyle.dashLength = o.dashLength;
    newStyle.image = o.image;

    return newStyle;
}

Style.prototype={
    /**Round join*/
    STYLE_LINE_JOIN_ROUND: 'round',
    
    /**Bevel join*/
    STYLE_LINE_JOIN_BEVEL: 'bevel',
    
    /**Mitter join*/
    STYLE_LINE_JOIN_MITER: 'miter',
    
    /**Butt cap*/
    STYLE_LINE_CAP_BUTT: 'butt',
    
    /**Round cap*/
    STYLE_LINE_CAP_ROUND: 'round',
    
    /**Square cap*/
    STYLE_LINE_CAP_SQUARE: 'square',
    
    constructor : Style,

    /**Setup the style of a context
     *@param {Context} context - the canvas context
     **/
    setupContext:function(context){
        for(var propertyName in this){
            if(propertyName != "linearGradient" && propertyName != "addColorStop" && propertyName != "image"){
                if(this[propertyName] != null && propertyName != undefined){
                    context[propertyName] = this[propertyName];
                }
            }
        }

        if(this.linearGradient.length !=0 && image == null){
            var lin = context.createLinearGradient(this.linearGradient[0], this.linearGradient[1], this.linearGradient[2], this.linearGradient[3]);

            for(var i=0; i<this.addColorStop.length; i++){
                lin.addColorStop(i, this.addColorStop[i]);
            }

            context.fillStyle = lin;
            this.fillStyle = lin;
        }

        if(this.image != null && IE){
            var ptrn = context.createPattern(this.image,'no-repeat');
        //context.fillStyle=ptrn;
        //this.fillStyle=ptrn;
        }
    },


    clone: function(){
        var anotherStyle = new Style;
        for(var propertyName in anotherStyle){
            if(propertyName!="addColorStop" && propertyName!="linearGradient"){
                anotherStyle[propertyName]=this[propertyName];
            }
            else{
                for(var i=0; i< this[propertyName].length; i++){
                    anotherStyle[propertyName].push(this[propertyName][i]);
                }
            }
        }
        return anotherStyle;
    },


    /**Try not to save the properties that are null
     *The deleted property will be recreated and set to null while .load() method anyway
     *@author Alex
     **/
    toJSON : function(){
        var aClone = this.clone();
        for(var propertyName in aClone){
            if(aClone[propertyName] == null){
                delete aClone[propertyName];
            }
        }

        return aClone;
    },


    getGradient:function(){
        return this.addColorStop[0]+"/"+this.addColorStop[1];
    },


    setGradient:function(figure, value){
        this.addColorStop[0] = value.split("/")[0];
        this.addColorStop[1] = value.split("/")[1];
    },

    /**Merge current style with another style.
     *If current style is missing some of other's feature it will be "enhanced" with them
     *@param {Style} anotherStyle - the other style
     *@author Zack Newsham <zack_newsham@yahoo.co.uk>
     *@author Alex <alex@scriptoid.com>
     **/
    merge:function(anotherStyle){
        for(var propertyName in anotherStyle){
            if( (this[propertyName] == null || this[propertyName] == undefined) && propertyName != "image"){
                this[propertyName] = anotherStyle[propertyName];
            }
        }
    },


    transform:function(matrix){
        if(this.linearGradient.length!=0){
            var p1=new Point(this.linearGradient[0],this.linearGradient[1]);
            var p2=new Point(this.linearGradient[2],this.linearGradient[3]);
            p1.transform(matrix);
            p2.transform(matrix);
            this.linearGradient[0]=p1.x;
            this.linearGradient[1]=p1.y;
            this.linearGradient[2]=p2.x;
            this.linearGradient[3]=p2.y;
        }
        if(this.image){
            var p1 = new Point(0,0);
            var p2 = new Point(this.image.width, this.image.height);
            p1.transform(matrix);
            p2.transform(matrix);
            this.image.width = p2.x-p1.x;
            this.image.height = p2.y-p1.y;
        }
    },


    /**TODO: implement it*/
    equals:function(anotherStyle){
        if(!anotherStyle instanceof Style){
            return false;
        }
        
        //TODO: test members

        return true;
    },


    /**Transform all the style into a SVG style
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    toSVG : function(){
        var style = ' style="';

        style += 'stroke:' + ( (this.strokeStyle == null || this.strokeStyle == '') ? 'none' : this.strokeStyle) + ';';
        style += 'fill:' + ( (this.fillStyle == null || this.fillStyle == '') ? 'none' : this.fillStyle) + ';';
        style += 'stroke-width:' + ( (this.lineWidth == null || this.lineWidth == '') ? 'none' : this.lineWidth) + ';';
        style += 'stroke-linecap:' + ( (this.lineCap == null || this.lineCap == '') ? 'inherit' : this.lineCap) + ';';
        style += 'stroke-linejoin:' + ( (this.lineJoin == null || this.lineJoin == '') ? 'inherit' : this.lineJoin) + ';';
        style += '" ';

        return style;
    }

}

