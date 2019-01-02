import {MongoClient, Db} from 'mongodb'
const url = 'mongodb+srv://felipejm:M@rtins123@cluster0-dcik1.mongodb.net';
const dbName = 'test';

export class MongoConnector{
     db = null

    async connect() {
        console.log("startt")
        return new Promise((resolve, reject) => {
            if(this.isAlreadyConnected()){
                return resolve(this.db)
            }else{
                this.tryConnect(resolve, reject)
            }
        })
        
    }

     tryConnect(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if(err) return reject(err)

            console.log("Connected successfully to server");
            this.db = client.db(dbName);
            client.close();

            return resolve(this.db)
          });
    }
    
     isAlreadyConnected(){
        return this.db 
    }
}