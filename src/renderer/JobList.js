import React, {useEffect, useState} from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { InputAdornment } from "@mui/material";
import { reCalculateCost } from "./common/Utils";
import { jobListGridConfig, partsGridConfig } from "./common/GridConfig";
import { CommonGrid } from "./common/CommoonGrid";


function SingleValueCard({name, units, value, setValue}) {
  const [mode, setMode] = useState('view');
  const [tempValue, setTempValue] = useState('');

  function save() {
    setValue(parseInt(tempValue));
    setViewMode();
  }
  function setEditMode() {
    setTempValue(value);
    setMode('edit');
  }
  function setViewMode() {
    setTempValue('');
    setMode('view');
  }
  return (
    <Card variant="outlined" sx={{ width: '100%', height: 115}}>
      <Box sx={{ p: 1, marginBottom: '10px'}} className={'card-header'}>
        {name}
      </Box>
      <Box sx={{ p: 1 }}>
        <Stack direction="row" spacing={1} sx={{ height : '40px', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px'}}>          
          {
            mode === 'view'
            ?
              <Typography gutterBottom variant="h6" component="div" sx={{margin: '0 10px'}}>
                {value} {units}
              </Typography>
            :
              <TextField
                autoFocus
                sx={{ m: 1, width: '15ch' }}
                InputProps={{endAdornment: <InputAdornment position="start">{units}</InputAdornment>}}
                size="small"
                value={tempValue} onChange={(event) => setTempValue(event.target.value)}
              />
          }
          <div>
            {
              mode === 'view'
              ?
                <Button variant="outlined" onClick={() => setEditMode()}>Змінити</Button>
              : <>
                <Button variant="contained" onClick={save} sx={{marginRight: '10px'}}>Зберегти</Button>
                <Button variant="outlined" onClick={() => setMode('view')}>Відміна</Button>
              </>
            }
          </div>
        </Stack>
      </Box>
    </Card>
  );
}

function JobList(props) {
  const {
    normativeCost,
    setNormativeCost,
    commissionPercentage,
    setCommissionPercentage,
    jobList,
    setJobList,
    setPageTitle,
    partList,
    setPartList,
    setBreadCrumbs
  } = props;

  useEffect(() => {
    setPageTitle('Роботи і Запчастини');
    setBreadCrumbs([
      {
        key: 0,
        label: 'Роботи і запчастини',
        href: '',
        inactive: true
      }
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setJobList(reCalculateCost(jobList, normativeCost)), [normativeCost]);
  const customActions = (id) => [];

  const emptyObj = {
    id: '',
    jobName: '',
    hours: '',
    cost: 0,
  };

  const emptyPartObj = {
    id: '',
    partName: '',
    partNumber: '',
  };

  function updateJobPrice(rowData) {
    return normativeCost * rowData.hours;
  }

    return (
      <React.Fragment>
        <Grid container spacing={3} sx={{p: 2}}>
          <Grid xs={12} md={12} lg={7}>
            <CommonGrid
              columns = {jobListGridConfig}
              actionsWidth = {100}
              customActions = {customActions}
              fieldToFocus = {'jobName'}
              gridData = {jobList}
              setGridData = {setJobList}
              emptyObj = {emptyObj}
              onsiteCalculatedColumns = {[{name: 'cost', calcFn: (rowData) => updateJobPrice(rowData)}]}
              gridHeight= {510}
              title={'Роботи'}
            >  
            </CommonGrid>
          </Grid>
          <Grid xs={12} md={12} lg={5}>
            <Grid xs={6} lg={12}>
              <CommonGrid
                columns = {partsGridConfig}
                actionsWidth = {100}
                customActions = {customActions}
                fieldToFocus = {'partName'}
                gridData = {partList}
                setGridData = {setPartList}
                emptyObj = {emptyPartObj}
                gridHeight= {510}
                title={'Запчастини'}
                >
              </CommonGrid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{p: 2, paddingTop: 0}}>
          <Grid xs={12} md={6} lg={4}>
            <SingleValueCard name={'Нормо-година'} units={'грн'} value={normativeCost} setValue={setNormativeCost}></SingleValueCard>
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <SingleValueCard name={'Коміссія за запчастини'} units={'%'} value={commissionPercentage} setValue={setCommissionPercentage}></SingleValueCard>
          </Grid>
        </Grid>
      </React.Fragment>
    );
}

export default JobList;
