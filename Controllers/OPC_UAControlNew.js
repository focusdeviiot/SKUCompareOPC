import opcua from 'node-opcua';
import { WriteLogFlie } from './WRJsonControl.js';
import async from 'async';

var endpointUrl2;
var V_client;
var V_session;
var V_subscription;

async function clientConnect( settingJson ) {
    try {
        endpointUrl2 = settingJson.url;
        V_client = opcua.OPCUAClient.create(settingJson.SettingOPC);

        await V_client.connect(endpointUrl2);
        V_session = await V_client.createSession();

        V_client.on("connection_reestablished",function() {
            console.log(" !!!!!!!!!!!!!!!!!!!!!!!!  CONNECTION RE-ESTABLISHED !!!!!!!!!!!!!!!!!!!");
            WriteLogFlie("OPC CONNECTION RE-ESTABLISHED");
        });

        V_client.on("backoff", function (number, delay) {
            console.log("backoff  attempt #",number, " retrying in ",delay/1000.0," seconds");
            WriteLogFlie("OPC backoff  attempt #" + number + " retrying in " + delay/1000.0 + " seconds");
        });

        V_session.on("session_closed" ,function(statusCode) {
            
            console.log("Session has closed : statusCode = ", statusCode ? statusCode.toString() : "????");
            WriteLogFlie("OPC Session has closed : statusCode = " + statusCode ? statusCode.toString() : "????");

        });
        
            
    }
    catch (err) {
        console.log(err.message);
        //process.exit(0);
    }
}

async function clientBrowse( ) {
    try {
        var data = await V_session.browse("RootFolder")
        return data;
    }
    catch (err) {
        console.log(err.message);
    }
}

async function clientReadValues(nodeId) {
    var data;
    data = await V_session.readVariableValue(nodeId);
    return data;
}

async function clientReadValues2(nodeId) {
    var data;
    data = await V_session.read({nodeId, attributeId: opcua.AttributeIds.BrowseName});
    return data;
}

async function clientMonitor(nodeId) {
     const subscriptionParameters = {
            maxNotificationsPerPublish: 10,
            priority: 10,
            publishingEnabled: true,
            requestedLifetimeCount: 1000,
            requestedMaxKeepAliveCount: 12,
            requestedPublishingInterval: 100,
        };

        V_subscription = await V_session.createSubscription2(subscriptionParameters)

        V_subscription
               .on("started", () => {
                 console.log(
                   "subscription started for 2 seconds - subscriptionId=",
                   the_subscription.subscriptionId
                 );
               })
               .on("keepalive", function() {
                 console.log("subscription keepalive");
               })
               .on("terminated", function() {
                 console.log("terminated");
               });


        await client.withSubscriptionAsync(endpointUrl, subscriptionParameters, async (session, subscription) => {
            const nodeId = coerceNodeId("ns=1;s=Temperature");
            const itemToMonitor = { nodeId, attributeId: AttributeIds.Value, indexRange: null };
            const requestedParameters = {
                samplingInterval: 1000,
                queueSize: 10000,
                discardOldest: true
            };
            const monitoredItem = await subscription.monitor(itemToMonitor, requestedParameters);
            monitoredItem.on("changed", (dataValue) => console.log("Temperature ", dataValue.value.value));
            monitoredItem.on("err", (err) => console.log(err));
            await new Promise((resolve) => setTimeout(resolve, 5000));
        });
}

async function clientMonitorTest() {
    
    const subscriptionParameters = {
            maxNotificationsPerPublish: 10,
            priority: 10,
            publishingEnabled: true,
            requestedLifetimeCount: 1000,
            requestedMaxKeepAliveCount: 12,
            requestedPublishingInterval: 100,
    };

    V_subscription = await V_session.createSubscription2(subscriptionParameters)

    V_subscription
           .on("started", () => {
             console.log(
               "subscription started for 2 seconds - subscriptionId=",
               V_subscription.subscriptionId
             );
           })
           .on("keepalive", function() {
             console.log("subscription keepalive");
           })
           .on("terminated", function() {
             console.log("terminated");
           });
    
    const itemToMonitor = {
             nodeId: opcua.resolveNodeId("ns=2;s=Channel1.Device1.Tag1"),
             attributeId: opcua.AttributeIds.Value
    };

    const itemToMonitor2 = {
             nodeId: opcua.resolveNodeId("ns=2;s=Channel1.Device1.Tag2"),
             attributeId: opcua.AttributeIds.Value
    };

    const monitoringParamaters = {
             samplingInterval: 100,
             discardOldest: true,
             queueSize: 10
    };

    V_subscription.monitor(
             itemToMonitor,
             monitoringParamaters,
             opcua.TimestampsToReturn.Both,
             (err, monitoredItem) => {
               monitoredItem.on("changed", function(dataValue) {
                 console.log(
                   "monitored item TAG1 changed:  % free mem = ",
                   dataValue.value.value
                 );
            });


        }
    );

    V_subscription.monitor(
             itemToMonitor2,
             monitoringParamaters,
             opcua.TimestampsToReturn.Both,
             (err, monitoredItem) => {
               monitoredItem.on("changed", function(dataValue) {
                 console.log(
                   "monitored item TAG2 changed:  % free mem = ",
                   dataValue.value.value
                 );
            });


        }
    );
    
}


async function clientDisconnect( ) {
    try {
        await V_session.close();
        await V_client.disconnect();
    }
    catch (err) {
        console.log(err.message);
        //process.exit(0);
    }
}

export {
clientConnect,
clientBrowse,
clientReadValues,
clientReadValues2,
clientMonitorTest,
clientDisconnect,
}
