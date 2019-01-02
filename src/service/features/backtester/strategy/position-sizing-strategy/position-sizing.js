export class PositionSizing{

    constructor(portfolio, options){
        this.portfolio = portfolio
        this.options = options
    }

    verifyAmountToBuy(stock){}
    verifyAmountToSell(stock){}

    toMultipleOfHundred(amount){
        return Math.floor(amount / 100) * 100
    }
}