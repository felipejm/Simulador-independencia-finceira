import mongoose from 'mongoose';
import {StockHistory} from '../stock-history'
import csvtojson from 'csvtojson'
import https from 'https'
import eachLimit from 'async/eachLimit'
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, { dbName:process.env.MONGO_DB, useNewUrlParser: true,
    auth: {
        user: process.env.MONGO_USER, password: process.env.MONGO_PASSWORD
      }
    });

export class StockHistoryDAO{
    stockhistoryModel = null

    constructor(){
        this.stockhistoryModel = mongoose.model("stock_history", StockHistory, "history")
    }

    async fetchByCodes(codes, startYear, endYear){
        return this.stockhistoryModel
        .find({})
        .where("code").in(codes)
        .where("date").gte(new Date(startYear, 0, 1)).lte(new Date(endYear, 11, 31))
        .sort({date: 'asc'})
    }

    async downloadCotacoes(){
        const symbols = ["ABCB4","AZUL4","ABEV3","AGRO3","ALPA3","ALPA4","ALSC3","ALUP11","AMAR3","ARZZ3","ATOM3","BAHI3","BAZA3","BBAS3","BBSE3","BBDC4","BBRK3","BIDI4","ANIM3","BEEF3","BMEB3","BMEB4","BMIN4","BMTO4","BOBR4","BOVA11","BPHA3","BRAP3","BRAP4","BRFS3","BRGE11","BRGE3","BRGE8","BRIN3","BRIV4","BRKM3","BRKM5","BRML3","BRPR3","BRSR6","BSLI3","BTOW3","BTTL3","BTTL4","BVMF3","CALI4","CARD3","CCRO3","CCXC3","CELP3","CELP6","CESP6","CGAS5","CIEL3","CLSC4","CMIG3","CMIG4","COCE5","CPFE3","CPLE3","CPLE6","CRDE3","CSAN3","CSMG3","CSNA3","CSRN5","CTAX3","CTIP3","CTKA4","CVCB3","CYRE3","DASA3","DIRR3","DIVO11","DTEX3","ECOR3","EEEL3","ELET3","ELET6","ELPL4","EMAE4","EMBR3","ENBR3","ENGI11","EQTL3","ESTC3","ESTR4","ETER3","EUCA4","EVEN3","EZTC3","FESA4","FHER3","FIBR3","FJTA4","FLRY3","FRAS3","FRIO3","GFSA3","GGBR3","GGBR4","GOAU3","GOAU4","GOLL4","GOVE11","GPCP3","GRND3","GSHP3","GUAR3","GUAR4","HAGA4","HBOR3","HGTX3","HYPE3","IDNT3","IGTA3","IMBI4","INEP3","INEP4","ISUS11","ITSA3","ITSA4","ITUB4","JBSS3","JHSF3","JSLG3","KEPL3","KLBN11","KROT3","LAME3","LAME4","LCAM3","LEVE3","LIGT3","LLIS3","LOGN3","LPSB3","LREN3","LUPA3","LUXM3","LUXM4","MAGG3","MDIA3","MGEL4","MGLU3","MILS3","MLFT4","MNDL3","MOAR3","MPLU3","MRFG3","MRVE3","MULT3","MYPK3","NAFG4","NATU3","ODPV3","OGXP3","OIBR3","OIBR4","PARC3","PATI3","PCAR4","PDGR3","PEAB3","PETR3","PETR4","PFRM3","PIBB11","PINE4","PMAM3","POMO3","POMO4","POSI3","PSSA3","PTBL3","PTNT3","QGEP3","QUAL3","RADL3","RAPT3","RAPT4","RCSL3","RDNI3","RENT3","RNEW11","ROMI3","RPMG3","RAIL3","SANB11","SANB3","SANB4","SAPR4","SBSP3","SCAR3","SEER3","SMLS3","SGAS4","SGPS3","SHOW3","SHUL4","SLCE3","SLED4","SMLE3","SMTO3","SSBR3","SULA11","SUZB5","SUZB6","TAEE11","TCNO4","TCSA3","TECN3","TELB4","TENE7","TGMA3","TIMP3","TOTS3","TOYB3","TRIS3","TRPL3","TRPL4","TRPN3","TUPY3","UCAS3","UGPA3","UNIP5","UNIP6","USIM3","USIM5","TIET11","VALE3","VALE5","VIVR3","VIVT3","VIVT4","VLID3","VULC3","VVAR11","WEGE3","WHRL3","WSON33"]
        let qntDownloaded = 0
        eachLimit(symbols, 10, (symbol, callback) => {
            this.deleteStockHistories(symbol).then(result => {
                console.log("Delete "+symbol+" quotes")
                return this.downloadStockHistories(symbol)
            }).then(body => {
                console.log("Download "+symbol+" quotes")
                if(body && body.length > 0){
                    return this.convertCsvToJson(body, symbol)
                }

                console.log(symbol+ "has no quotes")
                callback()
            }).then(stockHistories => {
                console.log("Saving "+symbol+" quotes")
                return this.saveStockHistory(stockHistories, symbol)
            }).then(result => {
                qntDownloaded++
                console.log(symbol+" quotes saved")
                console.log("Progress: "+ (Math.round((qntDownloaded/symbols.length)*100)) + "%")
                callback()
            }).catch(err => { 
                callback(err)
                console.log(err)
             })
        })
    }

