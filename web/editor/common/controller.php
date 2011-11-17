<?php

require_once dirname(__FILE__) . '/delegate.php';

session_start();
################################################################################
###   REQUEST   ################################################################
// Collect the data (from POST or GET)
$action = $_REQUEST['action'];


switch ($action) {

    case 'info':
        info();
        break;

    case 'logoutExe':
        logoutExe();
        break;

    case 'loginExe':
        loginExe();
        break;

    case 'forgotPasswordExe':
        forgotPasswordExe();
        break;

    case 'resetPassword':
        resetPassword();
        break;

    case 'resetPasswordExe':
        resetPasswordExe();
        break;

    case 'saveSettingsExe':
        saveSettingsExe();
        break;


    case 'save':
        save();
        break;

    case 'saveAs':
        saveAs();
        break;

    case 'saveSvg':
        saveSvg();
        break;

    case 'newDiagramExe':
        newDiagramExe();
        break;

    case 'editDiagramExe':
        editDiagramExe();
        break;

    case 'firstSaveExe':
        firstSaveExe();
        break;

    case 'load':
        load();
        break;

    case 'deleteDiagramExe':
        deleteDiagramExe();
        break;
    /*************************** */
    /*********COLABORATORS****** */
    /*************************** */
    case 'inviteColaboratorExe':
        inviteColaboratorExe();
        break;
    
    case 'cancelInvitationExe':
        cancelInvitationExe();
        break;
    
    case 'acceptInvitationExe':
        acceptInvitationExe();
        break;
    
    case 'declineInvitationExe':
        declineInvitationExe();
        break;

    case 'removeColaborator':
        removeColaborator();
        break;
    

    case 'removeMeFromDiagram':
        removeMeFromDiagram();
        break;
    
    /*************************** */
    /*********USERS****** */
    /*************************** */
//    case 'addUserExe':
//        addUserExe();
//        break;
    
    case 'registerExe':
        registerExe();
        break;
        
    case 'editUserExe':
        editUserExe();
        break;
}



function loginExe() {
    $email = trim($_REQUEST['email']);
    $password = trim($_REQUEST['password']);


    // Validate data
    if (validateString($email, 'Empty email or bad email syntax')) {
        #print "Wrong email";
    }
    if (validateString($password, 'Empty password')) {
        #print "Wrong password";
    }


    if (errors ()) {
        #print "Errors"; exit(0);
        //outer site
        redirect("../index.php");
        exit(0);
    }

    $delegate = new Delegate();
    $user = $delegate->userGetByEmailAndPassword($email, $password);
    if (is_object($user)) {
        $_SESSION['userId'] = $user->id;

        //remember me option
        if ($_REQUEST['rememberMe'] === 'true') {
            $userCookie = packer(array('email' => $email, 'password' => md5($password)), PACKER_PACK);
            setcookie('biscuit', $userCookie, time() + ((60 * 60 * 24) * 5), '/');
        }

        $user->lastLoginDate = now();
        $user->lastLoginIp = $_SERVER['REMOTE_ADDR'];
        $user->lastBrowserType = $_SERVER['HTTP_USER_AGENT'];
        $delegate->userUpdate($user);

        redirect("../editor.php");
        exit(0);        
    } else {
        addError("Authetication failed");
        //outer site
        redirect("../login.php");
        exit(0);
    }
}

/**
 * Logout
 */
function logoutExe() {
    if (is_numeric($_SESSION['userId'])) {
        unset($_SESSION['userId']);

        // Clear the user cookie
        setcookie('biscuit', null, time() - ((60 * 60 * 24) * 5), '/');


        session_destroy();
    }

    addMessage("You were logged out!");

    //up to the outer site
    redirect("../login.php");
}

/**
 */
