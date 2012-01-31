/*
 *  Copyright 2010 Scriptoid s.r.l
 *
 * TODO: different methods for image patterns, either whole bg, with the figure as a mask, or shrunk to size
 * if shrunk to size, keep ratios?
 *  A small library of drawing primitives.
 *  All primitives should have the following methods implemented:
 *  Like a Shape interface:
 *  -paint:void
 *  -tranform(matrix):void
 *  -contains(x, y):boolean
 *  -equals(object):boolean
 *  -toString():String
 *  -clone():object  - this is a deep clone
 *  -getBounds():[number, number, number, number]
 *  -near(distance):boolean - This should be used to test if a click is close to a primitive/figure
 *  -getPoints():Array - returns an array of points, so that a figure can implement contains
 *  -getStyleInfo():Style - returns the different styles that can be used by any shape
 */





/**
  * Creates an instance of Point
  *
  *
  * @constructor
  * @this {Point}
  * @param {Number} x The x coordinate of point.
  * @param {Number} y The y coordinate of point.
  * @author Alex Gheorghiu <alex@scriptoid.com>
  * Note: Even if it is named Point this class should be named Dot as Dot is closer
  * then Point from math perspective.
  **/
function Point(x, y){
    /**The x coordinate of point*/
    this.x = x;
    
    /**The y coordinate of point*/
    this.y = y;
    
    /**The {@link Style} of the Point*/
    this.style = new Style();
    
    /**Serialization type*/
    this.oType = 'Point'; //object type used for JSON deserialization
}

/**Creates a {Point} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Point} a newly constructed Point
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Point.load = function(o){
    var newPoint = new Point();
    newPoint.x = o.x;
    newPoint.y = o.y;
    newPoint.style = Style.load(o.style);
    return newPoint;
}


/**Creates an array of points from an array of {JSONObject}s
 *@param {Array} v - the array of JSONObjects
 *@return an {Array} of {Point}s
 **/
Point.loadArray = function(v){
    var newPoints = [];
    for(var i=0; i< v.length; i++){
        newPoints.push(Point.load(v[i]));
    }
    return newPoints;
}


/**Clones an array of points
 *@param {Array} v - the array of {Point}s
 *@return an {Array} of {Point}s
 **/
Point.cloneArray = function(v){
    var newPoints = [];
    for(var i=0; i< v.length; i++){
        newPoints.push(v[i].clone());
    }
    return newPoints;
}

Point.prototype = {
    constructor : Point,
    
    /*
     *Transform a point by a tranformation matrix. 
     *It is done by multiplication
     *Pay attention on the order of multiplication: The tranformation {Matrix} is
     *mutiplied with the {Point} matrix.
     * P' = M x P
     *@param matrix is a 3x3 matrix
     *@see <a href="http://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations">http://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations</a>
     **/
    transform:function(matrix){
        if(this.style!=null){
            this.style.transform(matrix);
        }
        var oldX = this.x;
        var oldY = this.y;
        this.x = matrix[0][0] * oldX + matrix[0][1] * oldY + matrix[0][2];
        this.y = matrix[1][0] * oldX + matrix[1][1] * oldY + matrix[1][2];
    },

    /**Paint current {Point} withing a context
     *If you want to use a different style then the default one change the style
     **/
    paint:function(context){
        if(this.style != null){
            this.style.setupContext(context);
        }
        if(this.style.strokeStyle != ""){
            context.fillStyle = this.style.strokeStyle;
            context.beginPath();
            var width = 1;
            if(this.style.lineWidth != null){
                width = parseInt(this.style.lineWidth);
            }
            context.arc(this.x, this.y, width, 0,Math.PI/180*360,false);
            context.fill();
        }
    },


    /**Tests if this point is similar to other point
     *@param {Point} anotherPoint - the other point
     **/
    equals:function(anotherPoint){
        if(! (anotherPoint instanceof Point) ){
            return false;
        }
        return (this.x == anotherPoint.x)
        && (this.y == anotherPoint.y)
        && this.style.equals(anotherPoint.style);
    },

    /**Clone current Point
     **/
    clone: function(){
        var newPoint = new Point(this.x, this.y);
        newPoint.style = this.style.clone();
        return newPoint;
    },

    /**Tests to see if a point (x, y) is within a range of current Point
     *@param {Numeric} x - the x coordinate of tested point
     *@param {Numeric} y - the x coordinate of tested point
     *@param {Numeric} radius - the radius of the vicinity
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    near:function(x, y, radius){
        var distance = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));

        return (distance <= radius);
    },

    contains: function(x,y){
        return this.x == x && this.y == y;
    },

    toString:function(){
        return 'point(' + this.x + ',' + this.y + ')';
    },

    getPoints:function(){
        return [this];
    },

    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    /**
     *We will draw a point a circle. The "visual" color and thicknes of the point will
     *be created by the SVG's element style
     *
     *@see <a href="http://tutorials.jenkov.com/svg/circle-element.html">http://tutorials.jenkov.com/svg/circle-element.html</a>
     *
     *Example:
     *<circle cx="40" cy="40" r="1" style="stroke:#006600; fill:#00cc00"/>
     **/
    toSVG: function(){
        var r = '';

        r += "\n" + repeat("\t", INDENTATION) + '<circle cx="' + this.x + '" cy="' + this.y + '" r="' + 1 + '"' ;
        r += this.style.toSVG();
        r += '/>'

        return r;
    }


}




/**
  * Creates an instance of a Line
  *
  * @constructor
  * @this {Line}
  * @param {Point} startPoint - starting point of the line
  * @param {Point} endPoint - the ending point of the line
  * @author Alex Gheorghiu <alex@scriptoid.com>
  **/
function Line(startPoint, endPoint){
    /**Starting {@link Point} of the line*/
    this.startPoint = startPoint;
    
    /**Ending {@link Point} of the line*/
    this.endPoint = endPoint;
    
    /**The {@link Style} of the line*/
    this.style = new Style();
    
    /**Serialization type*/
    this.oType = 'Line'; //object type used for JSON deserialization
}

/**Creates a {Line} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Line} a newly constructed Line
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Line.load = function(o){
    var newLine = new Line();
    newLine.startPoint = Point.load(o.startPoint);
    newLine.endPoint = Point.load(o.endPoint);
    newLine.style = Style.load(o.style);
    return newLine;
}

Line.prototype = {
    contructor: Line,
    
    transform:function(matrix){
        this.startPoint.transform(matrix);
        this.endPoint.transform(matrix);
        if(this.style!=null){
            this.style.transform(matrix);
        }

    },

    paint:function(context){
        if(this.style != null){
            this.style.setupContext(context);
        }
        context.moveTo(this.startPoint.x, this.startPoint.y);
        if(this.style.dashLength==0){
            context.lineTo(this.endPoint.x, this.endPoint.y);
        }
        else{

            //get the length of the line
            var lineLength=Math.sqrt(Math.pow(this.startPoint.x-this.endPoint.x,2)+Math.pow(this.startPoint.y-this.endPoint.y,2));

            //get the angle
            var angle=Util.getAngle(this.startPoint,this.endPoint);

            //draw a dotted line
            var move=false;
            for(var i=0; i<lineLength; i+=(this.style.dashLength)){
                var p=this.startPoint.clone();

                //translate to origin of start
                p.transform(Matrix.translationMatrix(-this.startPoint.x,-this.startPoint.y))

                //move it north by incremental dashlengths
                p.transform(Matrix.translationMatrix(0, -i));

                //rotate to correct location
                p.transform(Matrix.rotationMatrix(angle));

                //translate back
                p.transform(Matrix.translationMatrix(this.startPoint.x,this.startPoint.y))

                if (move==false){
                    context.lineTo(p.x,p.y);
                    move=true;
                }
                else{
                    context.moveTo(p.x,p.y);
                    move=false;
                }
            }
        }

        if(this.style.strokeStyle != null && this.style.strokeStyle != ""){
            context.stroke();
        }
    },

    clone:function(){
        var ret = new Line(this.startPoint.clone(), this.endPoint.clone());
        ret.style = this.style.clone();
        return ret;
    },

    equals:function(anotherLine){
        if(!anotherLine instanceof Line){
            return false;
        }
        return this.startPoint.equals(anotherLine.startPoint)
        && this.endPoint.equals(anotherLine.endPoint)
        && this.style.equals(anotherLine.style);
    },

    /** Tests to see if a point belongs to this line (not as infinite line but more like a segment)
     * Algorithm: Compute line's equation and see if (x, y) verifies it.
     * @param {Number} x - the X coordinates
     * @param {Number} y - the Y coordinates
     * @author Alex Gheorghiu <alex@scriptoid.com>
     **/
    contains: function(x, y){
        // if the point is inside rectangle bounds of the segment
        if (Math.min(this.startPoint.x, this.endPoint.x) <= x
            && x <= Math.max(this.startPoint.x, this.endPoint.x)
            && Math.min(this.startPoint.y, this.endPoint.y) <= y
            && y <= Math.max(this.startPoint.y, this.endPoint.y)) {

            // check for vertical line
            if (this.startPoint.x == this.endPoint.x) {
                return x == this.startPoint.x;
            } else { // usual (not vertical) line can be represented as y = a * x + b
                var a = (this.endPoint.y - this.startPoint.y) / (this.endPoint.x - this.startPoint.x);
                var b = this.startPoint.y - a * this.startPoint.x;
                return y == a * x + b;
            }
        } else {
            return false;
        }
    },

    /*
     *See if we are near a {Line} by a certain radius
     *@param {Number} x - the x coordinates
     *@param {Number} y - the y coordinates
     *@param {Number} radius - the radius to search for
     *@author Zack Newsham <zack_newsham@yahoo.co.uk>
     *@see <a href="http://mathworld.wolfram.com/Point-LineDistance2-Dimensional.html">http://mathworld.wolfram.com/Point-LineDistance2-Dimensional.html</a>
     *@see <a href="http://www.worsleyschool.net/science/files/linepoint/distance.html">http://www.worsleyschool.net/science/files/linepoint/distance.html </a> (see method 5)
     *TODO: review not made
     **/
    near:function(x,y,radius){
        with(this){
            //get the slope of the line
            var m;
            if(endPoint.x==startPoint.x){
                return ( (startPoint.y-radius<=y && endPoint.y+radius>=y) || (endPoint.y-radius<=y && startPoint.y+radius>=y))
                && x>startPoint.x-radius && x<startPoint.x+radius ;
            }
            if(startPoint.y==endPoint.y){
                return ( (startPoint.x-radius<=x && endPoint.x+radius>=x) || (endPoint.x-radius<=x && startPoint.x+radius>=x))
                && y>startPoint.y-radius && y<startPoint.y+radius ;
            }


            startX = Math.min(endPoint.x,startPoint.x);
            startY = Math.min(endPoint.y,startPoint.y);
            endX = Math.max(endPoint.x,startPoint.x);
            endY = Math.max(endPoint.y,startPoint.y);

            m = (endPoint.y-startPoint.y)/(endPoint.x-startPoint.x);
            b = -1;
            //get the intercept
            var c = startPoint.y-m*startPoint.x;

            //get the radius
            var d = (m*x+(b*y)+c)/Math.sqrt(Math.pow(m,2)+Math.pow(b,2));
            if(d < 0){
                d = 0 - d;
            }
            return (d<=radius && endX>=x && x>=startX && endY>=y && y>=startY)
            || startPoint.near(x,y,radius) || endPoint.near(x,y,radius);
            }

    },

    /**we need to create a new array each time, or we will affect the actual shape*/
    getPoints:function(){
        points=[];
        points.push(this.startPoint);
        points.push(this.endPoint);
        return points;
    },

    /**
     *Get bounds for this line
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    /**String representation*/
    toString:function(){
        return 'line(' + this.startPoint + ',' + this.endPoint + ')';
    },

    /**Render the SVG fragment for this primitive*/
    toSVG:function(){
        //<line x1="0" y1="0" x2="300" y2="300" style="stroke:rgb(99,99,99);stroke-width:2"/>
        var result = "\n" + repeat("\t", INDENTATION) + '<line x1="' + this.startPoint.x + '" y1="' + this.startPoint.y + '" x2="' + this.endPoint.x  + '" y2="' + this.endPoint.y + '"';
        result += this.style.toSVG();
        result += " />"
        return  result;
    }
}



