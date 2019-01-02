import { PositionSizing } from "./position-sizing";
export class BlockPositionSizing extends PositionSizing{

    constructor(portfolio, numBlocks, options){
        super(portfolio, options)
        this.numBlocks = numBlocks
        this.blocks = []
        this.capital = portfolio.amountMoney
    }

    verifyAmountToBuy(stock){
        let amountToBuy = 0
        const block = this.getBlock(stock.code)
        if(block){
            if(block.capitalRemaining >= stock.price){
                amountToBuy = Math.floor(block.capitalRemaining / stock.price)
                
                if(this.options.onlySharesMultipleOf100){
                    amountToBuy = this.toMultipleOfHundred(amountToBuy)
                }

                if(amountToBuy > 0){
                    block.shares += amountToBuy
                    block.capitalRemaining = block.capitalRemaining - (amountToBuy * stock.price)
                }
            }
        }else if(this.hasFreeBlock()){
            const capitalToBlock = this.capital / (this.numBlocks - this.blocks.length)
            amountToBuy = Math.floor(capitalToBlock / stock.price)

            if(this.options.onlySharesMultipleOf100){
                amountToBuy = this.toMultipleOfHundred(amountToBuy)
            }

            if(amountToBuy > 0){
                this.capital -= capitalToBlock
                const capitalRemaining = capitalToBlock - (amountToBuy * stock.price)
                this.blocks.push(new Block(stock.code, amountToBuy, capitalRemaining))
            }
        }

        return amountToBuy
    }

    verifyAmountToSell(stock){
        let amountToSell = 0
        const block = this.getBlock(stock.code)
        if(block){
            amountToSell = block.shares
            this.capital += block.shares * stock.price + block.capitalRemaining
            this.removeBlock(stock.code)
        }
        return amountToSell
    }

    removeBlock(symbol){
        const index = this.blocks.findIndex(element => element.symbol == symbol)
        this.blocks.splice(index, 1)
    }

    getBlock(symbol){
        return this.blocks.filter(element => element.symbol == symbol)[0]
    }

    hasFreeBlock(){
        return this.blocks.length < this.numBlocks
    }
}

class Block{
    constructor(symbol, shares, capitalRemaining){
        this.symbol = symbol
        this.shares = shares
        this.capitalRemaining = capitalRemaining
    }
}