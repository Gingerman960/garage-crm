const { contextBridge, ipcRenderer } = require("electron");

let saveData = (fileName, data) => {
  ipcRenderer.send("saveData", fileName, data);
};

let bridge = {
  saveData,
};

contextBridge.exposeInMainWorld("Bridge", bridge);


contextBridge.exposeInMainWorld('NormativeCostData', {
  normativeCostData: () => ipcRenderer.invoke('normativeCostData').then(res => res)
});
contextBridge.exposeInMainWorld('CommissionPercentageData', {
  commissionPercentageData: () => ipcRenderer.invoke('commissionPercentageData').then(res => res)
});
contextBridge.exposeInMainWorld('JobListData', {
  jobListData: () => ipcRenderer.invoke('jobListData').then(res => res)
});
contextBridge.exposeInMainWorld('PartListData', {
  partListData: () => ipcRenderer.invoke('partListData').then(res => res)
});
contextBridge.exposeInMainWorld('CarsStateData', {
  carsStateData: () => ipcRenderer.invoke('carsStateData').then(res => res)
});
contextBridge.exposeInMainWorld('ServiceJobHistoryData', {
  serviceJobHistoryData: () => ipcRenderer.invoke('serviceJobHistoryData').then(res => res)
});