import React, { useEffect } from "react";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { carsGridConfig } from "./common/GridConfig";
import { CommonGrid } from "./common/CommoonGrid";

function Cars(props) {
  const {
    carsState,
    setCarsState,
    navigate,
    setPageTitle,
    setBreadCrumbs,
  } = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPageTitle('Авто в роботі'), []);
  useEffect(() => {
    setPageTitle('Авто в роботі');
    setBreadCrumbs([
      {
        key: 0,
        label: 'Авто в роботі',
        href: '',
        inactive: true
      }
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectToServiceHistory = (id) => {
    const vin = carsState.filter(car => car.id === id)[0].vin;
    navigate(`/serviceHistory/${vin}`)
  };

    const emptyObj = {
      id: '',
      brand: '',
      model: '',
      year: '',
      vin: '',
      serviceHistory: [],
      archived: false
    }
  
    const customActions = (id) => [
      <Button
        variant="contained"
        size="small"
        sx={{marginLeft: 1}}
        onClick={() => redirectToServiceHistory(id)}
      >
        Сервісна Історія
      </Button>,
    ]
  
    return (
      <Grid container spacing={3} sx={{p: 2}}>
        <Grid xs={12}>
          <CommonGrid
            columns = {carsGridConfig}
            actionsWidth = {240}
            customActions = {customActions}
            fieldToFocus = {'brand'}
            gridData = {carsState}
            setGridData = {setCarsState}
            emptyObj = {emptyObj}
          >  
          </CommonGrid>
        </Grid>
      </Grid>
    )

}

export default Cars;