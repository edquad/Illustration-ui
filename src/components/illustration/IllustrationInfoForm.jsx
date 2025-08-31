import React, { useState } from "react";
import { Box, Tab, Tabs, Paper, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import TabPanel from "./TabPanel";
import IllustrationPersonalInfo from "./IllustrationPersonalInfo";
import IllustrationHeaderInfo from "./IllustrationHeaderInfo";
import IllustrationProductsInfo from "./IllustrationProductsInfo";

function IllustrationInfoForm() {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedState, setSelectedState] = useState(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  // const [productType, setProductType] = useState("");
  // const [premium, setPremium] = useState();
  // const [dateOfBirth, setDateOfBirth] = useState();
  // const [firstTerm, setFirstTerm] = useState();
  // const [secondTerm, setSecondTerm] = useState();
  // const [withdrawalType, setWithdrawalType] = useState("none");
  // const [withdrawalAmount, setWithdrawalAmount] = useState();
  // const [withdrawalFromYear, setWithdrawalFromYear] = useState();
  // const [withdrawalToYear, setWithdrawalToYear] = useState();
  // const [frequency, setFrequency] = useState();

  //==================================

  // Add personal information state
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    last_name: "",
    birthday: null,
    age: 0
  });

  const handleStateChange = (state) => {
    setSelectedState(state);
  };
  
  // Add handler for personal information changes
  const handlePersonalInfoChange = (info) => {
    setPersonalInfo(info);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleNavigation = () => {
    setIsNavVisible(!isNavVisible);
  };

  //============================
  return (
    <Paper sx={{ p: 2, height: "calc(100vh - 100px)" }}>
      <Typography variant="h6" gutterBottom>
        Illustration
      </Typography>

      {/* Top Info Row */}
      <IllustrationHeaderInfo />
      {/* Tabs with Sidebar */}
      <Box
        sx={{
          bgcolor: "background.paper",
          display: "flex",
          position: "relative",
        }}
      >
        {/* Toggle Button */}
        <IconButton
          onClick={toggleNavigation}
          sx={{
            position: "absolute",
            top: -20,
            left: isNavVisible ? 170 : 10,
            zIndex: 3,
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
            borderRadius: "50%",
            width: 28,
            height: 28,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "left 0.3s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            "& .MuiSvgIcon-root": {
              fontSize: "16px",
            },
          }}
        >
          {isNavVisible ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>

        {/* Sidebar Tabs */}
        <Box
          sx={{
            position: "sticky",
            top: 80,
            alignSelf: "flex-start",
            zIndex: 2,
            minWidth: isNavVisible ? 180 : 0,
            width: isNavVisible ? 180 : 0,
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          {isNavVisible && (
            <Tabs
              value={activeTab}
              orientation="vertical"
              onChange={handleTabChange}
              aria-label="Vertical tabs example"
              sx={{
                borderRight: 1,
                borderColor: "divider",
                minWidth: 180,
                alignItems: "flex-start",
                "& .MuiTab-root": {
                  justifyContent: "center",
                  textAlign: "left",
                  alignItems: "flex-start",
                  pl: 1,
                  py: 0,
                  textTransform: "capitalize",
                },
                "& .Mui-selected": {
                  backgroundColor: "#e3f2fd",
                  fontWeight: 600,
                  borderRadius: 1,
                },
              }}
            >
              <Tab label="Personal" value={1} />
              <Tab label="Products" value={2} />
            </Tabs>
          )}
        </Box>
        {/*========TabPanel Box========*/}
        <Box 
          sx={{ 
            flexGrow: 1, 
            width: isNavVisible ? "calc(100vw - 300px)" : "calc(100vw - 120px)",
            transition: "width 0.3s ease",
          }}
        >
          {/*========Personal Information Tab========*/}
          <TabPanel value={activeTab} index={1}>
            <IllustrationPersonalInfo 
              handleStateChange={handleStateChange}
              onPersonalInfoChange={handlePersonalInfoChange}
            />
          </TabPanel>

          {/*========Products Information Tab========*/}
          <TabPanel value={activeTab} index={2}>
            <IllustrationProductsInfo 
              selectedState={selectedState}
              personalInfo={personalInfo}
            />
          </TabPanel>
        </Box>
      </Box>
    </Paper>
  );
}

export default IllustrationInfoForm;
