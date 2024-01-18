import * as React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import SearchField from './SearchField';
import FilterField from './FilterField';

export default function SearchAppBar(props) {
  const { options, filter, setFilter ,setSearch } = props;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Log-System
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 2,
              gap: 2,
            }}>
              <SearchField setSearch={setSearch}/>
              <FilterField name='Machine' options={options.Machine} setFilter={setFilter} filter={filter} />
              <FilterField name='Domain' options={options.Domain} setFilter={setFilter} filter={filter} />
              <FilterField name='ErrorCode' options={options.ErrorCode} setFilter={setFilter} filter={filter} />
              <FilterField name='LogType' options={options.LogType} setFilter={setFilter} filter={filter} />
              <FilterField name='LogLevel' options={options.LogLevel} setFilter={setFilter} filter={filter} />
              <FilterField name='ObjectType' options={options.ObjectType} setFilter={setFilter} filter={filter} />
            </Box>
          </Box>
        </Toolbar>

      </AppBar>
    </Box>
  );
}