    async deleteStockHistories(symbol){
        return this.stockhistoryModel.find({code: symbol}).remove().exec()
    }

    async downloadStockHistories(symbol){
        return new Promise((resolve, reject) => {
            https.get("https://br.financas.yahoo.com/quote/"+symbol+".SA/history?p="+symbol+".SA", response => {
                        const regex = /CrumbStore":\{"crumb":"([^"]+)"\}/
                        let body = ""
                        
                        response.setEncoding('utf8');
                        response.on('data', function (chunk) { body += chunk });
                        response.on('end', () => {
                            const cookies = response.headers['set-cookie']
                            const crumbs = body.match(regex)
                            
                            console.log("Download crumbs and cookie for authentication")
                            if(crumbs && crumbs.length > 1 && cookies && cookies.length > 0){
                                const cookie = cookies[0].split(";")[0]
                                const crumb = crumbs[1].split('\\u002F').join("/")
                                this.requestStockQuotes(cookie, crumb, symbol, resolve)
                            }
                        });
                })
        })
    }

    requestStockQuotes(cookie, crumb, symbol, resolve){
        var options = {
            host: 'query1.finance.yahoo.com',
            port: 443,
            timeout: 120,
            path: "/v7/finance/download/"+symbol+".SA?period1=946868400&period2=1546138800&interval=1d&events=history&crumb="+crumb,
            method: 'GET',
            headers: { "Cookie": cookie }
        };
        
        https.get(options, (response) => {
            response.setEncoding('utf8')
            let fullBody = ""
            response.on('data', function (body) { fullBody += body })
            response.on('end', () => { resolve(fullBody) })
        })
    }

    async convertCsvToJson(body){
        console.log("Converting to json")
        return new csvtojson({ noheader:false, delimiter: ","})
        .fromString(body)
    }

    saveStockHistory(histories, symbol,){
        const stocksHistories = []
        histories.forEach(history => {
            if(!history.Open || history.Open === "null") return
            if(!history.Date || history.Date === "null") return
            if(!history.Close || history.Close === "null") return
            if(!history.High || history.High === "null") return
            if(!history.Low || history.Low === "null") return

            const stockHistory = new this.stockhistoryModel()
            stockHistory.date =  Date.parse(history.Date)
            stockHistory.code = symbol
            stockHistory.open = history.Open
            stockHistory.close = history.Close
            stockHistory.low = history.Low
            stockHistory.high = history.High
            stocksHistories.push(stockHistory)
        })

        return this.stockhistoryModel.create(stocksHistories)
    }
}


