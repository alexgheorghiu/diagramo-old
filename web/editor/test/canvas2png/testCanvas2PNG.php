<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        <script type="text/javascript" src="../../assets/javascript/jquery-1.4.2.min.js"></script>
        <script type="text/javascript">
            var canvas; 
            var ctx;
            var console;
            function init(){
                //alert('loaded');
                
                console = document.getElementById('console');
                canvas = document.getElementById('c');
                ctx = canvas.getContext('2d');
                
                ctx.beginPath();
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 400, 500);
                ctx.fill();
                
                ctx.moveTo(10,10);
                ctx.lineTo(200, 200);
                ctx.stroke();                
            }
            
            function saveCanvas(){
                var dataURL = canvas.toDataURL();
                //alert(dataURL);
                console.value = dataURL;
                
                //see: http://api.jquery.com/jQuery.post/
                $.post("./save.php",
                    {action: 'save', data: dataURL},
                    function(respData){
                        //alert(data);
                        if(respData == 'ok'){
                            //alert("saved");
                            
                            //window.open("./download.png");
                        }
                        else{
                            alert('Unknown: ' + data );
                            return false;
                        }
                    }
                );
                
                return true;
            }
            
            window.addEventListener('load', init, false);
            
        </script>
    </head>
    <body >
        <canvas width="400" height="500" id="c" style="float: left;"></canvas>
        <a href="./download.php" onclick="return saveCanvas(); " target="new">Save</a>
        <textarea id="console" cols="50" rows="10"></textarea>
    </body>
</html>
