<div id="header">
    <table style="height: 52px;" width="100%" border="0" cellpadding="0" cellspacing="0" >
        <tr>
            <td width="10">&nbsp;</td>
            <td style="/*border: 1px solid green;*/" width="100" valign="middle"><a href="/"><img src="./assets/images/logo-web-app.png" border="0" width="141" height="38" alt="Diagramo editor logo"/></a></td>
            <td valign="top"><span style="font-size: 10px;">v<?= VERSION ?></span></td>
            <? if (is_object($loggedUser)) { ?>
                <? if (false) { ?>
                <td width="70" align="center">
                    <a style="text-decoration: none;" target="new" href="http://diagramo.com/buy.php?url=<?=urlencode('http://' . $_SERVER['SERVER_NAME'])?>"><span style="color: orangered;">Upgrade !</span></a>
                </td>
                <?}?>
                <td width="70" align="center">
                    <a style="text-decoration: none;" href="./settings.php"><span class="menuText">My settings</span></a>
                </td>
                <td width="20" align="center">
                    <img style="vertical-align:middle;" src="./assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
                </td>
                <td width="170" align="center">
                    <a style="text-decoration: none;" href="./common/controller.php?action=logoutExe"><img style="vertical-align:middle; margin-right: 5px;" src="<?=WEBADDRESS?>/editor/assets/images/icon_logout.gif" border="0" width="16" height="16"/><span class="menuText">Logout (<?= $loggedUser->email ?>)</span></a>
                </td>
                <td width="10">&nbsp;</td>
            <? } else { ?>
                <td>&nbsp;</td>
            <? } ?>
        </tr>
    </table>
</div>