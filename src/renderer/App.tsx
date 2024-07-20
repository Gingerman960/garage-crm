import React, { Suspense, useEffect, useState } from 'react';
import JobList from './JobList';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {reCalculateCost, saveFile} from './common/Utils';
import Cars from './Cars';
import { Route, Routes, useNavigate, Navigate, useLocation } from 'react-router-dom';
import ServiceHistory from './ServiceHistory';
import ServiceVisitDetails from './ServiceVisitDetails';
import './App.css';
import RenderBreadCrumbs from './common/Breadcrumbs';

const navItems = [
  {name: 'Авто в роботі', link: '/cars'},
  {name: 'Сервісна історія', link: '/serviceHistory'},
  {name: 'Роботи і запчастини', link: '/jobs'},
];

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Layout(props: any) {
  const {pageTitle, children, currentPage, navigate} = props;
  const UnderlineButton = styled(Button)(() => ({
    borderBottom: '2px solid white',
    borderRadius: 0
  }));

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            {pageTitle}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              currentPage.includes(item.link)
              ?
              <UnderlineButton key={item.link} onClick={() => navigate(item.link)} sx={{ color: '#fff' }}>
                {item.name}
              </UnderlineButton>
              :
              <Button key={item.link} onClick={() => navigate(item.link)} sx={{ color: '#fff' }}>
                {item.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function Router() {
  const [normativeCost, setNormativeCost] = useState(0);
  const [commissionPercentage, setCommissionPercentage] = useState(0);
  const [jobList, setJobList] = useState([]);
  const [partList, setPartList] = useState([]);
  const [carsState, setCarsState] = useState([]);
  const [serviceJobHistory, setServiceJobHistory] = useState([]);
  const [pageTitle, setPageTitle] = useState('Tesla Service');
  const [breadcrubms, setBreadCrumbs] = useState([]);
  const [dataLoaded , setDataLoaded] = useState(false)

  useEffect(() => {
    const normativeCostData = window.NormativeCostData.normativeCostData().then((res: any) => {
      if (res) {
        const parsed = JSON.parse(res);
        setNormativeCost(parsed);
      } else {
        setNormativeCost(500);
      }
    });

    const commissionPercentageData = window.CommissionPercentageData.commissionPercentageData().then((res: any) => {
      if (res) {
        const parsed = JSON.parse(res);
        setCommissionPercentage(parsed);
      } else {
        setCommissionPercentage(10);
      }
    });

    const jobListData = window.JobListData.jobListData().then((res: any) => {
      if (res) {
        const parsed = JSON.parse(res);
        setJobList(reCalculateCost(parsed, normativeCost));
      }
    });

    const partListData = window.PartListData.partListData().then((res: any) => {
      if (res) {
        const parsed = JSON.parse(res);
        setPartList(parsed);
      }
    });

    const carsStateData = window.CarsStateData.carsStateData().then((res: any) => {
      if (res) {
        const parsed = JSON.parse(res);
        setCarsState(parsed);
      }
    });

    const serviceJobHistoryData = window.ServiceJobHistoryData.serviceJobHistoryData().then((res: any) => {
      if (res) {
        const parsed = JSON.parse(res);
        setServiceJobHistory(parsed);
      }
    });

    Promise.allSettled(
      [normativeCostData,
      commissionPercentageData,
      jobListData,
      partListData,
      carsStateData,
      serviceJobHistoryData]).then(res => {
        setDataLoaded(true);
      })
}, [])

  useEffect(() => {
    if (dataLoaded) {
      const data = normativeCost;
      
      if (data) {
        saveFile('normativeCostData', data);
      }
    }
  }, [normativeCost, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      const data = commissionPercentage;
      
      if (data) {
        saveFile('commissionPercentageData', data);
      }
    }
  }, [commissionPercentage, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      const data = jobList.filter((row: any) => !row.isNew);
      
      if (data && data.length) {
        saveFile('jobListData', data);
      }
    }
  }, [jobList, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      const data = partList.filter((row: any) => !row.isNew);
      
      if (data && data.length) {
        saveFile('partListData', data);
      }
    }
  }, [partList, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      const data = carsState.filter((row: any) => !row.isNew);
      
      if (data && data.length) {
        saveFile('carsStateData', data);
      }
    }
  }, [carsState, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      const data = serviceJobHistory.filter((row: any) => !row.isNew);

      if (data && data.length) {
        saveFile('serviceJobHistoryData', data);
      }
    }
  }, [serviceJobHistory, dataLoaded]);
  

  const navigate = useNavigate();
  const location = useLocation().pathname;
  const content = (
    <>
      <Routes>
        <Route path="/cars" element={
          <Cars
            carsState = {carsState}                
            setCarsState = {setCarsState}
            navigate = {navigate}
            setPageTitle = {setPageTitle}    
            setBreadCrumbs = {setBreadCrumbs}        
          />
        }/>
        <Route path="/serviceHistory/:vin" element={
          <ServiceHistory
            carsState = {carsState}
            setCarsState = {setCarsState}
            serviceJobHistory = {serviceJobHistory}
            setServiceJobHistory = {setServiceJobHistory}
            navigate = {navigate}
            setPageTitle = {setPageTitle}
            setBreadCrumbs = {setBreadCrumbs}
          />
        }/>
        <Route path="/serviceHistory/:vin/:visitId" element={
          <ServiceVisitDetails
            carsState = {carsState}
            setCarsState = {setCarsState}
            serviceJobHistory = {serviceJobHistory}
            setServiceJobHistory = {setServiceJobHistory}
            setPageTitle = {setPageTitle}
            partList = {partList} 
            setPartList = {setPartList}
            jobList = {jobList} 
            setBreadCrumbs = {setBreadCrumbs}
            commissionPercentage = {commissionPercentage}
            normativeCost = {normativeCost}
          />
        }/>
        <Route path="/jobs" element={
          <JobList
            normativeCost = {normativeCost} 
            setNormativeCost = {setNormativeCost} 
            commissionPercentage = {commissionPercentage} 
            setCommissionPercentage = {setCommissionPercentage} 
            jobList = {jobList} 
            setJobList = {setJobList}
            partList = {partList} 
            setPartList = {setPartList}
            setPageTitle = {setPageTitle}
            setBreadCrumbs = {setBreadCrumbs}
          />
        }/>
        <Route path="*" element={<Navigate to="/cars" />}/>
      </Routes>
    </>
  );

  return (
    <Layout pageTitle={pageTitle} currentPage={location} navigate={navigate}>
      <RenderBreadCrumbs
        crumbsArr = {breadcrubms}
        navigate = {navigate}
      ></RenderBreadCrumbs>
      {dataLoaded ? content : BigSpinner()}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}

// List of possible improvements: 

// biggest id +1 instead of random

// submit by enter when delete row
