// kdo je na fořtu, kdo je na pauze 
// pauzírovaný, čtyřka (jak rozpisovat)


var glCurrResultTotals = [0,0,0];
var glCurrGameId;
var glCurrSessionId;
var glCurrSessionMaxId;
var glCurrSessionList = "";

//Called when application is started.
function OnStart() {

    app.SetOrientation("Portrait", null);

    //Create main layout vertical
    layMain = app.CreateLayout( "linear", "Vertical,FillXY" );

    //Create a layout with objects vertically centered.
    layGames = app.CreateLayout( "linear", "Horizontal" );
    layMain.AddChild( layGames );

    //Create spinner game select.
    spinGames = app.CreateSpinner( "", 0.3 );
    spinGames.SetOnTouch( spinGames_OnChange );
    layGames.AddChild( spinGames );

    btnNewGame = app.CreateButton( "new g.",  0.3, -1 );
    btnNewGame.SetOnTouch( btnNewGame_OnTouch );
    layGames.AddChild( btnNewGame );

    btnDeleteGame = app.CreateButton( "delete g.",  0.3, -1 );
    btnDeleteGame.SetOnTouch( btnDeleteGame_OnTouch );
    layGames.AddChild( btnDeleteGame );

    //Create a layout with objects vertically centered.
    laySession = app.CreateLayout( "linear", "Horizontal" );
    layMain.AddChild( laySession );

    //Create spinner session select.
    spinSessions = app.CreateSpinner( "", 0.3 );
    spinSessions.SetOnTouch( spinSessions_OnChange );
    laySession.AddChild( spinSessions );

    btnNewSession = app.CreateButton( "new s.",  0.3, -1 );
    btnNewSession.SetOnTouch( btnNewSession_OnTouch );
    laySession.AddChild( btnNewSession );

    btnDeleteSession = app.CreateButton( "delete s.",  0.3, -1 );
    btnDeleteSession.SetOnTouch( btnDeleteSession_OnTouch );
    laySession.AddChild( btnDeleteSession );

    // --- end of navigation buttons



    // create fields with player nems
    layPNames = app.CreateLayout( "linear", "Horizontal" );
    layMain.AddChild( layPNames );

    txtPlayer1 = app.CreateText( "", 0.3, -1 );
    txtPlayer1.SetTextSize(18);
    txtPlayer1.SetTextShadow( 0.6, 0.02, 0.02, "red" );
    txtPlayer1.SetBackColor("darkgray");
    txtPlayer1.SetMargins( 0, 0.01, 0, 0.01 );
    layPNames.AddChild( txtPlayer1 );

    txtPlayer2 = app.CreateText( "", 0.3, -1 );
    txtPlayer2.SetTextSize(18);
    txtPlayer2.SetTextShadow( 0.6, 0.02, 0.02, "green" );
    txtPlayer2.SetBackColor("darkgray");
    txtPlayer2.SetMargins( 0, 0.01, 0, 0.01 );
    layPNames.AddChild( txtPlayer2 );

    txtPlayer3 = app.CreateText( "", 0.3, -1 );
    txtPlayer3.SetTextSize(18);
    txtPlayer3.SetTextShadow( 0.6, 0.02, 0.02, "yellow" );
    txtPlayer3.SetBackColor("darkgray");
    txtPlayer3.SetMargins( 0, 0.01, 0, 0.01 );
    layPNames.AddChild( txtPlayer3 );

    // create input fields
    layPResults = app.CreateLayout( "linear", "Horizontal" );
    layMain.AddChild( layPResults );

    edtPlayer1 = app.CreateTextEdit( "", 0.3, -1, "Number" );
    edtPlayer1.SetOnChange( edtPlayer1_OnChange );
    layPResults.AddChild( edtPlayer1 );

    edtPlayer2 = app.CreateTextEdit( "", 0.3, -1, "Number" );
    edtPlayer2.SetOnChange( edtPlayer2_OnChange );
    layPResults.AddChild( edtPlayer2 );

    edtPlayer3 = app.CreateTextEdit( "", 0.3, -1, "Number" );
    edtPlayer3.SetOnChange( edtPlayer3_OnChange );
    layPResults.AddChild( edtPlayer3 );

    // report result
    btnNewResult = app.CreateButton( "store new result",  0.9, -1 );
    btnNewResult.SetOnTouch( btnNewResult_OnTouch );
    layMain.AddChild( btnNewResult );

    // create play list
    scrollPlays = app.CreateScroller( 0.9, 0.21 );
    layMain.AddChild( scrollPlays );

    layScroll = app.CreateLayout( "Linear", "Vertical,FillX" );
    scrollPlays.AddChild( layScroll );

    scrollPlays.ScrollTo( 0,layScroll.GetHeight() );

    // create fields with player totals
    layResults = app.CreateLayout( "linear", "Horizontal" );
    layMain.AddChild( layResults );

    txtPlayer1rt = app.CreateText( "", 0.3, -1 );
    txtPlayer1rt.SetTextSize(24);
    txtPlayer1rt.SetBackColor("darkgray");
    txtPlayer1rt.SetMargins( 0, 0.01, 0, 0.01 );
    layResults.AddChild( txtPlayer1rt );

    txtPlayer2rt = app.CreateText( "", 0.3, -1 );
    txtPlayer2rt.SetTextSize(24);
    txtPlayer2rt.SetBackColor("darkgray");
    txtPlayer2rt.SetMargins( 0, 0.01, 0, 0.01 );
    layResults.AddChild( txtPlayer2rt );

    txtPlayer3rt = app.CreateText( "", 0.3, -1 );
    txtPlayer3rt.SetTextSize(24);
    txtPlayer3rt.SetBackColor("darkgray");
    txtPlayer3rt.SetMargins( 0, 0.01, 0, 0.01 );
    layResults.AddChild( txtPlayer3rt );


    //Add layout to app.
    app.AddLayout( layMain );


    // initialize db
    initDb();

    refreshSpinGames();

}