/**
  * Creates an instance of a Polyline
  *
  * @constructor
  * @this {Polyline}
  * @author Alex Gheorghiu <alex@scriptoid.com>
  **/
function Polyline(){
    /**An {Array} of {@link Point}s*/
    this.points = []
    
    /**The {@link Style} of the polyline*/
    this.style = new Style();
    
    /**The starting {@link Point}. 
     * Required for path, we could use getPoints(), but this existed first.
     * Also its a lot simpler. Each other element used in path already has a startPoint
     * //TODO: (added by alex) This is bullshit....we need to remove this kind of junky code
     **/
    this.startPoint = null;
    
    /**Serialization type*/
    this.oType = 'Polyline'; //object type used for JSON deserialization
}

/**Creates a {Polyline} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Polyline} a newly constructed Polyline
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Polyline.load = function(o){
    var newPolyline = new Polyline();
    newPolyline.points = Point.loadArray(o.points);
    newPolyline.style = Style.load(o.style);
    newPolyline.startPoint = Point.load(o.startPoint);
    return newPolyline;
}

Polyline.prototype = {
    constructor : Polyline,
    
    addPoint:function(point){
        if(this.points.length==0){
            this.startPoint=point;
        }
        this.points.push(point);
    },
    transform:function(matrix){
        with(this){
            if(style!=null){
                style.transform(matrix);
            }
            for(var i=0; i<points.length; i++){
                points[i].transform(matrix);
            }
            }
    },
    getPoints:function(){
        var p=[];
        for (var i=0; i<this.points.length; i++){
            p.push(this.points[i]);
        }
        return p;
    },

    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    clone:function(){
        var ret=new Polyline();
        with(this){
            for(var i=0; i<points.length; i++){
                ret.addPoint(points[i].clone());
            }
            }
        ret.style=this.style.clone();
        return ret;
    },


    equals:function(anotherPolyline){
        if(!anotherPolyline instanceof Polyline){
            return false;
        }
        if(anotherPolyline.points.length == this.points.length){
            for(var i=0; i<this.points.length; i++){
                if(!this.points[i].equals(anotherPolyline.points[i])){
                    return false;
                }
            }
        }
        else{
            return false;
        }

        if(!this.style.equals(anotherPolyline.style)){
            return false;
        }

        if(!this.startPoint.equals(anotherPolyline.startPoint)){
            return false;
        }



        return true;
    },
    paint:function(context){
        with(this){
            if(style!=null){
                style.setupContext(context);
            }
            context.moveTo(points[0].x,points[0].y);
            for(var i=1; i<points.length; i++){
                context.lineTo(points[i].x,points[i].y);
            }
            if(style.strokeStyle!=null && this.style.strokeStyle!=""){
                context.stroke();
            }
            if(style.fillStyle!=null && this.style.fillStyle!=""){
                context.fill();
            }
            }
    },

    contains:function(x, y){
        return Util.isPointInside(new Point(x, y), this.getPoints())
    },

    near:function(x,y,radius){
        with(this){
            for(var i=0; i< points.length-1; i++){
                var l=new Line(points[i],points[i+1]);
                if(l.near(x,y)){
                    return true;
                }
            }
            return false;
            }

    },

    toString:function(){
        var result = 'polyline(';
        with(this){
            for(var i=0; i < points.length; i++){
                result += points[i].toString() + ' ';
            }
            }
        result += ')';
        return result;
    },

    /**Render the SVG fragment for this primitive*/
    toSVG:function(){
        //<polyline points="0,0 0,20 20,20 20,40 40,40 40,60" style="fill:white;stroke:red;stroke-width:2"/>
        var result = "\n" + repeat("\t", INDENTATION) + '<polyline points="';
        for(var i=0; i < this.points.length; i++){
            result += this.points[i].x + ',' + this.points[i].y + ' ';
        }
        result += '"';
        result += this.style.toSVG();
        result += '/>';

        return result;
    }
}


/**
  * Creates an instance of a Polygon
  *
  * @constructor
  * @this {Polygon}
  * @author Alex Gheorghiu <alex@scriptoid.com>
  **/
function Polygon(){
    /**An {Array} of {@link Point}s*/
    this.points = []
    
    /**The {@link Style} of the polygon*/
    this.style = new Style();
    
    /**Serialization type*/
    this.oType = 'Polygon'; //object type used for JSON deserialization
}

/**Creates a {Polygon} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Polygon} a newly constructed Polygon
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Polygon.load = function(o){
    var newPolygon = new Polygon();
    newPolygon.points = Point.loadArray(o.points);
    newPolygon.style = Style.load(o.style);
    return newPolygon;
}


Polygon.prototype = {
    contructor : Polygon,
    
    addPoint:function(point){
        this.points.push(point);
    },


    getPosition:function(){
        return [this.points[0].x,[this.points[0].y]];
    },


    paint:function(context){
        with(context){
            beginPath();
            if(this.style!=null){
                this.style.setupContext(context);
            }
            if(this.points.length > 1){
                moveTo(this.points[0].x, this.points[0].y);
                for(var i=1; i<this.points.length; i++){
                    lineTo(this.points[i].x, this.points[i].y)
                }
            }
            closePath();

            //first fill
            if(this.style.fillStyle!=null && this.style.fillStyle!=""){
                fill();
            }

            //then stroke
            if(this.style.strokeStyle!=null && this.style.strokeStyle!=""){
                stroke();
            }
            }
    },

    getPoints:function(){
        return this.points;
    },

    /**
     *@return {Array<Number>} - returns [minX, minY, maxX, maxY] - bounds, where
     *  all points are in the bounds.*/
    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    fill:function(context,color){
        with(this){
            context.fillStyle=color;
            context.beginPath();
            context.moveTo(points[0].x,points[0].y);
            for(var i=1; i<points.length; i++){
                context.lineTo(points[i].x,points[i].y);
            }
            context.lineTo(points[0].x,points[0].y);
            context.closePath();
            context.fill();
            }
    },

    near:function(x,y,radius){
        with(this){
            var i=0;
            for(i=0; i< points.length-1; i++){
                var l=new Line(points[i],points[i+1]);
                if(l.near(x,y,radius)){
                    return true;
                }
            }
            l=new Line(points[i],points[0]);
            if(l.near(x,y,radius)){
                return true;
            }
            return false;
            }
    },
    equals:function(anotherPolygon){
        if(!anotherPolygon instanceof Polygon){
            return false;
        }
        with(this){
            if(anotherPolygon.points.length == points.length){
                for(var i=0; i<points.length; i++){
                    if(!points[i].equals(anotherPolygon.points[i])){
                        return false;
                    }
                }
            }
            //TODO: test for all Polygon members
            }
        return true;
    },

    clone:function(){
        var ret=new Polygon();
        with(this){
            for(var i=0; i<points.length; i++){
                ret.addPoint(points[i].clone());
            }
            }
        ret.style=this.style.clone();
        return ret;
    },

    contains:function(x, y){
        var inPath = false;
        var p = new Point(x,y);
        if(!p){
            alert('Polygon: P is null');
        }
        
        return Util.isPointInside(p, this.points);
    },

    transform:function(matrix){
        with(this){
            if(style!=null){
                style.transform(matrix);
            }
            for(var i=0; i < points.length; i++){
                points[i].transform(matrix);
            }
            }
    },

    toString:function(){
        var result = 'polygon(';
        with(this){
            for(var i=0; i < points.length; i++){
                result += points[i].toString() + ' ';
            }
            }
        result += ')';
        return result;
    },

    /**Render the SVG fragment for this primitive*/
    toSVG:function(){
        //<polygon points="220,100 300,210 170,250" style="fill:#cccccc; stroke:#000000;stroke-width:1"/>
        var result = "\n" + repeat("\t", INDENTATION) + '<polygon points="';
        for(var i=0; i < this.points.length; i++){
            result += this.points[i].x + ',' + this.points[i].y + ' ';
        }
        result += '" '
        //+  'style="fill:#cccccc;stroke:#000000;stroke-width:1"'
        +  this.style.toSVG()
        +  ' />';
        return result;
    }
}


/**
  * Creates an instance of a quad curve.
  * A curved line determined by 2 normal points (startPoint and endPoint) and 1 control point (controlPoint)
  *
  * @constructor
  * @this {QuadCurve}
  * @param {Point} startPoint - starting point of the line
  * @param {Point} controlPoint - the control point of the line
  * @param {Point} endPoint - the ending point of the line
  * @see <a href="http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves">http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves</a>
 **/
function QuadCurve(startPoint, controlPoint, endPoint){
    /**The start {@link Point}*/
    this.startPoint = startPoint;
    
    /**The controll {@link Point}*/
    this.controlPoint = controlPoint;
    
    /**The end {@link Point}*/
    this.endPoint = endPoint;
    
    /**The {@link Style} of the quad*/
    this.style = new Style();
    
    /**Serialization type*/
    this.oType = 'QuadCurve'; //object type used for JSON deserialization
}

