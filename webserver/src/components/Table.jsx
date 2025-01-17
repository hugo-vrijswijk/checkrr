import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton,
  GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import { ButtonBase, Paper } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';

const columns = [
  { field: 'id', headerName: 'ID', flex: 0.05, },
  { field: 'path', headerName: 'Path', flex: 1},
  { field: 'ext', headerName: 'File Extension', flex: 0.15,},
  { field: 'reacquire', headerName: 'Reacquired', flex: 0.15},
  { field: 'service', headerName: 'Service', flex: 0.13},
];

export default function DataTable() {
  const [rows, setdatarows] = useState([])
  const [displayModal, setdisplayModal] = useState(false)
  const [selectedRows, setselectedRows] = useState([])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  function fetchData() {
    axios.get(`/api/files/bad`)
    .then(res => {
        const data = res.data
        let rows = []
        for(let i = 0; i < data.length; i++) {
            let l = data[i]
            let row = {}
            row.id = i + 1
            row.path = l.Path
            row.ext = l.Data.fileExt
            row.reacquire = l.Data.reacquire
            row.service = l.Data.service
            rows.push(row)
        }
        setdatarows(rows)
    })
    setTimeout(() => {fetchData()},10000)
  }

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line
  },[])

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <ButtonBase class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall css-8nnocu" onClick={() => {
          setdisplayModal(true)
        }}><DeleteIcon /> DELETE SELECTED ROWS</ButtonBase>
      </GridToolbarContainer>
    );
  }

  return (
  <Paper elevation={3}>
    <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        style={{paddingTop: 20, paddingBottom: 10, paddingLeft: 20}}
        sx={{
          mr: 2,
          flexGrow: 1,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.05rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        Bad Files
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            onSelectionModelChange={(selections) => {
              console.log(selections)
              if (selections.length > 0) {
                setselectedRows(selections)
              } else {
                setselectedRows(selections)
              }
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
            sx={{border: 0}}
        />
        <Modal
            open={displayModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to delete these entries?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              checkrr doesn't support deleting files via the Web UI. This will just delete the records from the list.
          </Typography>
          <Grid>
              <Button color="warning" onClick={() => {
              axios.post('/api/files/bad', selectedRows).then(res => {
                setdisplayModal(false)
                window.location.reload(false)
          })}}>Delete</Button>
          </Grid>
          <Grid>
              <Button onClick={() => {setdisplayModal(false)}}>Cancel</Button>
          </Grid>
          </Box>
        </Modal>
      </div>
      <br/>
    </Paper>
  )
}
