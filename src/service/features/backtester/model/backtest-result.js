var dateFormat = require('dateformat');

export class BacktestResult{

    formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    })

    constructor(){
        this.capitalByDate = []
        this.operations = []
        this.finalCapitalAmount = 0
        this.InicialCapitalAmount = 0
        this.periodStart = 0
        this.periodEnd = 0
    }

    addCapitalChange(capital, date){
        this.capitalByDate[date] = capital
    }

    getPeriod(){
        return "01/01/"+this.periodStart + " à " + "31/12/"+this.periodEnd
    }

    getInicialCapital(){
        return this.formatter.format(this.InicialCapitalAmount)
    }

    getFinalCapital(){
        return this.formatter.format(this.finalCapitalAmount)
    }

    logSellOperation(stock, amount, priceOfTransaction){
        this.operations.push(new Operation("Short",stock.code,stock.price, priceOfTransaction, amount, stock.date))
    }

    logBuyOperation(stock, amount, priceOfTransaction){
        this.operations.push(new Operation("Long",stock.code,stock.price, priceOfTransaction, amount, stock.date))
    }

    isPercentageCapitalPositive(){
        return this.getPercentageCapital() > 0
    }

    getPercentageCapital(){
        return Math.round((100 * (this.finalCapitalAmount - this.InicialCapitalAmount)) / this.InicialCapitalAmount)
    }

    getCapital(){
        return Object.values(this.capitalByDate)
    }

    getDates(){
        return Object.keys(this.capitalByDate).map(element => {
            return new Date(element)
        })
    }
}

class Operation{
    currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    })

    formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
    })

    constructor(typeOperation, code, stockPrice, priceOfTransaction, amount, date){
        this.typeOperation = typeOperation
        this.code = code
        this.stockPrice = this.currencyFormatter.format(stockPrice)
        this.priceOfTransaction = this.currencyFormatter.format(priceOfTransaction)
        this.amount = this.formatter.format(amount)
        this.date = dateFormat(date, "dd/mm/yyyy")
    }
}