/**Creates a {QuadCurve} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {QuadCurve} a newly constructed QuadCurve
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
QuadCurve.load = function(o){
    var newQuad = new QuadCurve();
    newQuad.startPoint = Point.load(o.startPoint);
    newQuad.controlPoint = Point.load(o.controlPoint);
    newQuad.endPoint = Point.load(o.endPoint);
    newQuad.style = Style.load(o.style);
    return newQuad;
}

/**Creates an {Array} of {QuadCurve} out of JSON parsed object
 *@param {JSONObject} v - the JSON parsed object (actually an {Array} of {JSONObject}s
 *@return {Array} of {QuadCurve}s
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
QuadCurve.loadArray = function(v){
    var quads = [];

    for(var i=0; i<v.length; i++){
        quads.push(QuadCurve.load(v[i]));
    }

    return quads;
}

QuadCurve.prototype = {
    constructor : QuadCurve,
    
    transform:function(matrix){
        if(this.style!=null){
            this.style.transform(matrix);
        }
        this.startPoint.transform(matrix);
        this.controlPoint.transform(matrix);
        this.endPoint.transform(matrix);
    },

    getPoints:function(){
        //should this return a number of points along the line?
        return [this.startPoint,this.controlPoint,this.endPoint];
    },

    /*We could use an interpolation algorightm t=0,1 and pick 10 points to iterate on ...but for now it's fine
     **/
    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },


    paint:function(context){
        with(context){
            if(this.style!=null){
                this.style.setupContext(context);
            }
            with(this){
                moveTo(startPoint.x,startPoint.y);
                quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
                //first fill
                if(style.fillStyle!=null && this.style.fillStyle!=""){
                    context.fill();
                }

                //then stroke
                if(style.strokeStyle!=null && this.style.strokeStyle!=""){
                    stroke();
                }

                }
            }
    },

    /*
     *TODO: algorithm not clear and maybe we can find the math formula to determine if we have an intersection
     *@see <a href="http://rosettacode.org/wiki/Bitmap/B%C3%A9zier_curves/Quadratic">http://rosettacode.org/wiki/Bitmap/B%C3%A9zier_curves/Quadratic</a>
     */
    near:function(x,y,radius){
        with(this){
            var polls=100;
            if(!Util.isPointInside(new Point(x,y), [startPoint,controlPoint,endPoint]) && !startPoint.near(x,y,radius) && ! endPoint.near(x,y,radius)){
                return false;//not inside the control points, so can't be near the line
            }
            var low=0;
            var high=polls;
            var i=(high-low)/2;
            while(i >= low && i <= high && high-low>0.01){//high-low indicates>0.01 stops us from taking increasingly tiny steps
                i=low+(high-low)/2 //we want the mid point

                //dont fully understand this
                var t = i / polls;
                var fromEnd = Math.pow((1.0 - t), 2); //get how far from end we are and square it
                var a = 2.0 * t * (1.0 - t);
                var fromStart = Math.pow(t, 2); //get how far from start we are and square it
                var newX = fromEnd * startPoint.x + a * controlPoint.x + fromStart * endPoint.x;//?
                var newY = fromEnd * startPoint.y + a * controlPoint.y + fromStart * endPoint.y;//?
                p=new Point(newX,newY);
                if(p.near(x,y,radius)){
                    return true;
                }

                //get distance between start and the point we are looking for, and the current point on line
                pToStart=Math.sqrt(Math.pow(startPoint.x-p.x,2)+Math.pow(startPoint.y-p.y,2));
                myToStart=Math.sqrt(Math.pow(startPoint.x-x,2)+Math.pow(startPoint.y-y,2));

                //if our point is closer to start, we know that our cursor must be between start and where we are
                if(myToStart<pToStart){
                    high=i;
                }
                else if(myToStart!=pToStart){
                    low=i;
                }
                else{
                    return false;//their distance is the same but the point is not near, return false.
                }
                return startPoint.near(x,y,radius)|| endPoint.near(x,y,radius);
            }
            }
    },

    clone:function(){
        ret=new QuadCurve(this.startPoint.clone(),this.controlPoint.clone(),this.endPoint.clone());
        ret.style=this.style.clone();
        return ret;
    },

    equals:function(anotherQuadCurve){
        if(!anotherQuadCurve instanceof QuadCurve){
            return false;
        }

        return this.startPoint.equals(anotherQuadCurve.startPoint)
        && this.controlPoint.equals(anotherQuadCurve.controlPoint)
        && this.endPoint.equals(anotherQuadCurve.endPoint)
        && this.style.equals(anotherQuadCurve.style);
    },

    /**
     *@deprecated
     **/
    deprecated_contains:function(x, y){
        return this.near(x,y,3);
        points=[this.startPoint,this.controlPoint,this.endPoint];
        return Util.isPointInside(new Point(x,y),points);
    },

    /**
     * @see sources for <a href="http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/6-b14/java/awt/geom/QuadCurve2D.java">java.awt.geom.QuadCurve2D</a>
     * @author (just converted to JavaScript) alex@scriptoid.com
     */
    contains:function(x,y) {

        var x1 = this.startPoint.x;
        var y1 = this.startPoint.y;
        var xc = this.controlPoint.x;
        var yc = this.controlPoint.y;
        var x2 = this.endPoint.x;
        var y2 = this.endPoint.y;

        /*
	 * We have a convex shape bounded by quad curve Pc(t)
	 * and ine Pl(t).
	 *
	 *     P1 = (x1, y1) - start point of curve
	 *     P2 = (x2, y2) - end point of curve
	 *     Pc = (xc, yc) - control point
	 *
	 *     Pq(t) = P1*(1 - t)^2 + 2*Pc*t*(1 - t) + P2*t^2 =
	 *           = (P1 - 2*Pc + P2)*t^2 + 2*(Pc - P1)*t + P1
	 *     Pl(t) = P1*(1 - t) + P2*t
	 *     t = [0:1]
	 *
	 *     P = (x, y) - point of interest
	 *
	 * Let's look at second derivative of quad curve equation:
	 *
	 *     Pq''(t) = 2 * (P1 - 2 * Pc + P2) = Pq''
	 *     It's constant vector.
	 *
	 * Let's draw a line through P to be parallel to this
	 * vector and find the intersection of the quad curve
	 * and the line.
	 *
	 * Pq(t) is point of intersection if system of equations
	 * below has the solution.
	 *
	 *     L(s) = P + Pq''*s == Pq(t)
	 *     Pq''*s + (P - Pq(t)) == 0
	 *
	 *     | xq''*s + (x - xq(t)) == 0
	 *     | yq''*s + (y - yq(t)) == 0
	 *
	 * This system has the solution if rank of its matrix equals to 1.
	 * That is, determinant of the matrix should be zero.
	 *
	 *     (y - yq(t))*xq'' == (x - xq(t))*yq''
	 *
	 * Let's solve this equation with 't' variable.
	 * Also let kx = x1 - 2*xc + x2
	 *          ky = y1 - 2*yc + y2
	 *
	 *     t0q = (1/2)*((x - x1)*ky - (y - y1)*kx) /
	 *                 ((xc - x1)*ky - (yc - y1)*kx)
	 *
	 * Let's do the same for our line Pl(t):
	 *
	 *     t0l = ((x - x1)*ky - (y - y1)*kx) /
	 *           ((x2 - x1)*ky - (y2 - y1)*kx)
	 *
	 * It's easy to check that t0q == t0l. This fact means
	 * we can compute t0 only one time.
	 *
	 * In case t0 < 0 or t0 > 1, we have an intersections outside
	 * of shape bounds. So, P is definitely out of shape.
	 *
	 * In case t0 is inside [0:1], we should calculate Pq(t0)
	 * and Pl(t0). We have three points for now, and all of them
	 * lie on one line. So, we just need to detect, is our point
	 * of interest between points of intersections or not.
	 *
	 * If the denominator in the t0q and t0l equations is
	 * zero, then the points must be collinear and so the
	 * curve is degenerate and encloses no area.  Thus the
	 * result is false.
	 */
        var kx = x1 - 2 * xc + x2;
        var ky = y1 - 2 * yc + y2;
        var dx = x - x1;
        var dy = y - y1;
        var dxl = x2 - x1;
        var dyl = y2 - y1;

        var t0 = (dx * ky - dy * kx) / (dxl * ky - dyl * kx);
        if (t0 < 0 || t0 > 1 || t0 != t0) {
            return false;
        }

        var xb = kx * t0 * t0 + 2 * (xc - x1) * t0 + x1;
        var yb = ky * t0 * t0 + 2 * (yc - y1) * t0 + y1;
        var xl = dxl * t0 + x1;
        var yl = dyl * t0 + y1;

        return (x >= xb && x < xl) ||
        (x >= xl && x < xb) ||
        (y >= yb && y < yl) ||
        (y >= yl && y < yb);
    },

    toString:function(){
        return 'quad(' + this.startPoint + ',' + this.controlPoint + ',' + this.endPoint + ')';
    },

    /**Render the SVG fragment for this primitive
     *@see <a href="http://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands">http://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands</a>
     **/
    toSVG:function(){
        //<path d="M200,300 Q400,50 600,300 T1000,300" fill="none" stroke="red" stroke-width="5"  />

        var result = "\n" + repeat("\t", INDENTATION) + '<path d="M';
        result += this.startPoint.x + ',' + this.endPoint.y;
        result += ' Q' + this.controlPoint.x + ',' + this.controlPoint.y;
        result += ' ' + this.endPoint.x + ',' + this.endPoint.y;

        result += '" '
        +  this.style.toSVG()
        +  ' />';

        return result;
    }
}


/**
  * Creates an instance of a cubic curve.
  * A curved line determined by 2 normal points (startPoint and endPoint) and 2 control points (controlPoint1, controlPoint2)
  *
  * @constructor
  * @this {CubicCurve}
  * @param {Point} startPoint - starting point of the line
  * @param {Point} controlPoint1 - 1st control point of the line
  * @param {Point} controlPoint2 - 2nd control point of the line
  * @param {Point} endPoint - the ending point of the line
  * @see <a href="http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B.C3.A9zier_curves">http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B.C3.A9zier_curves</a>
 **/
function CubicCurve(startPoint, controlPoint1, controlPoint2, endPoint){
    /**The start {@link Point}*/
    this.startPoint = startPoint;
    
    /**The first controll {@link Point}*/
    this.controlPoint1 = controlPoint1;
    
    /**The second controll {@link Point}*/
    this.controlPoint2 = controlPoint2;
    
    /**The end {@link Point}*/
    this.endPoint = endPoint;
    
    /**The {@link Style} of the quad*/
    this.style = new Style();
    
    /**Object type used for JSON deserialization*/
    this.oType = 'CubicCurve';
}

