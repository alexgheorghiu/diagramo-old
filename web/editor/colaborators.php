<?php
/**Colaborators are per diagram*/

require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

require_once dirname(__FILE__) . '/common/rememberme.php';

if (!isset($_SESSION['userId']) || !is_numeric($_SESSION['userId'])) {
    addError("Access denied");
    redirect('./index.php');
}

if(!is_numeric($_REQUEST['diagramId'])){
    print('Wrong Diagram Id');
    exit();
}



$delegate = new Delegate();

$loggedUser = $delegate->userGetById($_SESSION['userId']);
$diagram = $delegate->diagramGetById($_REQUEST['diagramId']);

$userdiagram = $delegate->userdiagramGetByIds($loggedUser->id, $diagram->id);


$collaborators = $delegate->usersGetAsCollaboratorNative($diagram->id);
$invitations = $delegate->invitationGetAllForDiagram($diagram->id);


/*All the collaborators this author knows in the system
 * as a dictionary (email, user_object)
 */
$buddies =  $delegate->usersGetBuddies($loggedUser->id);

?>

<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>Colaborators - Diagramo</title>
        <link rel="stylesheet" media="screen" type="text/css" href="assets/css/style.css" />
        <script type="text/javascript">
            function confirmation(message){
                var answer = confirm(message);
                if(answer){
                    return true;
                }

                return false;
            }
            
            
        </script>
    </head>
    <body>
        <? require_once dirname(__FILE__) . '/header.php'; ?>

        <div id="content" style="text-align: left; /*border: solid 1px red;*/ padding-left: 100px;">
            <? require_once dirname(__FILE__) . '/common/messages.php'; ?>
            <br/>

            
            <!--Invitations-->
            <?if($userdiagram->level == Userdiagram::LEVEL_AUTHOR){?>
            <?if( count($invitations) > 0 ){?>
            <div class="form"  style="width: 600px;">
                <div class="formTitle">
                    <span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">
                        Invitations for diagram: <?=$diagram->title?>
                    </span>
                </div>
                <table width="100%">
                    
                    <tr>
                        <th>Date</th>
                        <th>Email</th>
                        <th>Cancel</th>
                    </tr>
                    <?foreach($invitations as $invitation){?>
                    <tr>
                        <td><?=$invitation->createdDate?></td>
                        <td><?=$invitation->email?></td>
                        <td><a onclick="return confirm('Are you sure you want to cancel this invitation?');" href="/editor/common/controller.php?action=cancelInvitationExe&invitationId=<?=$invitation->id?>">cancel</a></td>
                    </tr>
                    <?}?>
                </table>
            </div>
            <?}?>
            <?}?>
            
            <p/>
            
            <!--Collaborators-->
            <?if(count($collaborators) > 0 ){?>
            <div class="form"  style="width: 600px;">
                <div class="formTitle" >
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="400"><span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Collaborators for diagram: <?=$diagram->title?></span></td>
                            <td colspan="2">&nbsp;</td>
                        </tr>
                    </table>
                </div>

                <table border="0" width="100%">
                    <tr>
                        <td align="center"><span class="formLabel">Level</span></td>
                        <td><span class="formLabel">Email</span></td>
                        <td align="center"><span class="formLabel">Remove collaborator</span></td>
                    </tr>
                    <?foreach($collaborators as $collaborator){
                        $colabDiagram = $delegate->userdiagramGetByIds($collaborator->id, $diagram->id);
                    ?>
                    <tr>
                        <td align="center">
                            <img src="./assets/images/<?=$colabDiagram->level==Userdiagram::LEVEL_AUTHOR?'author.gif':'editor.gif'?>"/>
                        </td>
                        <td><?=$collaborator->email?></td>
                        <td align="center">
                            <?if($userdiagram->level == Userdiagram::LEVEL_AUTHOR && $collaborator->id != $_SESSION['userId']){?>
                            <a onclick="return confirmation('Are you sure you want to remove the collaborator?');" href="./common/controller.php?action=removeColaborator&diagramId=<?=$diagram->id?>&userId=<?=$collaborator->id?>"><img style="vertical-align:middle; margin-right: 3px;" src="./assets/images/remove.gif" border="0" width="24" height="24"/></a>
                            <?}else{?>
                            N/A
                            <?}?>
                        </td>
                    </tr>
                    <?}?>
                </table>
            </div>            
            <?}?>
            <!--End collaborators-->

            
            <p/>

            <!--Invite known people-->
            <?if($userdiagram->level == Userdiagram::LEVEL_AUTHOR){?>
            <?if(count($buddies) > 0){?>
            <div class="form"  style="width: 600px;">
                <div class="formTitle" >
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="400"><span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Invite known people to diagram</span></td>
                            <td colspan="2">&nbsp;</td>
                        </tr>
                    </table>
                </div>
                
                <form action="./common/controller.php" method="POST">
                    <input type="hidden" name="action" value="inviteColaboratorExe"/>
                    <input type="hidden" name="diagramId" value="<?=$diagram->id?>"/>
                    <label for="email">Name</label>
                    <select name="email" id="email">
                        <?foreach($buddies as $email => $buddy){?>
                        <option value="<?=$buddy->email?>"><?=$buddy->name . '(' . $buddy->email . ')'?></option>
                        <?}?>
                    </select>
                    <input type="submit" value="Invite"/>
                </form>
            </div>
            <?}?>
            <?}?>
            <!--End add collaborator-->
            
            <p/>
            
            <!--Invite new people by email-->
            <?if($userdiagram->level == Userdiagram::LEVEL_AUTHOR){?>
            <div class="form"  style="width: 600px;">
                <div class="formTitle" >
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="400"><span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Invite people by email</span></td>
                            <td colspan="2">&nbsp;</td>
                        </tr>
                    </table>
                </div>
                
                <form action="./common/controller.php" method="POST">
                    <input type="hidden" name="action" value="inviteColaboratorExe"/>
                    <input type="hidden" name="diagramId" value="<?=$diagram->id?>"/>
                    <label for="email">Email</label>
                    <input type="text" name="email"/>
                    <input type="submit" value="Invite"/>
                </form>
            </div>
            <?}?>
            <!--End add collaborator by email-->
            

            <p/>
            <div class="form"  style="width: 600px;">
                <a href="./editor.php?diagramId=<?=$_REQUEST['diagramId']?>">back to diagram</a>
            </div>
        </div>
        

    </body>
</html>
