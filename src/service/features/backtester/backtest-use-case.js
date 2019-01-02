import { Backtester } from './backtester'
import { DonchianStrategy } from './strategy/buy-sell-strategy/donchian-strategy'
import { BlockPositionSizing } from './strategy/position-sizing-strategy/block-position-sizing'
import { PositionSizingByRisk } from './strategy/position-sizing-strategy/position-sizing-by-risk'
import { Portfolio } from './model/portfolio';

export class BacktestUseCase{

    async run(request){
        console.log()

        let strategy = this.configureStrategy(request)
        const capitalParam = request.query['capital-amount']
        const allowDaytradeParam = request.query['allow-daytrade'] ? true : false
        const stocksParam = request.query['stocks'].split(',')

        const options = {allowDaytrade: allowDaytradeParam}
        const portfolio = new Portfolio(capitalParam)
        const positionSizing =  this.configurePositionSizingStrategy(request, portfolio, options)

        const backtester = new Backtester(strategy, positionSizing, portfolio, 
            stocksParam, options)
        
        return backtester.start()
    }

    configurePositionSizingStrategy(request, portfolio, options){
        let strategy = null

        const strategyParam = request.query['position-strategy']
        if(strategyParam && strategyParam === 'Porcentual de risco'){
            const risk = request.query['risk-percent'] / 100
            strategy = new PositionSizingByRisk(portfolio, risk, options)

        }else if(strategyParam && strategyParam === 'Blocos'){
            const numBlocks = request.query['number-blocks']
            strategy = new BlockPositionSizing(portfolio, numBlocks, options)
        }

        return strategy
    }

    configureStrategy(request){
        let strategy = null
        const strategyParam = request.query['strategy']
        if(strategyParam && strategyParam === 'Donchian channels'){
            const topChannel = request.query['donchian-top-channel']
            const bottomChannel = request.query['donchian-bottom-channel']
            strategy = new DonchianStrategy(topChannel, bottomChannel)
        }

        return strategy
    }
}