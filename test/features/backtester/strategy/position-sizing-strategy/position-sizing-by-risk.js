import { PositionSizingByRisk } from "../../../../../src/service/features/backtester/strategy/position-sizing-strategy/position-sizing-by-risk"
import { Portfolio } from "../../../../../src/service/features/backtester/model/portfolio"
import { Stock } from "../../../../../src/service/features/backtester/model/stock/stock"

const assert = require('assert');

describe('Buy Operation', function() {
  it('should return 100 shares when risk is 10%, capital is 10.000 and price is $10', function() {
    //Given
    const portfolio = new Portfolio(10000)
    const strategy = new PositionSizingByRisk(portfolio, 0.1)
    const stock = new Stock("PETR4", 10)

    //Then
    const amountToBuy = strategy.verifyAmountToBuy(stock)

    //Should
    assert.equal(amountToBuy, 100);
  })

  it('should return 100 shares when risk is 20%, capital is 10.000 and price is $10', function() {
    //Given
    const portfolio = new Portfolio(10000)
    const strategy = new PositionSizingByRisk(portfolio, 0.2)
    const stock = new Stock("PETR4", 10)

    //Then
    const amountToBuy = strategy.verifyAmountToBuy(stock)

    //Should
    assert.equal(amountToBuy, 200);
  })

  it('should return 10 shares when risk is 10%, capital is 10.000 and price is $100', function() {
    //Given
    const portfolio = new Portfolio(10000)
    const strategy = new PositionSizingByRisk(portfolio, 0.1)
    const stock = new Stock("PETR4", 100)

    //Then
    const amountToBuy = strategy.verifyAmountToBuy(stock)

    //Should
    assert.equal(amountToBuy, 10);
  })

  it('should return 3675 shares when risk is 15%, capital is 10.000 and price is $2.450.607,39', function() {
    //Given
    const portfolio = new Portfolio(2450607.39)
    const strategy = new PositionSizingByRisk(portfolio, 0.15)
    const stock = new Stock("PETR4", 100)

    //Then
    const amountToBuy = strategy.verifyAmountToBuy(stock)

    //Should
    assert.equal(amountToBuy, 3675);
  })
})

describe('Sell Operation', function() {

  it('should sell all shares', function() {
    //Given
    const portfolio = new Portfolio(10000)
    portfolio.buy("PETR4", 100, 10000)

    const strategy = new PositionSizingByRisk(portfolio, 0.15)
    const stock = new Stock("PETR4", 100)

    //Then
    const amountToBuy = strategy.verifyAmountToSell(stock)

    //Should
    assert.equal(amountToBuy, 100);
  })

  it('should sell only PETR4 shares', function() {
    //Given
    const portfolio = new Portfolio(10000)
    portfolio.buy("PETR4", 100, 500)
    portfolio.buy("AZUL4", 50, 500)
    const strategy = new PositionSizingByRisk(portfolio, 0.15)
    const stock = new Stock("PETR4", 100)

    //Then
    const amountToBuy = strategy.verifyAmountToSell(stock)

    //Should
    assert.equal(amountToBuy, 100);
  })
})

