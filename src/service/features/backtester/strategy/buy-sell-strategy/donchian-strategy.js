import { Strategy } from "./strategy";

export class DonchianStrategy extends Strategy{
    
    constructor(top, bottom){
        super()
        this.top = top
        this.bottom = bottom
    }

    verifySignal(stockHistory, stock){
        const stockFromTopPeriod = stockHistory.slice(-this.top)
        const stockFromBottomPeriod = stockHistory.slice(-this.bottom)

        const topChannel = Math.max(...stockFromTopPeriod.map(data => data.high))
        const bottomChannel = Math.min(...stockFromBottomPeriod.map(data => data.low))

        let signal = Strategy.STRATEGY_SIGNAL.NOTHING
        if(stock.price >= topChannel) {
            signal = Strategy.STRATEGY_SIGNAL.BUY

        }else if(stock.price <= bottomChannel){
            signal = Strategy.STRATEGY_SIGNAL.SELL
        }
        
        return signal
    }

}