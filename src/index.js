import { Backtester } from './service/features/backtester/backtester'
import { DonchianStrategy } from './service/features/backtester/strategy/buy-sell-strategy/donchian-strategy'
import { PositionSizingByRisk } from './service/features/backtester/strategy/position-sizing-strategy/position-sizing-by-risk'
import { Portfolio } from './service/features/backtester/model/portfolio';
import { StockHistoryDAO } from './service/features/stocks/model/stock-history'

class Main{
    async runBacktest(){
        const portfolio = new Portfolio(100000)
        const positionSizing = new SimplePositionSizing(portfolio, 0.2)
        const strategy = new DonchianStrategy(90)
        const stockSymbols = ["AZUL4", "CALI4", "DIRR3", "VALE5", "GFSA3"]
        const options = {allowDaytrade: true}

        const backtester = new Backtester(strategy, positionSizing, portfolio, 
                                            stockSymbols, options)
        await backtester.start()
    }
}

//new StockSymbolDAO().downloadCotacoes()
new StockHistoryDAO().downloadCotacoes()
//new Main().runBacktest()