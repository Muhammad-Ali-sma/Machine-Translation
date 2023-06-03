export const generateData = (data) => {
  const newData = Object.keys(data).reduce((result, currentKey) => {
    if (
      typeof data[currentKey] === "string" ||
      data[currentKey] instanceof String
    ) {
      result.push(data[currentKey]);
    } else {
      const nested = generateData(data[currentKey]);
      result.push(...nested);
    }
    return result;
  }, []);
  return newData;
};
