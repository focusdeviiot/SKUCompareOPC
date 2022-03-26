import opcua from 'node-opcua';
var endpointUrl2;
var client;
var session;

async function clientConnect( settingJson ) {
    try {
        endpointUrl2 = settingJson.url;
        client = opcua.OPCUAClient.create(settingJson.SettingOPC);

        await client.connect(endpointUrl2, function(err){
            if (err) {
                console.log(" cannot connect to endpoint :" , endpointUrl2 );
            }
            else{
                console.log("connected !");
            }
        });
        
        client.on("connection_reestablished",function() {
            console.log(" !!!!!!!!!!!!!!!!!!!!!!!!  CONNECTION RE-ESTABLISHED !!!!!!!!!!!!!!!!!!!");
            //WriteLogFlie("OPC CONNECTION RE-ESTABLISHED");
        });

        client.on("backoff", function (number, delay) {
            console.log("backoff  attempt #",number, " retrying in ",delay/1000.0," seconds");
            //WriteLogFlie("OPC backoff  attempt #" + number + " retrying in " + delay/1000.0 + " seconds");
        });

        session = await client.createSession();
    }
    catch (err) {
        console.log(err.message);
        process.exit(0);
    }
}

async function clientDisconnect( ) {
    try {
        await session.close();
        await client.disconnect();
    }
    catch (err) {
        console.log(err.message);
        process.exit(0);
    }
}

export {
clientConnect,
clientDisconnect
}
