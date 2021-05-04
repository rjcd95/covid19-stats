import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import statService from "../../services/stat.service";
import { DataGrid } from '@material-ui/data-grid';

const numberFormat = new Intl.NumberFormat('en-US');
const newCases = new Intl.NumberFormat('en-US', {
  signDisplay: "exceptZero"
});

const columns = [
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
    },
  }
];

export default function Statistics({ search, syncData, setSyncData }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('country');
  const [order, setOrder] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  let reloadData = true;

  const handlePageChange = (params) => {
    setPage(params.page + 1);
    reloadData = true;
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
    reloadData = true;
  }

  const syncStatsData = async() => {
    setLoading(true);
    statService.syncStats()
      .then(resp => {
        alert(resp.data.msg);
        setSyncData(false);
        setDefaultFilter();
      })
  }

  const fetchStats = async () => {
    statService.getStats({ page, sort, order, search  })
      .then(resp => {
        const data = resp.data;
        setTotalRows(data.totalDocs);
        setLoading(false);
        setRows(data.docs);
      })
  }

  useEffect(() => {
    setLoading(true);
    if(reloadData) {
      fetchStats();
    }
    if(syncData) {
      syncStatsData();
    }
  }, [ page, sort, order, search, syncData ])

  return (    
    <div style={{ height: 400, width: '100%' }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Statistics
      </Typography>
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
    </div>
  );
}