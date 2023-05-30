import { QuestionMark } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { IconButton } from "@mui/material";

type Margin = {
    top: number,
    bottom: number,
    left: number,
    right: number
}

export const defaultMargin: Margin = {
    top: 0,
    bottom: 1,
    left: 0,
    right: 2.5
}

export const HelpCircle = ({ text, margin = {...defaultMargin}, size = 13 }: { text: string, margin?: Margin, size?: number }) => {
  return (
    <Tooltip 
      title={text} 
      placement="top"
      arrow
    >
      <IconButton 
        sx={{
          alignSelf: 'center', 
          margin:`${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
          padding: '3px',
        }}
        disableTouchRipple
      >
        <QuestionMark sx={{ height: size, width: size }}></QuestionMark>
      </IconButton>
    </Tooltip>
  );
};