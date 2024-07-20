import React, { useEffect, useRef } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";

function RenderAutoComplete(params, columnName, data, createNew, additionalProps, createNewFn) {
    let { id, value, field, hasFocus } = params;
    const [val, setVal] = React.useState(value || data.filter((v) => v.id === params.id)[0] || null);
    const filter = createFilterOptions();
    
    const apiRef = useGridApiContext();
    const ref = useRef();

    useEffect(() => {
      if (params.cellMode === 'edit') {
        apiRef.current.setEditCellValue({ id, field, value: val });
      }
    }, [params.cellMode]);

    // useLayoutEffect(() => {
    //  if (hasFocus && ref.current) {
    //     ref.current.parentElement.focus();
    //   }
    // }, [hasFocus]);

    const handleValueChange = (newValue) => {
      let newValObj = {};

      if (typeof newValue === 'string' && createNew) {
        newValObj = {
          id: randomId(),
          [columnName]: newValue,
          ...additionalProps.map(pr => ({pr: ''}))
        }
        createNewFn(newValObj);
      } else if (newValue && newValue.inputValue && createNew) {
        newValObj = {
          id: randomId(),
          [columnName]: newValue.inputValue,
          ...additionalProps.map(pr => ({pr: ''}))
        }
        createNewFn(newValObj);
      } else {
        newValObj = newValue;
      }
      
      setVal(newValObj);
      apiRef.current.setEditCellValue({ id, field, value: newValObj });
    };
    
    if (params.cellMode === 'view') {
      const label = val ? val[columnName] : 'Назва';
      return <span label="Назва" >{label}</span>
    }

    let createNewProps = {};

    if (createNew) {
      createNewProps = {
        filterOptions: (options, params) => {
          const filtered = filter(options, params);
    
          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option.title);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              [columnName]: `Cтворити "${inputValue}"`,
            });
          }
    
          return filtered;
        },
        freeSolo: true
      }
    }

    return <Autocomplete
      value={val}
      ref={ref}
      options={data}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option[columnName];
      }}
      {...createNewProps}
      onChange={(event, newValue) => handleValueChange(newValue)}
      disablePortal
      disableClearable
      selectOnFocus
      clearOnBlur
      size="small"
      sx={{ width: '100%'}}
      renderInput={(params) => <TextField {...params} label="Назва" />}
    />
  }

  export default RenderAutoComplete;

  // 'Cтворити' is not shown