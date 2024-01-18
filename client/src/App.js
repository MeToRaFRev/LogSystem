import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import SearchAppBar from './components/SearchAppBar';
import LogViewer from './components/LogViewer';


const theme = createTheme({
  palette: {
    mode: 'dark',
  }
});

export default function App() {
  const [options, setOptions] = useState({
    Machine: [],
    Domain: [],
    ErrorCode: [],
    LogType: [],
    LogLevel: [],
    ObjectType: [],
  });
  const [filter, setFilter] = useState({
    Machine: {
      closed: false,
      data: []
    },
    Domain: {
      closed: false,
      data: []
    },
    ErrorCode: {
      closed: false,
      data: []
    },
    LogType: {
      closed: false,
      data: []
    },
    LogLevel: {
      closed: false,
      data: []
    },
    ObjectType: {
      closed: false,
      data: []
    },
  });
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState([]);

  const [count, setCount] = useState(0);
  useEffect(() => {
    // Set up an interval that runs every 5 seconds
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1); // Increment the count
    }, 5000);

    // Clear the interval when the component is unmounted or re-rendered
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once after initial render



  const getLogs = async () => {
    const res = await fetch('/logs');
    const data = await res.json();
    let tempLogs = [];
    if (!data) return;
    for (let key in data) {
      for (let i = 0; i < data[key].length; i++) {
        let logLine = data[key][i];
        let logArray = logLine.split(" ");
        let dateTime = `${logArray[0]} W${logArray[1]} ${logArray[2]}`
        let machineIdentifier = logArray[3]
        let dpCustomTags = logArray[4].replace(/\[/g, '').replace(/\]/g, ',').slice(0, -1).split(',')
        let domain = dpCustomTags[0]
        let errorCode = dpCustomTags[1]
        let logType = dpCustomTags[2]

        let logLevel = dpCustomTags[3]
        let objectTags = logArray[5].replace(/\)/g, '').split('(')
        let objectType = objectTags[0]
        let objectName = objectTags[1]
        let transactionTags = logArray[6].replace(/\)/g, '').replace(/\]/g, '').replace(/\[/g, '(').split('(')
        let transactionId = transactionTags[1]
        let tranasctionDirection = transactionTags[2]
        let clientIp = transactionTags[3]
        let determineIfGuidExists = logArray[7].includes('gtid')
        let message = ''
        let gtid = ''
        if (determineIfGuidExists) {
          gtid = logArray[7].replace(/\)/g, '').replace(/\]/g, '').replace(/\[/g, '(').split('(')[1]
          message = logArray.splice(8, logArray.length).join(' ')
        } else {
          message = logArray.splice(7, logArray.length).join(' ')
        }
        setOptions((prev) => {
          let temp = { ...prev };
          if (!temp.Machine.includes(machineIdentifier)) temp.Machine.push(machineIdentifier);
          if (!temp.Domain.includes(domain)) temp.Domain.push(domain);
          if (!temp.ErrorCode.includes(errorCode)) temp.ErrorCode.push(errorCode);
          if (!temp.LogType.includes(logType)) temp.LogType.push(logType);
          if (!temp.LogLevel.includes(logLevel)) temp.LogLevel.push(logLevel);
          if (!temp.ObjectType.includes(objectType)) temp.ObjectType.push(objectType);
          return temp;
        }
        );

        if (filter.Machine.data.length > 0 && !filter.Machine.data.includes(machineIdentifier)) continue;
        if (filter.Domain.data.length > 0 && !filter.Domain.data.includes(domain)) continue;
        if (filter.ErrorCode.data.length > 0 && !filter.ErrorCode.data.includes(errorCode)) continue;
        if (filter.LogType.data.length > 0 && !filter.LogType.data.includes(logType)) continue;
        if (filter.LogLevel.data.length > 0 && !filter.LogLevel.data.includes(logLevel)) continue;
        if (filter.ObjectType.data.length > 0 && !filter.ObjectType.data.includes(objectType)) continue;
        if (search !== '' && !message.toLowerCase().includes(search.toLowerCase())) continue;
        console.log({
          dateTime,
          machineIdentifier,
          errorCode,
          logType,
          logLevel,
          objectType,
          objectName,
          transactionId,
          tranasctionDirection,
          clientIp,
          domain,
          gtid
        })
        const finalLog = `[${dateTime}]-(${transactionId}): ${message}`
        tempLogs.push(finalLog);
      }
    }
    setLogs(tempLogs);
  };

  useEffect(() => {
    getLogs();
  }, []);
  useEffect(() => {
    getLogs();
  }, [filter, search,count]);
  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider>
      <SearchAppBar options={options} filter={filter} setFilter={setFilter} setSearch={setSearch} />
      <LogViewer logs={logs} filter={filter} />
    </SnackbarProvider>
  </ThemeProvider>;
}