/**Creates a {CubicCurve} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {CubicCurve} a newly constructed CubicCurve
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
CubicCurve.load = function(o){
    var newCubic = new CubicCurve();

    newCubic.startPoint = Point.load(o.startPoint);
    newCubic.controlPoint1 = Point.load(o.controlPoint1);
    newCubic.controlPoint2 = Point.load(o.controlPoint2);
    newCubic.endPoint = Point.load(o.endPoint);

    newCubic.style = Style.load(o.style);
    return newCubic;
}


CubicCurve.prototype = {
    constructor : CubicCurve,
    
    transform:function(matrix){
        if(this.style!=null){
            this.style.transform(matrix);
        }
        this.startPoint.transform(matrix);
        this.controlPoint1.transform(matrix);
        this.controlPoint2.transform(matrix);
        this.endPoint.transform(matrix);
    },
    paint:function(context){
        with(this){
            if(style!=null){
                style.setupContext(context);
            }
            context.moveTo(startPoint.x,startPoint.y);
            context.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y)


            if(style.fillStyle!=null && this.style.fillStyle!=""){
                context.fill();
            }

            if(style.strokeStyle!=null && this.style.strokeStyle!=""){
                context.stroke();
            }
            }
    },

    clone:function(){
        ret = new CubicCurve(this.startPoint.clone(),this.controlPoint1.clone(), this.controlPoint2.clone(),this.endPoint.clone());
        ret.style=this.style.clone();
        return ret;
    },

    equals:function(anotherCubicCurve){
        if(!anotherCubicCurve instanceof CubicCurve){
            return false;
        }
        return this.startPoint.equals(anotherCubicCurve.startPoint)
        && this.controlPoint1.equals(anotherCubicCurve.controlPoint1)
        && this.controlPoint2.equals(anotherCubicCurve.controlPoint2)
        && this.endPoint.equals(anotherCubicCurve.endPoint);
    },

    /**@deprecated*/
    deprecated_contains:function(x,y){
        with(this){
            var q1=new QuadCurve(startPoint,controlPoint1,controlPoint2);
            var q2=new QuadCurve(controlPoint1,controlPoint2,endPoint);
            return q1.contains(x,y) || q2.contains(x,y);
            //restore();
            }

    },

    /**
     * Inspired by java.awt.geom.CubicCurve2D
     */
    contains:function(x, y) {
        if (!(x * 0.0 + y * 0.0 == 0.0)) {
            /* Either x or y was infinite or NaN.
             * A NaN always produces a negative response to any test
             * and Infinity values cannot be "inside" any path so
             * they should return false as well.
             */
            return false;
        }
        // We count the "Y" crossings to determine if the point is
        // inside the curve bounded by its closing line.
        var x1 = this.startPoint.x//getX1();
        var y1 = this.startPoint.y//getY1();
        var x2 = this.endPoint.x//getX2();
        var y2 = this.endPoint.y//getY2();
        var crossings =
        (Util.pointCrossingsForLine(x, y, x1, y1, x2, y2) +
            Util.pointCrossingsForCubic(x, y,
                x1, y1,
                this.controlPoint1.x, this.controlPoint1.y,
                this.controlPoint2.x, this.controlPoint2.y,
                x2, y2, 0));
        return ((crossings & 1) == 1);
    },


    /**
     *TODO: algorithm not clear and maybe we can find the math formula to determine if we have an intersection
     *@see <a href="http://rosettacode.org/wiki/Bitmap/B%C3%A9zier_curves/Cubic">http://rosettacode.org/wiki/Bitmap/B%C3%A9zier_curves/Cubic</a>
     */
    near:function(x,y,radius){
        var polls=100;
        with(this){
            for(i=0; i<=polls; ++i){
                var t=i/polls;
                var fromEnd=Math.pow((1 - t), 3);
                var fromStart=Math.pow(t, 3);
                var b = 3 * t * Math.pow((1 - t), 2);
                var c = 3 * Math.pow(t, 2) * (1 - t);
                var newX = fromEnd * startPoint.x + b * controlPoint1.x + c * controlPoint2.x + fromStart * endPoint.x;
                var newY = fromEnd * startPoint.y + b * controlPoint1.y + c * controlPoint2.y + fromStart * endPoint.y;
                var p=new Point(newX,newY);
                if(p.near(x,y,radius)){
                    return true;
                }
            }
            }
        return false
    },

    getPoints:function(){
        return [this.startPoint,this.controlPoint1,this.controlPoint2,this.endPoint];
    },

    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    toString:function(){
        return 'quad(' + this.startPoint + ',' + this.controlPoint1 + ',' + this.controlPoint2 + ',' + this.endPoint + ')';
    },

    /**Render the SVG fragment for this primitive
     *@see <a href="http://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands">http://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands</a>
     **/
    toSVG:function(){
        //<path d="M100,200 C100,100 250,100 250,200" />


        var result = "\n" + repeat("\t", INDENTATION) +  '<path d="M';
        result += this.startPoint.x + ',' + this.endPoint.y;
        result += ' C' + this.controlPoint1.x + ',' + this.controlPoint1.y;
        result += ' ' + this.controlPoint2.x + ',' + this.controlPoint2.y;
        result += ' ' + this.endPoint.x + ',' + this.endPoint.y;

        result += '" style="' + this.style.toSVG() +  '"  />';
        return result;
    }
}


/**
 * Draws an arc.
 * To allow easy transformations of the arc we will simulate the arc by a series of curves
 *
 * @constructor
 * @this {Arc}
 * @param {Number} x - the X coordinates of the "imaginary" circle of which the arc is part of
 * @param {Number} y - the Y coordinates of the "imaginary" circle of which the arc is part of
 * @param {Number} radius - the radius of the arc
 * @param {Number} startAngle - the degrees (not radians as in Canvas'specs) of the starting angle for this arc
 * @param {Number} endAngle - the degrees (not radians as in Canvas'specs) of the starting angle for this arc
 * @param {Number} direction - the direction of drawing. For now it's from startAngle to endAngle (anticlockwise). Not really used
 * @param {Number} styleFlag (optional) -
 * 1: close path between start of arc and end,
 * 2: draw pie slice, line to center point, line to start point
 * default: empty/0/anything else: just draw the arc
 * TODO: make it a class constant
 * @see <a href="http://STACKoverflow.com/questions/2688808/drawing-quadratic-bezier-circles-with-a-given-radius-how-to-determine-control-po">http://STACKoverflow.com/questions/2688808/drawing-quadratic-bezier-circles-with-a-given-radius-how-to-determine-control-po</a>
 **/

function Arc(x, y, radius, startAngle, endAngle, direction, styleFlag){
    /**End angle. Required for dashedArc*/
    this.endAngle = endAngle;
    
    /**Start angle. required for dashedArc*/
    this.startAngle = startAngle;
    
    /**The center {@link Point} of the circle*/
    this.middle = new Point(x,y); 
    
    /**The radius of the circle*/
    this.radius = radius 
    
    /**An {Array} of {@link QuadCurve}s used to draw the arc*/
    this.curves = [];
    
    /**Accuracy. It tells the story of how many QuadCurves we will use*/
    var numControlPoints = 8;
    
    /**The start {@link Point}*/
    this.startPoint = null;
    
    /**The end {@link Point}*/
    this.endPoint = null;
    
    /**The start angle, in radians*/
    this.startAngleRadians = 0;
    
    /**The end angle, in radians*/
    this.endAngleRadians = 0;

    //code shamelessly stollen from the above site.
    var start = Math.PI/180 * startAngle; //convert the angles back to radians
    this.startAngleRadians = start;
    this.endAngleRadians = Math.PI/180 * endAngle;
    var arcLength = (Math.PI/180*(endAngle-startAngle))/ numControlPoints;
    for (var i = 0; i < numControlPoints; i++) {
        if (i < 1)
        {
            this.startPoint = new Point(x + radius * Math.cos(arcLength * i),y + radius * Math.sin(arcLength * i))
        }
        var startPoint=new Point(x + radius * Math.cos(arcLength * i),y + radius * Math.sin(arcLength * i))

        //control radius formula
        //where does it come from, why does it work?
        var controlRadius = radius / Math.cos(arcLength * .5);

        //the control point is plotted halfway between the arcLength and uses the control radius
        var controlPoint=new Point(x + controlRadius * Math.cos(arcLength * (i + 1) - arcLength * .5),y + controlRadius * Math.sin(arcLength * (i + 1) - arcLength * .5))
        if (i == (numControlPoints - 1))
        {
            this.endPoint = new Point(x + radius * Math.cos(arcLength * (i + 1)),y + radius * Math.sin(arcLength * (i + 1)));
        }
        var endPoint=new Point(x + radius * Math.cos(arcLength * (i + 1)),y + radius * Math.sin(arcLength * (i + 1)));


        //if we arent starting at 0, rotate it to where it needs to be

        //move to origin (O)
        startPoint.transform(Matrix.translationMatrix(-x,-y));
        controlPoint.transform(Matrix.translationMatrix(-x,-y));
        endPoint.transform(Matrix.translationMatrix(-x,-y));

        //rotate by angle (start)
        startPoint.transform(Matrix.rotationMatrix(start));
        controlPoint.transform(Matrix.rotationMatrix(start));
        endPoint.transform(Matrix.rotationMatrix(start));

        //move it back to where it was
        startPoint.transform(Matrix.translationMatrix(x,y));
        controlPoint.transform(Matrix.translationMatrix(x,y));
        endPoint.transform(Matrix.translationMatrix(x,y));

        this.curves.push(new QuadCurve(startPoint,controlPoint,endPoint));
    }

    /**The style flag - see  contructor's arguments*/
    this.styleFlag = styleFlag;
    
    /**The {@link Style} of the arc*/
    this.style = new Style();
    
    /**Adding a reference to the end point makes the transform code hugely cleaner*/
    this.direction = direction;
    
    /**Object type used for JSON deserialization*/
    this.oType = 'Arc';
}


/**Creates a {Arc} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Arc} a newly constructed Arc
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Arc.load = function(o){
    var newArc = new Arc();

    newArc.endAngle = o.endAngle;
    newArc.startAngle = o.startAngle;
    newArc.middle = Point.load(o.middle);
    newArc.radius = o.radius
    newArc.curves = QuadCurve.loadArray(o.curves);

    /*we need to load these 'computed' values as they are computed only in constructor :(
     *TODO: maybe make a new function setUp() that deal with this*/
    newArc.startPoint = Point.load(o.startPoint);
    newArc.endPoint = Point.load(o.endPoint);
    newArc.startAngleRadians = o.startAngleRadians;
    newArc.endAngleRadians = o.endAngleRadians;

    newArc.styleFlag = o.styleFlag;
    newArc.style = Style.load(o.style);

    return newArc;
}

