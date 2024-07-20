export const reCalculateCost = (list, cost) => {
  return list.map(job => ({ ...job, cost: job.hours * cost }));
}

export const saveFile = (fileName, data) => {
  const sData = JSON.stringify(data);
  window.Bridge.saveData(fileName, sData);
}