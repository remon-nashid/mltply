// @flow

Object.compare = function(obj1, obj2) {
  //Loop through properties in object 1
  for (var p in obj1) {
    //Check property exists on both objects
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false

    if (obj1[p] === null && obj2[p] !== null) return false
    if (obj2[p] === null && obj1[p] !== null) return false

    switch (typeof obj1[p]) {
      //Deep compare objects
      case 'object':
        if (!Object.compare(obj1[p], obj2[p])) return false
        break
      //Compare function code
      case 'function':
        if (
          typeof obj2[p] === 'undefined' ||
          (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())
        )
          return false
        break
      //Compare values
      default:
        if (obj1[p] === '' && obj2[p] !== '') return false
        if (obj2[p] === '' && obj1[p] !== '') return false
        if (obj1[p] !== obj2[p]) return false
    }
  }

  //Check object 2 for any extra properties
  for (var p2 in obj2) {
    if (typeof obj1[p2] === 'undefined') return false
  }
  return true
}

Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index
  })
}
