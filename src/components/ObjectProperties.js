import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  List,
  ListItem,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SketchPicker } from 'react-color';

const ObjectProperties = ({ objects, updateObject, removeObject }) => {
  return (
    <Accordion style={{ position: 'fixed', right: 20, top: 20, zIndex: 1000, width: 350 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Celestial Bodies</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {objects.length === 0 ? (
          <Typography variant="body1">No objects added yet.</Typography>
        ) : (
          <List>
            {objects.map((obj, index) => (
              <Accordion key={index} style={{ marginBottom: '10px' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{`${obj.name || 'Unnamed Object'} - Type: ${obj.mesh.userData.type}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {/* Rename Object */}
                    <ListItem>
                      <TextField
                        label="Name"
                        value={obj.name}
                        onChange={(e) => updateObject(index, 'name', e.target.value)}
                        fullWidth
                      />
                    </ListItem>

                    {/* Update Color */}
                    <ListItem>
                      <Typography variant="body1">Color:</Typography>
                      <SketchPicker
                        color={obj.color}
                        onChangeComplete={(color) => updateObject(index, 'color', color.hex)}
                        style={{ marginLeft: '10px', width: '100px' }}
                      />
                    </ListItem>

                    {/* Update Radius */}
                    <ListItem>
                      <Typography variant="body1">Radius:</Typography>
                      <TextField
                        type="number"
                        value={obj.radius}
                        onChange={(e) => updateObject(index, 'radius', parseFloat(e.target.value))}
                        style={{ margin: '0 10px', width: '60px' }}
                      />
                    </ListItem>

                    {/* Update Mass */}
                    <ListItem>
                      <Typography variant="body1">Mass:</Typography>
                      <TextField
                        type="number"
                        value={obj.mass}
                        onChange={(e) => updateObject(index, 'mass', parseFloat(e.target.value))}
                        fullWidth
                      />
                    </ListItem>

                    {/* Update Position */}
                    <ListItem>
                      <Typography variant="body1">Position:</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          label="X"
                          type="number"
                          value={obj.mesh.position.x}
                          onChange={(e) => updateObject(index, 'positionX', parseFloat(e.target.value))}
                          sx={{ width: '33%' }}
                        />
                        <TextField
                          label="Y"
                          type="number"
                          value={obj.mesh.position.y}
                          onChange={(e) => updateObject(index, 'positionY', parseFloat(e.target.value))}
                          sx={{ width: '33%' }}
                        />
                        <TextField
                          label="Z"
                          type="number"
                          value={obj.mesh.position.z}
                          onChange={(e) => updateObject(index, 'positionZ', parseFloat(e.target.value))}
                          sx={{ width: '33%' }}
                        />
                      </Box>
                    </ListItem>

                    {/* Update Velocity */}
                    <ListItem>
                      <Typography variant="body1">Velocity:</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          label="Vx"
                          type="number"
                          value={obj.velocity.x}
                          onChange={(e) => updateObject(index, 'velocityX', parseFloat(e.target.value))}
                          sx={{ width: '33%' }}
                        />
                        <TextField
                          label="Vy"
                          type="number"
                          value={obj.velocity.y}
                          onChange={(e) => updateObject(index, 'velocityY', parseFloat(e.target.value))}
                          sx={{ width: '33%' }}
                        />
                        <TextField
                          label="Vz"
                          type="number"
                          value={obj.velocity.z}
                          onChange={(e) => updateObject(index, 'velocityZ', parseFloat(e.target.value))}
                          sx={{ width: '33%' }}
                        />
                      </Box>
                    </ListItem>

                    {/* Remove Object */}
                    <ListItem>
                      <Button variant="contained" color="secondary" onClick={() => removeObject(index)}>
                        Remove
                      </Button>
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ObjectProperties;