function initDb() {
    //Create or open a database called "MyData".
    db = app.OpenDatabase( "marias" );

    //db.Delete();

    //db.ExecuteSql( "DROP TABLE games" );
    //db.ExecuteSql( "DROP TABLE plays" );

    //Create a table (if it does not exist already).
    db.ExecuteSql( "CREATE TABLE IF NOT EXISTS games " +
        "(id integer primary key, player1 text, player2 text, player3 text)" );

    //
    db.ExecuteSql( "ALTER TABLE games ADD IF NOT EXISTS " +
        "(player4 text, play_type integer)" );

    db.ExecuteSql( "CREATE TABLE IF NOT EXISTS plays " +
        "(id integer primary key, " +
        "game_id integer, " +
        "session integer, " +
        "player1_amount numeric, player2_amount numeric, player3_amount numeric, " +
        "FOREIGN KEY(game_id) REFERENCES games(id) )" );

    db.ExecuteSql( "ALTER TABLE plays ADD IF NOT EXISTS " +
        "(player4_amount numeric, position_type integer)" );

}


function btnNewGame_OnTouch(){

    //Create dialog window.
    dlgTxt = app.CreateDialog( "enter player names" );

    //Create a layout for dialog.
    layDlg = app.CreateLayout( "linear", "vertical,fillxy" );
    layDlg.SetPadding( 0.02, 0, 0.02, 0.02 );
    dlgTxt.AddLayout( layDlg );

    //Create a list control.
    edtPlayer1ng = app.CreateTextEdit( "", 0.6, -1 );
    edtPlayer1ng.SetHint( "player 1" );
    layDlg.AddChild( edtPlayer1ng );

    edtPlayer2ng = app.CreateTextEdit( "", 0.6, -1 );
    edtPlayer2ng.SetHint( "player 2" );
    layDlg.AddChild( edtPlayer2ng );

    edtPlayer3ng = app.CreateTextEdit( "", 0.6, -1 );
    edtPlayer3ng.SetHint( "player 3" );
    layDlg.AddChild( edtPlayer3ng );

    edtPlayer4ng = app.CreateTextEdit( "", 0.6, -1 );
    edtPlayer4ng.SetHint( "player 4 (optional)" );
    layDlg.AddChild( edtPlayer4ng );

    //Create a layout with objects vertically centered.
    layConfirm = app.CreateLayout( "linear", "Horizontal" );
    layDlg.AddChild( layConfirm );

    btnOkNames = app.CreateButton( "ok",  0.3, -1 );
    btnOkNames.SetOnTouch( btnOkNames_OnTouch );
    layConfirm.AddChild( btnOkNames );

    btnCancelNames = app.CreateButton( "cancel",  0.3, -1 );
    btnCancelNames.SetOnTouch( btnCancelNames_OnTouch );
    layConfirm.AddChild( btnCancelNames );

    //Show dialog.
    dlgTxt.Show();

}

