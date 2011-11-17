figureSets["network"] = [
    {figureFunction: "PC", image: "video-display.png"}
]

function figure_PC(x, y)
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
    var url = "/lib/sets/network/video-display.svg";
    
    var ifig = new ImageFrame(url, x, y, true);
    ifig.debug = true;
    f.addPrimitive(ifig);
    f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    f.finalise();
    return f;
}