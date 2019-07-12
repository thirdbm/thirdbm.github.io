var db;
var tablename;

function init()
{
    if(!window.openDatabase){
        alert("This browser does not support Web SQL Database.");
        //return false;
    }
    //openDatabase("Database Name", "Database Version", "Database Description", "Database Size");
    db = openDatabase("monandolgames_db", "1.0", "Monandol Games Task Database", 2*1024*1024);
    tablename = "MONANDOL_TASKS";

    createDB();
    displayAll();
    editModeOff();
}

function createDB(){
    db.transaction(function(tx){
        //tx.executeSql('CREATE TABLE IF NOT EXISTS MYLOG1 (id unique, log)');
        //tx.executeSql('INSERT INTO MYLOG1 (id, log) VALUES (1, "Pig")');
        //tx.executeSql('INSERT INTO MYLOG1 (id, log) VALUES (2, "Lion")');
        //tx.executeSql('INSERT INTO MYLOG1 (id, log) VALUES (?, ?'), [e_id, e];

        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tablename + ' (ID INTEGER PRIMARY KEY AUTOINCREMENT, createDate DATETIME, message TEXT)');
    });
}

function displayAll(){
    db.transaction(function(tx){
        var source = 'SELECT * FROM ' + tablename;
        //var source = 'SELECT id, createDate, message FROM ' + tablename;
        
        tx.executeSql(source, [], function (tx, results) {
            //var len = results.rows.length, i;
            var len = results.rows.length;
            document.getElementById("rowCount").innerHTML = "(Total : " + len + ")";

            var divT = "";

            for(var i=0; i<len; i++) {
                var element = results.rows.item(i);
                
                //var msg = "<div>" + element.ID + " | " + element.createDate + " | " + element.message + "</div>"
                //document.querySelector("#status").innerHTML += msg;

                divT += '<div class="row">';
                divT += '<div class="col s1 db1 alignLeftTop line">' + element.ID + '</div>';
                divT += '<div class="col s2 db2 alignLeftTop line">' + element.createDate + '</div>';
                divT += '<div class="col s3 db3 alignLeftTop line">' + element.message + '</div>';
                divT += '<div class="col s4 db4 alignCenter"><a href="#" onclick="editDB(' + element.ID + ')">Edit</a></div>';
                divT += '<div class="col s5 db5 alignCenter"><a href="#" onclick="deleteDB(' + element.ID + ')">X</a></div>'
                divT += '</div>';
            }

            //document.querySelector("#dbTable").innerHTML = divT;
            document.getElementById("dbTable").innerHTML = divT;
            //document.getElementById("tTable").innerHTML += divT;
        }, null )
    });
}

function insertDB(_message_){
    db.transaction(function(tx){
        //tx.executeSql('INSERT INTO ' + tablename + ' (name, madeDate) VALUES (?, ?)', ['BlaBla', new Date()]);
        tx.executeSql('INSERT INTO ' + tablename + ' (createDate, message) VALUES (?, ?)', [getCurrentDate(), _message_], displayAll());
    });
    document.getElementById("writeArea").value = "";
}

function addRow(){    
    var msg = document.getElementById("writeArea").value;
    var finalmsg;

    if(msg == "" || msg.trim().length <= 0 || msg == null){
        finalmsg = "Empty";
    }
    else {
        finalmsg = [];
        //var numberOfLineBreaks = (msg.match(/\n/g)||[]).length;
        for(var i=0; i<msg.length; i++){     
            if(msg[i] == "\n"){
                finalmsg.push("<br>");
            } else {
                finalmsg.push(msg[i]);
            }
        }
        finalmsg = finalmsg.join("").trim();
    }
    
    insertDB(finalmsg);
}

function deleteDB(_id_){
    db.transaction(function(tx){
        var result = confirm('Are you sure you want to delete this line?');
        if(result === true)
            tx.executeSql('DELETE FROM ' + tablename + ' WHERE ID = ?', [_id_], displayAll());
    });
}

function editDB(_id_){
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM ' + tablename + ' WHERE ID = ?', [_id_], function(tx, results){
            var element = results.rows.item(0);
            document.getElementById('selectedID').value = element.ID;
            document.getElementById('writeArea').value = element.message;
        });
    });
    editModeOn();
}

function updateDB(){
    db.transaction(function(tx){
        var _id_ = document.getElementById("selectedID").value;
        var _message_ = document.getElementById("writeArea").value;
        tx.executeSql('UPDATE ' + tablename + ' SET createDate = ?, message = ? WHERE ID = ?', [getCurrentDate(), _message_, _id_], displayAll());
    });
}

function clearAll(){
    db.transaction(function(tx){
        tx.executeSql('DROP TABLE ' + tablename);
    });
}

function editModeOff(){    
    document.getElementById('selectedID').value = "";
    document.getElementById('writeArea').value = "";
    
    document.getElementById('btnAdd').style.display = "inline";
    document.getElementById('btnSave').style.display = "none";    
    document.getElementById('btnCancel').style.display = "none";
    document.getElementById('selectedID').style.display = "none";
}

function editModeOn(){
    document.getElementById('btnAdd').style.display = "none";
    document.getElementById('btnSave').style.display = "inline";    
    document.getElementById('btnCancel').style.display = "inline";
    document.getElementById('selectedID').style.display = "inline";
}

function getCurrentDate() {
    var _date = new Date().getFullYear() + "-"
        + (new Date().getMonth() +1) + "-"
        + new Date().getDate() + "<br>"
        + new Date().getHours() + ":"
        + new Date().getMinutes() + ":"
        + new Date().getSeconds();
    return _date;
}