import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import HomeIcon from '@material-ui/icons/Home';

import { Router, useRouter } from "next/router";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  table: {
    minWidth: 650,
  },
  dataContainer: {
    paddingTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
  },
}));

const city = () => {
  const router = useRouter();
  const { pid, citySlug } = router.query;
  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState(null);

  const [cityState, setCityState] = React.useState({
    populationTotal: null,
    populationDensity: null,
    areaTotal: null,
  });

  const handleBack = () => {
    router.back();
  };

  React.useEffect(() => {
    if (citySlug) {
      fetchData();
    }
  }, [citySlug]);

  //   const depthSearchForKeys = (obj) => {
  //       if(!obj) return;
  //       let totalLvl1Keys = 0;
  //       let lvl1Keyg5 = [];
  //       Object.keys(obj).forEach(key => {
  //         //   console.log(key)
  //           if(Object.keys(obj[key]).length > 5){
  //             lvl1Keyg5.push({
  //                 key: key,
  //                 length: Object.keys(obj[key]).length
  //             })
  //           }
  //           totalLvl1Keys+=1;
  //       })
  //       console.log(totalLvl1Keys);
  //       console.log(lvl1Keyg5);
  //       console.log(obj[`http://dbpedia.org/resource/${citySlug}`]["http://dbpedia.org/ontology/populationTotal"])

  //   }

  const fetchData = async () => {
    if (citySlug === undefined || citySlug === "") {
      alert("City not Found!!");
      return;
    }

    console.log("Loading...");
    setLoading(true);

    try {
      const res = await axios.get(`http://dbpedia.org/resource/${citySlug}`, {
        headers: { Accept: "application/json" },
      });
    //   console.log(res.data);
      if (Object.keys(res.data).length < 1) {
        setApiError("Data Not Found!!!");
        setLoading(false);
        return;
      }
      const cityObj = res.data[`http://dbpedia.org/resource/${citySlug}`];
      const populationTotal =
        cityObj["http://dbpedia.org/ontology/populationTotal"];
      const populationDensity =
        cityObj["http://dbpedia.org/ontology/populationDensity"];
      const areaTotal = cityObj["http://dbpedia.org/ontology/areaTotal"];
      setCityState({
        ...cityState,
        populationTotal,
        populationDensity,
        areaTotal,
      });
      setLoading(false);
    } catch (e) {
      console.log("error", e);
      setApiError("Some Error While Fetched Data...!")
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            City : {citySlug}
          </Typography>
          <IconButton
            edge="end"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => router.push("/")}
          >
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.dataContainer}>
        {loading ? (
          <CircularProgress />
        ) : apiError ? (
          <Typography variant="h3" component="h2" color="error">
            {apiError}
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="Data Table">
              <TableBody>
                {Object.keys(cityState).map((label) => (
                  <TableRow key={label}>
                    <TableCell component="th" scope="row">
                      {label}
                    </TableCell>
                    <TableCell align="right">
                      {cityState[label] && cityState[label][0]["value"]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </div>
  );
};

export default city;