function forgotPasswordExe() {    
    $email = trim($_POST['email']);


    // Validate data
    if (!validateString($email, 'Empty email or bad email syntax')) {
        print "Wrong email: " . $email;
        exit();
    }
    
    if($_REQUEST['captcha'] != $_SESSION['captcha']){
        addError("Text was wrong. try again!");        
    }


    if (errors ()) {
//        print "Errors"; exit(0);
        redirect("../forgot-password.php");
        exit(0);
    }

    $delegate = new Delegate();
    $user = $delegate->userGetByEmail($email);
    if (is_object($user)) {
        $url = WEBADDRESS . '/editor/common/controller.php?action=resetPassword&k=' . $user->password . '&i=' . $user->id;
        $body =
                "<html>
                <head>
                <title>Reset your password</title>
                </head>
             <body>
                Hello, <p/>
                Here is your request to reset your password. Please click the link to reset your password.
                <a href=\"${url}\">${url}</a>
             </body>
             </html>";
        if (sendEmail($user->email, 'no-reply@diagramo.com', "Password reset", $body)) {
            addMessage("Reset email sent!");
        } else {
            addError("Reset email NOT sent!");
        }

        #outer site
        redirect("../forgot-password.php");
        exit(0);
    } else {
        addError("Email not present in DB");
        redirect("../forgot-password.php");
        exit(0);
    }
}

/* * Resets a password */

function resetPassword() {
    $id = trim($_GET['i']); //get user Id
    $key = trim($_GET['k']); //get user's encrypted password :D


    // Validate data
    if (validateString($id, 'Wrong i param')) {
        #print "Wrong email";
    }

    if (validateString($key, 'Wrong k param')) {
        #print "Wrong email";
    }


    if (errors ()) {
        #print "Errors"; exit(0);
        redirect("../forgot-password.php");
        exit(0);
    }

    $delegate = new Delegate();
    $user = $delegate->userGetByIdAndEncryptedPassword($id, $key);
    #print_r($user);
    #exit();
    if (is_object($user)) {
        $_SESSION['userId'] = $user->id;

        redirect("../resetPassword.php");
        exit(0);
    } else {
        addError("User/Email not present in DB");
        redirect("../forgot-password.php");
        exit(0);
    }
}

/* * Resets a password */

function resetPasswordExe() {

    if (!is_numeric($_SESSION['userId'])) {
        addError("Not permited");
        redirect("../editor.php");
        exit(0);
    }

    $password = trim($_POST['password']);

    // Validate data
    if (validateString($password, 'Password should have at least 4 characters', 4)) {
        #print "Wrong email";
    }



    if (errors ()) {
        #print "Errors"; exit(0);
        redirect("../resetPassword.php");
        exit(0);
    }

    $delegate = new Delegate();
    $user = $delegate->userGetById($_SESSION['userId']);
    $user->password = md5($password);
    #print_r($user);
    #exit();
    if ($delegate->userUpdate($user)) {
        //we will skip this message
        //addMessage("Password changed!");

        redirect("../editor.php");
        exit(0);
    } else {
        addError("Password not changed");
        redirect("../resetPassword.php");
        exit(0);
    }
}

/* * Resets a password */

function saveSettingsExe() {

    if (!is_numeric($_SESSION['userId'])) {
        addError("Not permited");
        redirect("../editor.php");
        exit(0);
    }

    $delegate = new Delegate();
    $user = $delegate->userGetById($_SESSION['userId']);
//    print_r($user);
//    exit();

//    $name = trim($_POST['name']);
    $currentPassword = trim($_POST['currentPassword']);
    $newPassword = trim($_POST['newPassword']);

//    if (strlen($name) >= 2) {
//        $user->name = $name;
//    }

    if (strlen($currentPassword) > 0) { //we want to change the password
        if (!strlen($newPassword) >= 4) {
            addError("New password too short or empty");
        }

        if (md5($currentPassword) != $user->password) {
            addError("Current password is wrong");
        } else {
            $user->password = md5($newPassword);
        }
    }



    if (errors ()) {
        #print "Errors"; exit(0);
        redirect("../settings.php");
        exit(0);
    }


    if ($delegate->userUpdate($user)) {
        addMessage("Settings saved!");

        redirect("../settings.php");
        exit(0);
    } else {
        addError("Settings not saved (or nothing to save)");
        redirect("../settings.php");
        exit(0);
    }
}

