import React, { useState, useEffect, useMemo } from 'react';
import { AppBar, Toolbar, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Drawer, Box, Divider, CssBaseline, ThemeProvider, createTheme, TextField, IconButton, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import './App.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import InfoIcon from '@mui/icons-material/Info';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloseIcon from '@mui/icons-material/Close';
import logo from './logo.jpeg';
const DrawerBox = styled(Box)({
  width: '300px',
  padding: '20px',
});

const AppBarStyled = styled(AppBar)({
  marginBottom: '20px',
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#424242',
    },
  },
});

function App() {
  const [userData, setUserData] = useState([]);
  const [newYorkDateTime, setNewYorkDateTime] = useState('');
  const [drawerData, setDrawerData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const options = {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour12: false,
      };
      const newYorkTime = new Intl.DateTimeFormat('en-US', options).format(date);
      setNewYorkDateTime(newYorkTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const urls = [
 { url: 'http://35.212.31.6:8000', userId: "Augusto Vidaurre" ,etf:"QQQ" },
        { url: 'http://35.212.13.140:8000', userId: "Gerardo Yupari" ,etf:"QQQ" },
        { url: 'http://35.212.46.199:8000', userId: "Giancarlo Marchesi" ,etf:"QQQ" },
        { url: 'http://35.212.7.60:8000', userId: "Guillermo Berastain" ,etf:"QQQ" },
        { url: 'http://35.212.53.107:8000', userId: "Javier Briceño" ,etf:"QQQ" },
        { url: 'http://35.212.108.83:8000', userId: "Juan Carlos Mandujano" ,etf:"QQQ" },
        { url: 'http://35.212.44.4:8000', userId: "Orlando Marchesi" ,etf:"QQQ" } ,

        { url: 'http://35.212.72.211:8000', userId: "Andres Sotomayor" ,etf:"QQQ" }
      ];
      urls.sort((a, b) => {
        if (a.userId < b.userId) {
            return -1; // a va antes que b
        }
        if (a.userId > b.userId) {
            return 1; // b va antes que a
        }
        return 0; // son iguales
    });
    urls.sort((a, b) => {
      if (a.etf < b.etf) {
          return -1; // a va antes que b
      }
      if (a.etf > b.etf) {
          return 1; // b va antes que a
      }
      return 0; // son iguales
  });
      const dataPromises = urls.map(({ url, userId, downloadUrl }) => fetchUserData(url, userId ));
      const userData = await Promise.all(dataPromises);
      setUserData(userData.map(user => ({ ...user, expanded: true })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchUserData = async (url, userId, downloadUrl) => {
    try {
      const response = await fetch(url+"/get-data");
      const jsonData = await response.json();

      let STATUS;
      let bid=1;
      let mv ;
      

      let time = jsonData.time.split(':').slice(0, 3).join(':').replace(/\.?[0-9]*$/, '') 
    
       
    // Obtener la hora actual de Nueva York
    const options = {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    
    const newYorkTime = new Intl.DateTimeFormat('en-US', options).format(new Date());
    
    // Formatear time y newYorkTime a un formato comparable
    const [timeHours, timeMinutes, timeSeconds] = time.split(':').map(Number);
    const [nyHours, nyMinutes, nySeconds] = newYorkTime.split(':').map(Number);
    
    // Convertir ambas horas a segundos desde la medianoche
    const totalSecondsTime = timeHours * 3600 + timeMinutes * 60 + timeSeconds;
    const totalSecondsNY = nyHours * 3600 + nyMinutes * 60 + nySeconds;


 
     
      if (( jsonData.quantity)==0){
        mv=0
      }else{
        mv=( jsonData.quantity)*100*bid
      }
      return {
        userId: jsonData.name,
        date: jsonData.date,
        time:time,
        CASH: jsonData.wallet.TotalCashValue	,
        DCALL: (jsonData.dcall* 100).toFixed(2),
        DPUT: (jsonData.dput * 100).toFixed(2),
        DOCALL: (jsonData.docall* 100).toFixed(2),
        DOPUT: (jsonData.doput * 100).toFixed(2),
        RENT: (jsonData.rentabilidad * 100).toFixed(2),
        DCALLNumber: 0,
        STATUS: jsonData.status,
        CASHDATA: jsonData.wallet,
        CANTIDAD: jsonData.quantity,
        OPCALL: jsonData.call_option,
        OPPUT: jsonData.put_option,
 
        PRICE: jsonData.priceBuy,
 

        QQQ: jsonData.price ,
 
        DIFSTRIKE: 1,

        exchange: jsonData.exchange,
        callo : jsonData.call_open,
        callc: jsonData.call_close,
        puto : jsonData.put_open,
        putc: jsonData.put_close,
        caskbid :( jsonData.askbid_call * 100).toFixed(2),
        paskbid: (jsonData.askbid_put * 100).toFixed(2),
        exp:jsonData.exp,
        
        MV: mv,
        PICO: (jsonData.pico * 100).toFixed(2),
        CAIDA: (jsonData.caida * 100).toFixed(2),
        downloadUrl: url ,
        TRADES : jsonData.trades,
        label: jsonData.label,
        tipo:jsonData.tipo
      };
    } catch (error) {
      console.error(`Error fetching data for user ${userId}:`, error);
      return {
        userId: userId,
        date: '-',
        time: '-',
        CASH: '-',
        DCALL: '-',
        DPUT: '-',
        DOCALL:'-',
        DOPUT: '-',
        RENT: '-',
        STATUS: "-",
        CASHDATA: '-',
        CANTIDAD: "-",
        OPCALL: "-",
        OPPUT: "-",
        DIFSTRIKE: "-",
        LASTCALL: "-",
        LASTPUT: "-",
        SPY: "-",
        QQQ: "-",
        VIX: "-",
        D1: "-",
        D2: "-",
        INDICE: "-",
        LABEL: "-",
        PREDICT: "-",
        PRICE: "-",
        MV: "-",
        PICO: "-",
        downloadUrl: "-",
        TRADES : "-" ,

        exchange: "-",
        callo : "-" ,
        callc: "-",
        puto : "-" ,
        putc: "-" ,
        caskbid : "-" ,
        paskbid: "-" ,
        exp: "-" ,
        tipo: "-" ,
        CAIDA: "-" ,
         label: "-" ,
     
       
      };
    }
  };

  const handleDrawerOpen = (user) => {
    setDrawerData(user);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setDrawerData(null);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return userData;
    return userData.filter(user =>
      user.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userData, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const downloadCSV = (data, filename) => {
    const csvRows = [];
  
    // Obtener los encabezados del CSV de las claves del objeto
    const headers = Object.keys(data);
    csvRows.push(headers.join(','));
  
    // Obtener el número de filas a partir del tamaño de cualquier lista en el objeto
    const numRows = data[headers[0]].length;
  
    // Iterar a través de las filas y agregar valores al CSV
    for (let i = 0; i < numRows; i++) {
      const row = headers.map(header => data[header][i]);
      csvRows.push(row.join(','));
    }
  
    // Unir todas las filas con un salto de línea
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const downloadCSV_historical = (data, filename) => {
    const csvRows = [];
  
    // Obtener los encabezados del CSV de las claves del objeto
    const headers = Object.keys(data);
    csvRows.push(headers.join(','));
  
    // Obtener el número de filas a partir del tamaño de cualquier lista en el objeto
    const numRows = data[headers[0]].length;
  
    // Iterar a través de las filas y agregar valores al CSV
    for (let i = 0; i < numRows; i++) {
      const row = headers.map(header => data[header][i]);
      csvRows.push(row.join(','));
    }
  
    // Unir todas las filas con un salto de línea
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownload = async (url, userId) => {
    try {
   
      const response = await fetch(url+"/transactions");
      const jsonData = await response.json();
       
      downloadCSV(jsonData, `${userId}_transactions.csv`);
    } catch (error) {
      console.error(`Error downloading transactions for user ${userId}:`, error);
    }
  };
  const handleDownload_historical = async (url, userId) => {
    try {
   
      const response = await fetch(url+"/daytrade");
      const jsonData = await response.json();
       
      downloadCSV_historical(jsonData, `${userId}_hoy.csv`);
    } catch (error) {
      console.error(`Error downloading transactions for user ${userId}:`, error);
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
      <AppBarStyled position="static">
      <Toolbar>
        <Box component="img" src={logo} alt="Logo" sx={{ height: 40, marginRight: '20px' }} />
        <Typography variant="h6" component="div" sx={{ marginRight: '20px' }}>
         
        </Typography>
        <Typography variant="subtitle1" sx={{ marginLeft: 'auto', marginRight: '10px' }}>
          Hora de Nueva York: {newYorkDateTime}
        </Typography>
      </Toolbar>
    </AppBarStyled>
        <Container>
          {/* <TextField
            label="Buscar usuario"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ backgroundColor: '#fff', marginBottom: '20px' }} // Añadido margen inferior
          /> */}
          <TableContainer component={Paper} sx={{ marginBottom: '20%' }}>
            <Table aria-label="UserData table">
              <TableHead>
                <TableRow>
                  <TableCell  sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
    borderRight: '1px solid #ccc', // Línea en el lado derecho
    padding: '8px' // Ajusta el espacio si es necesario
  }}  align="center" >USER</TableCell>
                  <TableCell align="center"
                  sx={{
                    fontSize: '0.9rem', // Tamaño del texto más pequeño
                     padding: '8px' // Ajusta el espacio si es necesario
                  }}>TIME</TableCell>
                  <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
     padding: '8px' // Ajusta el espacio si es necesario
  }}>STATUS</TableCell>
                  <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
    borderRight: '1px solid #ccc',
     padding: '8px' // Ajusta el espacio si es necesario
  }}>CASH</TableCell>
                   <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
     padding: '8px' // Ajusta el espacio si es necesario
  }}>DCALL</TableCell>
                  <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
     padding: '8px' // Ajusta el espacio si es necesario
  }}>DOCALL</TableCell>
  <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
    borderRight: '1px solid #ccc',
     padding: '8px' // Ajusta el espacio si es necesario
  }}>ASK/BID</TableCell>
                  <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
     padding: '8px' // Ajusta el espacio si es necesario
  }}>DPUT</TableCell>
                  <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
     padding: '8px' // Ajusta el espacio si es necesario
  }}>DOPUT</TableCell>
   <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
    borderRight: '1px solid #ccc',
     padding: '8px' // Ajusta el espacio si es necesario
  }}>ASK/BID</TableCell>
                  <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
     padding: '8px' // Ajusta el espacio si es necesario
  }}>LABEL</TableCell>
                  <TableCell align="center" sx={{


     fontSize: '0.9rem', // Tamaño del texto más pequeño
     padding: '8px' // Ajusta el espacio si es necesario
  }}>RENT</TableCell>

             <TableCell align="center" sx={{


     fontSize: '0.9rem', // Tamaño del texto más pequeño
     padding: '8px' // Ajusta el espacio si es necesario
  }}>MAX</TableCell>


  <TableCell align="center" sx={{


fontSize: '0.9rem', // Tamaño del texto más pequeño
padding: '8px' // Ajusta el espacio si es necesario
}}>CAIDA</TableCell>
  <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
    borderRight: '1px solid #ccc',
     padding: '8px' // Ajusta el espacio si es necesario
  }}>TIPO</TableCell>
                  
                  <TableCell align="center" sx={{
    fontSize: '0.9rem', // Tamaño del texto más pequeño
    
     padding: '8px' // Ajusta el espacio si es necesario
  }}>ACT.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell align="center"  sx={{
    fontSize: '0.7rem', // Tamaño del texto más pequeño
    borderRight: '1px solid #ccc', // Línea en el lado derecho
    padding: '8px' // Ajusta el espacio si es necesario
  }}>{user.userId}</TableCell>
                    <TableCell align="center" sx={{
    fontSize: '0.7rem', // Tamaño del texto más pequeño
 
    padding: '8px' // Ajusta el espacio si es necesario
  }}>{user.time}</TableCell>
                    <TableCell align="center" sx={{
    fontSize: '0.7rem', // Tamaño del texto más pequeño
    // Línea en el lado derecho
    padding: '8px' // Ajusta el espacio si es necesario
  }}>{user.STATUS}</TableCell>
                    <TableCell align="center"
                    sx={{
                      fontSize: '0.7rem', // Tamaño del texto más pequeño
                      borderRight: '1px solid #ccc', // Línea en el lado derecho
                      padding: '8px' // Ajusta el espacio si es necesario
                    }}>{user.CASH} $</TableCell>
                    {/* <TableCell align="center">{user.MV} $</TableCell> */}

                    <TableCell align="center" sx={{
    fontSize: '0.7rem', // Tamaño del texto más pequeño
      // Línea en el lado derecho
    padding: '8px' // Ajusta el espacio si es necesario
  }} style={{ color: user.DCALL >= 0 ? 'green' : 'red' }}>{user.DCALL} %</TableCell>
                    <TableCell align="center"  sx={{
    fontSize: '0.7rem', // Tamaño del texto más pequeño
     // Línea en el lado derecho
    padding: '8px' // Ajusta el espacio si es necesario
  }}style={{ color: user.DOCALL >= 0 ? 'green' : 'red' }}>{user.DOCALL} %</TableCell>
                    <TableCell align="center"   
                    sx={{
                      fontSize: '0.7rem', // Tamaño del texto más pequeño
                      borderRight: '1px solid #ccc', // Línea en el lado derecho
                      padding: '8px' // Ajusta el espacio si es necesario
                    }}>{user.caskbid} %</TableCell>

                    <TableCell align="center"  sx={{
    fontSize: '0.7rem', // Tamaño del texto más pequeño
     // Línea en el lado derecho
    padding: '8px' // Ajusta el espacio si es necesario
  }} style={{ color: user.DPUT >= 0 ? 'green' : 'red' }}>{user.DPUT} %</TableCell>
                    <TableCell align="center"  sx={{
    fontSize: '0.7rem', // Tamaño del texto más pequeño
      // Línea en el lado derecho
    padding: '8px' // Ajusta el espacio si es necesario
  }} style={{ color: user.DOPUT >= 0 ? 'green' : 'red' }}>{user.DOPUT} %</TableCell>
                    <TableCell align="center"  
                    sx={{
                      fontSize: '0.7rem', // Tamaño del texto más pequeño
                      borderRight: '1px solid #ccc', // Línea en el lado derecho
                      padding: '8px' // Ajusta el espacio si es necesario
                    }}  >{user.paskbid} %</TableCell>
                    <TableCell align="center" sx={{
    fontSize: '0.7rem', // Tamaño del texto más pequeño
   // Línea en el lado derecho
    padding: '8px' // Ajusta el espacio si es necesario
  }} style={{ color: user.label > 0 ? 'red' : 'green' }}>{user.label}</TableCell>


                    <TableCell align="center"  
                     sx={{
                      fontSize: '0.7rem', // Tamaño del texto más pequeño
                   
                      padding: '8px' // Ajusta el espacio si es necesario
                    }}style={{ color: user.RENT >= 0 ? 'green' : 'red' }}>{user.RENT} %</TableCell>
                   
