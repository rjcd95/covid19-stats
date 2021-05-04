import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import statService from "../../services/stat.service";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import StatItem from "./StatItem";


const useStyles = makeStyles((theme) => ({
  centered: {
      textAlign: 'center'
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const numberFormat = new Intl.NumberFormat('en-US');
const newCases = new Intl.NumberFormat('en-US', {
  signDisplay: "exceptZero"
});
const defaultColumns = [
  
  { field: 'id', headerName: 'ID', hide: true },
  { field: 'country', headerName: 'Country', flex: 1 },
  { 
    field: 'newCases',
    headerName: 'New Cases',
    flex: 1,
    valueFormatter: ({ value }) => newCases.format(Number(value)),
  },
  { 
    field: 'activeCases',
    headerName: 'Active Cases',
    flex: 1,
    valueFormatter: ({ value }) => numberFormat.format(Number(value)),
  },
  {    
    field: 'criticalCases',
    headerName: 'Critical Cases',
    flex: 1,
    valueFormatter: ({ value }) => numberFormat.format(Number(value)),
  },
  {    
    field: 'recoveredCases',
    headerName: 'Recovered Cases',
    flex: 1,
    valueFormatter: ({ value }) => numberFormat.format(Number(value)),
  },
  {    
    field: 'totalCases',
    headerName: 'Total Cases',
    flex: 1,
    valueFormatter: ({ value }) => numberFormat.format(Number(value)),
  },
  { 
    field: 'newDeaths',
    headerName: 'New Deaths',
    flex: 1 ,
    valueFormatter: ({ value }) => newCases.format(Number(value)),
  },
  {
    field: 'totalDeaths',
    headerName: 'Total Deaths',
    flex: 1,
    valueFormatter: ({ value }) => numberFormat.format(Number(value)),
  },
  {
    field: 'totalTests',
    headerName: 'Total Tests',
    flex: 1,
    valueFormatter: ({ value }) => numberFormat.format(Number(value)),
  },
  { 
    field: 'date',
    headerName: 'Date',
    flex: 1,
    valueFormatter: ({ value }) => {
      return new Date(value).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }
]

export default function Statistics({ search, syncData, setSyncData }) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('country');
  const [order, setOrder] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState('');
  const [openForm, setOpenForm] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [reloadData, setReloadData] = React.useState(true);
  const [dialogText, setDialogText] = React.useState({});

  const columns = [...defaultColumns, 
    {
      field: "",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        const onClick = () => {
          setOpenForm(true);
          setCountryId(params.id);
        };
        return <IconButton color="inherit" onClick={onClick}><CreateIcon /></IconButton>;
      }
    }
  ];

  const initDialogTxt = () => {
    setDialogText({
      title: "Sync all stats?",
      msg: "Are you sure to sync the data? You will lose all the information registered manually.",
      txtOk: 'Ok',
      txtCancel: 'Cancel'
    });
  }

  const handlePageChange = (params) => {
    setPage(params.page + 1);
    setReloadData(true);
  };

  const setDefaultFilter = () => {
    setPage(1);            
    setSort('country');
    setOrder(1);
  }

  const handleSortModelChange = (params) => {
    const sortModel = params.sortModel[0];
    const field = (sortModel) ? sortModel.field : 'country';
    const sort = (sortModel) ? ((sortModel.sort === "asc") ? 1 : -1) : 1;

    setSort(field);
    setOrder(sort);
    setReloadData(true);
  }

  const handleOkBtnDialog = (e) => {
    e.preventDefault();
    syncStatsData();    
  }

  const syncStatsData = async() => {
    setOpen(false);
    setLoading(true);
    statService.syncStats()
      .then(resp => {
        if(resp.status === 201){
          setSyncData(false);
          setLoading(false);
          setDefaultFilter();
          setDialogText({
            title: "Sync stats",
            msg: "Data synced successfully!",
            txtOk: '',
            txtCancel: 'Ok'
          });
          setOpen(true);
        }
      })
  }

  const fetchStats = async () => {
    setLoading(true);
    statService.getStats({ page, sort, order, search  })
      .then(resp => {
        const data = resp.data;
        if(data.docs.length == 0) {
          syncStatsData();
        } else {
          setTotalRows(data.totalDocs);
          setLoading(false);
          setRows(data.docs);
          setReloadData(false);
        }
      })
  }

  const handleClose = () => {
    if(dialogText.txtOk === "") {
      fetchStats();
    }
    setOpen(false);
    setSyncData(false);
  };

  useEffect(() => {
    if(reloadData || search) {
      fetchStats();
    }
    if(syncData) {
      initDialogTxt();
      setOpen(true);
    }
  }, [ page, sort, order, search, syncData, reloadData ])

  return (    
    <div style={{ height: 400, width: '100%' }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Statistics
      </Typography>
      {!loading && (
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          pageSize={5}
          rowCount={totalRows}
          paginationMode="server"
          onPageChange={handlePageChange}
          onSortModelChange={handleSortModelChange}
          disableColumnFilter
          loading={loading}
        /> 
      )}
      {loading && (
        <div className={classes.centered}>
          <CircularProgress disableShrink/>
        </div>
      )}
      <Dialog 
        open={open}
        onClose={handleClose} 
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle id="alert-dialog-title">{dialogText.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogText.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {dialogText.txtCancel}
          </Button>
          {dialogText.txtOk !== "" &&(
            <Button onClick={handleOkBtnDialog} color="primary" autoFocus>
              {dialogText.txtOk}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <StatItem 
        countryId={ countryId }
        setCountryId={ setCountryId }
        openForm={ openForm }
        setOpenForm={ setOpenForm }
        setOpenConfirmDialog={ setOpen }
        setReloadData= { setReloadData }
        setDialogText= { setDialogText }
      />
    </div>
  );
}