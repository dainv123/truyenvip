import { ConnectDB } from './connect-db'
import { DefaultState } from './default-state'

async function InitializeDB() {
  let db = await ConnectDB();

  for (let collectionName in DefaultState) {
    let collection = db.collection(collectionName)

    await collection.insertMany(DefaultState[collectionName])
  }

  // console.log("INITIALIZE HAVE DONE");
}

InitializeDB();