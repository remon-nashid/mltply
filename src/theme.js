// @flow

export function _formatAmount(amount: number) {
  return amount.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })
}

export function _changePercentageStyle(percentage: number) {
  if (percentage > 100) {
    return {
      backgroundColor: 'rgba(76, 175, 80, 1)'
      // color: '#FFF'
    }
  }
  if (percentage < 100 && percentage >= 50) {
    return {
      backgroundColor: 'rgba(76, 175, 80, 0.75)'
      // color: '#FFF'
    }
  }
  if (percentage < 50 && percentage >= 25) {
    return {
      backgroundColor: 'rgba(76, 175, 80, 0.5)'
      // color: '#191a1a'
    }
  }
  if (percentage < 25 && percentage >= 10) {
    return {
      backgroundColor: 'rgba(76, 175, 80, 0.25)'
      // color: '#191a1a'
    }
  }
  if (percentage < 10 && percentage >= 5) {
    return {
      backgroundColor: 'rgba(76, 175, 80, 0.1)'
      // color: '#191a1a'
    }
  }
  if (percentage < 5 && percentage >= 0) {
    return {
      backgroundColor: 'rgba(76, 175, 80, 0.05)'
      // color: '#191a1a'
    }
  }

  if (percentage < 0 && percentage >= -5) {
    return {
      backgroundColor: 'rgba(244, 67, 54, 0.05)'
      // color: '#212323'
    }
  } else if (percentage < -5 && percentage >= -10) {
    return {
      backgroundColor: 'rgba(244, 67, 54, 0.1)'
      // color: '#212323'
    }
  } else if (percentage < -10 && percentage >= -25) {
    return {
      backgroundColor: 'rgba(244, 67, 54, 0.25)'
      // color: '#212323'
    }
  } else if (percentage < -25 && percentage >= -50) {
    return {
      backgroundColor: 'rgba(244, 67, 54, 0.5)'
      // color: '#FFF'
    }
  } else if (percentage < -50 && percentage >= -100) {
    return {
      backgroundColor: 'rgba(244, 67, 54, 0.75)'
      // color: '#FFF'
    }
  } else {
    // TODO return theme colors
    return {
      backgroundColor: 'white'
      // color: 'black'
    }
  }
}