/* * Save currently edited diagram
 * We have 3 cases:
 * 1. there is no account present  (once time)
 * 2. account is present but this is the first save (seldomly)
 * 3. account is pressent and this is not the first save (the most common)
 */

function save() {

    if (!is_numeric($_SESSION['userId'])) { //no user logged so save it temporarly
        $_SESSION['tempDiagram'] = $_POST['diagram'];
        $_SESSION['tempSVG'] = $_POST['svg'];
        print "noaccount";
        exit();
    } else { //user is logged
        if (is_numeric($_REQUEST['diagramId'])) { //we have a current working diagram
            //print($_POST['svg']);

            $delegate = new Delegate();
            
            //see if we have rights to save it
            $userdiagram = $delegate->userdiagramGetByIds($_SESSION['userId'], $_REQUEST['diagramId']);
            if(!is_object($userdiagram)){
                print 'Not allocated to this diagram';
                exit();
            }
            //end check rights


            $currentDiagramId = $_REQUEST['diagramId'];
            $nowIsNow = now();

            //update the Dia file
            $diaData = $delegate->diagramdataGetByDiagramIdAndType($currentDiagramId, Diagramdata::TYPE_DIA);

            $fh = fopen(dirname(__FILE__) . '/../diagrams/' . $currentDiagramId . '.dia', 'w');
            
//            $diaFile = dirname(__FILE__) . '/../diagrams/' . $_REQUEST['diagramId'] . '.dia';
            $diaSize = fwrite($fh, $_POST['diagram']);
            fclose($fh);

            $diaData->fileSize = $diaSize;
            $diaData->lastUpdate = $nowIsNow;
            $delegate->diagramdataUpdate($diaData);
            //end update Dia file
            //update the SVG file
            $svgData = $delegate->diagramdataGetByDiagramIdAndType($currentDiagramId, Diagramdata::TYPE_SVG);

            $fh = fopen(getStorageFolder() . '/' . $currentDiagramId . '.svg', 'w');
            $svgSize = fwrite($fh, $_POST['svg']);
            fclose($fh);

            $svgData->fileSize = $svgSize;
            $svgData->lastUpdate = $nowIsNow;
            $delegate->diagramdataUpdate($svgData);
            //end update the SVG file
            //update the Diagram
            $diagram = $delegate->diagramGetById($currentDiagramId);
            $diagram->size = $diaSize;
            $diagram->lastUpdate = $nowIsNow;

            if ($delegate->diagramUpdate($diagram)) {
                print "saved";
            } else {
                print 'diagramdata not saved';
            }
            exit();
        } else { //no current working diagram
            $_SESSION['tempDiagram'] = $_POST['diagram'];
            $_SESSION['tempSVG'] = $_POST['svg'];
            print "firstSave";
            exit();
        }
    }
}

/* * Save currently edited diagram. We always have an user logged
 * We have 2 cases:
 * 1. there is no account present  (do nothing)
 * 2. account is present so store diagram in session and redirect (from JavaScript) to save Diabram form
 */

function saveAs() {
    
    if (!is_numeric($_SESSION['userId'])) { //no user logged
        $_SESSION['tempDiagram'] = $_POST['diagram'];
        $_SESSION['tempSVG'] = $_POST['svg'];
        print "noaccount";
        exit();
    } else { //user is logged
        $_SESSION['tempDiagram'] = $_POST['diagram'];
        $_SESSION['tempSVG'] = $_POST['svg'];
        print "step1Ok";
        exit();
    }
}

/* * Save currently SVG-ed diagram
 */

function saveSvg() {

    if (!empty($_POST['svg'])) { //no user logged
        $_SESSION['svg'] = $_POST['svg'];
        print "svg_ok";
        exit();
    } else { //user is not logged
        print "svg_failed";
        exit();
    }
}