function btnDeleteGame_OnTouch() {

    if ( spinGames.GetText() ){

        idsToDelete = spinGames.GetText().split(":");
        glCurrGameId = parseInt(idsToDelete[0]);

        console.log("id to delete: " + glCurrGameId );
        db.ExecuteSql( "DELETE FROM games WHERE id = " + glCurrGameId, [], refreshSpinGames );   

        // should be done by casacde delete
        db.ExecuteSql( "DELETE FROM plays WHERE game_id = " + glCurrGameId  ); 

        //refreshSpinGames();

        txtPlayer1.SetText("");
        txtPlayer2.SetText("");
        txtPlayer3.SetText("");

    }
}



function btnOkNames_OnTouch() {

    if ( !edtPlayer1ng.GetText() || !edtPlayer2ng.GetText() || !edtPlayer3ng.GetText() ){
        app.ShowPopup( "some of the names is not defined" );
        return;
    }

    db.ExecuteSql( "INSERT INTO games (player1, player2, player3)" +   
        " VALUES (?,?,?)", [edtPlayer1ng.GetText(), edtPlayer2ng.GetText(),edtPlayer3ng.GetText()], 
        OnNamesOk, 
        OnNamesError );  
}


function btnNewSession_OnTouch() {


    if ( glCurrGameId ){
        console.log("glCurrGameId: " + glCurrGameId );
        if ( glCurrSessionId == 0 ){
            glCurrSessionMaxId = 1;
            glCurrSessionList = "1";
            glCurrSessionId = 1;
        } else {
            glCurrSessionMaxId = glCurrSessionMaxId + 1;
            glCurrSessionList = glCurrSessionList + "," + glCurrSessionMaxId;
            glCurrSessionId = glCurrSessionMaxId;
        }

        spinSessions.SetList( glCurrSessionList );

        spinSessions.SelectItem( glCurrSessionId );

        refreshResults();

        console.log( "add session: " + glCurrSessionId );

    }
}


function btnDeleteSession_OnTouch() {

    if ( spinGames.GetText() ){

        idsToDelete = spinGames.GetText().split(":");
        glCurrGameId = parseInt(idsToDelete[0]);

        console.log("id-session to delete: " + glCurrGameId + "-" + glCurrSessionId );
        db.ExecuteSql( "DELETE FROM plays WHERE game_id = " + glCurrGameId + " AND session = " + glCurrSessionId, [], refreshSessions );   

    }
}



function refreshSpinGames(){

    db.ExecuteSql( "SELECT * FROM games ORDER BY id;", [], OnGamesResult ); 

}


function refreshSessions() {

    db.ExecuteSql( "SELECT DISTINCT session FROM plays WHERE game_id = ? ORDER BY 1;", [glCurrGameId], OnSessionResult );

}


function refreshResults() {

    db.ExecuteSql( "SELECT id, player1_amount, player2_amount, player3_amount FROM plays WHERE game_id = ? AND session = ? ORDER BY 1;", [glCurrGameId, glCurrSessionId], OnResultsResult );

}


function OnGamesResult(results){

    var s = "";  
    var tmp = "";
    var len = results.rows.length;  
    for(var i = 0; i < len; i++ ) {  
        var item = results.rows.item(i)

        if ( s ){
            s += ","
        }
        tmp = item.id + ":" + item.player1 + "-" + item.player2 + "-" + item.player3;
        glCurrGameId = parseInt(item.id);    
        s += tmp;   
    }  

    spinGames.SetList( s );

    spinGames.SelectItem( tmp );

    setNames(tmp);

    refreshSessions();
}


