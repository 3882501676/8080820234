import React from 'react'

const CurrencyContext = React.createContext({})

export const CurrencyProvider = CurrencyContext.Provider
export const CurrencyConsumer = CurrencyContext.Consumer
export default CurrencyContext