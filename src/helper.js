const cleanObject = function (myObj) {
  if (myObj instanceof Object) {
    Object.keys(myObj).forEach((key) => (myObj[key] === null || myObj[key] === undefined) && delete myObj[key]);
  }
  return myObj;
};

function isEmptyObject(obj = {}) {
    return Object.keys(obj).length === 0;
}


module.exports = {
  cleanObject,
  isEmptyObject
};