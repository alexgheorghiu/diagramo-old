<?
require_once dirname(__FILE__) . '/../../common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

require_once dirname(__FILE__) . '/../../common/rememberme.php';


$delegate = new Delegate();

$loggedUser = $delegate->userGetById($_SESSION['userId']);

?>

<!DOCTYPE HTML>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>HTML5 diagram editor</title>
        <link rel="stylesheet" media="screen" type="text/css" href="style.css" />
        <link rel="stylesheet" media="screen" type="text/css" href="minimap.css" />

        <script type="text/javascript" src="canvasprops.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/style.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/primitives.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/matrix.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/util.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/key.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/groups.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/stack.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/connections.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/connectionManagers.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/handles.js?<?=time()?>"></script>

        <script type="text/javascript" src="../../lib/builder.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/text.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/log.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/text.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/sets/basic.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/sets/secondary.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/browserReady.js?<?=time()?>"></script>
        <script type="text/javascript" src="main.js?<?=time()?>"></script>
        <script type="text/javascript" src="minimap.js?<?=time()?>"></script>

        <script type="text/javascript" src="../../lib/commands/History.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/commands/CanvasResizeCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/commands/ConnectCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/commands/ConnectorHandleCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/commands/CreateCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/commands/DeleteCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/commands/GroupCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/commands/MatrixCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/commands/PropertyCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="../../lib/commands/ZOrderCommand.js?<?=time()?>"></script>

        <script type="text/javascript" src="../../assets/javascript/json2.js"></script>
        <script type="text/javascript" src="../../assets/javascript/jquery-1.4.2.min.js"></script>
        <script type="text/javascript" src="../../assets/javascript/jquery.simplemodal-1.3.5.min.js"></script>


        <script type="text/javascript" src="../../assets/javascript/colorPicker_new.js"></script>
        <link rel="stylesheet" media="screen" type="text/css" href="../../assets/css/colorPicker_new.css" />


        <!--[if IE]>
        <script src="../assets/javascript/excanvas.js"></script>
        <![endif]-->






        <script type="text/javascript">
            /**Export the Canvas as SVG*/
            function toSVG(){
                var canvas = getCanvas();
                var v2 = '<svg width="' + canvas.width +'" height="' + canvas.height + '" xmlns="http://www.w3.org/2000/svg" version="1.1">';
                v2 += stack.toSVG();
                v2 += CONNECTOR_MANAGER.toSVG();
                v2 += '</svg>';

                return v2;
            }

             /** Save current diagram
             *See:
             *http://www.itnewb.com/v/Introduction-to-JSON-and-PHP/page3
             *http://www.onegeek.com.au/articles/programming/javascript-serialization.php
             **/
            function save(){
                Log.info('Save pressed');
                var diagram = { c:canvasProps, s:stack, m:CONNECTOR_MANAGER };
                var serializedDiagram = JSON.stringify(diagram);
                var svgDiagram = toSVG();

                //alert($serializedDiagram);
                //alert(svgDiagram);

                //see: http://api.jquery.com/jQuery.post/
                $.post("../common/controller.php",
                    {action: 'save', diagram: serializedDiagram, svg: svgDiagram, diagramId: '<?=$_REQUEST['diagramId']?>'},
                    function(data){
                        //alert(data);
                        if(data == 'noaccount'){
                            Log.info('No account...so we will redirect');
                            window.location = '../register.php';
                        }
                        else if(data == 'firstSave'){
                            Log.info('firstSave!');
                            window.location = './saveDiagram.php';
                        }
                        else if(data == 'saved'){
                            //Log.info('saved!');
                            alert('saved!');
                        }
                        else{
                            //alert('Unknown: ' + data );
                        }
                    }
                );
            }

            /**Loads a saved diagram
             *@param {Number} diagramId - the id of the diagram you want to load
             **/
            function load(diagramId){
                //alert("load diagram [" + diagramId + ']');
                $.post("../common/controller.php", {action: 'load', diagramId: diagramId},
                    function(data){
//                        alert(data);
                        var obj  = eval('(' + data + ')');
                        stack = Stack.load(obj['s']);
                        canvasProps  = CanvasProps.load(obj['c']);
                        //TODO: update canvas size

                        CONNECTOR_MANAGER = ConnectorManager.load(obj['m']);
                        draw();

                        //alert("loaded");
                    }
                );

            }


            /**Saves a diagram. Actually send the serialized version of diagram
             *for saving
             **/
            function saveAs(){
                var canvas = getCanvas();
                var $diagram = {c:canvas.save(), s:stack, m:CONNECTOR_MANAGER};
                $serializedDiagram = JSON.stringify($diagram);
                var svgDiagram = toSVG();

                //alert($serializedDiagram);

                //see: http://api.jquery.com/jQuery.post/
                $.post("../common/controller.php", {action: 'saveAs', diagram: $serializedDiagram, svg: svgDiagram},
                    function(data){
                        if(data == 'noaccount'){
                            Log.info('You must have an account to use that feature');
                            //window.location = '../register.php';
                        }
                        else if(data == 'step1Ok'){
                            Log.info('Save as...');
                            window.location = './saveDiagram.php';
                        }
                    }
                );
            }


            /**Exports current canvas as SVG*/
            function exportCanvas(){
                //export canvas as SVG
		var v = '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg" version="1.1">\
			<rect x="0" y="0" height="200" width="300" style="stroke:#000000; fill: #FFFFFF"/>\
				<path d="M100,100 C200,200 100,50 300,100" style="stroke:#FFAAFF;fill:none;stroke-width:3;"  />\
				<rect x="50" y="50" height="50" width="50"\
				  style="stroke:#ff0000; fill: #ccccdf" />\
			</svg>';



                //get svg
                var canvas = getCanvas();

                var v2 = '<svg width="' + canvas.width +'" height="' + canvas.height + '" xmlns="http://www.w3.org/2000/svg" version="1.1">';
                v2 += stack.toSVG();
                v2 += CONNECTOR_MANAGER.toSVG();
                v2 += '</svg>';
                alert(v2);

                //save SVG into session
                //see: http://api.jquery.com/jQuery.post/
                $.post("../common/controller.php", {action: 'saveSvg', svg: escape(v2)},
                    function(data){
                        if(data == 'svg_ok'){
                            //alert('SVG was save into session');
                        }
                        else if(data == 'svg_failed'){
                            Log.info('SVG was NOT save into session');
                        }
                    }
                );

                //open a new window that will display the SVG
                window.open('./svg.php', 'SVG', 'left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
            }

            var minimap;
                
            $(document).mouseup(function(){minimap.selected = false;});
            window.onresize = function(){minimap.updateMap()};
            /**Initialize the page*/
            function init(){
                //Canvas properties (width and height)

                var w = getCanvas().width;
                var h = getCanvas().height;
                minimap = new Minimap(getCanvas(), document.getElementById("minimap"), 115);
                minimap.updateCanvas();
                getCanvas().width=w;
                getCanvas().height=h;
                //set up a minimap with a width priority
                
                if(canvasProps == null){//only create a new one if we have not already loaded one
                       canvasProps = new CanvasProps(CanvasProps.DEFAULT_WIDTH, CanvasProps.DEFAULT_HEIGHT);
                }
                canvasProps.setWidth(canvasProps.getWidth());//lets make sure that our canvas is set to the correct values
                canvasProps.setHeight(canvasProps.getHeight());


                //Grid
                grid = document.getElementById("grid");
                if(document.getElementById("gridCheckbox").checked){
                    showGrid();
                }
                else{
                    document.getElementById("gridCheckbox").checked=false;
                }

                if(document.getElementById("snapCheckbox").checked){
                    snapToGrid();
                }
                else{
                    document.getElementById("snapCheckbox").checked=false;
                }



                //Browser support and warnings
                if(isBrowserReady() == 0){ //no support at all
                    modal();
                }

                //Edit panel
                setUpEditPanel(canvasProps);

                //Load current diagram
                <? if( is_numeric($_REQUEST['diagramId']) ){?>
                load(<?=$_REQUEST['diagramId']?>);
                <? }?>
            }
        </script>

        <!--[if IE]>
        <script type="text/javascript">
            var IE=true;
        </script>
        <![endif]-->



    </head>
    <body onload="init();" id="body" onkeydown="return onKeyDown(event);">
        <? require_once dirname(__FILE__) . '/../../common/header.php'; ?>
        <div id="menu">
            <table border="0" cellpadding="3" cellspacing="0">
                <tr>
                    <td width="10">
                        &nbsp;
                    </td>
                    <td valign="middle">
                        <a style="text-decoration: none;" href="../common/controller.php?action=newDiagramExe"><img style="vertical-align:middle; margin-right: 3px;" src="../assets/images/icon_new.jpg" border="0" width="20" height="21"/><span class="menuText">New</span></a>
                    </td>
                    <td width="20" align="center">
                        <img style="vertical-align:middle;" src="../assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
                    </td>
                    <td valign="middle">
                        <a style="text-decoration: none;" href="../myDiagrams.php"><img style="vertical-align:middle; margin-right: 3px;" src="../assets/images/icon_open.jpg" border="0" width="20" height="21"/><span class="menuText">Open</span></a>
                    </td>
                    <td width="20" align="center">
                        <img style="vertical-align:middle;" src="../assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
                    </td>
                    <td valign="middle">
                        <a style="text-decoration: none;" href="javascript:save();"><img style="vertical-align:middle; margin-right: 3px;" src="../assets/images/icon_save.jpg" border="0" width="22" height="22"/><span class="menuText">Save</span></a>
                    </td>
                    <td width="20" align="center">
                        <img style="vertical-align:middle;" src="../assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
                    </td>
                    <td valign="middle">
                        <a style="text-decoration: none;" href="javascript:saveAs();"><img style="vertical-align:middle; margin-right: 3px;" src="../assets/images/icon_save_as.jpg" border="0" width="22" height="22"/><span class="menuText">Save as</span></a>
                    </td>
                    <td width="20" align="center">
                        <img style="vertical-align:middle;" src="../assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
                    </td>

                    <?if(is_numeric($_REQUEST['diagramId']) ){//option available ony when the diagram was saved?>
                    <td valign="middle">
                        <a style="text-decoration: none;" href="../exportDiagram.php?diagramId=<?=$_REQUEST['diagramId']?>"><img style="vertical-align:middle; margin-right: 3px;" src="../assets/images/icon_export.jpg" border="0" width="22" height="22"/><span class="menuText">Export</span></a>
                    </td>
                    <td width="20" align="center">
                        <img style="vertical-align:middle;" src="../assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
                    </td>
                    <?}?>

                    <!--
                    <td valign="middle">
                        <a style="text-decoration: none;" href="javascript:exportCanvas();"><img style="vertical-align:middle; margin-right: 3px;" src="../assets/images/icon_export.jpg" border="0" width="22" height="22"/><span class="menuText">Debug Export</span></a>
                    </td>
                    <td width="20" align="center">
                        <img style="vertical-align:middle;" src="../assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
                    </td>
                    -->

                    <?if(is_numeric($_REQUEST['diagramId']) ){ //these options should appear ONLY if we have a saved diagram
                        $diagram = $delegate->diagramGetById($_REQUEST['diagramId']);
                    ?>
                    <td valign="middle">
                        <a style="text-decoration: none;" href="../colaborators.php?diagramId=<?=$_REQUEST['diagramId']?>"><img style="vertical-align:middle; margin-right: 3px;" src="../assets/images/collaborators.gif" border="0" width="22" height="22"/><span class="menuText">Colaborators</span></a>
                    </td>
                    <td width="20" align="center">
                        <img style="vertical-align:middle;" src="../assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
                    </td>
                    <td>
                        <span class="menuText">Direct link : </span> <input style="font-size: 10px;" type="text" class="text" size="40" value="http://<?=WEBADDRESS?>/diagram/<?=$diagram->hash?>"/>
                    </td>
                    <?}?>

                    <script type="text/javascript">
                        switch(isBrowserReady()){
                            case 0: //not supported at all
                                document.write("<td bgcolor=\"red\">");
                                document.write("No support for HTML5. More <a href=\"http://<?=WEBADDRESS?>/htm5-support.php\">here</a></a>");
                                document.write("</td>");
                                break;
                            case 1: //IE - partially supported
                                document.write("<td bgcolor=\"yellow\">");
                                document.write("Poor HTML5 support. More <a href=\"http://<?=WEBADDRESS?>/htm5-support.php\">here</a></a>");
                                document.write("</td>");
                                break;
                        }
                    </script>

                </tr>
            </table>
        </div>


            <div id="actions">
                <input type="checkbox" onclick="showGrid();" id="gridCheckbox" /> <span class="toolbarText">Show grid</span>
                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <input type="checkbox" onclick="snapToGrid();" id="snapCheckbox" /> <span class="toolbarText">Snap to grid</span>
                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <!--
                <a class="button" href="javascript:action('up');">up</a>
                <a class="button" href="javascript:action('down');">down</a>
                <a class="button" href="javascript:action('left');">left</a>
                <a class="button" href="javascript:action('right');">right</a>
                <a class="button" href="javascript:action('grow');">grow</a>
                <a class="button" href="javascript:action('shrink');">shrink</a>
                <a class="button" href="javascript:action('rotate90');">rotate 5<sup>o</sup> CW</a>
                <a class="button" href="javascript:action('rotate90A');">rotate 5<sup>o</sup> ACW</a>
                <a style="border: 1px solid red; background-color: red; color: white;" href="javascript:stack.reset(); CONNECTOR_MANAGER.reset(); draw();">Reset Canvas</a><br />
                -->
                <a href="javascript:action('front');"><img src="../assets/images/icon_front.gif" border="0"/></a>
                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('back');"><img src="../assets/images/icon_back.gif" border="0"/></a>
                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('moveforward');"><img src="../assets/images/icon_forward.gif" border="0"/></a>
                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('moveback');"><img src="../assets/images/icon_backward.gif" border="0"/></a>

                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('connector-straight');"><img src="../assets/images/icon_connector_straight.gif" border="0"/></a>

                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('connector-jagged');"><img src="../assets/images/icon_connector_jagged.gif" border="0"/></a>

                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('group');"><img src="../assets/images/group.gif" border="0"/></a>
                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('ungroup');"><img src="../assets/images/ungroup.gif" border="0"/></a>

                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:createFigure(figure_Text);"><img  style="vertical-align:middle;" src="../assets/images/text.gif" border="0" height ="16"/></a>

                <img style="vertical-align:middle; margin: 0 10px 0 10px;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>

                <a href="javascript:action('undo');"><img src="../assets/images/arrow_undo.png" border="0"/></a>
                <a href="javascript:action('redo');"><img src="../assets/images/arrow_redo.png" border="0"/></a>
                <input type="text" id="output" />
                <!--
                <img style="vertical-align:middle;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('duplicate');">Copy</a>
                <img style="vertical-align:middle;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('group');">Group</a>
                <img style="vertical-align:middle;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
                <a href="javascript:action('ungroup');">Ungroup</a>
                -->
            </div>
        <div id="editor">
            <div id="figures">
                <select style="width: 120px;" onchange="setFigureSet(this.options[this.selectedIndex].value)">
                    <option value="basic" selected>Basic</option>
                    <option value="secondary">Secondary</option>
                    <option value="more">More</option>
                </select>

                <div id="basic">
                    <table border="0" cellpadding="0" cellspacing="0" width="120">
                        <tr>
                            <td><a href="javascript:createFigure(figure_RoundedRectangle);"><img src="../assets/images/figures/basic/rounded_rectangle.png" border="0" alt="SQR" /></a></td>
                            <td><a href="javascript:createFigure(figure_Rectangle);"><img src="../assets/images/figures/basic/rectangle.png" border="0" /></a></td>
                            <td><a href="javascript:createFigure(figure_Square);"><img src="../assets/images/figures/basic/square.png" border="0" alt="square" /></a></td>
                        </tr>
                        <tr>
                            <td><a href="javascript:createFigure(figure_Circle);"><img src="../assets/images/figures/basic/circle.png" border="0" /></a></td>
                            <td><a href="javascript:createFigure(figure_Diamond);"><img src="../assets/images/figures/basic/diamond.png" border="0" /></a></td>
                            <td><a href="javascript:createFigure(figure_Parallelogram);"><img src="../assets/images/figures/basic/parallelogram.png" border="0" alt="SQR" /></a></td>
                        </tr>
                        <tr>
                            <td><a href="javascript:createFigure(figure_Ellipse);"><img src="../assets/images/figures/basic/ellipse.png" border="0" /></a></td>
                            <td><a href="javascript:createFigure(figure_RightTriangle);"><img src="../assets/images/figures/basic/right_triangle.png" border="0" /></a></td>
                            <td><a href="javascript:createFigure(figure_Pentagon);"><img src="../assets/images/figures/basic/pentagon.png" border="0" alt="SQR" /></a></td>
                        </tr>
                        <tr>
                            <td><a href="javascript:createFigure(figure_Hexagon);"><img src="../assets/images/figures/basic/hexagon.png" border="0" /></a></td>
                            <td><a href="javascript:createFigure(figure_Octogon);"><img src="../assets/images/figures/basic/octogon.png" border="0" /></a></td>
                            <td><a href="javascript:createFigure(figure_Text);"><img src="../assets/images/figures/basic/text.png" border="0" /></a></td>
                        </tr>

                    </table>
                </div>

                <div style="display:none;" id="secondary">
                    <table border="0" cellpadding="0" cellspacing="0" width="120">
                        <tr>
                            <td><a href="javascript:createFigure(figure_Page);"><img src="../assets/images/figures/secondary/page.png" border="0" alt="SQR" /></a></td>
                            <td><a href="javascript:createFigure(figure_PageUpperCornerFolded);"><img src="../assets/images/figures/secondary/page_upper_corner_folded.png" border="0" /></a></td>
                            <td><a href="javascript:createFigure(figure_PageLowerCornerFolded);"><img src="../assets/images/figures/secondary/page_lower_corner_folded.png" border="0" /></a></td>
                        </tr>
                        <tr>
                            <td><a href="javascript:createFigure(figure_SemiCircleUp);"><img src="../assets/images/figures/secondary/semi_circle_up.png" border="0" alt="semi circle" /></a></td>
                            <td><a href="javascript:createFigure(figure_SemiCircleDown);"><img src="../assets/images/figures/secondary/semi_circle_down.png" border="0" /></a></td>
                            <td><a href="javascript:createFigure(figure_Triangle);"><img src="../assets/images/figures/secondary/triangle.png" border="0" alt="triangle"/></a></td>
                        </tr>
                    </table>
                </div>
                <div style="display:none;" id="more">
                    More sets of figures <a href="http://diagramo.com/figures.php" target="_new">here</a>
                </div>
                <div id="minimap">
                </div>
            </div>
            <div id="edit">
            </div>
            <div style="width: 100%">
            <div  id="container">
                <canvas id="a" width="800" height="600" ontouchstart="onTouchStart(event);" ontouchmove="onTouchMove(event);"></canvas>
            </div>
            </div>
        </div>




        <script type="text/javascript">

            function loadFill(check){
                if(check.checked == true){
                    if($('#colorpickerHolder3').css('display')=='none'){
                        $('#colorSelector3').click();
                    }
                }
                else{
                    if($('#colorpickerHolder3').css('display')=='block'){
                        $('#colorSelector3').click();
                    }
                }
            }
            //$("#a").ontouchstart(onTouchStart);
            $("#a").mousemove(onMouseMove);
            $("#a").mousedown(onMouseDown);
            $("#a").mouseup(onMouseUp);
            //$("#a").click(onClick);

            document.onkeypress = onKeyPress;
            document.onkeydown = onKeyDown;
            document.onkeyup = onKeyUp;

        </script>
        <br/>
         <? require_once dirname(__FILE__) . '/common/analytics.php';?>
    </body>
</html>