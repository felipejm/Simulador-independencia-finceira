import mongoose from 'mongoose'
import {ResultSymbol} from '../result-symbol'

require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, { dbName:process.env.MONGO_DB, useNewUrlParser: true,
    auth: {
        user: process.env.MONGO_USER, password: process.env.MONGO_PASSWORD
      }
    });

export class ResultBacktestDAO{
    resultBacktestModel = null

    constructor(){
        this.resultBacktestModel = mongoose.model("result_backtest", ResultSymbol, "results")
    }

    create(id, params){
        const resultSymbol = new this.resultBacktestModel()
        resultSymbol.status = "WAITING"
        resultSymbol.requestId = id
        resultSymbol.params = params
        resultSymbol.save()
        console.log("SALVOU!!")
    }
}