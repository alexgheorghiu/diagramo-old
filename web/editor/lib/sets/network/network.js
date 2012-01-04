figureSets["network"] = [
    {figureFunction: "Person", image: "1_person.png"},
    {figureFunction: "Switch", image: "2_switch.png"},    
    {figureFunction: "Router", image: "3_router.png"},    
    {figureFunction: "Cloud", image: "4_cloud.png"},    
    {figureFunction: "Server", image: "5_server.png"},
    {figureFunction: "Firewall", image: "6_firewall.png"},
    {figureFunction: "Building", image: "7_building.png"},
    {figureFunction: "Laptop", image: "8_laptop.png"},
    {figureFunction: "Desktop", image: "9_desktop.png"},
    {figureFunction: "Lock", image: "10_lock.png"},
    {figureFunction: "PDA", image: "11_pda.png"},
    {figureFunction: "Phone", image: "12_phone.png"},
    {figureFunction: "Printer", image: "13_printer.png"},
    {figureFunction: "Database", image: "14_database.png"},
    {figureFunction: "UPS", image: "15_ups.png"},
    {figureFunction: "Wireless", image: "16_wireless_router.png"}
]

function figure_Person(x, y)
{
    var f = new Figure("Person");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/1_person.svg";
    
    var ifig = new ImageFrame(url, x, y, true, 48, 48);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + 24, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + 24, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - 24, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - 24), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + 35), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}



function figure_Switch(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48.75;
    var imageHeight = 32.375;
   
    
    var f = new Figure("Switch");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/2_switch.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Router(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48.75;
    var imageHeight = 32.375;
   
    
    var f = new Figure("Router");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/3_router.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Cloud(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 100;
    var imageHeight = 100;
   
    
    var f = new Figure("Cloud");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/4_cloud.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}

function figure_Server(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 37.59;
    var imageHeight = 60.125;
   
    
    var f = new Figure("Server");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/5_server.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Firewall(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48.897;
    var imageHeight = 55.66;
   
    
    var f = new Figure("Firewall");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/6_firewall.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Building(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 60;
    var imageHeight = 94.167;
   
    
    var f = new Figure("Building");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/7_building.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}

function figure_Laptop(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 54;
    var imageHeight = 48.5;
   
    
    var f = new Figure("Laptop");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/8_laptop.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}





function figure_Desktop(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48;
    var imageHeight = 48;
   
    
    var f = new Figure("Desktop");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/9_desktop.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Lock(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 24.5;
    var imageHeight = 31.7;
   
    
    var f = new Figure("Lock");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/10_lock.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_PDA(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 36.66;
    var imageHeight = 58.543;
   
    
    var f = new Figure("PDA");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/11_pda.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Phone(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 43.033;
    var imageHeight = 37.081;
   
    
    var f = new Figure("Phone");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/12_phone.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Printer(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48;
    var imageHeight = 48;
   
    
    var f = new Figure("Printer");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/13_printer.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Database(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 57.073;
    var imageHeight = 84.51;
   
    
    var f = new Figure("Database");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/14_database.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}



function figure_UPS(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 60.667;
    var imageHeight = 37.667;
   
    
    var f = new Figure("UPS");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/15_ups.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Wireless(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48.75;
    var imageHeight = 53.953;
   
    
    var f = new Figure("Wireless");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    
    //Image
    var url = "/editor/lib/sets/network/16_wireless_router.svg";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
    var t2 = new Text(figure_defaultFigureTextStr, x, y + imageHeight/2 + 5, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}