<TableCell align="center"  
                     sx={{
                      fontSize: '0.7rem', // Tamaño del texto más pequeño
                   
                      padding: '8px' // Ajusta el espacio si es necesario
                    }}style={{ color: user.PICO >= 0 ? 'green' : 'red' }}>{user.PICO} %</TableCell>



                   <TableCell align="center"  
                     sx={{
                      fontSize: '0.7rem', // Tamaño del texto más pequeño
                   
                      padding: '8px' // Ajusta el espacio si es necesario
                    }} >{user.CAIDA} %</TableCell>

                   <TableCell align="center"  
                     sx={{
                      fontSize: '0.7rem', // Tamaño del texto más pequeño
                      borderRight: '1px solid #ccc', // Línea en el lado derecho
                      padding: '8px' // Ajusta el espacio si es necesario
                    }}style={{ color: user.tipo == "U" ? 'red' : 'black' }}>{user.tipo}</TableCell>
                    <TableCell align="center">
                    <Button
                        variant="contained"
                        onClick={() => handleDrawerOpen(user)}
                        startIcon={<InfoIcon />}   sx={{
                          width: 7, // Ancho del botón
                          height: 25, // Alto del botón (igual que el ancho para hacerlo cuadrado)
                          borderRadius: 2, // Opcional: para que no tenga bordes redondeados
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >INFO</Button>
    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
            {drawerData && (
              <DrawerBox>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{drawerData.userId}</Typography>
                  <IconButton onClick={handleDrawerClose} color="inherit">
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider variant="middle" />
                <Typography variant="body2">Update at: {drawerData.date} {drawerData.time}</Typography>
                <Divider textAlign="left">WALLET</Divider>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2">AvailableFunds: </Typography>
                    <Typography variant="body2">NetLiquidation: </Typography>
                    <Typography variant="body2">SettledCash: </Typography>
                    <Typography variant="body2">UnrealizedPnL: </Typography>
                    <Typography variant="body2">TotalCashValue: </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2"> {drawerData.CASHDATA.AvailableFunds} $</Typography>
                    <Typography variant="body2"> {drawerData.CASHDATA.NetLiquidation} $</Typography>
                    <Typography variant="body2"> {drawerData.CASHDATA.SettledCash} $</Typography>
                    <Typography variant="body2"> {drawerData.CASHDATA.UnrealizedPnL} $</Typography>
                    <Typography variant="body2"> {drawerData.CASHDATA.TotalCashValue} $</Typography>
                  </Box>
                </Box>
                <Divider textAlign="left">STATUS</Divider>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2">Estado: </Typography>
                    <Typography variant="body2">Contratos:</Typography>
                    <Typography variant="body2">Precio:</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">{drawerData.STATUS}</Typography>
                    <Typography variant="body2">{drawerData.CANTIDAD}</Typography>
                    <Typography variant="body2">{drawerData.PRICE}$</Typography>
                  </Box>
                </Box>
             

                <Divider textAlign="left">ETFs</Divider>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    {/* <Typography variant="body2">SPY:  </Typography> */}
                    <Typography variant="body2">QQQ: </Typography>
                    <Typography variant="body2">VIX: </Typography>
                  </Box>
                  <Box>
                    {/* <Typography variant="body2">{drawerData.SPY} $</Typography> */}
                    <Typography variant="body2">{drawerData.QQQ} $</Typography>
                    <Typography variant="body2">{drawerData.VIX}</Typography>
                  </Box>
                </Box>
                <Divider textAlign="left">OPTIONS</Divider>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  
                  <Box>
                  <Typography variant="body2">Exchange: {drawerData.exchange}</Typography>
                  <Typography variant="body2">EXP: {drawerData.exp}</Typography>
        
                  </Box>
                
                  
                </Box>
                <Divider/ > 
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  
                  <Box>
                  <Typography variant="body2">Tipo : CALL</Typography>
                    <Typography variant="body2">Ask: {drawerData.OPCALL.ask}$</Typography>
                    <Typography variant="body2">Close Ant.: {drawerData.callc} $</Typography>
                 
                  </Box>
                  <Box>
                  <Typography variant="body2">Strike: {drawerData.OPCALL.strike}</Typography>
                  <Typography variant="body2">Bid: {drawerData.OPCALL.bid} $</Typography>

                    
                    <Typography variant="body2">Open: {drawerData.callo} $</Typography>
                  </Box>  
                  
                </Box>
                <Divider/ > 
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  
                <Box>
                {/* <Typography variant="body2">Exchange : {drawerData.exchange}</Typography> */}
                  <Typography variant="body2">Tipo : PUT</Typography>
                    <Typography variant="body2">Ask: {drawerData.OPPUT.ask}$</Typography>
                    <Typography variant="body2">Close Ant.: {drawerData.putc} $</Typography>
                    
 
                  </Box>
                  <Box>
                  <Typography variant="body2">Strike: {drawerData.OPPUT.strike}</Typography>
                  <Typography variant="body2">Bid: {drawerData.OPPUT.bid} $</Typography>

                    <Typography variant="body2">Open: {drawerData.puto} $</Typography>
                  </Box>
                  
                </Box>

                <Divider textAlign="left">TRADES</Divider>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  
                  <Box>
            
                    <Typography variant="body2">Numero de Trades : </Typography>
                    <Typography variant="body2"> Dias Restantes : </Typography>
                  </Box>
                  <Box>
                  <Typography variant="body2">{drawerData.TRADES.length }</Typography>
                  <Typography variant="body2">{drawerData.TRADES.map((trade, index) => (
                    <span key={index}>
                        {trade}
                        {index < drawerData.TRADES.length - 1 && ', '} {/* Añade una coma entre elementos */}
                    </span>
                ))}</Typography>
           
                  </Box>  
                  
                </Box>
              </DrawerBox>
            )}
          </Drawer>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;