/**Creates a {Arc} out of an Array of JSON parsed object
 *@param {Array} v - an {Array} of JSON parsed objects
 *@return {Array}of newly constructed Arcs
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Arc.loadArray = function(v){
    var newArcs = [];

    for(var i=0; i<v.length; i++){
        newArcs.push(Arc.load(v[i]));
    }

    return newArcs;
}



Arc.prototype = {
    
    constructor : Arc,
    
    transform:function(matrix){
        /* rotations - ok
         * translations - ok
         * scale - ok
         * skew - NOT ok (i do not know how to preserve points, angles...etc- maybe a Cola :)
         **/
        with(this){
            //transform the style
            if(style!=null){
                style.transform(matrix);
            }

            //transform the center of the circle
            middle.transform(matrix);

            //transform each curve
            for(var i=0; i<curves.length; i++){
                curves[i].transform(matrix);
            }
            }
    },


    paint:function(context){
        with(this){
            if(style!=null){
                style.setupContext(context);
            }
            context.lineWidth = style.lineWidth;
            //context.arc(x,y,radius,(Math.PI/180)*startAngle,(Math.PI/180)*endAngle,direction);
            context.moveTo(curves[0].startPoint.x,curves[0].startPoint.y);
            for(var i=0; i<curves.length; i++){
                context.quadraticCurveTo(curves[i].controlPoint.x,curves[i].controlPoint.y,curves[i].endPoint.x,curves[i].endPoint.y)
            //curves[i].paint(context);
            }

            if(styleFlag == 1){
                context.closePath();
            }
            else if(styleFlag == 2){
                context.lineTo(this.middle.x,this.middle.y);
                context.closePath();
            }

            //first fill
            if(style.fillStyle!=null && this.style.fillStyle!=""){
                context.fill();
            }

            //then stroke
            if(style.strokeStyle!=null && this.style.strokeStyle!=""){
                context.stroke();
            }

            }
    },

    clone:function(){
        with(this){
            var ret = new Arc(middle.x,middle.y,radius,startAngle,endAngle,direction,styleFlag);
            for (var i=0; i< this.curves.length; i++){
                ret.curves[i]=this.curves[i].clone();
            }
            ret.style=this.style.clone();
            return ret;
            }
    },

    equals:function(anotherArc){
        if(!anotherArc instanceof Arc){
            return false;
        }

        //check curves
        for(var i = 0 ; i < this.curves.lenght; i++){
            if(!this.curves[i].equals(anotherArc.curves[i])){
                return false;
            }
        }

        return this.startAngle == anotherArc.startAngle
        && this.endAngle == anotherArc.endAngle
        && this.middle.equals(anotherArc.middle)
        && this.radius == anotherArc.radius
        && this.numControlPoints == anotherArc.numControlPoints
        && this.startPoint.equals(anotherArc.startPoint)
        && this.endPoint.equals(anotherArc.endPoint)
        && this.startAngleRadians == anotherArc.startAngleRadians
        && this.endAngleRadians == anotherArc.endAngleRadians
    ;
    },

    near:function(thex,they,theradius){
        with(this){
            for(var i=0; i<curves.length; i++){
                if(curves[i].near(thex,they,radius)){
                    return true;
                }
            }
            //return (distance && angle) || finishLine || startLine || new Point(x,y).near(thex,they,theradius);
            }

        return false;
    },

    contains: function(thex,they){
        with(this){
            var p = getPoints();
            return Util.isPointInside((new Point(thex,they)), p);
            }

    },

    /**Get the points of the Arc
     *@return {Array} of {Point}s
     *@author Zack
     **/
    getPoints:function(){
        var p = [];
        if(this.styleFlag ==2){
            p.push(this.middle);
        }
        for(var i=0; i<this.curves.length; i++){
            var c = this.curves[i].getPoints();
            for(var a=0; a<c.length; a++){
                p.push(c[a]);
            }
        }
        return p;
    },

    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    toString:function(){
        return 'arc(' + new Point(this.x,this.y) + ','  + this.radius + ',' + this.startAngle + ',' + this.endAngle + ',' + this.direction + ')';
    },


    /**
     *As we simulate an arc by {QuadCurve}s so we will collect all of them
     *and add it to a <path/> element.
     *Note: We might use the SVG's arc command but what if the arc got distorted by a transformation?
     *@see <a href="http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands">http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands</a>
     *@see <a href="http://tutorials.jenkov.com/svg/path-element.html">http://tutorials.jenkov.com/svg/path-element.html</a>
     *@author Alex <alex@scriptoid.com>
     **/
    toSVG: function(){
        var r = "\n" + repeat("\t", INDENTATION) + '<path d="';
        r += ' M' + this.curves[0].startPoint.x  + ',' + this.curves[0].startPoint.y
        for(var i=0; i<this.curves.length; i++){
            r += ' Q' + this.curves[i].controlPoint.x  + ',' + this.curves[i].controlPoint.y
            + ' ' + this.curves[i].endPoint.x + ',' + this.curves[i].endPoint.y;
        }
        r += '" ';
        r += this.style.toSVG();
        r += '/>';
        return r;
    }
}



/**
 * Approximate an ellipse through 4 bezier curves, one for each quadrant
 * 
 * @constructor
 * @this {Ellipse}
 * @param {Point} centerPoint - the center point of the ellipse
 * @param {Number} width - the width of the ellipse
 * @param {Number} height - the height of the ellipse

 * @see <a href="http://www.codeguru.com/cpp/g-m/gdi/article.php/c131">http://www.codeguru.com/cpp/g-m/gdi/article.php/c131</a>
 * @see <a href="http://www.tinaja.com/glib/ellipse4.pdf">http://www.tinaja.com/glib/ellipse4.pdf</a>
 * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 **/
function Ellipse(centerPoint, width, height) {
    /**"THE" constant*/
    var EToBConst = 0.2761423749154;

    /**Width offset*/
    var offsetWidth = width * 2 * EToBConst;
    
    /**Height offset*/    
    var offsetHeight = height * 2 * EToBConst;
    
    /**The center {@link Point}*/
    this.centerPoint = centerPoint;
    
    /**Top left {@link CubicCurve}*/
    this.topLeftCurve = new CubicCurve(new Point(centerPoint.x-width,centerPoint.y),new Point(centerPoint.x-width,centerPoint.y-offsetHeight),new Point(centerPoint.x-offsetWidth,centerPoint.y-height),new Point(centerPoint.x,centerPoint.y-height));
    
    /**Top right {@link CubicCurve}*/
    this.topRightCurve = new CubicCurve(new Point(centerPoint.x,centerPoint.y-height),new Point(centerPoint.x+offsetWidth,centerPoint.y-height),new Point(centerPoint.x+width,centerPoint.y-offsetHeight),new Point(centerPoint.x+width,centerPoint.y));
    
    /**Bottom right {@link CubicCurve}*/
    this.bottomRightCurve = new CubicCurve(new Point(centerPoint.x+width,centerPoint.y),new Point(centerPoint.x+width,centerPoint.y+offsetHeight),new Point(centerPoint.x+offsetWidth,centerPoint.y+height),new Point(centerPoint.x,centerPoint.y+height));
    
    /**Bottom left {@link CubicCurve}*/
    this.bottomLeftCurve = new CubicCurve(new Point(centerPoint.x,centerPoint.y+height),new Point(centerPoint.x-offsetWidth,centerPoint.y+height),new Point(centerPoint.x-width,centerPoint.y+offsetHeight),new Point(centerPoint.x-width,centerPoint.y));
    
    /**The matrix array*/
    this.matrix = null; //TODO: do we really need this?
    
    /**The {@link Style} used*/
    this.style = new Style();
    
    /**Oject type used for JSON deserialization*/
    this.oType = 'Ellipse'; 
}

/**Creates a new {Ellipse} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Ellipse} a newly constructed Ellipse
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Ellipse.load = function(o){
    var newEllipse= new Ellipse(new Point(0,0), 0, 0); //fake ellipse (if we use a null centerPoint we got errors)

    newEllipse.offsetWidth = o.offsetWidth;
    newEllipse.offsetHeight = o.offsetHeight;
    newEllipse.centerPoint = Point.load(o.centerPoint);
    newEllipse.topLeftCurve = CubicCurve.load(o.topLeftCurve);
    newEllipse.topRightCurve = CubicCurve.load(o.topRightCurve);
    newEllipse.bottomRightCurve = CubicCurve.load(o.bottomRightCurve);
    newEllipse.bottomLeftCurve = CubicCurve.load(o.bottomLeftCurve);
    this.matrix = Matrix.clone(o.matrix);
    newEllipse.style = Style.load(o.style);

    return newEllipse;
}


Ellipse.prototype = {
    constructor: Ellipse,
    
    transform:function(matrix){
        this.topLeftCurve.transform(matrix);
        this.topRightCurve.transform(matrix);
        this.bottomLeftCurve.transform(matrix);
        this.bottomRightCurve.transform(matrix);
        this.centerPoint.transform(matrix);
        if(this.style){
            this.style.transform(matrix);
        }
    },

    paint:function(context){
        with(context){
            with(this){
                if(style!=null){
                    style.setupContext(context);
                }
                beginPath();
                moveTo(topLeftCurve.startPoint.x,topLeftCurve.startPoint.y);
                bezierCurveTo(topLeftCurve.controlPoint1.x,topLeftCurve.controlPoint1.y,topLeftCurve.controlPoint2.x,topLeftCurve.controlPoint2.y,topLeftCurve.endPoint.x,topLeftCurve.endPoint.y);
                bezierCurveTo(topRightCurve.controlPoint1.x,topRightCurve.controlPoint1.y,topRightCurve.controlPoint2.x,topRightCurve.controlPoint2.y,topRightCurve.endPoint.x,topRightCurve.endPoint.y);
                bezierCurveTo(bottomRightCurve.controlPoint1.x,bottomRightCurve.controlPoint1.y,bottomRightCurve.controlPoint2.x,bottomRightCurve.controlPoint2.y,bottomRightCurve.endPoint.x,bottomRightCurve.endPoint.y);
                bezierCurveTo(bottomLeftCurve.controlPoint1.x,bottomLeftCurve.controlPoint1.y,bottomLeftCurve.controlPoint2.x,bottomLeftCurve.controlPoint2.y,bottomLeftCurve.endPoint.x,bottomLeftCurve.endPoint.y);
                //first fill
                if(style.fillStyle!=null && this.style.fillStyle!=""){
                    fill();
                }

                //then stroke
                if(style.strokeStyle!=null && this.style.strokeStyle!=""){
                    stroke();
                }

                }
            }
    },

    contains:function(x,y){
        with(this){
            var points = topLeftCurve.getPoints();
            curves = [topRightCurve, bottomRightCurve, bottomLeftCurve];
            for(var i=0; i<curves.length; i++){
                curPoints = curves[i].getPoints();

                for(var a=0; a<curPoints.length; a++){
                    points.push(curPoints[a]);
                }
            }
            return Util.isPointInside(new Point(x,y), points);
            }

        return false;
    },

    near:function(x,y,radius){
        return this.topLeftCurve.near(x,y,radius) || this.topRightCurve.near(x,y,radius) || this.bottomLeftCurve.near(x,y,radius) || this.bottomRightCurve.near(x,y,radius);
    },

    equals:function(anotherEllipse){
        if(!anotherEllipse instanceof Ellipse){
            return false;
        }

        return this.offsetWidth == anotherEllipse.offsetWidth
        && this.offsetHeight == anotherEllipse.offsetHeight
        && this.centerPoint.equals(anotherEllipse.centerPoint)
        && this.topLeftCurve.equals(anotherEllipse.topLeftCurve)
        && this.topRightCurve.equals(anotherEllipse.topRightCurve)
        && this.bottomRightCurve.equals(anotherEllipse.bottomRightCurve)
        && this.bottomLeftCurve.equals(anotherEllipse.bottomLeftCurve);
    //TODO: add this && this.matrix.equals(anotherEllipse.bottomLeftCurve)
    //TODO: add this && this.style.equals(anotherEllipse.bottomLeftCurve)
    },

    clone:function(){
        var ret=new Ellipse(this.centerPoint.clone(),10,10);
        ret.topLeftCurve=this.topLeftCurve.clone();
        ret.topRightCurve=this.topRightCurve.clone();
        ret.bottomLeftCurve=this.bottomLeftCurve.clone();
        ret.bottomRightCurve=this.bottomRightCurve.clone();
        ret.style=this.style.clone();
        return ret;
    },

    toString:function(){
        return 'ellipse('+this.centerPoint+","+this.xRadius+","+this.yRadius+")";
    },

    /**
     *@see <a href="http://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands">http://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands</a>
     *@author Alex Gheorghiu <scriptoid.com>
     **/
    toSVG: function(){
        var result = "\n" + repeat("\t", INDENTATION) +  '<path d="M';
        result += this.topLeftCurve.startPoint.x + ',' + this.topLeftCurve.startPoint.y;

        //top left curve
        result += ' C' + this.topLeftCurve.controlPoint1.x + ',' + this.topLeftCurve.controlPoint1.y;
        result += ' ' + this.topLeftCurve.controlPoint2.x + ',' + this.topLeftCurve.controlPoint2.y;
        result += ' ' + this.topLeftCurve.endPoint.x + ',' + this.topLeftCurve.endPoint.y;

        //top right curve
        result += ' C' + this.topRightCurve.controlPoint1.x + ',' + this.topRightCurve.controlPoint1.y;
        result += ' ' + this.topRightCurve.controlPoint2.x + ',' + this.topRightCurve.controlPoint2.y;
        result += ' ' + this.topRightCurve.endPoint.x + ',' + this.topRightCurve.endPoint.y;

        //bottom right curve
        result += ' C' + this.bottomRightCurve.controlPoint1.x + ',' + this.bottomRightCurve.controlPoint1.y;
        result += ' ' + this.bottomRightCurve.controlPoint2.x + ',' + this.bottomRightCurve.controlPoint2.y;
        result += ' ' + this.bottomRightCurve.endPoint.x + ',' + this.bottomRightCurve.endPoint.y;

        //bottom left curve
        result += ' C' + this.bottomLeftCurve.controlPoint1.x + ',' + this.bottomLeftCurve.controlPoint1.y;
        result += ' ' + this.bottomLeftCurve.controlPoint2.x + ',' + this.bottomLeftCurve.controlPoint2.y;
        result += ' ' + this.bottomLeftCurve.endPoint.x + ',' + this.bottomLeftCurve.endPoint.y;

        result += '" ' + this.style.toSVG() +  '  />';
        return result;

    },

    getPoints:function(){
        var points = [];
        var curves = [this.topLeftCurve, this.topRightCurve,this.bottomRightCurve,this.bottomLeftCurve];

        for(var i=0; i<curves.length; i++){
            var curPoints = curves[i].getPoints();
            for(var a=0; a<curPoints.length; a++){
                points.push(curPoints[a]);
            }
        }
        return points;
    },


    getBounds:function(){
        return Util.getBounds(this.getPoints());
    }
}



