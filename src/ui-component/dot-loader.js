
import { useTheme } from '@mui/material/styles';

export default function DotLoader() {
    const theme = useTheme();

    const dotStyle = {
        position: "relative",
        width: "10px",
        height: "10px",
        borderRadius: "5px",
        animation: "dot-flashing 1s infinite linear alternate",
        animationDelay: "0.5s",
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
    };

    const spanStyle = {
        position: "absolute",
        top: "0",
        width: "10px",
        height: "10px",
        borderRadius: "5px",
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
        color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
        animation: "dot-flashing 1s infinite alternate",
    };

    return (
        <div style={dotStyle}>
        <style>
          {`
            @keyframes dot-flashing {
              0% {
                background-color: ${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark};
              }
              50%, 100% {
                background-color: rgba(152, 128, 255, 0.2);
              }
            }
          `}
        </style>
        <span style={{ ...spanStyle, left: "-15px", animationDelay: "0s" }}></span>
        <span style={{ ...spanStyle, left: "15px", animationDelay: "1s" }}></span>
      </div>

    );
}