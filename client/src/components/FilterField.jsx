import React, { useState } from 'react';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;


export default function FilterField(props) {
  const { name, options, setFilter, filter } = props;
  const [lastSelections, setLastSelections] = useState([]);
  //determine what is the biggest string in the options array
  const optionsMaxLength = options.reduce((max, option) => option.length > max ? option.length : max, 0);
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: optionsMaxLength * 20,
      },
    },
  };
  const handleChange = (event) => {
    const {
      target: { value: newValue },
    } = event;

    // Convert newValue to an array if it's a string
    const newSelections = typeof newValue === 'string' ? newValue.split(',') : newValue;
    setFilter((oldValues) => ({
      ...oldValues,
      [name]: {
        closed: false,
        data: newSelections,
      },
    }));
  };

  const handleClose = () => {
    const currentSelections = filter[name].data || [];
    const addedItems = currentSelections.filter(item => !lastSelections.includes(item)).length;
    const removedItems = lastSelections.filter(item => !currentSelections.includes(item)).length;

    if (addedItems > 0) {
      enqueueSnackbar(`Added ${addedItems} ${name} filter(s)`, { variant: 'success' });
    }
    else if (removedItems > 0) {
      enqueueSnackbar(`Removed ${removedItems} ${name} filter(s)`, { variant: 'warning' });
    }
    setLastSelections(currentSelections);
    setFilter((oldValues) => ({
      ...oldValues,
      [name]: {
        closed: true,
        data: currentSelections,
      },
    }));
  };

  const handleOpen = () => {
    setLastSelections(filter[name].data || []);
  };

  return (
    <div>
      <FormControl sx={{ width: 135 }}>
        <InputLabel size='small' id="demo-multiple-checkbox-label">{name}</InputLabel>
        <Select
          size='small'
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={filter[name].data || []}
          onChange={handleChange}
          onOpen={handleOpen}
          onClose={handleClose}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={filter[name].data.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
