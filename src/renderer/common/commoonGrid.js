import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbarQuickFilter,
  GridToolbarExport,
} from '@mui/x-data-grid';
import {
  randomId,
} from '@mui/x-data-grid-generator';

export function CommonGrid(props) {
  const {
    columns,
    actionsWidth,
    customActions,
    fieldToFocus,
    gridData,
    setGridData,
    emptyObj,
    onsiteCalculatedColumns,
    gridHeight,
    title,
    hasExport
  } = props;

  const [rowModesModel, setRowModesModel] = React.useState({});
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const requiredColumns = columns.filter(col => col.required).map(col => col.field);
  const [hasInvalidCells, setHasInvalidCells] = useState(false);

  const gridColumns = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Дії',
      width: actionsWidth,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={() => handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          ...customActions(id),
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => confirmDeleteOpen(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  function EditToolbar(props) {
    const { setGridData, setRowModesModel, emptyObj } = props;
  
    const createNewClick = () => {
      const id = randomId();
      setGridData((oldRows) => [{ ...emptyObj, id, isNew: true }, ...oldRows]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: fieldToFocus },
      }));
    };
  
    return (
      <React.Fragment>
        {title && (
          <div className="card-header">
            {title}
          </div>
        )}
        <GridToolbarContainer className="grid-filters space-between">
          <GridToolbarQuickFilter></GridToolbarQuickFilter>
          <div className="d-flex">
            {hasExport ? (
              <div className="margin-right-10 d-flex align-center">
                <GridToolbarExport />
              </div>
            ) : ''}
            <Button color="primary" startIcon={<AddIcon />} onClick={createNewClick}>
              Новий запис
            </Button>
          </div>
        </GridToolbarContainer>
      </React.Fragment>
    );
  }

  function ConfirmDeleteDialog() {
    return (
      <Dialog
          open={open}
          onClose={() => confirmDeleteClose(null)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Видалити запис?"}
          </DialogTitle>
          <Box sx={{ p: 1 }}>
            <DialogActions>
              <Button variant="contained" onClick={() => confirmDeleteClose(true)}>
                Так
              </Button>
              <Button variant="" onClick={() => confirmDeleteClose(false)} autoFocus>
                Відміна
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
    );
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: fieldToFocus } });
  };

  const handleSaveClick = (id) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
};

  const handleCancelClick = (id) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = gridData.find((row) => row.id === id);

    if (editedRow.isNew) {
      setGridData(gridData.filter((row) => row.id !== id));
    }

    setHasInvalidCells(false);
  };

  const processRowUpdate = (newRow) => {
    const emptyrequiredFields = Object.keys(newRow).filter(key => !newRow[key] && requiredColumns.includes(key));

    if (emptyrequiredFields.length) {
      setRowModesModel({ ...rowModesModel, [newRow.id]: { mode: GridRowModes.Edit, invalid: true } });
      console.warn('Required field is empty: ', newRow);
      setHasInvalidCells(true);
      return;
    } else {
      setHasInvalidCells(false);
    }

    const updatedRow = { ...newRow,  isNew: false };
    onsiteCalculatedColumns && onsiteCalculatedColumns.forEach(col => {
      updatedRow[col.name] = col.calcFn(newRow);
    });
    setGridData(gridData.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const processRowUpdateError = (newRow) => {
    console.warn(newRow);
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const confirmDeleteOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const confirmDeleteClose = (confirmation) => {
    if (confirmation) {
      deleteRow(deleteId);
    }
    setDeleteId(null);
    setOpen(false);
  };

  function deleteRow(id) {
    setGridData(gridData.filter(row => row.id !== id));
  }

    return (
      <React.Fragment>
        <div className='common-grid-container'>
          <Box
            sx={{
              height: gridHeight || 650,
              width: '100%',
              '& .actions': {
                color: 'text.secondary',
              },
              '& .textPrimary': {
                color: 'text.primary',
              },
            }}
          >
            <DataGrid
              rows={gridData}
              columns={gridColumns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={processRowUpdateError}
              checkboxSelection={false}
              getCellClassName={(params) => {
                if (params.colDef.required && !params.value && hasInvalidCells) {
                  return 'highlight-required';
                }
                return '';
              }}
              slots={{
                toolbar: EditToolbar
              }}
              slotProps={{
                toolbar: {
                  setGridData,
                  setRowModesModel,
                  emptyObj,
                  showQuickFilter: true
                },
              }}
            />
          </Box>
        </div>
        <ConfirmDeleteDialog></ConfirmDeleteDialog>
      </React.Fragment>
    );
}