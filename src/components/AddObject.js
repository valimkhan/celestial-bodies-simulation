import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SketchPicker } from 'react-color';

const AddObject = ({ objectProps, setObjectProps, addObject }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setObjectProps((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePositionChange = (axis, value) => {
    setObjectProps((prev) => ({
      ...prev,
      position: { ...prev.position, [axis]: parseFloat(value) },
    }));
  };

  const handleVelocityChange = (axis, value) => {
    setObjectProps((prev) => ({
      ...prev,
      velocity: { ...prev.velocity, [axis]: parseFloat(value) },
    }));
  };

  return (
    <Accordion style={{ position: 'fixed', left: 20, top: 20, zIndex: 1000, width: 300 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Add Object</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <TextField
            label="Object Name"
            value={objectProps.name}
            onChange={(e) => setObjectProps({ ...objectProps, name: e.target.value })}
            sx={{ mb: 2 }}
            fullWidth
          />

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <RadioGroup
              row
              value={objectProps.type}
              onChange={(e) => setObjectProps({ ...objectProps, type: e.target.value })}
            >
              <FormControlLabel value="planet" control={<Radio />} label="Planet" />
              <FormControlLabel value="star" control={<Radio />} label="Star" />
            </RadioGroup>
          </FormControl>

          <Typography variant="body1" sx={{ mb: 1 }}>Select Color:</Typography>
          <SketchPicker
            color={objectProps.color}
            onChangeComplete={(color) => setObjectProps({ ...objectProps, color: color.hex })}
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" sx={{ mb: 1 }}>Radius:</Typography>
          <Slider
            value={objectProps.radius}
            min={0.5}
            max={5}
            step={0.1}
            onChange={(e, val) => setObjectProps({ ...objectProps, radius: val })}
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" sx={{ mb: 1 }}>Mass:</Typography>
          <TextField
            type="number"
            value={objectProps.mass}
            onChange={(e) => setObjectProps({ ...objectProps, mass: parseFloat(e.target.value) })}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" sx={{ mb: 1 }}>Position:</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="X"
              type="number"
              value={objectProps.position.x}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              sx={{ width: '33%' }}
            />
            <TextField
              label="Y"
              type="number"
              value={objectProps.position.y}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              sx={{ width: '33%' }}
            />
            <TextField
              label="Z"
              type="number"
              value={objectProps.position.z}
              onChange={(e) => handlePositionChange('z', e.target.value)}
              sx={{ width: '33%' }}
            />
          </Box>

          <Typography variant="body1" sx={{ mb: 1 }}>Velocity:</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Vx"
              type="number"
              value={objectProps.velocity.vx}
              onChange={(e) => handleVelocityChange('vx', e.target.value)}
              sx={{ width: '33%' }}
            />
            <TextField
              label="Vy"
              type="number"
              value={objectProps.velocity.vy}
              onChange={(e) => handleVelocityChange('vy', e.target.value)}
              sx={{ width: '33%' }}
            />
            <TextField
              label="Vz"
              type="number"
              value={objectProps.velocity.vz}
              onChange={(e) => handleVelocityChange('vz', e.target.value)}
              sx={{ width: '33%' }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={addObject}
            sx={{ mt: 2 }}
          >
            Add {objectProps.type}
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AddObject;
