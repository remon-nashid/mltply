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
  cmcPagesN: 10,
  appName: 'mltply',
  socialLinks: [
    {
      label: 'twitter',
      url: 'https://twitter.com/mltp_ly'
    },
    {
      label: 'reddit',
      url: 'https://www.reddit.com/user/mltp_ly'
    },
    {
      label: 'medium',
      url: 'https://medium.com/me/stories/public'
    },
    {
      label: 'facebook',
      url: 'https://www.facebook.com/mltplyapp'
    },
    {
      label: 'github',
      iconName: 'github-circle',
      url: 'https://github.com/remon-nashid/mltply'
    }
  ],
  canny: 'https://mltply.canny.io/feature-requests'
}