function newDiagramExe() {
//    if(!is_numeric($_SESSION['userId'])) { //no user logged
//        print "wrong turn";
//        exit();
//    }
    //reset ay temporary diagram
    $_SESSION['tempDiagram'] = null;
    unset($_SESSION['tempDiagram']);

    redirect('../editor.php');
}

function editDiagramExe() {
    if (!is_numeric($_SESSION['userId'])) { //no user logged
        print "Not allowed";
        exit();
    }

    if (!is_numeric($_REQUEST['diagramId'])) { //no diagram specified
        print "No diagram";
        exit();
    }

    $d = new Delegate();
    $userdiagram = $d->userdiagramGetByIds($_SESSION['userId'], $_REQUEST['diagramId']);
    if (is_object($userdiagram) && is_numeric($userdiagram->userId)) { //see if we are "attached" to this diagram
        $diagram = $d->diagramGetById($_REQUEST['diagramId']);

        $diagram->title = trim($_REQUEST['title']);
        $diagram->description = trim($_REQUEST['description']);
        $diagram->public = ($_REQUEST['public'] == true) ? true : false;
        $diagram->lastUpdate = now();

        if ($d->diagramUpdate($diagram)) {
            addMessage("Diagram updated");
        } else {
            addError("Diagram not updated");
        }
    } else {
        print "No rights over that diagram";
        exit();
    }

    redirect('../myDiagrams.php');
}

/* * We already have the temporary diagram saved in session */
function firstSaveExe() {
    if (!is_numeric($_SESSION['userId'])) {
        print "Wrong way";
        exit();
    }

    //store current time
    $nowIsNow = now();

    //save Diagram
    $diagram = new Diagram();
    $diagram->title = trim($_REQUEST['title']);
    $diagram->description = trim($_REQUEST['description']);
    $diagram->public = ($_REQUEST['public'] == true) ? true : false;
    $diagram->createdDate = $nowIsNow;
    $diagram->lastUpdate = $nowIsNow;
    $diagram->size = strlen($_SESSION['tempDiagram']); //TODO: it might be not very accurate

    $delegate = new Delegate();

    $token = '';
    do {
        $token = generateRandom(6);
    } while ($delegate->diagramCountByHash($token) > 0);

    $diagram->hash = $token;
    $diagramId = $delegate->diagramCreate($diagram);
    //end save Diagram
    //create Dia file
    $diagramdata = new Diagramdata();
    $diagramdata->diagramId = $diagramId;
    $diagramdata->type = Diagramdata::TYPE_DIA;
    $diagramdata->fileName = $diagramId . '.dia';

    $fh = fopen(getStorageFolder() . '/' . $diagramId . '.dia', 'w');
    $size = fwrite($fh, $_SESSION['tempDiagram']);
    fclose($fh);

    $diagramdata->fileSize = $size;
    $diagramdata->lastUpdate = $nowIsNow;

    $delegate->diagramdataCreate($diagramdata);
    //end Dia file
    //create SVG file
    $diagramdata = new Diagramdata();
    $diagramdata->diagramId = $diagramId;
    $diagramdata->type = Diagramdata::TYPE_SVG;
    $diagramdata->fileName = $diagramId . '.svg';

    $fh = fopen(getStorageFolder() . '/' . $diagramId . '.svg', 'w');
    $size = fwrite($fh, $_SESSION['tempSVG']);
    fclose($fh);

    $diagramdata->fileSize = $size;
    $diagramdata->lastUpdate = $nowIsNow;
    $delegate->diagramdataCreate($diagramdata);
    //end SVG file

    //clean temporary diagram
    unset($_SESSION['tempDiagram']);
    unset($_SESSION['tempSVG']);

    //attach it to an user
    $userdiagram = new Userdiagram();
    $userdiagram->diagramId = $diagramId;
    $userdiagram->userId = $_SESSION['userId'];
    $userdiagram->invitedDate = now();
    $userdiagram->level = Userdiagram::LEVEL_AUTHOR;
    $userdiagram->status = Userdiagram::STATUS_ACCEPTED;

    $delegate->userdiagramCreate($userdiagram);

    redirect("../editor.php?diagramId=" . $diagramId);
}


