import express from 'express';
import * as OPCUAc from './Controllers/OPC_UAControlNew.js';
import { ReadSettingsJson, WriteLogFlie } from './Controllers/WRJsonControl.js';

const app = express();
const port = 3012;



app.get('/', async (req, res) => {
    await res.send("Hello OPCUA!");
});

app.get('/OPC_Connect', async (req, res) => {
    try {
        await OPCUAc.clientConnect(ReadSettingsJson());
        await res.send("Connected!!");
    }
    catch(err) {
        console.log(err);
        await res.send(err.message);
    }
});

app.get('/OPC_ReadValues', async (req, res) => {
    try {
        var result = await OPCUAc.clientReadValues("ns=2;s=Channel1.Device1.Tag1");
        await res.send(result);
    }
    catch(err) {
        console.log(err);
        await res.send(err.message);
    }
});

app.get('/OPC_ReadValues1', async (req, res) => {
    try {
        var result = await OPCUAc.clientReadValues2("i=84");
        await res.send(result);
    }
    catch(err) {
        console.log(err);
        await res.send(err.message);
    }
});

app.get('/OPC_Browsing', async (req, res) => {
    try {
        var result = await OPCUAc.clientBrowse();
        await res.send(result);
    }
    catch(err) {
        console.log(err);
        await res.send(err.message);
    }
});

app.get('/OPC_Monitortest', async (req, res) => {
    try {
        await OPCUAc.clientMonitorTest();
        res.send("Hello OPCUA!");
    }
    catch(err) {
        console.log(err);
        await res.send(err.message);
    }
});

app.get('/OPC_Disconnect', async (req, res) => {
    try {
        await OPCUAc.clientDisconnect();
        await res.send("DisConnected!!");
    }
    catch(err) {
        console.log(err);
        await res.send(err.message);
    }
});



//"ns=2;s=Channel1.Device1.Tag1"
//setTimeout(() => read(), 3000);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
    WriteLogFlie('String API Listening at http://localhost:${port}')
});