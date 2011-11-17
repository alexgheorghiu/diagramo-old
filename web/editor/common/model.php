<?php
include(dirname(__FILE__).'/settings.php');


//TODO: Blob should not be 'refined' with ' htmlentities(stripslashes....'


#create connection
$con= mysql_connect(DB_ADDRESS, DB_USER_NAME, DB_USER_PASS);
$ok	= mysql_select_db(DB_NAME);

#find all tables
$tables = array();
$query = "SHOW TABLES";
$result = mysql_query($query, $con);
while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    $tableName = $row['Tables_in_' . DB_NAME];
    #print $tableName . "\n";
    $tables[] = $tableName;
}


#find columns their properties
$protoModels = array();
foreach($tables as $table){
    $query = "SHOW COLUMNS FROM $table";
    print $query . "\n";
    
    $result = mysql_query($query, $con);
    
    $protoModels[$table] = array();
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $columnName = $row['Field'];
        //print "\t". $columnName . "\n";
    
        
        $isKey = $row['Key'] === 'PRI' ? 1:0;
        print "\t". $isKey . "\n";
        
        $isAutoIncrement = $row['Extra'] === 'auto_increment' ? 1:0;
        #print "\tColumn $columnName, key: $isKey, auto-increment: $isAutoIncrement  \n";
        
        
        $protoModels[$table][] = array('columnName'=>$columnName, 'isKey'=>$isKey, 'isAutoIncrement'=>$isAutoIncrement, 'type'=>$row['Type'], 'null'=>$row['Null']);
        
    }//while
}//foreach

#print_r($protoModels);


#GENERATE MODEL

#generate model for each table
$fh = fopen(dirname(__FILE__).'/entities.php','w+');
#php start
fwrite($fh, "<?php\n");
#include Entity
fwrite($fh, "\$currentFolder = dirname(__FILE__);\n");

foreach($protoModels as $protoName => $protoData){
    #Recover from Novak's request (remove plural), actually remove the last 's'
    print_r('Initial:' . $protoName."\n");    
    print_r('After:' . $protoName."\n");
    
    $entityName = ucfirst($protoName);
    
    #class start
    fwrite($fh, "\n\nclass $entityName {");
    
    
    
    #enum types ---to--> CONST
    foreach($protoData as $protoProperty){
        #print_r($protoProperty);
        #read this: http://www.hudzilla.org/phpwiki/index.php?title=Finding_a_string_within_a_string
        if(strpos($protoProperty['type'],'enum')===false){
            #do nothing           
        }
        else{
            $type = $protoProperty['type'];
            $columnName = $protoProperty['columnName'];
            
            $start = strpos($type, '(');
            $end = strpos($type, ')');
            $sub = substr($type, $start + 1, $end - $start -1 );
            $tmps = explode (',', $sub);
            $values = array();
            foreach($tmps as $t){
                $values[] = substr($t, 1, strlen($t) -2);
            }
            #print_r($values);
            
            foreach($values as $value){
                fwrite($fh, sprintf("\n\tconst %s = '%s';", strtoupper($columnName . '_' . $value), $value) );
            }
        }
    }    
    
    
    #columns ---to--> FIELDS
    fwrite($fh, "\n");
    foreach($protoData as $protoProperty){
            fwrite($fh, "\n\tpublic $" . $protoProperty['columnName'] .";");
    }
    fwrite($fh, "\n");
    
    
    #generate loadFromSQL function
    fwrite($fh, "\n\tfunction loadFromSQL(\$row) {");
    foreach($protoData as $protoProperty){
		//stripslashes is not needed as the inverse function of addslashes....fwrite($fh, sprintf("\n\t\t\$this->%s = is_null(\$row['%s']) ? null : stripslashes(\$row['%s']);",$protoProperty['columnName'] , $protoProperty['columnName'], $protoProperty['columnName']));
		fwrite($fh, sprintf("\n\t\t\$this->%s = is_null(\$row['%s']) ? null : \$row['%s'];",$protoProperty['columnName'] , $protoProperty['columnName'], $protoProperty['columnName']));
    }
    fwrite($fh, "\n\t}\n");


/*
    #generate validate function
    fwrite($fh, "\n\tfunction validate() {");
    foreach($protoData as $protoProperty) {
		if($protoProperty['null'] == 'NO') {
			if(strpos($protoProperty['type'], 'int')) {
				fwrite($fh, sprintf("\n\t\t\(!validateInteger(\$this->%s)) ? return false : null;", $protoProperty['columnName']));
			}
		}
    }
    fwrite($fh, "\t}\n");
*/

    
    
    #class end
    fwrite($fh, '}');
    
    
    
    
} //end foreach

#php end
fwrite($fh, "\n?>");

#close stream
fclose($fh);


?>