function OnSessionResult( results ){

    glCurrSessionId = 0;
    glCurrSessionMaxId = 0;
    glCurrSessionList = "";

    var s = "";  
    var tmp = "";
    var len = results.rows.length;  
    for(var i = 0; i < len; i++ ) {  

        console.log("in session loop");
        var item = results.rows.item(i)

        if ( s.length > 0 ){
            s += ","
        } 
        tmp = item.session;
        glCurrSessionId = parseInt(tmp);   
        glCurrSessionMaxId = glCurrSessionId;   
        s += tmp;   
    }  

    glCurrSessionList = s;

    spinSessions.SetList( s );
    spinSessions.SelectItem( tmp );  

    refreshResults();

}


function OnResultsResult( results ){

    scrollPlays.RemoveChild(layScroll);

    layScroll = app.CreateLayout( "Linear", "Vertical,FillX" );
    scrollPlays.AddChild( layScroll );

    glCurrResultTotals[0] = 0;
    glCurrResultTotals[1] = 0;
    glCurrResultTotals[2] = 0;

    //reset totals
    if (glCurrResultTotals[0] < 0 ) {
        txtPlayer1rt.SetTextColor("red");
    } else if ( glCurrResultTotals[0] > 0 ){
        txtPlayer1rt.SetTextColor("green");
    } else {
        txtPlayer1rt.SetTextColor("white");
    }
    txtPlayer1rt.SetText( glCurrResultTotals[0].toFixed(1) );
    if (glCurrResultTotals[1] < 0 ) {
        txtPlayer2rt.SetTextColor("red");
    } else if ( glCurrResultTotals[1] > 0 ){
        txtPlayer2rt.SetTextColor("green");
    } else {
        txtPlayer2rt.SetTextColor("white");
    }
    txtPlayer2rt.SetText( glCurrResultTotals[1].toFixed(1) );
    if (glCurrResultTotals[2] < 0 ) {
        txtPlayer3rt.SetTextColor("red");
    } else if ( glCurrResultTotals[2] > 0 ){
        txtPlayer3rt.SetTextColor("green");
    } else {
        txtPlayer3rt.SetTextColor("white");
    }
    txtPlayer3rt.SetText( glCurrResultTotals[2].toFixed(1) );    

    var s = "";  
    var tmp = "";
    var len = results.rows.length;  

    for(var i = 0; i < len; i++ ) {  
        var item = results.rows.item(i)

        layPNames = app.CreateLayout( "linear", "Horizontal" );            
        layScroll.AddChild( layPNames );

        var pr1;
        if ( item.player1_amount ){
            pr1 = item.player1_amount.toFixed(1);
            glCurrResultTotals[0] = glCurrResultTotals[0] + item.player1_amount;
        } else {
            pr1 = "-";
        }

        txtPlayer1r = app.CreateText( pr1, 0.3, -1 );
        if (item.player1_amount < 0 ) {
            txtPlayer1r.SetTextColor("red");
        } else if ( item.player1_amount > 0 ){
            txtPlayer1r.SetTextColor("green");
        }
        txtPlayer1r.SetTextSize(16);
        txtPlayer1r.SetBackColor("darkgray");        
        layPNames.AddChild( txtPlayer1r );

        var pr2;
        if ( item.player2_amount ){
            pr2 = item.player2_amount.toFixed(1);
            glCurrResultTotals[1] = glCurrResultTotals[1] + item.player2_amount;
        } else {
            pr2 = "-";
        }

        txtPlayer2r = app.CreateText( pr2, 0.3, -1 );
        if (item.player2_amount < 0 ) {
            txtPlayer2r.SetTextColor("red");
        } else if ( item.player2_amount > 0 ){
            txtPlayer2r.SetTextColor("green");
        }
        txtPlayer2r.SetTextSize(16);
        txtPlayer2r.SetBackColor("darkgray");
        layPNames.AddChild( txtPlayer2r );    

        var pr3;
        if ( item.player3_amount ){
            pr3 = item.player3_amount.toFixed(1);
            glCurrResultTotals[2] = glCurrResultTotals[2] + item.player3_amount;

        } else {
            pr3 = "-";
        }
        txtPlayer3r = app.CreateText( pr3, 0.3, -1 );
        if (item.player3_amount < 0 ) {
            txtPlayer3r.SetTextColor("red");
        } else if ( item.player3_amount > 0 ){
            txtPlayer3r.SetTextColor("green");
        }
        txtPlayer3r.SetTextSize(16);
        txtPlayer3r.SetBackColor("darkgray");
        layPNames.AddChild( txtPlayer3r );    

        console.log( "totals: " + glCurrResultTotals );

        // test scroll step
        scrollPlays.ScrollTo( 0,layScroll.GetHeight() );

        //update totals
        if (glCurrResultTotals[0] < 0 ) {
            txtPlayer1rt.SetTextColor("red");
        } else if ( glCurrResultTotals[0] > 0 ){
            txtPlayer1rt.SetTextColor("green");
        } else {
            txtPlayer1rt.SetTextColor("white");
        }
        txtPlayer1rt.SetText( glCurrResultTotals[0].toFixed(1) );
        if (glCurrResultTotals[1] < 0 ) {
            txtPlayer2rt.SetTextColor("red");
        } else if ( glCurrResultTotals[1] > 0 ){
            txtPlayer2rt.SetTextColor("green");
        } else {
            txtPlayer2rt.SetTextColor("white");
        }
        txtPlayer2rt.SetText( glCurrResultTotals[1].toFixed(1) );
        if (glCurrResultTotals[2] < 0 ) {
            txtPlayer3rt.SetTextColor("red");
        } else if ( glCurrResultTotals[2] > 0 ){
            txtPlayer3rt.SetTextColor("green");
        } else {
            txtPlayer3rt.SetTextColor("white");
        }
        txtPlayer3rt.SetText( glCurrResultTotals[2].toFixed(1) );

    }  

    scrollPlays.ScrollTo( 0,layScroll.GetHeight() );

}



