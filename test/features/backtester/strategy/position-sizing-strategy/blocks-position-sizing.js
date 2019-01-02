import { BlockPositionSizing } from "../../../../../src/service/features/backtester/strategy/position-sizing-strategy/block-position-sizing"
import { Portfolio } from "../../../../../src/service/features/backtester/model/portfolio"
import { Stock } from "../../../../../src/service/features/backtester/model/stock/stock"

const assert = require('assert');

describe('Buy Operation', function() {
  it('should create new block', function() {
    //Given
    const portfolio = new Portfolio(200000)
    const strategy = new BlockPositionSizing(portfolio, 2, {onlySharesMultipleOf100: true})
    const stock = new Stock("PETR4", 10)

    //Then
    const amountToBuy = strategy.verifyAmountToBuy(stock)

    //Should
    assert.equal(amountToBuy, 10000)
    assert.equal(strategy.blocks.length, 1)
  })

  it('should do nothing if block exist and dont have money', function() {
    //Given
    const portfolio = new Portfolio(10000)
    const strategy = new BlockPositionSizing(portfolio, 2, {onlySharesMultipleOf100: true})
    const stock = new Stock("PETR4", 15)

    strategy.verifyAmountToBuy(stock)
    assert.equal(strategy.blocks.length, 1)
    assert.equal(strategy.blocks[0].shares, 300)

    //Then
    strategy.verifyAmountToBuy(stock)

    //Should
    assert.equal(strategy.blocks.length, 1)
    assert.equal(strategy.blocks[0].shares, 300)
    assert.equal(strategy.blocks[0].capitalRemaining, 500)
  })

  it('should do buy 100 shares with remaining capital', function() {
    //Given
    const portfolio = new Portfolio(150000)
    const strategy = new BlockPositionSizing(portfolio, 1, { onlySharesMultipleOf100: true })
    const firstStock = new Stock("PETR4", 22)

    strategy.verifyAmountToBuy(firstStock)
    assert.equal(strategy.blocks.length, 1)
    assert.equal(strategy.blocks[0].shares, 6800)

    const stock = new Stock("PETR4", 1)

    //Then
    strategy.verifyAmountToBuy(stock)

    //Should
    assert.equal(strategy.blocks.length, 1)
    assert.equal(strategy.blocks[0].shares, 7200)
    assert.equal(strategy.blocks[0].capitalRemaining, 0)
  })

  it('should create other block', function() {
    //Given
    const portfolio = new Portfolio(10000)
    const strategy = new BlockPositionSizing(portfolio, 2, {onlySharesMultipleOf100: true})
    const petrStock = new Stock("PETR4", 10)
    const azulStock = new Stock("AZUL4", 20)

    //Then
    strategy.verifyAmountToBuy(petrStock)
    strategy.verifyAmountToBuy(azulStock)

    //Should
    assert.equal(strategy.blocks.length, 2)
    assert.equal(strategy.blocks[0].symbol, "PETR4")
    assert.equal(strategy.blocks[0].shares, 500)
    assert.equal(strategy.blocks[0].capitalRemaining, 0)
    assert.equal(strategy.blocks[1].symbol, "AZUL4")
    assert.equal(strategy.blocks[1].shares, 200)
    assert.equal(strategy.blocks[1].capitalRemaining, 1000)
  })
})

describe('Sell Operation', function() {

  it('should return 0 if there is no block', function() {
    //Given
    const portfolio = new Portfolio(10000)
    const strategy = new BlockPositionSizing(portfolio, 2, {onlySharesMultipleOf100: true})
    const azulStock = new Stock("AZUL4", 20)

    //Then
    const amountToSell = strategy.verifyAmountToSell(azulStock)

    //Should
    assert.equal(amountToSell, 0)
    assert.equal(strategy.blocks.length, 0)
  })

  it('should sell all stocks', function() {
    //Given
    const portfolio = new Portfolio(10000)
    const strategy = new BlockPositionSizing(portfolio, 2, {onlySharesMultipleOf100: true})
    const azulStock = new Stock("AZUL4", 20)
    const petrStock = new Stock("PETR4", 10)
    strategy.verifyAmountToBuy(azulStock)
    strategy.verifyAmountToBuy(petrStock)
    assert.equal(strategy.blocks.length, 2)

    //Then
    const amountToSell = strategy.verifyAmountToSell(azulStock)

    //Should
    assert.equal(amountToSell, 200)
    assert.equal(strategy.blocks.length, 1)
  })

  it('should remaing one block', function() {
    //Given
    const portfolio = new Portfolio(10000)
    const strategy = new BlockPositionSizing(portfolio, 2, {onlySharesMultipleOf100: true})
    const azulStock = new Stock("AZUL4", 20)
    strategy.verifyAmountToBuy(azulStock)
    assert.equal(strategy.blocks.length, 1)
    assert.equal(strategy.blocks[0].shares, 200)

    //Then
    const amountToSell = strategy.verifyAmountToSell(azulStock)

    //Should
    assert.equal(amountToSell, 200)
    assert.equal(strategy.blocks.length, 0)
  })
})