/**
 * Approximate an ellipse through 4 bezier curves, one for each quadrant
 * 
 * @constructor
 * @this {DashedArc}
 * @param {Number} x - x coodinated of the center of the "invisible" circle
 * @param {Number} y - y coodinated of the center of the "invisible" circle
 * @param {Number} radius - the radius of the "invisible" circle
 * @param {Number} startAngle - the angle the arc will start from
 * @param {Number} endAngle - the angle the arc will end into
 * @param {Number} direction - direction of drawing (clockwise or anti-clock wise)
 * @param {Style} styleFlag - the style of the arc
 * @param {Number} dashGap - how big the gap between the lines will be

 * @see <a href="http://www.codeguru.com/cpp/g-m/gdi/article.php/c131">http://www.codeguru.com/cpp/g-m/gdi/article.php/c131</a>
 * @see <a href="http://www.tinaja.com/glib/ellipse4.pdf">http://www.tinaja.com/glib/ellipse4.pdf</a>
 * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 **/
function DashedArc(x, y, radius, startAngle, endAngle, direction, styleFlag, dashGap){
    /**The "under the hood" {@link Arc}*/
    this.arc = new Arc(x, y, radius, startAngle, endAngle, direction, styleFlag);
    
    /*The {@link Style} used**/
    this.style = this.arc.style;
    
    /**The gap between dashes*/
    this.dashWidth = dashGap;
    
    /**An {Array} or {@link Arc}s*/
    this.lines = []; //an {Array} of {Arc}s

    //init the parts
    for(var i=0; i<100; i += this.dashWidth){
        var a = new Arc(x, y, radius+this.style.lineWidth/2, (endAngle-startAngle)/100*i, (endAngle-startAngle)/100*(i+1), false);
        a.style.strokeStyle = this.style.strokeStyle;
        this.lines.push(a);
    }

    /**Object type used for JSON deserialization*/
    this.oType = 'DashedArc'; 
}

/**Creates a new {Ellipse} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {DashedArc} a newly constructed DashedArc
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
DashedArc.load = function(o){
    var newDashedArc = new DashedArc(100,100,30,0,360,false,0,6); //fake dashed (if we do not use it we got errors - endless loop)
    newDashedArc.style.fillStyle="#ffffff"

    newDashedArc.arc = Arc.load(o.arc);
    newDashedArc.style = newDashedArc.arc.style; //strange but...
    newDashedArc.dashWidth = o.dashWidth;
    newDashedArc.lines = Arc.loadArray(o.lines);


    return newDashedArc;
}


DashedArc.prototype = {
    constructor: DashedArc,
    
    transform:function(matrix){
        this.arc.transform(matrix);
        for (var i=0; i<this.lines.length; i++){
            this.lines[i].transform(matrix);
        }
    },

    getBounds:function(){
        return this.arc.getBounds();
    },

    getPoints:function(){
        return this.arc.getPoints();
    },

    contains:function(x,y){
        return this.arc.contains(x,y);
    },

    near:function(x,y,radius){
        return this.arc.near(x,y,radius);
    },


    toString:function(){
        return this.arc.toString();
    },


    toSVG: function(){
        throw 'Arc:toSVG() - not implemented';
    },

    /***/
    equals:function(anotherDashedArc){
        if(!anotherDashedArc instanceof DashedArc){
            return false;
        }


        if(this.lines.length != anotherDashedArc.lines.length){
            return false;
        }
        else{
            for(var i in this.lines){
                if(!this.lines[i].equals(anotherDashedArc.lines[i])){
                    return false;
                }
            }
        }

        return this.arc.equals(anotherDashedArc.arc)
        && this.style.equals(anotherDashedArc.style)
        && this.dashWidth == anotherDashedArc.dashWidth;
    },

    clone:function(){
        return this.arc.clone();
    },

    paint:function(context){
        this.style.setupContext(context);
        context.lineCap="round"//this.style.lineCap;
        for(var i=0; i<this.lines.length; i++){
            context.beginPath();
            this.lines[i].paint(context);
            context.stroke();
        }
        this.style.strokeStyle=null;
        this.arc.paint(context)
    }

}


/**
 * A path contains a number of elements (like shape) but they are drawn as one, i.e.
 * 
 * @example
 * begin path
 *  loop to draw shapes
 *      draw shape
 *  close loop
 * close path
 * 
 * 
 * @constructor
 * @this {Path}
 **/
function Path() {
    /**An {Array} that will store all the basic primitives: {@link Point}s, {@link Line}s, {@link CubicCurve}s, etc that make the path*/
    this.primitives = [];
    
    /**The {@link Style} used for drawing*/
    this.style = new Style();
    
    /**Object type used for JSON deserialization*/
    this.oType = 'Path'; 
}

