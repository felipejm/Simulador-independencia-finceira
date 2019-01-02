import {PositionSizing } from './position-sizing'

export class PositionSizingByRisk extends PositionSizing{

    constructor(portfolio, risk, options){
        super(portfolio, options)
        this.risk = risk
    }
    
    verifyAmountToBuy(stock){
        let maxMoneyToSpend = 0
        const currentAmountMoney = this.portfolio.amountMoney
        
        if(currentAmountMoney && currentAmountMoney > 0){
            maxMoneyToSpend = this.portfolio.amountMoney * this.risk
        }

        let amountToBuy = maxMoneyToSpend / stock.price
        if(this.options && this.options.onlySharesMultipleOf100){
            amountToBuy = this.toMultipleOfHundred(amountToBuy)
        }

        return Math.floor(amountToBuy)
    }

    verifyAmountToSell(stock){
        const portfolioStock = this.portfolio.findPortfolioStockByCode(stock.code)
        let amountToSell = 0

        if(portfolioStock){
            amountToSell = portfolioStock.quantity
        }

        return amountToSell
    }
}