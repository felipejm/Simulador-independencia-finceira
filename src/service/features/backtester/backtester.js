import {Stock} from './model/stock/stock'
import {Strategy} from './strategy/buy-sell-strategy/strategy'
import {BacktestResult} from './model/backtest-result'
import {StockHistoryDAO} from './model/stock/dao/stock-history-dao'
import {BacktestOptions} from './model/backtest-configuration'

export class Backtester{
    stockDao = new StockHistoryDAO()
    
    constructor(strategy, positionSizingStrategy, portfolio, stocksCodes, options){
        this.strategy = strategy
        this.portfolio = portfolio
        this.positionSizingStrategy = positionSizingStrategy
        this.stocksCodes = stocksCodes
        this.options = options ? options : BacktestOptions
        this.result = new BacktestResult()
    }
    
    async start(){
        let stockHistories = await this.stockDao.fetchByCodes(this.stocksCodes)
        this.result.InicialCapitalAmount = this.portfolio.amountMoney
        
        if(stockHistories && stockHistories.lenght > 0){
            this.result.addCapitalChange(this.portfolio.amountMoney, stockHistories[0].date)
        }

        stockHistories.forEach((stockHistory, index) => {
            this.simulateMarketDay(stockHistory,stockHistories, index)
        });
        
        this.result.finalCapitalAmount = this.portfolio.amountMoney
        return this.result
    }

    simulateMarketDay(stockHistory,stockHistories,index){
        //Open Market Day
        const stockOpen = new Stock(stockHistory.code, stockHistory.open, stockHistory.date)
        const hadOpenOperation = this.simulateMarketOperation(stockOpen, index, stockHistories)
        if(hadOpenOperation && !this.options.allowDaytrade) return

        //Highest Market Day
        const stockHigh = new Stock(stockHistory.code, stockHistory.high, stockHistory.date)
        const hadHighOperation = this.simulateMarketOperation(stockHigh, index, stockHistories)
        if(hadHighOperation && !this.options.allowDaytrade) return

        //Lowest Market Day
        const stockLow = new Stock(stockHistory.code, stockHistory.low, stockHistory.date)
        const hadLowOperation = this.simulateMarketOperation(stockLow, index, stockHistories)
        if(hadLowOperation && !this.options.allowDaytrade) return

        //Close Market Day
        const stockClose = new Stock(stockHistory.code, stockHistory.close, stockHistory.date)
        this.simulateMarketOperation(stockClose, index, stockHistories)
    }

    simulateMarketOperation(stock, index, stockHistories){
        let hadOperation = false
        const previousStockHistories = this.getPreviousStockHistories(stockHistories, index)
        const strategySignal = this.strategy.verifySignal(previousStockHistories, stock)

        if(strategySignal === Strategy.STRATEGY_SIGNAL.BUY){
            const amountToBuy = this.positionSizingStrategy.verifyAmountToBuy(stock)
            const priceOfTransaction = amountToBuy * stock.price

            if(amountToBuy > 0){
                hadOperation = true
                this.portfolio.buy(stock.code, amountToBuy, priceOfTransaction)
                this.result.logBuyOperation(stock, amountToBuy, priceOfTransaction)
            }

        }else if(strategySignal === Strategy.STRATEGY_SIGNAL.SELL){
            const amountToSell = this.positionSizingStrategy.verifyAmountToSell(stock)
            const priceOfTransaction = amountToSell * stock.price

            if(amountToSell > 0){
                hadOperation = true
                this.portfolio.sell(stock.code, amountToSell, priceOfTransaction)
                this.result.logSellOperation(stock, amountToSell, priceOfTransaction)
            }
        }

        return hadOperation
    }

    getPreviousStockHistories(stockHistories, index){
        let previousStockHistories = []
        if(index > 0){
            previousStockHistories = stockHistories.slice(0, index)
        }

        return previousStockHistories
    }
    
    async getEstimatedMoneyOfPortfolio(){
        let totalMoneyAmount = 0
        let stockHistories = await this.stockDao.fetchByCodes(this.stocksCodes)

        this.portfolio.portfolioStocks.forEach(portoflioStock => {
            const stockHistory = stockHistories.filter(element => portoflioStock.code == element.code )
            const lastHistory = [...stockHistory].pop();
            totalMoneyAmount += portoflioStock.quantity * lastHistory.close
        })
        return totalMoneyAmount
    }
}