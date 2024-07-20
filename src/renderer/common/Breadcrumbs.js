
import { Breadcrumbs, Link, Typography } from '@mui/material';

function RenderBreadCrumbs(props) {
    const {
      crumbsArr,
      navigate
    } = props;
    
    const changeLocation = (ev, href) => {
      ev.preventDefault();
      navigate(href);
    }
  
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link 
          underline="hover"
          color="inherit" 
          href={'/'}
          onClick={(event => changeLocation(event, '/'))}
          >
          Головна
        </Link>
        {crumbsArr.map(crumb => {
          if (crumb.inactive) {
            return (<Typography key={crumb.key} color="text.primary">{crumb.label}</Typography>);
          }

          return (
            <Link
              underline="hover"
              onClick={(event => changeLocation(event, crumb.href))}
              color="inherit"
              key={crumb.key}
              href={crumb.href}
              >
              {crumb.label}
            </Link>
          )
        })}
      </Breadcrumbs>
    );
  }

  export default RenderBreadCrumbs