/**Creates a new {Path} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Path} a newly constructed {Path}
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Path.load = function(o){
    var newPath = new Path(); //fake path

    newPath.style = Style.load(o.style);

    for(var i=0; i< o.primitives.length; i++){
        /**We can not use instanceof Point construction as
         *the JSON objects are typeless... so JSONObject are simply objects */
        if(o.primitives[i].oType == 'Point'){
            newPath.primitives.push(Point.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Line'){
            newPath.primitives.push(Line.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Polyline'){
            newPath.primitives.push(Polyline.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Polygon'){
            newPath.primitives.push(Polygon.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'QuadCurve'){
            newPath.primitives.push(QuadCurve.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'CubicCurve'){
            newPath.primitives.push(CubicCurve.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Arc'){
            newPath.primitives.push(Arc.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Ellipse'){
            newPath.primitives.push(Ellipse.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'DashedArc'){
            newPath.primitives.push(DashedArc.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Path'){
            newPath.primitives.push(Path.load(o.primitives[i]))
        }

    }

    return newPath;
}


Path.prototype = {
    constructor : Path,
    
    transform:function(matrix){
        for(var i = 0; i<this.primitives.length; i++ ){
            this.primitives[i].transform(matrix);
        }
    },

    addPrimitive:function(primitive){
        this.primitives.push(primitive);
    },

    contains:function(x,y){
        with(this){
            var points=[];
            for(var i=0; i<primitives.length; i++){
                if(primitives[i].contains(x,y)){
                    return true;
                }
                var curPoints=primitives[i].getPoints();
                for(var a=0; a<curPoints.length; a++){
                    points.push(curPoints[a]);
                }
            }
            }
        return Util.isPointInside(new Point(x,y),points);
    },

    near: function(x,y,radius){
        with(this){
            var points=[];
            for(var i=0; i<primitives.length; i++){
                if(primitives[i].near(x,y,radius)){
                    return true;
                }
            }
            }
        return false;
    },

    getPoints:function(){
        var points = [];
        for (var i=0; i<this.primitives.length; i++){
            points = points.concat(this.primitives[i].getPoints());
        }
        return points;
    },
    getBounds:function(){
        var points = [];
        for (var i in this.primitives) {
            var bounds = this.primitives[i].getBounds();
            points.push(new Point(bounds[0], bounds[1]));
            points.push(new Point(bounds[2], bounds[3]));
        }
        return Util.getBounds(points);
    },

    clone:function(){
        var ret = new Path();
        for (var i=0; i<this.primitives.length; i++){
            ret.addPrimitive(this.primitives[i].clone());
            if(this.primitives[i].parentFigure){
                ret.primitives[i].parentFigure=ret;
            }
        }
        ret.style=this.style
        return ret;
    },

    /**@author: Alex Gheorghiu <alex@scriptoid.com>*/
    equals : function(anotherPath){
        if(!anotherPath instanceof Path){
            return false;
        }

        for(var i=0; i<this.primitives.length; i++){
            if(!this.primitives[i].equals(anotherPath.primitives[i])){
                return  false;
            }
        }
        return true;
    },

    paint:function(context){
        context.save();

        if(this.style != null){
            this.style.setupContext(context);
        }

        //PAINT FILL
        //this loop is the one for the fill, we keep the reference.
        //if you try to put these two together, you will get a line that is the same colour,
        //even if you define different colours for each part of the line (i.e. fig 19)
        //not allowing multiple colours in a single path will clean this code up hugely.
        //
        if(this.style.fillStyle != null && this.style.fillStyle != "" ){
            context.beginPath();
            context.moveTo(this.primitives[0].startPoint.x,this.primitives[0].startPoint.y);
            for(var i = 0; i<this.primitives.length; i++ ){
                var primitive  = this.primitives[i];
                if(primitive instanceof Line){
                    context.lineTo(primitive.endPoint.x,primitive.endPoint.y);
                }
                else if(primitive instanceof Polyline){
                    for(var a=0; a<primitive.points.length; a++){
                        context.lineTo(primitive.points[a].x,primitive.points[a].y);
                    }
                }
                else if(primitive instanceof QuadCurve){
                    context.quadraticCurveTo(primitive.controlPoint.x, primitive.controlPoint.y, primitive.endPoint.x, primitive.endPoint.y);
                }
                else if(primitive instanceof CubicCurve){
                    context.bezierCurveTo(primitive.controlPoint1.x, primitive.controlPoint1.y, primitive.controlPoint2.x, primitive.controlPoint2.y, primitive.endPoint.x, primitive.endPoint.y)
                }
            }
            context.fill();
        }

        //PAINT STROKE
        //This loop draws the lines of each individual shape. Each part might have a different strokeStyle !
        if(this.style.strokeStyle != null && this.style.strokeStyle != "" ){
            for(var i = 0; i<this.primitives.length; i++ ){
                var primitive  = this.primitives[i];

                context.save();
                context.beginPath();

                //TODO: what if a primitive does not have a start point?
                context.moveTo(primitive.startPoint.x,primitive.startPoint.y);

                if(primitive instanceof Line){
                    context.lineTo(primitive.endPoint.x,primitive.endPoint.y);
                //Log.info("line");
                }
                else if(primitive instanceof Polyline){
                    for(var a=0; a<primitive.points.length; a++){
                        context.lineTo(primitive.points[a].x,primitive.points[a].y);
                    //Log.info("polyline");
                    }
                }
                else if(primitive instanceof QuadCurve){
                    context.quadraticCurveTo(primitive.controlPoint.x, primitive.controlPoint.y, primitive.endPoint.x, primitive.endPoint.y);
                //Log.info("quadcurve");
                }
                else if(primitive instanceof CubicCurve){
                    context.bezierCurveTo(primitive.controlPoint1.x, primitive.controlPoint1.y, primitive.controlPoint2.x, primitive.controlPoint2.y, primitive.endPoint.x, primitive.endPoint.y)
                //Log.info("cubiccurve");
                }
                else if(primitive instanceof Arc){
                    context.arc(primitive.startPoint.x, primitive.startPoint.y, primitive.radius, primitive.startAngleRadians, primitive.endAngleRadians, true)
                //Log.info("arc" + primitive.startPoint.x + " " + primitive.startPoint.y);
                }
                else
                {
                //Log.info("unknown primitive");
                }

                //save primitive's old style
                var oldStyle = primitive.style.clone();

                //update primitive's style
                if(primitive.style == null){
                    primitive.style = this.style;
                }
                else{
                    primitive.style.merge(this.style);
                }

                //use primitive's style
                primitive.style.setupContext(context);

                //stroke it
                context.stroke();

                //change primitive' style back to original one
                primitive.style = oldStyle;

                context.restore();
            }
        }

        context.restore();

    },


    /**
     *Export this path to SVG
     *@see <a href="http://tutorials.jenkov.com/svg/path-element.html">http://tutorials.jenkov.com/svg/path-element.html</a>
     *@example 
     * &lt;path d="M50,50
     *        A30,30 0 0,1 35,20
     *        L100,100
     *        M110,110
     *        L100,0"
     *     style="stroke:#660000; fill:none;"/&gt;
     */
    toSVG: function(){

        var result = "\n" + repeat("\t", INDENTATION) + '<path d="';
        var previousPrimitive = null;
        for(var i=0; i<this.primitives.length; i++){

            var primitive = this.primitives[i];

            if(primitive instanceof Point){
                //TODO: implement me. Should we allow points?
                /**Here is a big problem as if we implement the point as a line with 1px width
                 *upon scaling it will became obvious it's a line.
                 *Alternative solutions:
                 *1 - draw it as a SVG arc
                 *2 - draw it as an independent SVG circle*/
                throw 'Path:toSVG()->Point - not implemented';
            }
            if(primitive instanceof Line){
                /*If you want the Path to be a continuous contour we check if
                 *the M is unecessary - maybe we are already comming from that spot*/
                if(previousPrimitive == null  || previousPrimitive.endPoint.x != primitive.startPoint.x || previousPrimitive.endPoint.y != primitive.startPoint.y){
                    result += ' M' + primitive.startPoint.x + ',' + primitive.startPoint.y;
                }
                result += ' L' + primitive.endPoint.x + ',' + primitive.endPoint.y;
            }
            else if(primitive instanceof Polyline){
                for(var a=0; a<primitive.points.length; a++){
                    result += ' L' + primitive.points[a].x + ',' + primitive.points[a].y;
                //Log.info("polyline");
                }
            }
            else if(primitive instanceof QuadCurve){
                result += ' Q' + primitive.controlPoint.x + ',' + primitive.controlPoint.y + ',' + primitive.endPoint.x + ',' + primitive.endPoint.y ;
            }
            else if(primitive instanceof CubicCurve){
                result += ' C' + primitive.controlPoint1.x + ',' + primitive.controlPoint1.y + ',' + primitive.controlPoint2.x + ',' + primitive.controlPoint2.y + ',' + primitive.endPoint.x + ',' + primitive.endPoint.y;
            }
            else if(primitive instanceof Arc){
                //TODO: implement me
                //<path d="M100,100 A25 25 0 0 0 150 100" stroke="lightgreen" stroke-width="4" fill="none" />
                throw 'Path:toSVG()->Arc - not implemented';
            }
            else if(primitive instanceof Polyline){
                //TODO: implement me
                throw 'Path:toSVGPolylineArc - not implemented';
            }
            else{
                throw 'Path:toSVG()->unknown primitive rendering not implemented';
            }

            previousPrimitive = primitive;
        }//end for
        result += '" '; //end of primitive shapes
        //        result += ' fill="none" stroke="#0F0F00" /> '; //end of path
        result += this.style.toSVG(); //end of path
        result += ' />'; //end of path

        return result;
    }

}



/**A figure is simply a collection of basic primitives: Points, Lines, Arcs, Curves and Paths
 * A figure should not care about grouping primitives into Paths, each shape should draw itself.
 * The Figure only delegate the painting to the composing shape.
 *
 * @constructor
 * @this {DashedArc}
 * @param {String} name - the name of the figure
 *
 **/
function Figure(name) {
    /**Each Figure will have an unique Id on canvas*/
    this.id = STACK.generateId();
    
    /**Figure's name*/
    this.name = name;
    
    /**An {Array} of primitives that make the figure*/
    this.primitives = [];

    /**the Group'id to which this figure belongs to*/
    this.groupId = -1;

    /*Keeps track of all the handles for a figure*/
    //this.handles = [];
    //this.handleSelectedIndex=-1;
    //this.builder = new Builder(this.id);

    /**An {Array} of {@link BuilderProperty} objects*/
    this.properties = []; 
    
    /**The {@link Style} use to draw tis figure*/
    this.style = new Style();

    /**We keep the figure position by having different points
     *[central point of the figure, the middle of upper edge]
     * An {Array} or {@link Point}s
     **/
    this.rotationCoords = [];

    /**Object type used for JSON deserialization*/
    this.oType = 'Figure'; 
}

/**Creates a new {Figure} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Figure} a newly constructed Figure
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Figure.load = function(o){
    var newFigure = new Figure(); //fake dashed (if we do not use it we got errors - endless loop)

    newFigure.id = o.id;
    newFigure.name = o.name;
    for(var i=0; i< o.primitives.length; i++){
        /**We can not use instanceof Point construction as
         *the JSON objects are typeless... so JSONObject are simply objects */
        if(o.primitives[i].oType == 'Point'){
            newFigure.primitives.push(Point.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Line'){
            newFigure.primitives.push(Line.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Polyline'){
            newFigure.primitives.push(Polyline.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Polygon'){
            newFigure.primitives.push(Polygon.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'QuadCurve'){
            newFigure.primitives.push(QuadCurve.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'CubicCurve'){
            newFigure.primitives.push(CubicCurve.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Arc'){
            newFigure.primitives.push(Arc.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Ellipse'){
            newFigure.primitives.push(Ellipse.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'DashedArc'){
            newFigure.primitives.push(DashedArc.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Text'){
            newFigure.primitives.push(Text.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Path'){
            newFigure.primitives.push(Path.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Figure'){
            newFigure.primitives.push(Figure.load(o.primitives[i])) //kinda recursevly
        }
        else if(o.primitives[i].oType == 'ImageFrame'){
            newFigure.primitives.push(ImageFrame.load(o.primitives[i])) //kinda recursevly
        }
    }//end for

    newFigure.groupId = o.groupId;
    newFigure.properties = BuilderProperty.loadArray(o.properties);
    newFigure.style = Style.load(o.style);
    newFigure.rotationCoords = Point.loadArray(o.rotationCoords);


    return newFigure ;
}

/**Creates a new {Array} of {Figure}s out of JSON parsed object
 *@param {JSONObject} v - the JSON parsed object
 *@return {Array} of newly constructed {Figure}s
 *@author Alex Gheorghiu <alex@scriptoid.com>
 *@author Janis Sejans <janis.sejans@towntech.lv>
 **/
Figure.loadArray = function(v){
    var newFigures = [];

    for(var i=0; i<v.length; i++){
        newFigures.push(Figure.load(v[i]));
    }

    return newFigures;
}

Figure.prototype = {
    
    constructor: Figure,
    
    /* used by the edit panel
     * @return {Text} the text item
     */
    getText:function(){
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i] instanceof Text){
                return this.primitives[i];
            }
        }

        return '';
    },

    /*set the text from edit panel
     *@param{Text} text - text object
     */
    setText:function(text){
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i] instanceof Text){
                this.primitives[i]=text;
            }
        }
    },

    //@param{bool} transformConnector - should we transform the connector? Used when we transform a figure,
    //without redrawing it.
    transform:function(matrix, transformConnector){
        if(transformConnector == "undefined" || transformConnector == undefined){
            transformConnector = true;
        }
        //transform all composing primitives
        for(var i = 0; i<this.primitives.length; i++ ){
            this.primitives[i].transform(matrix);
        }

        //transform the style
        this.style.transform(matrix);

        //cascade transform to the connection point
        //Log.info('Figure: transform()');
        if(transformConnector){
            CONNECTOR_MANAGER.connectionPointTransform(this.id,matrix);
        }

        //some figures dont have rotation coords, i.e. those that arent "real" figures, such as the highlight rectangle
        if(this.rotationCoords.length!=0){
            this.rotationCoords[0].transform(matrix);
            this.rotationCoords[1].transform(matrix);
        }
    },

    getPoints:function(){
        var points = [];
        for (var i=0; i<this.primitives.length; i++){
            points = points.concat(this.primitives[i].getPoints()); //add all primitive's points in a single pass
        }
        return points;
    },

    addPrimitive:function(primitive){
        this.primitives.push(primitive);
    },

    //no more points to add, so create the handles and selectRect
    finalise:function(){
        var bounds = this.getBounds();

        if(bounds == null){
            throw 'Figure bounds are null !!!';
            return;
        }
        //central point of the figure
        this.rotationCoords[0] = new Point(
            bounds[0] + (bounds[2] - bounds[0]) / 2,
            bounds[1] + (bounds[3] - bounds[1]) / 2
        );

        //the middle of upper edge
        this.rotationCoords[1] = new Point(this.rotationCoords[0].x, bounds[1]);
    },

    /**TODO: this clone is not gonna be equal with the original
     *as it will have a different id
     *Janis: REMOVE What this comment means? It should be equal and with different id. Fixed some stuff please review.
     **/
    clone:function(){
        var ret = new Figure(this.name); //Janis: REMOVE fixed - if cloning square, then create square
        for (var i=0; i<this.primitives.length; i++){
            ret.addPrimitive(this.primitives[i].clone());
        }
        ret.properties = this.properties.slice(0); //Janis: REMOVE fixed - clone the properties array
        ret.style = this.style.clone(); //Janis: REMOVE fixed - clone the style
        ret.rotationCoords[0]=this.rotationCoords[0].clone();
        ret.rotationCoords[1]=this.rotationCoords[1].clone();
        
        //get all conection points and add them to the figure
        var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id);
        cps.forEach(function(ConnectionPoint, index, array){
            CONNECTOR_MANAGER.connectionPointCreate(ret.id,ConnectionPoint.point,ConnectionPoint.TYPE_FIGURE);
        });
        return ret;
    },


    contains:function(x,y){
        var points=[];
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i].contains(x,y)){
                return true;
            }
            points = points.concat(this.primitives[i].getPoints());
        }
        return Util.isPointInside(new Point(x,y),points);
    },


    /**
     * @return {Array<Number>} - returns [minX, minY, maxX, maxY] - bounds, where
     *  all points are in the bounds.
     */
    getBounds: function(){
        var points = [];
        for (var i = 0; i < this.primitives.length; i++) {
            var bounds = this.primitives[i].getBounds();
            points.push(new Point(bounds[0], bounds[1]));
            points.push(new Point(bounds[2], bounds[3]));
        }
        return Util.getBounds(points);
    },


    paint:function(context){
        if(this.style){
            this.style.setupContext(context);
        }
        for(var i = 0; i<this.primitives.length; i++ ){
            var primitive  = this.primitives[i];
            context.save();

            var oldStyle = null;
            if(primitive.style){ //save primitive's style
                oldStyle = primitive.style.clone();
            }

            if(primitive.style == null){ //if primitive does not have a style use Figure's one
                primitive.style = this.style;
            }
            else{ //if primitive has a style merge it
                primitive.style.merge(this.style);
            }

            context.beginPath();
            primitive.paint(context);
            primitive.style = oldStyle;
            if(this.style.image != null){ //TODO: should a figure has a Style cann't just delegate all to primitives?
                //clip required for background images, there were two methods, this was the second I tried
                //neither work in IE
                context.clip();
                context.save();
                if(this.rotationCoords.length != 0){
                    var angle=Util.getAngle(this.rotationCoords[0], this.rotationCoords[1]);
                    if(IE && angle==0){
                        angle=0.00000001;//stupid excanves, without this it puts all images down and right of the correct location
                    //and by an amount relative to the distane from the top left corner
                    }

                    //if we perform a rotation on the actual rotationCoords[0] (centerPoint), when we try to translate it back,
                    //rotationCoords[0] will = 0,0, so we create a clone that does not get changed
                    var rotPoint = this.rotationCoords[0].clone();

                    //move to origin, make a rotation, move back in place
                    this.transform(Matrix.translationMatrix(-rotPoint.x, -rotPoint.y))
                    this.transform(Matrix.rotationMatrix(-angle));
                    this.transform(Matrix.translationMatrix(rotPoint.x, rotPoint.y))

                    //TODO: these are not used...so why the whole acrobatics ?
                    //this was the second method that is also not supported by IE, get the image, place it in
                    //the correct place, then shrink it, so its still an 'image mask' but it is only a small image
                    //context.scale below is also part of this
                    //var shrinkBounds = this.getBounds();

                    //move back to origin, 'undo' the rotation, move back in place
                    this.transform(Matrix.translationMatrix(-rotPoint.x, -rotPoint.y))
                    this.transform(Matrix.rotationMatrix(angle));
                    this.transform(Matrix.translationMatrix(rotPoint.x, rotPoint.y))

                    //rotate current canvas to prepare it to draw the image (you can not roate the image...:D)
                    context.translate(rotPoint.x,rotPoint.y);
                    context.rotate(angle);
                    //context.scale(0.01,0.01)//1/getCanvas().width*shrinkBounds[0]+(shrinkBounds[2]-shrinkBounds[0])/2,1/getCanvas().width*shrinkBounds[1]+(shrinkBounds[3]-shrinkBounds[1])/2)
                    context.translate(-rotPoint.x,-rotPoint.y);
                }
                //draw image
                /*context.fill();
                context.beginPath();
                context.globalCompositeOperation = "source-atop"
                 clip works best,but this works too, neither will work in IE*/
                //context.fill();
                context.drawImage(this.style.image,this.rotationCoords[0].x-this.style.image.width/2,this.rotationCoords[0].y-this.style.image.height/2,this.style.image.width,this.style.image.height)

                context.restore();
            }
            else if (this.style.image!=null){
                context.fill();
            }

            context.restore();
        }
    },

    equals:function(anotherFigure){
        if(!anotherFigure instanceof Figure){
            Log.info("Figure:equals() 0");
            return false;
        }


        if(this.primitives.length == anotherFigure.primitives.length){
            for(var i=0; i<this.primitives.length; i++){
                if(!this.primitives[i].equals(anotherFigure.primitives[i])){
                    Log.info("Figure:equals() 1");
                    return false;
                }
            }
        }
        else{
            Log.info("Figure:equals() 2");
            return false;
        }
        //test group
        if(this.groupId != anotherFigure.groupId){
            return false;
        }

        //test rotation coords
        if(this.rotationCoords.length == anotherFigure.rotationCoords.length){
            for(var i in this.rotationCoords){
                if(!this.rotationCoords[i].equals(anotherFigure.rotationCoords[i])){
                    return false;
                }
            }
        }
        else{
            return false;
        }

        //test style
        if(!this.style.equals(anotherFigure.style)){
            return false;
        }

        return true;
    },

    near:function(x,y,radius){
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i].near(x,y,radius)){
                return true;
            }
        }
        return false;
    },
    toString:function(){
        var result = this.name + ' [id: ' + this.id + '] (';
        for(var i = 0; i<this.primitives.length; i++ ){
            result += this.primitives[i].toString();
        }
        result += ')';
        return result;
    },


    toSVG: function(){
        var tempSVG = '';
        tempSVG += "\n" + repeat("\t", INDENTATION) +  "<!--Figure start-->";
        for(var i = 0; i<this.primitives.length; i++ ){
            var primitive  = this.primitives[i];

            var oldStyle = null;
            if(primitive.style){ //save primitive's style
                oldStyle = primitive.style.clone();
            }

            if(primitive.style == null){ //if primitive does not have a style use Figure's one
                primitive.style = this.style;
            }
            else{ //if primitive has a style merge it
                primitive.style.merge(this.style);
            }

            tempSVG += this.primitives[i].toSVG();

            //restore primitives style
            primitive.style = oldStyle;
        }
        tempSVG += "\n" + repeat("\t", INDENTATION) +  "<!--Figure end-->" + "\n";

        return tempSVG;
    }
}




/**
 * A predefined matrix of a 90 degree clockwise rotation 
 *
 *@see <a href="http://en.wikipedia.org/wiki/Rotation_matrix">http://en.wikipedia.org/wiki/Rotation_matrix</a>
 */ 
R90 = [
    [Math.cos(0.0872664626),-Math.sin(0.0872664626), 0],
    [Math.sin(0.0872664626),  Math.cos(0.0872664626), 0],
    [0,  0, 1]
    ];
    
/**
 * A predefined matrix of a 90 degree anti-clockwise rotation 
 *
 *@see <a href="http://en.wikipedia.org/wiki/Rotation_matrix">http://en.wikipedia.org/wiki/Rotation_matrix</a>
 */     
R90A = [
    [Math.cos(0.0872664626), Math.sin(0.0872664626), 0],
    [-Math.sin(0.0872664626),  Math.cos(0.0872664626), 0],
    [0,  0, 1]
    ];

/**
 * The identity matrix
 */      

IDENTITY=[[1,0,1],[0,1,0],[0,0,1]];


if(typeof(document) == 'undefined'){ //test only from console
    print("\n--==Point==--\n");
    p = new Point(10, 10);
    print(p);
    print("\n");
    p.transform(R90);
    print(p)

    print("\n--==Line==--\n");
    l = new Line(new Point(10, 23), new Point(34, 50));
    print(l);
    print("\n");


    print("\n--==Polyline==--\n");
    polyline = new Polyline();
    for(var i=0;i<5; i++){
        polyline.addPoint(new Point(i, i*i));
    }
    print(polyline);
    print("\n");




    print("\n--==Quad curve==--\n");
    q = new QuadCurve(new Point(75,25), new Point(25,25), new Point(25,62))
    print(q)

    print("\n");
    q.transform(R90);
    print(q)

    print("\n--==Cubic curve==--\n");
    q = new CubicCurve(new Point(75,40), new Point(75,37), new Point(70,25), new Point(50,25))
    print(q)

    print("\n");
    q.transform(R90);
    print(q)

    print("\n--==Figure==--\n");
    f = new Figure();
    f.addPrimitive(p);
    f.addPrimitive(q);
    print(f);

    f.transform(R90);
    print("\n");
    print(f);
    print("\n");
//f.draw();
}
