import { AccessibilityNew, BugReport } from "@mui/icons-material";
import { Box, Button, Link } from "@mui/material";
import vdl_logo from "../../assets/vdl_logo.svg";
import { accessibilityStatementAtom } from "../../atoms/accessibilityStatementAtom";
import { useRecoilState } from "recoil";
import { AccessibilityStatement } from "../AccessiblityStatement";
import { About } from "../About";
import { aboutAtom } from "../../atoms/aboutAtom";

const Footer = () => {

    const categoryCSS = {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
    }

    const [ accessibilityStatement, setAccessibilityStatement ] = useRecoilState(accessibilityStatementAtom);
    const [ aboutModal, setAboutModal ] = useRecoilState(aboutAtom);

    return (
        <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
            <footer>
                <Box sx={{backgroundColor: "#e0e0e0", width: "100%", display: "flex", justifyContent: "space-around", padding: "5px 0"}}>
                    <Button
                        sx={categoryCSS}
                        variant="contained"
                        color="inherit"
                        size="medium"
                        disableElevation
                        aria-label="Open About Us modal"
                        aria-haspopup="dialog"
                        onClick={() => setAboutModal(true)}
                    >
                        <img src={vdl_logo} alt="About Us" height="32px" width="100%" />
                    </Button>
                    <Link
                        href="https://github.com/visdesignlab/upset2/issues"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open GitHub issues for this project"
                    >
                        <Button
                            sx={categoryCSS}
                            variant="contained"
                            color="inherit"
                            size="medium"
                            disableElevation
                            startIcon={<BugReport />}
                        >
                            Report a Bug
                        </Button>
                    </Link>

                    <Button
                        sx={categoryCSS}
                        variant="contained"
                        color="inherit"
                        size="medium"
                        disableElevation
                        startIcon={<AccessibilityNew />}
                        aria-label="Open Accessibility Statement modal"
                        aria-haspopup="dialog"
                        tabIndex={1}
                        onClick={() => setAccessibilityStatement(true)}
                    >
                        Accessibility Statement
                    </Button>

                    {/* Accessibility Statement dialog */}
                    <AccessibilityStatement open={accessibilityStatement} close={() => setAccessibilityStatement(false)} />
                    {/* About dialog */}
                    <About open={aboutModal} close={() => setAboutModal(false)} />
                </Box>
            </footer>
        </Box>
    )
}

export default Footer;
