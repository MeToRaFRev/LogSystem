import React from 'react'
import { Box,TextField } from '@mui/material'
function LogViewer(props) {
    const {logs,filter} = props
    // console.log({logs,selected})
  return (
    <Box sx={{
        display:'flex',
        height:'100%',
        padding:2,
        mt:1
      }}>
        <TextField multiline 
        inputProps={{readOnly:true,style:{fontSize:12}}} 
        maxRows={20}
        value={logs.join('\n')}
        sx={{
            width:'100%',
            height:'100%',
        }}/>
      </Box>
  )
}

export default LogViewer