import * as fs from "fs";
import dateFormat, { masks } from "dateformat";

function ReadSettingsJson (){
    let rawdata = fs.readFileSync('./setting.json');
    let setting = JSON.parse(rawdata);
    console.log("ReadSetting" ,setting);
    WriteLogFlie( "ReadSetting : " + JSON.stringify(setting) )

    return setting
}

function ReadLogFlie (){

}

function WriteLogFlie (data){
    var dateNow = Date.now();
    fs.appendFile("./logs/log " + dateFormat( dateNow, 'yyyy-mm-dd') + ".txt",  dateFormat( dateNow, 'dd/mm/yyyy hh:MM:ss') + "  " + data + "\n", function(err) {
    if(err) {
        return console.log(err);
    }
}); 
}

function ReadListFileLog (){
    var files = fs.readdirSync('./logs/');
    return files;
}


export {
    ReadSettingsJson,
    ReadLogFlie,
    WriteLogFlie
}