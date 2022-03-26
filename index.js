import express from 'express';
import {main, readString, readBool, readInt, readFloat} from './Controllers/OPC_UAControl.js';
//import * as OPCUA from './Controllers/OPC_UAControl.js';
import { ReadSettingsJson, WriteLogFlie } from './Controllers/WRJsonControl.js';

const app = express();
const port = 3012;


main(ReadSettingsJson());

app.get('/', async (req, res) => {
    var ssss = await readString();
    await console.log(" free mem % = " , ssss);
    await res.send(ssss);
});

app.get('/bool', async (req, res) => {
    var ssss = await readBool();
    await res.send(ssss);
});

app.get('/int', async (req, res) => {
    var ssss = await readInt();
    await res.send(ssss);
});

app.get('/float', async (req, res) => {
    var ssss = await readFloat();
    await res.send(ssss);
});


//setTimeout(() => read(), 3000);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
    WriteLogFlie('String API Listening at http://localhost:${port}')
});