figureSets["experimental"] = {
    name : 'Experimental',
    description : 'An experimental set of figures. Use it on your own risk',
    figures : [
        {figureFunction: "SimpleImage", image: "image_32.gif"},
        {figureFunction: "ImageFrame", image: "page.png"},
        {figureFunction: "Settings", image: "page.png"},
        {figureFunction: "Tango", image: "page.png"},
        {figureFunction: "Organic", image: "page.png"},
        {figureFunction: "Inkscape", image: "page.png"},
        {figureFunction: "Airport", image: "page.png"},
        {figureFunction: "200by200SVG", image: "page.png"},
        {figureFunction: "200by200PNG", image: "page.png"},
        {figureFunction: "3Figures", image: "page.png"},
        {figureFunction: "3FiguresNoSize", image: "page.png"}
    ]
}

/**
 *"..i have changed in the basic.js file and added the following function
 *its for creating the icon stop..."
 *@author Nour Al-Harake <n_harake@hotmail.com>
 **/
function figure_Stop(x,y) 
{

   var r = new Polygon();
    r.addPoint(new Point(x, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentSize, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentSize));
    r.addPoint(new Point(x, y + figure_defaultFigureSegmentSize));


    var f=new Figure("Square");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    //todo:  if uncomment next line it will creates artefacts
    //f.style.image="Icons/Stop Form.ico";
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));//f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS));
    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentSize/2, y + figure_defaultFigureSegmentSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);


    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentSize / 2 - 10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentSize / 2 + 10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize / 2 - 10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize / 2 + 10),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
  
}

function figure_SimpleImage(x, y)
{
    var f = new Figure("FamilyCard");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = "/editor/assets/images/no-image.png";
    
    var ifig = new ImageFrame(url, x, y, true);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}


function figure_ImageFrame(x, y)
{
    var f = new Figure("FamilyCard");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    
    //frame - 0
    var frame = new Polygon();
    frame.addPoint(new Point(x - 200, y - 100));
    frame.addPoint(new Point(x + 200, y - 100));
    frame.addPoint(new Point(x + 200, y + 100));
    frame.addPoint(new Point(x - 200, y + 100));
    f.addPrimitive(frame);

    //Image - 1
//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
    //img.src = '/assets/images/logo.gif';
//    img.src = '/test/image/duff.jpg';
//    img.src = '/test/image/NancySinatra2.jpg';
//    img.src = '/test/svg/arcs.svg';
    var url = "/test/image/NancySinatra2.jpg";
    /*
     *http://diagramo.test/test/image/duff.jpg
     *http://diagramo.test/test/image/NancySinatra2.jpg
     *http://scriptoid.com/assets/images/hotmug/small_logo.gif //securiy exception
     */
    
    var ifig = new ImageFrame(url, x - 200 + 150/2, y - 100 + 150 / 2, false, 150, 150);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.1.url', BuilderProperty.TYPE_TEXT));
    
    //Title - 2
    var title = new Text("Hilary Erhard Duff", x + 100, y - 80, 'tahoma', 14);
    title.style.fillStyle = figure_defaultFillTextStyle;
    title.style.strokeStyle = '#006633';
    title.style.fillStyle = '#006633';
    f.addPrimitive(title);
    f.properties.push(new BuilderProperty('Title', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    
    //Description
    var description = new Text("After working in local \ntheater plays and \ntelevision commercials in \nher childhood, Duff \ngained fame playing...."
                            , x + 100, y - 20, 'tahoma', 12);
    description.style.fillStyle = figure_defaultFillTextStyle;
    description.style.strokeStyle = '#000';
    description.style.fillStyle = '#000';
    description.align = Text.ALIGN_LEFT;
    
    f.addPrimitive(description);
    f.properties.push(new BuilderProperty('Description', 'primitives.3.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.3.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.3.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.3.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.3.style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    
    //Born date
    var bornDate = new Text("born September 28, 1987" , x - 400 / 4, y + 200 / 4, 'tahoma', 14);
    bornDate.style.fillStyle = figure_defaultFillTextStyle;
    bornDate.style.strokeStyle = '#000';
    bornDate.style.fillStyle = '#000';
    //t2.style.font = 'tahoma';
    f.addPrimitive(bornDate);
    f.properties.push(new BuilderProperty('Born date', 'primitives.4.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.4.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.4.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.4.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.4.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    
    f.finalise();
    return f;
}

function figure_Settings(x, y)
{
    var f = new Figure("Settings");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = figureSetsURL + "/experimental/preferences-system-symbolic-plain.svg";
    
    var ifig = new ImageFrame(url, x, y, true);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}

function figure_Tango(x, y)
{
    var f = new Figure("Tango");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = figureSetsURL + "/experimental/tango.svg";
    
    var ifig = new ImageFrame(url, x, y, true, 200, 200);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}


function figure_Organic(x, y)
{
    var f = new Figure("Organic");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = figureSetsURL + "/experimental/organic.svg";
    
    var ifig = new ImageFrame(url, x, y, true, 200, 200);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}


function figure_Inkscape(x, y)
{
    var f = new Figure("Inkscape");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = figureSetsURL + "/experimental/rectangle.svg";
    
    var ifig = new ImageFrame(url, x, y, true, 200, 200);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}

function figure_Airport(x, y)
{
    var f = new Figure("Inkscape");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = figureSetsURL + "/experimental/airport.svg";
    
    var ifig = new ImageFrame(url, x, y, true, 200, 200);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}


function figure_200by200SVG(x, y)
{
    var f = new Figure("200by200SVG");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = figureSetsURL + "/experimental/200by200.svg";
    
    var ifig = new ImageFrame(url, x, y, true, 100, 100);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}


function figure_200by200PNG(x, y)
{
    var f = new Figure("200by200PNG");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = figureSetsURL + "/experimental/200by200.png";
    
    var ifig = new ImageFrame(url, x, y, true, 100, 100);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}


/**
 *Study the viewBox on/off size on/off effect on rendering of SVG images
 **/
function figure_3Figures(x, y)
{
    var f = new Figure("3FiguresSVG");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = figureSetsURL + "/experimental/3figures.svg";
    
    var ifig = new ImageFrame(url, x, y, true, 100, 100);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}

function figure_3FiguresNoSize(x, y)
{
    var f = new Figure("3FiguresSVG");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = figureSetsURL + "/experimental/3figures.svg";
    
    var ifig = new ImageFrame(url, x, y, true, 100, 100);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}

