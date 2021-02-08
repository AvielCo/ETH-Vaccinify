export const validateID = (id) => {
  const response = {
    result: false,
    cause: '',
  };
  if (id.length !== 9) {
    response.cause = 'id must have 9 characters.';
    return response;
  } else if (typeof id !== 'string' || isNaN(id)) {
    response.cause = 'id must be type of string and contains numbers only.';
    return response;
  }
  let sum = 0;
  let incNum;
  for (const i in id) {
    incNum = Number(id[i]) * ((i % 2) + 1); // Multiply number by 1 or 2
    sum += incNum > 9 ? incNum - 9 : incNum; // Sum the digits up and add to total
  }
  if (sum % 10 !== 0) {
    response.cause = 'invalid id.';
    return response;
  }
  response.result = true;
  return response;
};