/**Loads a diagram*/
function load() {

    if (!is_numeric($_REQUEST['diagramId'])) {
        print "Wrong diagram id : " . $_REQUEST['diagramId'];
        exit();
    }

    $d = new Delegate();
    $diagram = $d->diagramGetById($_REQUEST['diagramId']);

    $allow = false;
    if($diagram->public){
        $allow = true;
    }
    else{ //no public so only logged users can see it
        if (!is_numeric($_SESSION['userId'])) {
            print "Wrong user id";
            exit();
        }

        $userdiagram = $d->userdiagramGetByIds($_SESSION['userId'], $_REQUEST['diagramId']);
        if (is_object($userdiagram) && is_numeric($userdiagram->userId)) {
            $allow = true;
        }
        else{
            print 'Error: no right over that diagram';
            exit();
        }
    }

    if($allow){
        $diagramdata = $d->diagramdataGetByDiagramIdAndType($_REQUEST['diagramId'], Diagramdata::TYPE_DIA);

        $diaFile = getStorageFolder() . '/' . $_REQUEST['diagramId'] . '.dia';

        /**When switching from Linux to Windows some files might get corrupt so we will use file_get_contents*/
//        $fh = fopen($diaFile, 'r');
//        $data = fread($fh, $diagramdata->fileSize);
//        fclose($fh);
        $data = file_get_contents($diaFile);

        print $data;
    }        
}



function deleteDiagramExe() {
    if (!is_numeric($_SESSION['userId'])) {
        print "Wrong way";
        exit();
    }

    if (!is_numeric($_REQUEST['diagramId'])) {
        print "Wrong diagram id : " . $_REQUEST['diagramId'];
        exit();
    }

    //TODO: usually ONLY the author can delete the diagram
    $d = new Delegate();


    $userdiagram = $d->userdiagramGetByIds($_SESSION['userId'], $_REQUEST['diagramId']);
    if (is_object($userdiagram) && is_numeric($userdiagram->userId)) {
        
        //delete diagramdata
        $diagramDatas = $d->diagramdataGetByDiagramId($userdiagram->diagramId);
        $storageFolder = getStorageFolder();
        foreach($diagramDatas as $diagramData){
            //TODO: we can make more tests here
            unlink($storageFolder . '/' . $diagramData->fileName);
            $d->diagramdataDeleteByDiagramIdAndType($diagramData->diagramId, $diagramData->type);
        }


        //delete all users linked to this diagram
        $userdiagrams = $d->userdiagramGetByDiagramId($userdiagram->diagramId);
        foreach($userdiagrams as $userdiagram){
            $d->userdiagramDelete($userdiagram->userId, $userdiagram->diagramId);
        }
        
        
        //delete diagram
        if ($d->diagramDelete($userdiagram->diagramId)) {
            addMessage("Diagram deleted");
        } else {
            addError("Diagram could not be deleted from database");
        }

        redirect('../myDiagrams.php');
    } else {
        print 'Error: no right over that diagram';
    }
}


/**Invite a collaborator to a diagram.
 * There are 2 kind of invitations:
 *  1. outside people - when you send an email with invitation and they will 
 *      first create an account and then accept the invitation
 *  2. known people - You already know those people and you invite them.
 *      They will get an email + an "accept invitation" link on main page.
 */
