// @flow

export default {
  settings: {
    baseFiat: 'USD',
    // NOTE List of currencies supported by fixer.io, minus what's not supported
    // in CMC.
    baseFiatOptions: [
      'AUD',
      // 'BGN',
      'BRL',
      'CAD',
      'CHF',
      'CNY',
      'CZK',
      'DKK',
      'EUR',
      'GBP',
      'HKD',
      // 'HRK',
      'HUF',
      'IDR',
      'ILS',
      // 'INR',
      // 'ISK',
      'JPY',
      'KRW',
      'MXN',
      'MYR',
      'NOK',
      'NZD',
      'PHP',
      'PLN',
      // 'RON',
      'RUB',
      'SEK',
      'SGD',
      'THB',
      'TRY',
      'USD',
      'ZAR'
    ],
    minAssetValue: 0,
    minimumBalanceOptions: [0, 1, 10, 100]
  },
  ccxtRateLimit: 1000,
  corsProxyURL: 'http://localhost:8080/',
  fetchProxy: false,
  chartLabelThreshold: 2,
  cmcPagesN: 5,
  appName: 'mltply'
}
