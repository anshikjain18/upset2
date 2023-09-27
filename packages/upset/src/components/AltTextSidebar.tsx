import {
  Box,
  Divider, Drawer, FormControlLabel, IconButton, Radio, RadioGroup, TextField, Typography, css,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, FC } from 'react';

type Props = {
  open: boolean;
  close: () => void;
  generateAltText: (verbosity: string, level: number, explain: string) => Promise<string>;
}

const initialDrawerWidth = 450;

export const AltTextSidebar: FC<Props> = ({ open, close, generateAltText }) => {
  const [altText, setAltText] = useState<string>('');
  const [verbosity, setVerbosity] = useState<string>('low');
  const [level, setLevel] = useState<number>(1);
  const [explain, setExplain] = useState<string>('full');

  useEffect((): void => {
    async function generate(): Promise<void> {
      const resp = await generateAltText(verbosity, level, explain);
      setAltText(resp);
    }

    if (open) {
      generate();
    }
  }, [open, verbosity, level, explain]);

  const handleVerbosityChange = (e: EventTarget & HTMLInputElement): void => {
    setVerbosity(e.value);
  };

  const handleLevelChange = (e: EventTarget & HTMLInputElement): void => {
    setLevel(parseInt(e.value, 10));
  };

  const handleExplainChange = (e: EventTarget & HTMLInputElement): void => {
    setExplain(e.value);
  };

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
          <Typography variant="button" fontSize="1em">
            Alternative Text
          </Typography>
          <IconButton onClick={close}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider
          css={css`
            width: 95%;
            margin: auto;
            margin-bottom: 1em;
          `}
        />
        <TextField multiline InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} label="Generated" defaultValue={altText} fullWidth maxRows={8} />
        <Box>
          <Typography variant="caption" fontSize="1em">
            Verbosity
          </Typography>
          <RadioGroup
            row
            defaultValue="low"
            value={verbosity}
            onChange={(e): void => handleVerbosityChange(e.target)}
          >
            <FormControlLabel value="low" control={<Radio />} label="Low" />
            <FormControlLabel value="medium" control={<Radio />} label="Medium" />
            <FormControlLabel value="high" control={<Radio />} label="High" />
          </RadioGroup>
        </Box>
        <Box>
          <Typography variant="caption" fontSize="1em">
            Level
          </Typography>
          <RadioGroup
            row
            defaultValue="2"
            value={level}
            onChange={(e): void => handleLevelChange(e.target)}
          >
            <FormControlLabel value="0" control={<Radio />} label="0" />
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
          </RadioGroup>
        </Box>
        <Box>
          <Typography variant="caption" fontSize="1em">
            Explain
          </Typography>
          <RadioGroup
            row
            defaultValue="full"
            value={explain}
            onChange={(e): void => handleExplainChange(e.target)}
          >
            <FormControlLabel value="none" control={<Radio />} label="None" />
            <FormControlLabel value="simple" control={<Radio />} label="Simple" />
            <FormControlLabel value="full" control={<Radio />} label="Full" />
          </RadioGroup>
        </Box>
      </div>
    </Drawer>
  )
};