function inviteColaboratorExe() {

    if (!is_numeric($_SESSION['userId'])) {
        print "Wrong way";
        exit();
    }

    if (empty($_REQUEST['email'])) {
        print "Email is empty";
        exit();
    }

    $d = new Delegate();
    $loggedUser = $d->userGetById($_SESSION['userId']);
    $diagram = $d->diagramGetById($_REQUEST['diagramId']);

    //see if he has the right to invite collaborators
    $userdiagram = $d->userdiagramGetByIds($_SESSION['userId'], $_REQUEST['diagramId']);
    if (!is_object($userdiagram)) {
        addError("You have no rights to invite users.");
        redirect('../colaborators.php?diagramId=' . $diagram->id);
        exit();
    }

    if ($userdiagram->level != Userdiagram::LEVEL_AUTHOR) {
        addError("No rights to invite people");
        redirect('../colaborators.php?diagramId=' . $diagram->id);
        exit();
    }

    $email = trim($_REQUEST['email']);

    /* Alreay a collaborator?
     * See if email belongs to an existing colaborator (so we can skip)*/
    $collaborators = $d->usersGetAsCollaboratorNative($diagram->id);
    foreach($collaborators as $collaborator){
        if($collaborator->email == $email){
            addError("This email belongs to an already present collaborator");
            redirect('../colaborators.php?diagramId=' . $diagram->id);
        }
    }


    //add colaborator
    $user = $d->userGetByEmail($email);
    
    $invitation = new Invitation();        
    $invitation->createdDate = now();
    $invitation->diagramId = $diagram->id;
    
    $invitation->token = uniqid();        
        
    if(is_object($user)){ //already in the system
        $invitation->email = $user->email;
    }
    else{ //not in the system, invite by email (register first)
        
        $invitation->email = $email;
    }
    
    
    $d->invitationCreate($invitation);
    
    
    if(is_object($user)){ //already in the system
        //TODO: email
        $body = sprintf(
                    "<html>
                        <head>
                            <title>Diagramo - Invited to edit diagram</title>
                        </head>
                        <body>
                            Hello, <p/>
                            %s invited you to edit the diagram: %s. Please access your account for more information.
                        </body>
                    </html>",
                    $loggedUser->email,
                    $diagram->title
                );
    }
    else{
        //TODO: email
        $url = WEBADDRESS . '/register.php?i=' . $invitation->token;
        $body = sprintf(
                    "<html>
                        <head>
                            <title>Diagramo - Invited to edit diagram</title>
                        </head>
                        <body>
                            Hello, <p/>
                            %s invited you to edit the diagram: %s. Please click the link to accept it.
                            <a href=\"%s\">%s</a>
                        </body>
                    </html>",
                    $loggedUser->email,
                    $diagram->title,
                    $url,
                    $url                                    
                );
    }

    //send needed emails
    if (sendEmail($email, 'no-reply@diagramo.com', "Invitation", $body)) {
        addMessage("Invitation email sent!");
    } else {
        addError("Invitation email NOT sent!");
    }
        
    //refirect back to collaborators
    redirect('../colaborators.php?diagramId=' . $_REQUEST['diagramId']);
}


/**Delete an invitation*/
function cancelInvitationExe() {

    if (!is_numeric($_SESSION['userId'])) {
        print "Wrong way";
        exit();
    }

    if (empty($_REQUEST['invitationId'])) {
        print "Invitation id is wrong";
        exit();
    }

    $d = new Delegate();
    $loggedUser = $d->userGetById($_SESSION['userId']);
    $invitation = $d->invitationGetById($_REQUEST['invitationId']);
    $diagram = $d->diagramGetById($invitation->diagramId);

    //are u allocated?
    $userdiagram = $d->userdiagramGetByIds($loggedUser->id, $diagram->id);
    if (!is_object($userdiagram)) {
        addError("Not working on that diagram.");
        redirect('../myDiagrams.php');
        exit();
    }
    
    if($userdiagram->level != Userdiagram::LEVEL_AUTHOR){
        addError("You have no rights.");
        redirect('../myDiagrams.php');
        exit();
    }
    
    if($d->invitationDelete($invitation->id)){
        addMessage("Invitation deleted");
    } 
    else{
        addError("Invitation NOT deleted");
    }        
    
    redirect('../colaborators.php?diagramId=' . $diagram->id);
}


/**
 * Remove a colaborator
 */
