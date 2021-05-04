import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import statService from "../../services/stat.service";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    mainTitle: {
        marginLeft: theme.spacing(2),
        flex: 1
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        textAlign: 'center'
    },
    inputContent: {
        margin: theme.spacing(2),
        textAlign: 'center'
    },
    input: {
        margin: theme.spacing(2),
    },
    paper: {
      textAlign: 'center',
      color: theme.palette.text.secondary,
      margin: theme.spacing(2),
    },
    divider: {
        margin: theme.spacing(2),
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StatItem({ countryId, setCountryId, openForm, setOpenForm, setOpenConfirmDialog, setReloadData, setDialogText }) {
    const classes = useStyles();
    const [data, setData] = React.useState({});
    const [newData, setNewData]= React.useState(
        {
            newCases: 0,
            critical: 0,
            recovered: 0,
            newDeaths: 0,
            newTests: 0
        })


    const handleClose = (e) => {
        e.preventDefault();
        setOpenForm(false);
        setCountryId('');
    };
    
    const onBlurNewCases = (value) => {
        const newCases = parseInt(value);
        setNewData({...newData, newCases});
    }
    
    const onBlurNewTests = (value) => {
        const newTests = parseInt(value);
        setNewData({...newData, newTests});
    }
    
    const onBlurNewDeaths = (value) => {
        const newDeaths = parseInt(value);
        setNewData({...newData, newDeaths});
    }
    
    const onBlurCritical = (value) => {
        const critical = parseInt(value);
        setNewData({...newData, critical});
    }
    
    const onBlurRecovered = (value) => {
        const recovered = parseInt(value);
        setNewData({...newData, recovered});
    }

    const handleSaveNewStatInfo = () => {
        statService.updateStatItem({...newData, id: data.id})
        .then(resp => {
            if(resp.status === 201) {
                setOpenForm(false); 
                setOpenConfirmDialog(true);
                setReloadData(true);
                setDialogText({
                    title: `${data.country} stats`,
                    msg: `Stats of ${data.country} has been updated successfully!`,
                    txtOk: '',
                    txtCancel: 'Ok'
                });
            }
        })
    }

    const fetchStatItem = async () => {
      statService.getStatItem(countryId)
        .then(resp => {
            setData(resp.data);
            setOpenForm(true);
        })
    }

    useEffect(() => {
        if(countryId !== ''){
            fetchStatItem();
        }
    }, [ countryId ])

    return (
        <Dialog fullScreen open={openForm} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.mainTitle}>
                    {data.country}
                </Typography>
                <Button autoFocus color="inherit" onClick={handleSaveNewStatInfo}>
                    save
                </Button>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <Grid container item xs={12}>
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.paper}>
                            <Typography variant="h6" className={classes.title}>Register new info</Typography>                                
                            <Grid container item xs={12} spacing={3}>
                                <Grid item sm={12} md={6}>
                                    <TextField
                                        id="newCases"
                                        className={classes.input}
                                        label="New Cases"
                                        type="number"
                                        onBlur={e => onBlurNewCases(e.target.value)}
                                        fullWidth
                                        defaultValue="0"
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ inputProps: { min: 0 } }}
                                        />
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    <TextField
                                        id="newDeaths"
                                        className={classes.input}
                                        label="New Deaths"
                                        type="number"
                                        fullWidth
                                        defaultValue="0"
                                        onBlur={e => onBlurNewDeaths(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ inputProps: { min: 0 } }}
                                        />
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    <TextField
                                        id="newTests"
                                        className={classes.input}
                                        label="New Tests"
                                        type="number"
                                        fullWidth
                                        defaultValue="0"
                                        onBlur={e => onBlurNewTests(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ inputProps: { min: 0 } }}
                                        />
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    <TextField
                                        id="recoveredCases"
                                        className={classes.input}
                                        label="Recovered Cases"
                                        type="number"
                                        fullWidth
                                        defaultValue="0"
                                        onBlur={e => onBlurRecovered(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ inputProps: { min: 0 } }}
                                        />
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    <TextField
                                        id="criticalCases"
                                        className={classes.input}
                                        label="Critical Cases"
                                        type="number"
                                        fullWidth
                                        defaultValue="0"
                                        onBlur={e => onBlurCritical(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ inputProps: { min: 0 } }}
                                        />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.paper}>
                            <Typography variant="h6" className={classes.title}>
                                Current Information
                            </Typography>
                            <Grid container item xs={12}>
                                <Grid item xs={12} md={6}>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h6" className={classes.title}>Cases</Typography>
                                        <List>
                                            <ListItem>
                                                <ListItemText primary="New cases"/>
                                                <ListItemSecondaryAction>{data.newCases}</ListItemSecondaryAction>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="Active cases"/>
                                                <ListItemSecondaryAction>{data.activeCases}</ListItemSecondaryAction>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="Critical cases"/>
                                                <ListItemSecondaryAction>{data.criticalCases}</ListItemSecondaryAction>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="Recovered cases"/>
                                                <ListItemSecondaryAction>{data.recoveredCases}</ListItemSecondaryAction>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="Total cases"/>
                                                <ListItemSecondaryAction>{data.totalCases}</ListItemSecondaryAction>
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h6" className={classes.title}>Deaths</Typography>
                                        <List>
                                            <ListItem>
                                                <ListItemText primary="New Deaths"/>
                                                <ListItemSecondaryAction>{data.newDeaths}</ListItemSecondaryAction>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="Total Deaths"/>
                                                <ListItemSecondaryAction>{data.totalDeaths}</ListItemSecondaryAction>
                                            </ListItem>
                                        </List>
                                    </Paper>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h6" className={classes.title}>Tests</Typography>
                                        <List>
                                            <ListItem>
                                                <ListItemText primary="Total Tests"/>
                                                <ListItemSecondaryAction>{data.totalTests}</ListItemSecondaryAction>
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>                   
                </Grid>
            </DialogContent>
        </Dialog>            
    )
}