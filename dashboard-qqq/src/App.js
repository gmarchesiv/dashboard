import React, { useEffect, useMemo, useState } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Drawer,
  Box,
  Divider,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
} from '@mui/material';

import { styled } from '@mui/system';

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

import './App.css';
import logo from './logo.jpeg';


// ============================================================
// CONFIGURACIÓN
// ============================================================

const POLLING_MS = 1000;
const REQUEST_TIMEOUT_MS = 2500;


// ============================================================
// SERVIDORES
// ============================================================

const SERVERS = [
  { url: 'http://35.212.31.6:8000', userId: "Augusto Vidaurre", etf: "QQQ" },
  { url: 'http://35.212.46.199:8000', userId: "Giancarlo Marchesi", etf: "QQQ" },
  { url: 'http://35.212.13.140:8000', userId: "Gerardo Yupari", etf: "QQQ" },
  { url: 'http://35.212.7.60:8000', userId: "Guillermo Berastain", etf: "QQQ" },

  { url: 'http://35.212.44.4:8000', userId: "Orlando Marchesi", etf: "QQQ" },
  { url: 'http://34.4.44.99:8000', userId: "Renzo Muente", etf: "QQQ" },



].sort(
  (a, b) =>
    a.etf.localeCompare(b.etf) ||
    a.userId.localeCompare(b.userId)
);


// ============================================================
// FORMATTER HORA NUEVA YORK
// ============================================================

const NY_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour12: false,
});


// ============================================================
// ESTILOS
// ============================================================

const DrawerBox = styled(Box)({
  width: '300px',
  padding: '20px',
});

const AppBarStyled = styled(AppBar)({
  marginBottom: '20px',
});


// ============================================================
// THEME
// ============================================================

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#424242',
    },
  },
});


// ============================================================
// HELPERS
// ============================================================

const toPercent = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number * 100;
};


const formatNumber = (value, decimals = 2) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return '-';
  }

  return number.toFixed(decimals);
};


const valueColor = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 'inherit';
  }

  return number >= 0 ? 'success.main' : 'error.main';
};


const createErrorUser = (server) => ({
  userId: server.userId,
  etf: server.etf,

  date: '-',
  time: '-',

  CASH: null,

  DCALL: null,
  DPUT: null,

  DOCALL: null,
  DOPUT: null,

  RENT: null,

  STATUS: 'ERROR',

  CASHDATA: null,

  CANTIDAD: null,

  OPCALL: null,
  OPPUT: null,

  PRICE: null,

  QQQ: null,

  DIFSTRIKE: null,

  exchange: null,

  callo: null,
  callc: null,

  puto: null,
  putc: null,

  caskbid: null,
  paskbid: null,

  exp: null,

  MV: null,

  PICO: null,
  CAIDA: null,

  downloadUrl: server.url,

  TRADES: [],

  label: null,
  tipo: null,

  online: false,
});


// ============================================================
// COMPONENTE
// ============================================================