function removeColaborator(){

    if (!is_numeric($_SESSION['userId'])) {
        print("Wrong way");
        exit();
    }
    
    if(!is_numeric($_REQUEST['diagramId'])){
        print("Wrong diagram");
        exit();
    }

    if(!is_numeric($_REQUEST['userId'])){
        print("Wrong user");
        exit();
    }

    $delegate = new Delegate();
    $userdiagram = $delegate->userdiagramGetByIds($_SESSION['userId'], $_REQUEST['diagramId']);
    if(is_object($userdiagram) && $userdiagram->level = Userdiagram::LEVEL_AUTHOR){
        if($_SESSION['userId'] == $_REQUEST['userId']){ /*Author should not delete itself :D*/
            addError("You should NOT delete yourself from the diagram. If you got bored just delete the diagram.");
        }
        else{
            if( $delegate->userdiagramDelete($_REQUEST['userId'], $_REQUEST['diagramId']) ){
                addMessage("Collaborator removed");
            }
            else{
                addError("Collaborator not removed");
            }
        }

        redirect('../colaborators.php?diagramId=' . $userdiagram->diagramId);
    }
    
}


/**
 * The collaborator remove itself from diagram
 */
function removeMeFromDiagram(){

    if (!is_numeric($_SESSION['userId'])) {
        print("Wrong way");
        exit();
    }

    if(!is_numeric($_REQUEST['diagramId'])){
        print("No diagram");
        exit();
    }


    $delegate = new Delegate();
    $loggedUser = $delegate->userGetById($_SESSION['userId']);
    
    $userdiagram = $delegate->userdiagramGetByIds($loggedUser->id, $_REQUEST['diagramId']);

    if ($userdiagram) {
        /**author can not remove itself. he has to delete the diagram*/
        if($userdiagram->level == Userdiagram::LEVEL_AUTHOR){
            addError("Author can not remove itself from a diagram");
            redirect('../myDiagrams.php');
            exit();
        }
        
        if ($delegate->userdiagramDelete($loggedUser->id, $_REQUEST['diagramId'])) {
            addMessage("Removed from diagram");
            //TODO:  notify author ?             
        } else {
            addError("You were not removed from diagram");
        }

        redirect('../myDiagrams.php');
    }
    else{
        print('No rights');
        exit();
    }
}


function info() {
    phpinfo();
}


function registerExe(){
    if(!validateEmail($_REQUEST['email'])){
        addError("Email is wrong");
    }
    
    $d = new Delegate();
    
    $existingUser = $d->userGetByEmail(trim($_REQUEST['email']));
    if(is_object($existingUser)){
        addError("An user with same email already present.");
    }
    
    if(!validateString($_REQUEST['password'])){
        addError("Password is not ok");
    }
    
    if($_REQUEST['password'] != $_REQUEST['password2']){
        addError("Passwords do not match");
    }
    
    if( !isset ($_REQUEST['invitationToken']) ){
        if($_REQUEST['captcha'] != $_SESSION['captcha']){
            addError("Code was incorrect");
        }
    }
    
        
    if(errors()){
        redirect('../../register.php');
        exit(0);
    }
    
    
    $user = new User();
    $user->email = trim($_REQUEST['email']);
    $user->password = md5($_REQUEST['password']);
    $user->createdDate = now();    
    $user->lastLoginDate = now();
    $user->lastLoginIp = $_SERVER['REMOTE_ADDR'];
    $user->lastBrowserType = $_SERVER['HTTP_USER_AGENT'];
    
    
    $userId = $d->userCreate($user);
    if(is_numeric($userId)){
        addMessage("You were registered");
        
        $_SESSION['userId'] = $userId;    
        
        $_SESSION['captcha'] = null;
        unset($_SESSION['captcha']);
        
        //TODO: if we have a temp diagram we will redirect to save page
        if( isset ($_SESSION['tempDiagram']) ){
            redirect('../saveDiagram.php');
        } 
        else if( isset($_REQUEST['invitationToken']) ){
            $invitation = $d->invitationGetByToken($_REQUEST['invitationToken']);
            if(is_object($invitation)){
                //find the diagram
                $diagram = $d->diagramGetById($invitation->diagramId);
                
                //create userdiagram
                $userdiagram = new Userdiagram();
                $userdiagram->diagramId = $diagram->id;
                $userdiagram->invitedDate = $invitation->createdDate;
                $userdiagram->level = Userdiagram::LEVEL_EDITOR;
                $userdiagram->status = Userdiagram::STATUS_ACCEPTED;
                $userdiagram->userId = $userId;
                
                if(!$d->userdiagramCreate($userdiagram)){
                    addError("Could not add you to the diagram");
                    redirect('../editor.php');
                    exit();
                }
                
                //delete invitation
                $d->invitationDelete($invitation->id);
                
                //all is fine, redirect to the diagram
                redirect('../editor.php?diagramId=' . $diagram->id);
                
            }
            else{
            }
            redirect('../editor.php');
        }
        else{
            redirect('../editor.php');
        }
        
        exit(0);
    }
    else{
        addError("User not added ");
        redirect('../../register.php');
        exit(0);
    }       
}




