import opcua from 'node-opcua';
import async from 'async';
import chalk from 'chalk';
//import TypeModel from '../Models/TypeValueModel.js'


var endpointUrl = "opc.tcp://localhost:49320";
var client;
var the_session, the_subscription;

// function OPCUAClientInit( Url, maxRetry, initialDelay, maxDelay){
//     endpointUrl = Url;
//     client = OPCUAClient.create({
//             endpoint_must_exist: false,

//             keepSessionAlive: true,
//             requestedSessionTimeout: 60000,

//             connectionStrategy: {
//             maxRetry: maxRetry,
//             initialDelay: initialDelay,
//             maxDelay: maxDelay
//             } 
//     });

//     client.on("connection_reestablished",function() {
//             console.log(chalk.bgWhite.red(" !!!!!!!!!!!!!!!!!!!!!!!!  CONNECTION RE-ESTABLISHED !!!!!!!!!!!!!!!!!!!"));
//         });
//     client.on("backoff", function (number, delay) {
//             console.log(chalk.bgWhite.yellow("backoff  attempt #"),number, " retrying in ",delay/1000.0," seconds");
//         });
// }

// function OPCUAConnect(){
//      try {

//         client.connect(endpointUrl, function (err) {
//             if(err){
//                 console.log(" cannot connect to endpoint :" , endpointUrl );
//             }
//             else{
//                 console.log("connected !");
//             }
//         });

//         client.createSession( function(err, session) {
//             if(err) {
//                 console.log( err.message );
//             }
//             the_session = session;
//         });

//         the_session.browse("RootFolder", function(err, browseResult) {
//            if(!err) {
//                console.log("Browsing rootfolder: ");
//                for(let reference of browseResult.references) {
//                    console.log( reference.browseName.toString(), reference.nodeId.toString());
//                }
//            }
//        });

//     }
//     catch (err) {
//         console.log("Err =", err);
//     }

// ...
export {
mainss as main,
readString,
readBool,
readInt,
readFloat
}

// }

function mainss() {

        const client = opcua.OPCUAClient.create({
            endpoint_must_exist: false,

            keepSessionAlive: true,
            requestedSessionTimeout: 60000,

            connectionStrategy: {
            maxRetry: 10000000,
            initialDelay: 100,
            maxDelay: 1000
            },

        }); 

    async.series([

    // step 1 : connect to
    function(callback)  {

        client.connect(endpointUrl,function (err) {
            if(err) {
                console.log(" cannot connect to endpoint :" , endpointUrl );
            } else {
                console.log("connected !");
            }
            callback(err);
        });

        client.on("connection_reestablished",function() {
            console.log(chalk.bgWhite.red(" !!!!!!!!!!!!!!!!!!!!!!!!  CONNECTION RE-ESTABLISHED !!!!!!!!!!!!!!!!!!!"));
        });
        client.on("backoff", function (number, delay) {
            console.log(chalk.bgWhite.yellow("backoff  attempt #"),number, " retrying in ",delay/1000.0," seconds");
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
                console.log((chalk.yellow("KeepAlive state="),state.toString()," pending request on server = "), the_subscription.publish_engine.nbPendingPublishRequests);

            });
            the_session.on("session_closed" ,function(statusCode) {
            
                console.log(chalk.yellow("Session has closed : statusCode = "), statusCode ? statusCode.toString() : "????");

            });
            callback(err);
        });
    },

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
       the_session.readVariableValue("ns=2;s=Channel4.Device1.asd", function(err, dataValue) {
           if (!err) {
               console.log(" free mem % = " , dataValue.toString());
           }
           callback(err);
       });
    },
    ]) ;

    
};

async function readString() {
    var data;
    data = await the_session.readVariableValue("ns=2;s=Channel4.Device1.asd");
    return data;
    //    const maxAge = 0;
    //     const nodeToRead = {
    //       nodeId: "ns=2;s=Channel4.Device1.asd",
    //       attributeId: AttributeIds.Value
    //     };
    //     const dataValue = session.read(nodeToRead, maxAge);
    //     console.log(" value " , dataValue.toString());
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