function App() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [userData, setUserData] = useState([]);

  const [newYorkDateTime, setNewYorkDateTime] =
    useState('');

  const [selectedUserId, setSelectedUserId] =
    useState(null);


  // ==========================================================
  // FETCH DE UNA MÁQUINA
  // ==========================================================

  const fetchUserData = async (server) => {

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);


    try {

      const response = await fetch(
        `${server.url}/get-data`,
        {
          signal: controller.signal,
          cache: 'no-store',
        }
      );


      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }


      const data = await response.json();


      // ======================================================
      // TIME
      // ======================================================

      const time =
        typeof data.time === 'string'
          ? data.time.split('.')[0]
          : '-';


      // ======================================================
      // MV
      // ======================================================

      const quantity =
        Number(data.quantity) || 0;

      const mv =
        quantity * 100;


      // ======================================================
      // RESULTADO
      // ======================================================

      return {

        userId:
          data.name ??
          server.userId,

        etf:
          server.etf,

        date:
          data.date ?? '-',

        time,


        // ====================================================
        // WALLET
        // ====================================================

        CASH:
          Number(
            data.wallet?.TotalCashValue
          ) || 0,

        CASHDATA:
          data.wallet ?? null,


        // ====================================================
        // CALL
        // ====================================================

        DCALL:
          toPercent(data.dcall),

        DOCALL:
          toPercent(data.docall),

        caskbid:
          toPercent(data.askbid_call),

        CASK:
          data.cask ?? null,
        CBID:
          data.cbid ?? null,

        CSTRIKE:
          data.strike_c ?? null,
        // ====================================================
        // PUT
        // ====================================================

        DPUT:
          toPercent(data.dput),

        DOPUT:
          toPercent(data.doput),

        paskbid:
          toPercent(data.askbid_put),


        PASK:
          data.pask ?? null,
        PBID:
          data.pbid ?? null,

        PSTRIKE:
          data.strike_p ?? null,
        // ====================================================
        // RENTABILIDAD
        // ====================================================

        RENT:
          toPercent(data.rentabilidad),


        // ====================================================
        // STATUS
        // ====================================================

        STATUS:
          data.status ?? '-',

        CANTIDAD:
          quantity,


        // ====================================================
        // OPTIONS
        // ====================================================

        OPCALL:
          data.call_option ?? null,

        OPPUT:
          data.put_option ?? null,

        PRICE:
          Number(data.priceBuy) || 0,


        // ====================================================
        // ETF
        // ====================================================

        QQQ:
          Number(data.pico_etf) || 0,
        VIX:
          Number(data.vix) || 0,

        PERCTICK:
          Number(toPercent(data.Perc_Tick).toFixed(2)) || 0,
        // ====================================================
        // OPTIONS DATA
        // ====================================================

        DIFSTRIKE: 1,


        callo:
          data.call_open ?? 0,

        callc:
          data.call_close ?? 0,

        puto:
          data.put_open ?? 0,

        putc:
          data.put_close ?? 0,

        exp:
          data.exp ?? '-',


        // ====================================================
        // MÉTRICAS
        // ====================================================

        MV: mv,

        PICO:
          toPercent(data.pico),

        CAIDA:
          toPercent(data.caida),


        // ====================================================
        // OTROS
        // ====================================================

        downloadUrl:
          server.url,

        n_trades:

          data.n_trades ?? 0,

        cash_init:

          data.money_inicial ?? 0,
        cash_usar:

          data.money_trades ?? "-",
        racha:

          data.racha ?? "-",

        label:
          data.label ?? 0,

        tipo:
          (data.regla_ant ?? '-').split('_').slice(1).join('_'),

        online: true,
      };


    } catch (error) {

      if (error.name !== 'AbortError') {

        console.error(
          `Error fetching ${server.userId}:`,
          error
        );

      }

      return createErrorUser(server);

    } finally {

      clearTimeout(timeoutId);

    }
  };


  // ==========================================================
  // FETCH DE TODAS LAS MÁQUINAS
  // ==========================================================

  const fetchData = async () => {

    try {

      const results = await Promise.all(
        SERVERS.map((server) =>
          fetchUserData(server)
        )
      );


      setUserData(results);


    } catch (error) {

      console.error(
        'Error fetching data:',
        error
      );

    }
  };


  // ==========================================================
  // POLLING
  //
  // IMPORTANTE:
  //
  // No usamos:
  //
  // setInterval(fetchData, 1000)
  //
  // porque podría comenzar otra ronda mientras
  // la anterior todavía está ejecutándose.
  //
  // ==========================================================

  useEffect(() => {

    let active = true;
    let timer = null;


    const poll = async () => {

      await fetchData();


      if (active) {

        timer = setTimeout(
          poll,
          POLLING_MS
        );

      }

    };


    poll();


    return () => {

      active = false;

      if (timer) {
        clearTimeout(timer);
      }

    };

  }, []);


  // ==========================================================
  // RELOJ NUEVA YORK
  // ==========================================================

  useEffect(() => {

    const updateClock = () => {

      setNewYorkDateTime(
        NY_DATE_FORMATTER.format(
          new Date()
        )
      );

    };


    updateClock();


    const timer = setInterval(
      updateClock,
      1000
    );


    return () =>
      clearInterval(timer);

  }, []);


  // ==========================================================
  // DRAWER
  // ==========================================================

  const drawerData = useMemo(() => {

    if (!selectedUserId) {
      return null;
    }


    return (
      userData.find(
        (user) =>
          user.userId === selectedUserId
      ) ?? null
    );

  }, [
    userData,
    selectedUserId,
  ]);


  const handleDrawerOpen = (userId) => {

    setSelectedUserId(userId);

  };


  const handleDrawerClose = () => {

    setSelectedUserId(null);

  };


  // ==========================================================
  // CSV
  // ==========================================================

  const downloadCSV = (
    data,
    filename
  ) => {

    if (!data) {
      return;
    }


    const headers =
      Object.keys(data);


    if (!headers.length) {
      return;
    }


    const firstColumn =
      data[headers[0]];


    if (!Array.isArray(firstColumn)) {
      return;
    }


    const numRows =
      firstColumn.length;


    const escapeCSV = (value) => {

      if (
        value === null ||
        value === undefined
      ) {
        return '';
      }


      const stringValue =
        String(value);


      return `"${stringValue.replaceAll(
        '"',
        '""'
      )}"`;

    };


    const rows = [

      headers
        .map(escapeCSV)
        .join(','),

      ...Array.from(
        {
          length: numRows,
        },
        (_, index) =>

          headers
            .map(
              (header) =>
                escapeCSV(
                  data[header]?.[index]
                )
            )
            .join(',')

      ),

    ];


    const csvContent =
      rows.join('\n');


    const blob =
      new Blob(
        [csvContent],
        {
          type:
            'text/csv;charset=utf-8;',
        }
      );


    const blobUrl =
      URL.createObjectURL(blob);


    const link =
      document.createElement('a');


    link.href =
      blobUrl;

    link.download =
      filename;


    document.body.appendChild(
      link
    );

    link.click();


    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      blobUrl
    );

  };


  // ==========================================================
  // DOWNLOAD
  // ==========================================================

  const handleDownload = async (
    url,
    endpoint,
    filename
  ) => {

    try {

      const response =
        await fetch(
          `${url}/${endpoint}`,
          {
            cache: 'no-store',
          }
        );


      if (!response.ok) {

        throw new Error(
          `HTTP ${response.status}`
        );

      }


      const data =
        await response.json();


      downloadCSV(
        data,
        filename
      );


    } catch (error) {

      console.error(
        `Error downloading ${endpoint}:`,
        error
      );

    }

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <ThemeProvider theme={theme}>

      <CssBaseline />


      <AppBarStyled position="static">

        <Toolbar>

          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: 40,
              marginRight: '20px',
            }}
          />


          <Typography
            variant="h6"
            component="div"
          />


          <Typography
            variant="subtitle1"
            sx={{
              marginLeft: 'auto',
              marginRight: '10px',
            }}
          >

            Hora de Nueva York:{' '}

            {newYorkDateTime}

          </Typography>

        </Toolbar>

      </AppBarStyled>


      <Container>

        {/* ==================================================
            TABLA
            ================================================== */}

        <TableContainer
          component={Paper}
          sx={{
            marginBottom: '20%',
            overflowX: 'auto',
          }}
        >

          <Table
            size="small"
            aria-label="UserData table"

            sx={{

              '& .MuiTableCell-root': {
                textAlign: 'center',
                padding: '8px',
              },

              '& .MuiTableHead-root .MuiTableCell-root': {
                fontSize: '0.9rem',
                fontWeight: 600,
              },

              '& .MuiTableBody-root .MuiTableCell-root': {
                fontSize: '0.7rem',
              },

            }}
          >

            {/* ==================================================
                HEADER
                ================================================== */}

            <TableHead>

              <TableRow>

                <TableCell>USER</TableCell>

                <TableCell>TIME</TableCell>

                <TableCell>STATUS</TableCell>

                <TableCell>CASH</TableCell>

                <TableCell>DCALL</TableCell>

                <TableCell>DOCALL</TableCell>

                <TableCell>ASK/BID</TableCell>

                <TableCell>DPUT</TableCell>

                <TableCell>DOPUT</TableCell>

                <TableCell>ASK/BID</TableCell>

                <TableCell>LABEL</TableCell>

                <TableCell>RENT</TableCell>

                <TableCell>MAX</TableCell>

                <TableCell>CAIDA</TableCell>

                <TableCell>TIPO</TableCell>

                <TableCell>ACT.</TableCell>

              </TableRow>

            </TableHead>


            {/* ==================================================
                BODY
                ================================================== */}

            <TableBody>

              {userData.map((user) => (

                <TableRow
                  key={user.userId}
                  hover
                >

                  {/* USER */}

                  <TableCell>
                    {user.userId}
                  </TableCell>


                  {/* TIME */}

                  <TableCell>
                    {user.time}
                  </TableCell>


                  {/* STATUS */}

                  <TableCell
                    sx={{
                      color:
                        user.online
                          ? 'success.main'
                          : 'error.main',
                    }}
                  >
                    {user.STATUS}
                  </TableCell>


                  {/* CASH */}

                  <TableCell>

                    {user.CASH !== null
                      ? `${formatNumber(
                        user.CASH,
                        2
                      )} $`
                      : '-'}

                  </TableCell>


                  {/* DCALL */}

                  <TableCell
                    sx={{
                      color:
                        valueColor(
                          user.DCALL
                        ),
                    }}
                  >

                    {user.DCALL !== null
                      ? `${formatNumber(
                        user.DCALL
                      )} %`
                      : '-'}

                  </TableCell>


                  {/* DOCALL */}

                  <TableCell
                    sx={{
                      color:
                        valueColor(
                          user.DOCALL
                        ),
                    }}
                  >

                    {user.DOCALL !== null
                      ? `${formatNumber(
                        user.DOCALL
                      )} %`
                      : '-'}

                  </TableCell>


                  {/* CALL ASK/BID */}

                  <TableCell>

                    {user.caskbid !== null
                      ? `${formatNumber(
                        user.caskbid
                      )} %`
                      : '-'}

                  </TableCell>


                  {/* DPUT */}

                  <TableCell
                    sx={{
                      color:
                        valueColor(
                          user.DPUT
                        ),
                    }}
                  >

                    {user.DPUT !== null
                      ? `${formatNumber(
                        user.DPUT
                      )} %`
                      : '-'}

                  </TableCell>


                  {/* DOPUT */}

                  <TableCell
                    sx={{
                      color:
                        valueColor(
                          user.DOPUT
                        ),
                    }}
                  >

                    {user.DOPUT !== null
                      ? `${formatNumber(
                        user.DOPUT
                      )} %`
                      : '-'}

                  </TableCell>


                  {/* PUT ASK/BID */}

                  <TableCell>

                    {user.paskbid !== null
                      ? `${formatNumber(
                        user.paskbid
                      )} %`
                      : '-'}

                  </TableCell>


                  {/* LABEL */}

                  <TableCell
                    sx={{
                      color:
                        user.label > 0
                          ? 'error.main'
                          : 'success.main',
                    }}
                  >

                    {user.label ?? '-'}

                  </TableCell>


                  {/* RENT */}

                  <TableCell
                    sx={{
                      color:
                        valueColor(
                          user.RENT
                        ),
                      fontWeight: 600,
                    }}
                  >

                    {user.RENT !== null
                      ? `${formatNumber(
                        user.RENT
                      )} %`
                      : '-'}

                  </TableCell>


                  {/* MAX / PICO */}

                  <TableCell
                    sx={{
                      color:
                        valueColor(
                          user.PICO
                        ),
                    }}
                  >

                    {user.PICO !== null
                      ? `${formatNumber(
                        user.PICO
                      )} %`
                      : '-'}

                  </TableCell>


                  {/* CAIDA */}

                  <TableCell>

                    {user.CAIDA !== null
                      ? `${formatNumber(
                        user.CAIDA
                      )} %`
                      : '-'}

                  </TableCell>


                  {/* TIPO */}

                  <TableCell
                    sx={{
                      color:
                        user.tipo === 'U'
                          ? 'error.main'
                          : 'inherit',
                    }}
                  >

                    {user.tipo ?? '-'}

                  </TableCell>


                  {/* INFO */}

                  <TableCell>

                    <Button
                      variant="contained"
                      onClick={() =>
                        handleDrawerOpen(
                          user.userId
                        )
                      }
                      startIcon={
                        <InfoIcon />
                      }
                      sx={{
                        minWidth: 55,
                        width: 55,
                        height: 25,
                        padding: 0,
                        fontSize: '0.55rem',
                        borderRadius: 1,
                      }}
                    >
                      INFO
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </TableContainer>


        {/* ==================================================
            DRAWER
            ================================================== */}

        <Drawer
          anchor="right"
          open={Boolean(drawerData)}
          onClose={handleDrawerClose}
        >

          {drawerData && (

            <DrawerBox>

              {/* ==================================================
                  HEADER
                  ================================================== */}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                }}
              >

                <Typography variant="h6">
                  {drawerData.userId}
                </Typography>


                <IconButton
                  onClick={
                    handleDrawerClose
                  }
                  color="inherit"
                >

                  <CloseIcon />

                </IconButton>

              </Box>


              <Divider variant="middle" />


              <Typography variant="body2">

                Update at:{' '}
                {drawerData.date}{' '}
                {drawerData.time}

              </Typography>


              {/* ==================================================
                  WALLET
                  ================================================== */}

              <Divider textAlign="left">
                WALLET
              </Divider>


              {drawerData.CASHDATA && (

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                  }}
                >

                  <Box>
                    <Typography variant="body2">
                      Cash Inicial:
                    </Typography>
                    <Typography variant="body2">
                      AvailableFunds:
                    </Typography>

                    <Typography variant="body2">
                      NetLiquidation:
                    </Typography>

                    <Typography variant="body2">
                      SettledCash:
                    </Typography>



                    <Typography variant="body2">
                      TotalCashValue:
                    </Typography>

                  </Box>


                  <Box>
                    <Typography variant="body2">
                      {drawerData.cash_init}$
                    </Typography>
                    <Typography variant="body2">
                      {
                        drawerData.CASHDATA
                          .AvailableFunds
                      } $
                    </Typography>

                    <Typography variant="body2">
                      {
                        drawerData.CASHDATA
                          .NetLiquidation
                      } $
                    </Typography>

                    <Typography variant="body2">
                      {
                        drawerData.CASHDATA
                          .SettledCash
                      } $
                    </Typography>


                    <Typography variant="body2">
                      {
                        drawerData.CASHDATA
                          .TotalCashValue
                      } $
                    </Typography>

                  </Box>

                </Box>

              )}


              {/* ==================================================
                  STATUS
                  ================================================== */}

              <Divider textAlign="left">
                STATUS
              </Divider>


              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                }}
              >

                <Box>



                  <Typography variant="body2">
                    Contratos:
                  </Typography>

                  <Typography variant="body2">
                    Precio:
                  </Typography>

                </Box>


                <Box>


                  <Typography variant="body2">
                    {drawerData.CANTIDAD}
                  </Typography>

                  <Typography variant="body2">
                    {drawerData.PRICE}$
                  </Typography>

                </Box>

              </Box>


              {/* ==================================================
                  ETFs
                  ================================================== */}

              <Divider textAlign="left">
                ETFs
              </Divider>


              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                }}
              >

                <Box>

                  <Typography variant="body2">
                    QQQ:
                  </Typography>

                  <Typography variant="body2">
                    VIX:
                  </Typography>

                  <Typography variant="body2">
                    PERC.TICK:
                  </Typography>

                </Box>


                <Box>

                  <Typography variant="body2">
                    {drawerData.QQQ} $
                  </Typography>

                  <Typography variant="body2">
                    {drawerData.VIX}
                  </Typography>

                  <Typography variant="body2">
                    {drawerData.PERCTICK} %
                  </Typography>
                </Box>

              </Box>


              {/* ==================================================
                  OPTIONS
                  ================================================== */}

              <Divider textAlign="left">
                OPTIONS
              </Divider>



              <Typography variant="body2">
                EXP:{' '}
                {drawerData.exp}
              </Typography>


              <Divider />


              {/* ==================================================
                  CALL
                  ================================================== */}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  marginTop: 1,
                  marginBottom: 1,
                }}
              >

                <Box>

                  <Typography variant="body2">
                    Tipo: CALL
                  </Typography>

                  <Typography variant="body2">
                    Ask:{' '}
                    {drawerData.CASK}$
                  </Typography>

                  <Typography variant="body2">
                    Close Ant.:{' '}
                    {drawerData.callc ??
                      '-'} $
                  </Typography>



                </Box>


                <Box>

                  <Typography variant="body2">
                    Strike:{' '}
                    {drawerData.CSTRIKE}
                  </Typography>

                  <Typography variant="body2">
                    Bid:{' '}
                    {drawerData.CBID}$
                  </Typography>
                  <Typography variant="body2">
                    Open:{' '}
                    {drawerData.callo ??
                      '-'} $
                  </Typography>

                </Box>

              </Box>


              <Divider />


              {/* ==================================================
                  PUT
                  ================================================== */}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  marginTop: 1,
                  marginBottom: 1,
                }}
              >

                <Box>

                  <Typography variant="body2">
                    Tipo: PUT
                  </Typography>

                  <Typography variant="body2">
                    Ask:{' '}
                    {drawerData.PASK}$
                  </Typography>

                  <Typography variant="body2">
                    Close Ant.:{' '}
                    {drawerData.putc ??
                      '-'} $
                  </Typography>



                </Box>


                <Box>

                  <Typography variant="body2">
                    Strike:{' '}
                    {drawerData.PSTRIKE}
                  </Typography>

                  <Typography variant="body2">
                    Bid:{' '}
                    {drawerData.PBID}$
                  </Typography>

                  <Typography variant="body2">
                    Open:{' '}
                    {drawerData.puto ??
                      '-'} $
                  </Typography>

                </Box>

              </Box>


              {/* ==================================================
                  TRADES
                  ================================================== */}

              <Divider textAlign="left">
                TRADES
              </Divider>


              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                }}
              >

                <Box>

                  <Typography variant="body2">
                    Numero de Trades:
                  </Typography>
                  <Typography variant="body2">
                    Racha:
                  </Typography>




                </Box>


                <Box>

                  <Typography variant="body2">
                    {drawerData.n_trades}
                  </Typography>
                  <Typography variant="body2">
                    {drawerData.racha}
                  </Typography>


                </Box>


              </Box>


              {/* ==================================================
                  DOWNLOAD
                  ================================================== */}

              {/* <Divider
                sx={{
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />


              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexDirection: 'column',
                }}
              >

                <Button
                  variant="outlined"
                  onClick={() =>
                    handleDownload(
                      drawerData.downloadUrl,
                      'transactions',
                      `${drawerData.userId}_transactions.csv`
                    )
                  }
                >
                  Descargar Transactions
                </Button>


                <Button
                  variant="outlined"
                  onClick={() =>
                    handleDownload(
                      drawerData.downloadUrl,
                      'daytrade',
                      `${drawerData.userId}_hoy.csv`
                    )
                  }
                >
                  Descargar DayTrade
                </Button>

              </Box> */}

            </DrawerBox>

          )}

        </Drawer>

      </Container>

    </ThemeProvider>

  );
}


export default App;