function OnNamesOk( result ){
    dlgTxt.Hide();

    refreshSpinGames();

}

function OnNamesError( error ){
    app.ShowPopup( "error inserting data: " + error );
    console.log("error inserting");
}




function btnCancelNames_OnTouch() {

    dlgTxt.Hide();
}

function edtPlayer1_OnChange(){

}

function edtPlayer2_OnChange(){

}

function edtPlayer3_OnChange(){

}


function btnNewResult_OnTouch() {


    if ( !glCurrGameId || !glCurrSessionId ){
        app.ShowPopup( "either game or session is not defined" );
        return;
    }

    var p1;
    var p2;
    var p3;

    if ( !edtPlayer1.GetText() && !edtPlayer2.GetText() && !edtPlayer3.GetText() ) { 
        app.ShowPopup( "error empty inputs" );   
        return;
    }

    if ( ( edtPlayer1.GetText() && edtPlayer2.GetText() ) ||
         ( edtPlayer2.GetText() && edtPlayer3.GetText() ) ||
         ( edtPlayer1.GetText() && edtPlayer3.GetText() ) ||
         ( edtPlayer1.GetText() && edtPlayer2.GetText() && edtPlayer3.GetText() ) ) { 
        app.ShowPopup( "error to many inputs" );   
        return;
    }

    try {
        var ip1 = parseFloat(edtPlayer1.GetText());
        var ip2 = parseFloat(edtPlayer2.GetText());
        var ip3 = parseFloat(edtPlayer3.GetText());

        if ( ip1 != 0 && isNaN(ip2) && isNaN(ip3) ){        
            p1 = 2 * ip1; 
            p2 = -1 * ip1; 
            p3 = -1 * ip1; 
        } else if ( isNaN(ip1) && ip2 != 0 && isNaN(ip3) ) {
            p1 = -1 * ip2; 
            p2 = 2 * ip2; 
            p3 = -1 * ip2; 
        } else if ( isNaN(ip1) && isNaN(ip2) && ip3 != 0 ) {
            p1 = -1 * ip3; 
            p2 = -1 * ip3; 
            p3 = 2 * ip3; 
        }

    } catch(error) {

        app.ShowPopup( "error by calculating result: " + error );   
        return;
    }

    db.ExecuteSql( "INSERT INTO plays (game_id, session, player1_amount, player2_amount, player3_amount)" +   
        " VALUES (?,?,?,?,?)", [glCurrGameId, glCurrSessionId,p1,p2,p3], 
        OnResultsOk(p1,p2,p3), 
        OnResultsError );  

}


