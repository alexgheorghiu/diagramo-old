figureSets["network"] = [
    {figureFunction: "Network1", image: "video-display.png"},
    {figureFunction: "Network2", image: "video-display.png"}
]

function figure_Network1(x, y)
{
    var f = new Figure("PC");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = "/editor/lib/sets/network/video-display.svg";
    
    var ifig = new ImageFrame(url, x, y, true, ImageFrame.DEFAULT_WIDTH, ImageFrame.DEFAULT_HEIGHT);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}

function figure_Network2(x, y)
{
    var f = new Figure("Airport");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = "/editor/lib/sets/network/airport.svg";
    
    var ifig = new ImageFrame(url, x, y, false);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}