export class Portfolio{ 

    constructor(startMoneyAmount){
        this.portfolioStocks = []
        this.amountMoney = startMoneyAmount
    }

    quantityShares(){
        return this.portfolioStocks.map(element => element.quantity).reduce((a, b) => a + b, 0);
    }

    findPortfolioStockByCode(code){
        return this.portfolioStocks.find(element => element.code === code)
    }

    buy(code, quantity, moneyToWithout){
        this.amountMoney -= moneyToWithout
        this.addStockToPortfolio(code, quantity)
    }

    sell(code, quantity, moneyToDeposit){
        this.amountMoney += moneyToDeposit
        this.removeStockFromPortfolio(code, quantity)
    }

    addStockToPortfolio(code, quantity){
        const index = this.portfolioStocks.findIndex(element => element.code === code)
        if(index >= 0){
            const stock = this.portfolioStocks[index]
            stock.quantity += quantity
        }else{
            this.portfolioStocks.push(new PortfolioStock(quantity, code))
        }
    }

    removeStockFromPortfolio(code, quantity){
        const index = this.portfolioStocks.findIndex(element => element.code === code)
        if(index >= 0){
            const stock = this.portfolioStocks[index]
            if(stock.quantity > quantity){
                stock.quantity -= quantity
            }else{
                this.portfolioStocks.splice(index, 1)
            }
        }
    }
}

export class PortfolioStock{ 
    constructor(quantity, code){
        this.quantity = quantity
        this.code = code
    }
}