function OnResultsOk(p1,p2,p3){

    //refreshResults();

    var s = "";  
    var tmp = "";

    console.log( "single results after insert" );

    layPNames = app.CreateLayout( "linear", "Horizontal" );            
    layScroll.AddChild( layPNames );

    txtPlayer1r = app.CreateText( p1.toFixed(1), 0.3, -1 );
    if (p1 < 0 ) {
        txtPlayer1r.SetTextColor("red");
    } else if ( p1 > 0 ){
        txtPlayer1r.SetTextColor("green");
    }
    txtPlayer1r.SetTextSize(16);
    txtPlayer1r.SetBackColor("darkgray");        
    layPNames.AddChild( txtPlayer1r );

    txtPlayer2r = app.CreateText( p2.toFixed(1), 0.3, -1 );
    if (p2 < 0 ) {
        txtPlayer2r.SetTextColor("red");
    } else if ( p2 > 0 ){
        txtPlayer2r.SetTextColor("green");
    }
    txtPlayer2r.SetTextSize(16);
    txtPlayer2r.SetBackColor("darkgray");
    layPNames.AddChild( txtPlayer2r );    

    txtPlayer3r = app.CreateText( p3.toFixed(1), 0.3, -1 );
    if (p3 < 0 ) {
        txtPlayer3r.SetTextColor("red");
    } else if ( p3 > 0 ){
        txtPlayer3r.SetTextColor("green");
    }
    txtPlayer3r.SetTextSize(16);
    txtPlayer3r.SetBackColor("darkgray");
    layPNames.AddChild( txtPlayer3r );    

    scrollPlays.ScrollTo( 0,layScroll.GetHeight() );

    // adjust total amounts
    glCurrResultTotals[0] = glCurrResultTotals[0] + p1;
    glCurrResultTotals[1] = glCurrResultTotals[1] + p2;
    glCurrResultTotals[2] = glCurrResultTotals[2] + p3;


    if (glCurrResultTotals[0] < 0 ) {
        txtPlayer1rt.SetTextColor("red");
    } else if ( glCurrResultTotals[0] > 0 ){
        txtPlayer1rt.SetTextColor("green");
    } else {
        txtPlayer1rt.SetTextColor("white");
    }
    txtPlayer1rt.SetText( glCurrResultTotals[0].toFixed(1) );
    if (glCurrResultTotals[1] < 0 ) {
        txtPlayer2rt.SetTextColor("red");
    } else if ( glCurrResultTotals[1] > 0 ){
        txtPlayer2rt.SetTextColor("green");
    } else {
        txtPlayer2rt.SetTextColor("white");
    }
    txtPlayer2rt.SetText( glCurrResultTotals[1].toFixed(1) );
    if (glCurrResultTotals[2] < 0 ) {
        txtPlayer3rt.SetTextColor("red");
    } else if ( glCurrResultTotals[2] > 0 ){
        txtPlayer3rt.SetTextColor("green");
    } else {
        txtPlayer3rt.SetTextColor("white");
    }
    txtPlayer3rt.SetText( glCurrResultTotals[2].toFixed(1) );

    // clear edit fields
    edtPlayer1.SetText("");
    edtPlayer2.SetText("");
    edtPlayer3.SetText("");

}


function OnResultsError(error){

    app.ShowPopup("error by inserting result into db: "+ error);

    scrollPlays.ScrollTo( 1,1 );

}


function spinGames_OnChange( item ){

    console.log( "Item = " + item );      

    idsToDelete = spinGames.GetText().split(":");
    glCurrGameId = parseInt(idsToDelete[0]);

    setNames(item);    

    refreshSessions();

}


function spinSessions_OnChange( item ){

    console.log( "Item = " + item );       

    glCurrSessionId = parseInt(spinSessions.GetText());


    refreshResults();

}


function setNames(item){

    if ( item ) {

        twoParts = item.split( ":" );
        names = twoParts[1].split( "-" );

        txtPlayer1.SetText( names[0] );
        txtPlayer2.SetText( names[1] );
        txtPlayer3.SetText( names[2] );
    }

}