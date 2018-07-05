/**
 * @see https://gist.github.com/scwood/e58380174bd5a94174c9f08ac921994f
 *
 * largestRemainderRound will round each number in an array to the nearest
 * integer but make sure that the the sum of all the numbers still equals
 * desiredTotal. Uses Largest Remainder Method.  Returns numbers in order they
 * came.
 *
 * @param {number[]} numbers - numbers to round
 * @param {number} desiredTotal - total that sum of the return list must equal
 * @return {number[]} the list of rounded numbers
 * @example
 *
 * var numbers = [13.6263, 47.9896, 9.59600 28.7880]
 * largestRemainderRound(numbers, 100)
 *
 * // => [14, 48, 9, 29]
 *
 */
export default function largestRemainderRound(numbers, desiredTotal) {
  var result = numbers
    .map(function(number, index) {
      return {
        floor: Math.floor(number),
        remainder: getRemainder(number),
        index
      }
    })
    .sort(function(a, b) {
      return b.remainder - a.remainder
    })

  var lowerSum = result.reduce(function(sum, current) {
    return sum + current.floor
  }, 0)

  var delta = desiredTotal - lowerSum
  for (var i = 0; i < delta; i++) {
    result[i].floor += 1
  }

  return result
    .sort(function(a, b) {
      return a.index - b.index
    })
    .map(function(result) {
      return result.floor
    })
}

function getRemainder(number) {
  var remainder = number - Math.floor(number)
  return remainder.toFixed(4)
}
