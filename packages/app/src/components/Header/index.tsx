import { exportState, getAccessibleData } from '@visdesignlab/upset2-react';
import { getRows } from '@visdesignlab/upset2-core';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { AccountCircle, ErrorOutline } from '@mui/icons-material';
import { AppBar, Box, Button, ButtonGroup, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { useRecoilValue, useRecoilState } from 'recoil';
import React, { useContext, useState } from 'react';
import { getMultinetDataUrl, oAuth } from '../../atoms/authAtoms';
import { queryParamAtom } from '../../atoms/queryParamAtom';
import { provenanceVisAtom } from '../../atoms/provenanceVisAtom';
import { elementSidebarAtom } from '../../atoms/elementSidebarAtom';
import { ProvenanceContext } from '../Root';
import { ImportModal } from '../ImportModal';
import { AttributeDropdown } from '../AttributeDropdown';
import { importErrorAtom } from '../../atoms/importErrorAtom';
import { Link } from 'react-router-dom';

const Header = ({ data }: { data: any }) => {
  const { workspace } = useRecoilValue(queryParamAtom);
  const [ isProvVisOpen, setIsProvVisOpen ] = useRecoilState(provenanceVisAtom);
  const [ isElementSidebarOpen, setIsElementSidebarOpen ] = useRecoilState(elementSidebarAtom);
  const importError = useRecoilValue(importErrorAtom);
  
  const { provenance, isAtRoot, isAtLatest } = useContext(ProvenanceContext);
  
  const [ attributeDialog, setAttributeDialog ] = useState(false);
  const [ showImportModal, setShowImportModal ] = useState(false);
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  
  const visibleSets = provenance.getState().visibleSets;
  const hiddenSets = provenance.getState().allSets.filter((set: string) => !visibleSets.includes(set));

  const handleImportModalClose = () => {
    setShowImportModal(false);
  }

  const handleMenuClick = (event: React.MouseEvent<any>) => {
    handleMenuOpen(event.currentTarget);
  };
  const handleMenuKeypress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleMenuOpen(event.currentTarget);
    }
  };
  const handleMenuOpen = (target: EventTarget) => {
    setAnchorEl(target as HTMLElement);
    setIsMenuOpen(true);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };
  const handleAttributeClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
    setAttributeDialog(true);
  }
  const handleAttributeClose = () => {
    setAnchorEl(null);
    setAttributeDialog(false);
  }

  const dispatchState = () => {
    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('rows', JSON.stringify(getAccessibleData(getRows(data, provenance.getState()))));
    localStorage.setItem('visibleSets', JSON.stringify(visibleSets));
    localStorage.setItem('hiddenSets', JSON.stringify(hiddenSets));
  };
  
  return (
    <AppBar sx={{position:"static", boxShadow:"none"}}>
      <Toolbar variant="dense" sx={{ 
        width: '98vw',                     
        backgroundColor: "#e0e0e0",
        color: "rgba(0, 0, 0, 0.87)",
        justifyContent: "space-between",
      }}>
        <Box sx={{display: 'flex', flexGrow: '1', justifyContent: 'start', alignItems: 'center', margin: 0, padding: 0}}>
          <img className="logo" id="multinet-logo" src="https://raw.githubusercontent.com/multinet-app/multinet-components/main/src/assets/multinet_logo.svg" alt="Multinet Logo"/>
          <Typography variant="h6" noWrap component="div" sx={{ marginRight: '5px', lineHeight: '1.5', fontWeight: 'normal' }}>
            Upset - Visualizing Intersecting Sets
          </Typography>
          <ButtonGroup>
            <IconButton color="inherit" onClick={() => provenance.undo()} disabled={isAtRoot}>
              <UndoIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => provenance.redo()} disabled={isAtLatest}>
              <RedoIcon />
            </IconButton>
          </ButtonGroup>
        </Box>
        <Box sx={{display:'flex', alignItems: 'center', margin: 0, padding: 0}}>
          {data !== null &&
            <Button
              color="inherit"
            >
              <Link to="/datatable" target="_blank" onClick={dispatchState} style={{textDecoration: "none", color: "inherit"}}>Data Table</Link>
              <OpenInNewIcon sx={{height: "14px", opacity: 0.8}}></OpenInNewIcon>
            </Button>
          }
          <Button
            color="inherit"
            onClick={(e) => { handleAttributeClick(e) }}
          >
            Attributes
          </Button>
          {attributeDialog &&
            <AttributeDropdown anchorEl={anchorEl as HTMLElement} close={handleAttributeClose}></AttributeDropdown>
          }
          <Button onClick={() => {
            if (isProvVisOpen) {
              setIsProvVisOpen(false);
            }

            if (isElementSidebarOpen) {
              setIsElementSidebarOpen(false);
            } else {
              setIsElementSidebarOpen(true);
            }

            handleMenuClose();
          }}>
            Element View
          </Button>
          {importError &&
            <Tooltip title={"The imported state is missing fields. Default values have been used."} arrow={true}>
              <ErrorOutline color="error" sx={{ mr: "10px" }} />
            </Tooltip> 
          }
          <Button
            color="inherit"
            onClick={() => {
              if (window) {
                window.location.href = getMultinetDataUrl(workspace);
              }
            }}
          >
            Load Data
          </Button>
          <Button sx={{ minWidth: "24px" }} onKeyDown={(e) => handleMenuKeypress(e)} ><MoreVertIcon onClick={(e) => handleMenuClick(e)}></MoreVertIcon></Button>
            <Menu open={isMenuOpen} onClose={handleMenuClose} anchorEl={anchorEl}>
              <MenuItem onClick={() => setShowImportModal(true) } color="inherit">
                Import State
              </MenuItem>
              <MenuItem onClick={() => exportState(provenance)} color="inherit">
                Export State
              </MenuItem>
              <MenuItem onClick={() => exportState(provenance, data, getRows(data, provenance.getState()))}>
                Export State + Data
              </MenuItem>
              <MenuItem onClick={() => {
                  if (isElementSidebarOpen) {
                    setIsElementSidebarOpen(false);
                  }
                  setIsProvVisOpen(true); 
                  handleMenuClose();
                }}>
                  Show History
              </MenuItem>
            </Menu>
          <Button
            color="inherit"
            sx={{ minWidth: "24px" }}
            onClick={() => {
              oAuth.logout();
              if (window) {
                window.location.href = getMultinetDataUrl(workspace);
              }
            }}
          >
            <AccountCircle color="inherit"></AccountCircle>
          </Button>
        </Box>
        <ImportModal open={showImportModal} close={handleImportModalClose} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