//function editUserExe(){
//        
//    if (!is_numeric($_SESSION['userId'])) {
//        print("Wrong way");
//        exit();
//    }
//    
//    if(!is_numeric($_REQUEST['userId'])){
//        print("Wrong user");
//        exit();
//    }
//    
//    #exit('here');
//    $d = new Delegate();
//    
//    $loggedUser = $d->userGetById($_SESSION['userId']);
//    
//    
//    
//    if(errors()){
//        redirect('../users.php');
//        exit(0);
//    }
//    
//    $user = $d->userGetById($_REQUEST['userId']);
//    
//    if(strlen($_REQUEST['password']) > 0 ){
//        $user->password = md5($_REQUEST['password']) ;
//        if($d->userUpdate($user)){
//            addMessage("User updated");
//        }
//        else{
//            addError("User NOT updated");
//        }    
//    }
//    
//    
//    redirect('../users.php');
//}


function acceptInvitationExe(){
    if (!is_numeric($_SESSION['userId'])) {
        print("Wrong way");
        exit();
    }
    if( !isset ($_REQUEST['invitationId']) ){
        print("Wrong Invitation");
        exit();
    }
    
    $d = new Delegate();
    $loggedUser = $d->userGetById($_SESSION['userId']);
    $invitation = $d->invitationGetById($_REQUEST['invitationId']);
    
    
    if($invitation->email == $loggedUser->email){ //a match made in stars...how lovely :)
        
        
        $diagram = $d->diagramGetById($invitation->diagramId);
                
        //create userdiagram
        $userdiagram = new Userdiagram();
        $userdiagram->diagramId = $diagram->id;
        $userdiagram->invitedDate = $invitation->createdDate;
        $userdiagram->level = Userdiagram::LEVEL_EDITOR;
        $userdiagram->status = Userdiagram::STATUS_ACCEPTED;
        $userdiagram->userId = $loggedUser->id;

        //store it in DB
        $d->userdiagramCreate($userdiagram);

        //delete invitation
        $d->invitationDelete($invitation->id);
        
        addMessage("Invitation accepted");
        redirect('../editor.php?diagramId=' . $diagram->id);
    }
    else{
        
        addError("Nope");
        redirect('../myDiagrams.php');
    }
    
    
}
    
function declineInvitationExe(){
    if (!is_numeric($_SESSION['userId'])) {
        print("Wrong way");
        exit();
    }
    if( !isset ($_REQUEST['invitationId']) ){
        print("Wrong Invitation");
        exit();
    }
    
    $d = new Delegate();
    $loggedUser = $d->userGetById($_SESSION['userId']);
    $invitation = $d->invitationGetById($_REQUEST['invitationId']);
    
    
    if($invitation->email == $loggedUser->email){ //a match made in stars...how lovely :)
        $d->invitationDelete($invitation->id);
        addMessage("Invitation declined.");
    }
    
    redirect('../myDiagrams.php');
}
?>