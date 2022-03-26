import opcua from 'node-opcua';
import async from 'async';
import { WriteLogFlie } from './WRJsonControl.js';
//import TypeModel from '../Models/TypeValueModel.js'


var endpointUrl = "";
var client;
var the_session, the_subscription;

export {
mainss as main,
readString,
readBool,
readInt,
readFloat
}

// }

function mainss( settingJson ) {
        endpointUrl = settingJson.url;

        const client = opcua.OPCUAClient.create(
            settingJson.SettingOPC
        ); 

    async.series([

    // step 1 : connect to
    function(callback)  {

        client.connect(endpointUrl,function (err) {
            if(err) {
                console.log(" cannot connect to endpoint :" , endpointUrl );
                WriteLogFlie("OPC cannot connect to endpoint :" + endpointUrl );
            } else {
                console.log("connected !");
                WriteLogFlie("OPC connected !");
            }
            callback(err);
        });

        client.on("connection_reestablished",function() {
            console.log(" !!!!!!!!!!!!!!!!!!!!!!!!  CONNECTION RE-ESTABLISHED !!!!!!!!!!!!!!!!!!!");
            WriteLogFlie("OPC CONNECTION RE-ESTABLISHED");
        });
        client.on("backoff", function (number, delay) {
            console.log("backoff  attempt #",number, " retrying in ",delay/1000.0," seconds");
            WriteLogFlie("OPC backoff  attempt #" + number + " retrying in " + delay/1000.0 + " seconds");
        });
    },

    // step 2 : createSession
    function(callback) {
        client.createSession( function(err,session) {
            if(!err) {
                the_session = session;
            }
            console.log("session timeout = ",session.timeout);
            the_session.on("keepalive",function(state) {
                console.log("KeepAlive state=",state.toString()," pending request on server = ", the_subscription.publish_engine.nbPendingPublishRequests);
                WriteLogFlie("OPC KeepAlive state=" + state.toString() + " pending request on server = " + the_subscription.publish_engine.nbPendingPublishRequests);

            });
            the_session.on("session_closed" ,function(statusCode) {
            
                console.log("Session has closed : statusCode = ", statusCode ? statusCode.toString() : "????");
                WriteLogFlie("OPC Session has closed : statusCode = " + statusCode ? statusCode.toString() : "????");

            });
            callback(err);
        });
    },
/*
    function(callback) {
       the_session.browse("RootFolder", function(err, browseResult) {
           if(!err) {
               console.log("Browsing rootfolder: ");
               for(let reference of browseResult.references) {
                   console.log( reference.browseName.toString(), reference.nodeId.toString());
               }
           }
           callback(err);
       });
    },
    function(callback) {
       the_session.readVariableValue("ns=2;s=Channel1.Device1.Tag1", function(err, dataValue) {
           if (!err) {
               console.log(" free mem % = " , dataValue.toString());
           }
           callback(err);
       });
    },
    */

    ]) ;

    
};

async function readString() {
    var data;
    data = await the_session.readVariableValue("ns=2;s=Channel1.Device1.Tag1");
    return data;
};

async function readBool() {
    var data;
    data = await the_session.readVariableValue("ns=2;s=Channel4.Device1.bool");
    return data;
};

async function readInt() {
    var data;
    data = await the_session.readVariableValue("ns=2;s=Channel4.Device1.int");
    return data;
};

async function readFloat() {
    var data;
    data = await the_session.readVariableValue("ns=2;s=Channel4.Device1.float");
    return data;
};

async function readValue( node, type ) {
    var data;
    switch(type) {
    case TypeValue.bool:
    // code block
    break;
    case TypeValue.int:
    // code block
    break;
    case TypeValue.float:
    // code block
    break;
    case TypeValue.string:
    // code block
    break;
    default:
    // code block
}
    data = await the_session.readVariableValue(node);
    return data;
};
