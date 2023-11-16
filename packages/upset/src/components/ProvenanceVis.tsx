import { useContext, useState, useEffect } from 'react';
import { ProvVis } from '@trrack/vis-react';
import {
  Divider, Drawer, IconButton, Typography, css,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ProvenanceContext } from './Root';

type Props = {
  open: boolean,
  close: () => void
}

const initialDrawerWidth = 450;

export const ProvenanceVis = ({ open, close }: Props) => {
  const { provenance } = useContext(ProvenanceContext);
  const [currentNodeId, setCurrentNodeId] = useState(provenance.current.id);

  useEffect(() => {
    provenance.currentChange(() => setCurrentNodeId(provenance.current.id));
  }, [provenance]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      variant="persistent"
      sx={{
        width: (open) ? initialDrawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          marginTop: '2em',
          width: (open) ? initialDrawerWidth : 0,
          boxSizing: 'border-box',
          zIndex: 0,
        },
      }}
    >
      <div css={css`width:${initialDrawerWidth}`}>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 95%;
          `}
        >
          <Typography variant="h2" fontSize="1.2em" fontWeight="inherit">
            History
          </Typography>
          <IconButton onClick={close}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider
          css={css`
            width: 95%;
            margin: auto;
          `}
        />
        <ProvVis
          root={provenance.root.id}
          config={{
            changeCurrent: (node) => provenance.to(node),
          }}
          nodeMap={provenance.graph.backend.nodes}
          currentNode={currentNodeId}
        />
      </div>
    </Drawer>
  );
};
