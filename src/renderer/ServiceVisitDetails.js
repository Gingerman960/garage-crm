import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { serviceVisitJobsGridConfig, serviceVisitPartsGridConfig } from "./common/GridConfig";
import { CommonGrid } from "./common/CommoonGrid";
import Grid from '@mui/material/Unstable_Grid2';
import { Card } from "@mui/material";
import RenderAutoComplete from "./common/RenderAutoComplete";

function ServiceVisitDetails(props) {
  const {
    carsState,
    serviceJobHistory,
    setServiceJobHistory,
    setPageTitle,
    partList,
    setPartList,
    jobList,
    setBreadCrumbs,
    commissionPercentage,
    normativeCost
  } = props;
  const { vin, visitId } = useParams();

  const carData = carsState.filter(car => car.vin === vin)[0];
  const serviceVisit = serviceJobHistory.find(visit => visit.id.toString() === visitId);
  const visitDate = new Date(serviceVisit.date).toLocaleDateString('en-GB');
  const [serviceVisitJobs, setServiceVisitJobs] = useState(serviceVisit.jobs);
  const [serviceVisitParts, setServiceVisitParts] = useState(serviceVisit.parts);

  useEffect(() => {
    setPageTitle(`Візит: ${carData.brand} ${carData.model} ${carData.year} від  ${visitDate}`)
    setBreadCrumbs([
      {
        key: 0,
        label: `${carData.brand} ${carData.model} ${carData.year}`,
        href: `/serviceHistory/${vin}`,
      },
      {
        key: 1,
        label: visitDate,
        href: '',
        inactive: true
      }
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jobsMatch = useMemo(() => serviceVisitJobs.filter(job => !!job.name).length, [serviceVisitJobs]);
  const partsMatch = useMemo(() => serviceVisitParts.filter(part => !!part.name).length, [serviceVisitParts]);

  useEffect(() => {
    const output = [...serviceJobHistory].map(serviceVisit => {
      if (serviceVisit.id.toString() === visitId) {
        serviceVisit.jobs = serviceVisitJobs;
        serviceVisit.parts = serviceVisitParts;
      }
      return serviceVisit
    });
    setServiceJobHistory(output);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsMatch, partsMatch]);
  
  const emptyObj = {
    id: '',
    name: '',
    quantity: 1,
    price: '',
  }
  
  const jobsPredicttive = {
    field: 'name',
    headerName: 'Назва',
    renderCell: (params) => RenderAutoComplete(params, 'jobName', jobList, false),
    renderEditCell: (params) => RenderAutoComplete(params, 'jobName', jobList, false),
    display: 'flex',
    width: 300,
    editable: true,
    required: true,
  }
  
  const partsPredicttive = {
    field: 'name',
    headerName: 'Назва',
    renderCell: (params) => RenderAutoComplete(params, 'partName', partList, true, ['partNumber'], createNewPart),
    renderEditCell: (params) => RenderAutoComplete(params, 'partName', partList, true, ['partNumber'], createNewPart),
    display: 'flex',
    width: 300,
    editable: true,
    required: true,
  }

  function updateJobPrice(rowData) {
    return rowData.name.hours * normativeCost * rowData.quantity;
  }

  function createNewPart(partObj) {
    setPartList([...partList, partObj]);
  }

  const totalJobCost = useMemo(() => serviceVisitJobs.reduce((acc, curr) => acc += curr.price ? parseInt(curr.price) : 0, 0), [serviceVisitJobs]);
  const totalPartCost = useMemo(() => serviceVisitParts.reduce((acc, curr) => acc += curr.price ? parseInt(curr.price) : 0, 0), [serviceVisitParts]);
  const totalPartCommissionCost = useMemo(() => totalPartCost / 100 * commissionPercentage, [totalPartCost, commissionPercentage]);
  const totalCost = useMemo(() => totalJobCost + totalPartCost + totalPartCommissionCost, [totalJobCost, totalPartCost, totalPartCommissionCost]);

  const customActions = (id) => [];

  return (
    <Grid container spacing={3} sx={{p: 2}}>
      <Grid xs={12} lg={6}>
        <CommonGrid
          title={'Роботи'}
          columns = {[jobsPredicttive, ...serviceVisitJobsGridConfig]}
          gridHeight = {630}
          actionsWidth = {120}
          customActions = {customActions}
          fieldToFocus = {'name'}
          gridData = {serviceVisitJobs}
          setGridData = {setServiceVisitJobs}
          emptyObj = {emptyObj}
          onsiteCalculatedColumns = {[{name: 'price', calcFn: (rowData) => updateJobPrice(rowData)}] }
          hasExport = {true}
        >  
        </CommonGrid>
      </Grid>
      <Grid xs={12} lg={6}>
        <CommonGrid
          title={'Запчастини'}
          columns = {[partsPredicttive, ...serviceVisitPartsGridConfig]}
          gridHeight = {452}
          actionsWidth = {120}
          customActions = {customActions}
          fieldToFocus = {'name'}
          gridData = {serviceVisitParts}
          setGridData = {setServiceVisitParts}
          emptyObj = {emptyObj}
          hasExport = {true}
        >  
        </CommonGrid>
        <Card variant="outlined" sx={{ width: '100%', padding: '10px 30px', float: 'right', margin: '20px 0'}}>
          <div className="totalsContainer">
            <div className="totalItem">
              <span className="costLabel">Робота:</span>
              <span className="cost">{totalJobCost}</span>
            </div>
            <div className="totalItem">
              <span className="costLabel">Запчастини:</span>
              <span className="cost">{totalPartCost}</span>
            </div>
            <div className="totalItem">
              <span className="costLabel">Коміссія за запчастини:</span>
              <span className="cost">{totalPartCommissionCost}</span>
            </div>
            <div className="totalItem">
              <span className="costLabel bold">Разом:</span>
              <span className="cost bold">{totalCost}</span>
            </div>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ServiceVisitDetails;