figureSets["network"] = [
    {figureFunction: "Terminal", image: "video-display-32.png"},
    {figureFunction: "Terminal2", image: "video-display-32.png"},
    {figureFunction: "Network2", image: "video-display.png"}
]

function figure_Terminal(x, y)
{
    var f = new Figure("PC-SVG");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = "/editor/lib/sets/network/video-display-ai.svg";
    
    var ifig = new ImageFrame(url, x, y, true, 200, 200);
    ifig.debug = true;
    f.addPrimitive(ifig);
    //f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    
    
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + 100, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);
    
    f.finalise();
    return f;
}

function figure_Terminal2(x, y)
{
    var f = new Figure("PC-PNG");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
//    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
//    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    

//    var img = new Image();
    //img.src = 'http://scriptoid.com/assets/images/hotmug/small_logo.gif';
//    img.src = '/assets/images/logo.gif';
//    img.src = '/test/svg/arcs.svg';
//    var url = "/assets/images/logo.gif";
    var url = "/editor/lib/sets/network/video-display-ai.png";
    
    var ifig = new ImageFrame(url, x, y, true, 200, 200);
    ifig.debug = true;
    f.addPrimitive(ifig);
    //f.properties.push(new BuilderProperty('URL', 'primitives.0.url', BuilderProperty.TYPE_TEXT));
    
    
    
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + 100, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);
    
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