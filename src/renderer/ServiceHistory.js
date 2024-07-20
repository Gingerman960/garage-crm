import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom";
import { serviceHistoryGridConfig } from "./common/GridConfig";
import { CommonGrid } from "./common/CommoonGrid";
import Grid from '@mui/material/Unstable_Grid2';

function ServiceHistory(props) {
  const {
    carsState,
    setCarsState,
    serviceJobHistory,
    setServiceJobHistory,
    setPageTitle,
    navigate,
    setBreadCrumbs
  } = props;
  const { vin } = useParams();

  const [carData, setCarData] = useState(carsState.filter(car => car.vin === vin)[0]);
  const initialServiceHistoryData = serviceJobHistory
    .filter(visit => carData.serviceHistory.includes(visit.id))
    .map(visit => ({...visit, date: new Date(visit.date)}));
  const [serviceHistoryData, setServiceHistoryData] = useState(initialServiceHistoryData);

  useEffect(() => {
    setPageTitle(`Сервісна Історія: ${carData.brand} ${carData.model} ${carData.year}`);
    setBreadCrumbs([
      {
        key: 0,
        label: `Сервісна Історія: ${carData.brand} ${carData.model} ${carData.year}`,
        href: '',
        inactive: true
      }
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let output = [...carsState];
    output = output.map(car => {
      if (car.id === carData.id) {
        car.serviceHistory = carData.serviceHistory;
      }
      return car;
    })
    setCarsState(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carData]);
  useEffect(() => {
    let output = [...serviceJobHistory];

    const localData = serviceHistoryData.filter(item => !item.isNew);

    localData.forEach(item => {
      const index = serviceJobHistory.findIndex(i => i.id === item.id);
      
      if (index !== -1) {
        output[index] = item;
      }
      else {
        output.push(item);
        setCarData({...carData, serviceHistory: [...carData.serviceHistory, item.id]});
      }
    });

    if (localData.length < initialServiceHistoryData.length) {
      const deletedItem = initialServiceHistoryData.filter(x => !localData.includes(x))[0];
      output = output.filter(item => item.id !== deletedItem.id);
      setCarData({...carData, serviceHistory: [...carData.serviceHistory.filter(item => item !== deletedItem.id)]});
    }
    
    setServiceJobHistory(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceHistoryData]);

  const emptyObj = {
    id: '',
    date: new Date(),
    odometer: '',
    owner: '',
    phone: '',
    overview: '',
    parts: [],
    jobs: []
  }

  const customActions = (id) => [
    <Button
        variant="contained"
        size="small"
        sx={{marginLeft: 1}}
        onClick={() => redirectToServiceVisitDetails(id)}
        >Деталі
    </Button>,	
  ]

  const redirectToServiceVisitDetails = (id) => {
    navigate(`/serviceHistory/${vin}/${id}`)
  }

  return (
    <Grid container spacing={3} sx={{p: 2}}>
      <Grid xs={12}>
        <CommonGrid
          columns = {serviceHistoryGridConfig}
          actionsWidth = {180}
          customActions = {customActions}
          fieldToFocus = {'odometer'}
          gridData = {serviceHistoryData}
          setGridData = {setServiceHistoryData}
          emptyObj = {emptyObj}
        >  
        </CommonGrid>
      </Grid>
    </Grid>
  )

}

export default ServiceHistory;
