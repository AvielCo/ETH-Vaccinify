export const validateID = (id) => {
  if (id.length !== 9) {
    return false;
  } else if (typeof id !== 'string' || isNaN(id)) {
    return false;
  }

  let sum = 0;
  let incNum;
  for (const i in id) {
    incNum = Number(id[i]) * ((i % 2) + 1); // Multiply number by 1 or 2
    sum += incNum > 9 ? incNum - 9 : incNum; // Sum the digits up and add to total
  }
  if (sum % 10 !== 0) {
    return false;
  }
  return true;
};
