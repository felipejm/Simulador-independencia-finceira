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
    }

    addCapitalChange(capital, date){
        this.capitalByDate[date] = capital
    }

    getInicialCapital(){
        return this.formatter.format(this.InicialCapitalAmount)
    }

    getFinalCapital(){
        return this.formatter.format(this.finalCapitalAmount)
    }

    logSellOperation(stock, amount, priceOfTransaction){
        this.operations.push(new Operation("Short",stock.code, priceOfTransaction, amount, stock.date))
    }

    logBuyOperation(stock, amount, priceOfTransaction){
        this.operations.push(new Operation("Long",stock.code, priceOfTransaction, amount, stock.date))
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

    constructor(typeOperation, code, price, amount, date){
        this.typeOperation = typeOperation
        this.code = code
        this.price = this.currencyFormatter.format(price)
        this.amount = this.formatter.format(amount)
        this.date = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getFullYear()
    }
}