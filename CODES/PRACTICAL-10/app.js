const express = require('express');
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const bodyParser = require('body-parser');

let PORT = process.env.PORT || 3000;

const url = 'https://apikey-v2-26aj3ozdvpr2f1cmuwbxky11mhbiubctlpomomvyprjj:531f952562337579bc0b3ef8cfea14bc@ed643cff-2d52-40c5-b33d-71ad7ff9e885-bluemix.cloudantnosqldb.appdomain.cloud';
const apiKey = 'jQEQoKHvrKYVArJDcUXBl-IWtA90bnJHy0QfhkJuuuC8';

const authenticator = new IamAuthenticator({ apikey: apiKey });
const cloudant = CloudantV1.newInstance({ authenticator });
cloudant.setServiceUrl(url);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send("Welcome to cloudant database on IBM Cloud");
});

app.get('/list_of_databases', async function (req, res) {
  try {
    const response = await cloudant.getAllDbs();
    res.send(response.result);
  } catch (err) {
    res.send(err);
  }
});

app.post('/create-database', async (req, res) => {
  const name = req.body.name;
  try {
    await cloudant.putDatabase({ db: name });
    res.send("Database created");
  } catch (err) {
    res.send(err);
  }
});

app.post('/insert-document', async function (req, res) {
  const { db, id, name, address, phone, age } = req.body;
  try {
    const response = await cloudant.postDocument({
      db,
      document: { _id: id, name, address, phone, age }
    });
    res.send(response.result);
  } catch (err) {
    res.send(err);
  }
});

app.post('/insert-bulk/:database_name', async function (req, res) {
  const database_name = req.params.database_name;
  const students = req.body.docs.map(doc => ({
    _id: doc.id,
    name: doc.name,
    address: doc.address,
    phone: doc.phone,
    age: doc.age
  }));

  try {
    await cloudant.postBulkDocs({
      db: database_name,
      bulkDocs: { docs: students }
    });
    res.send('Inserted all documents');
  } catch (err) {
    res.send(err);
  }
});

app.delete('/delete-document', async function (req, res) {
  const { db, id, rev } = req.body;
  try {
    await cloudant.deleteDocument({ db, docId: id, rev });
    res.send('Document deleted');
  } catch (err) {
    res.send(err);
  }
});

app.put('/update-document', async function (req, res) {
  const { db, id, rev, name, address, phone, age } = req.body;
  try {
    const response = await cloudant.postDocument({
      db,
      document: { _id: id, _rev: rev, name, address, phone, age }
    });
    res.send(response.result);
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});