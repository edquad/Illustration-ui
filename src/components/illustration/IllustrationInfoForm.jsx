import React, { useState, useRef } from "react";
import dayjs from "dayjs";
import Split from "react-split";
import TabPanel from "./TabPanel";
import Chatbot from "../chatbot/chatbot";
import IllustrationHeaderInfo from "./IllustrationHeaderInfo";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import IllustrationPersonalInfo from "./IllustrationPersonalInfo";
import IllustrationProductsInfo from "./IllustrationProductsInfo";
import { createClientInfo } from "../../queries/IllustrationQueries";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box, Tab, Tabs, Typography, IconButton, Button } from "@mui/material";
function IllustrationInfoForm() {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedState, setSelectedState] = useState(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const scrollContainerRef = useRef(null);
  const [isExpand, setIsExpand] = useState(false);
  //==================================
  const [basicInfo, setBasicInfo] = useState({
    Agent_Name: "",
    Illustration_Number: "",
    llustration_Date: "",
  });
  // Add personal information state
  const [personalInfo, setPersonalInfo] = useState({
    Salutation: "",
    first_name: "",
    last_name: "",
    birthday: null,
    age: 0,
  });
  const handleChatbotExpand = (expand) => {
    setIsExpand(expand);
  };
  const InsertPersonalInfo = async () => {
    try {
      const fullName = [
        personalInfo.salutation,
        personalInfo.first_name,
        personalInfo.middle_name,
        personalInfo.last_name,
        personalInfo.suffix,
      ]
        .filter(Boolean)
        .join(" ");
      const params = {
        ILLUSTRATION_ID: basicInfo.Illustration_Number,
        AGENT_NAME: basicInfo.Agent_Name,
        ILLUSTRATION_DATE: basicInfo.llustration_Date.format("MM/DD/YYYY"),
        SALUTATION: personalInfo.salutation,
        FIRST_NAME: personalInfo.first_name,
        MIDDLE_NAME: personalInfo.middle_name,
        LAST_NAME: personalInfo.last_name,
        SUFFIX: personalInfo.suffix,
        FULL_NAME: fullName,
        GENDER: personalInfo.gender,
        DATE_OF_BIRTH: personalInfo.birthday.format("MM/DD/YYYY"),
        AGE: personalInfo.age,
        SSN_TAX_ID: personalInfo.ssn,
        RESIDENCE_ADDRESS: personalInfo.address,
        STATE: personalInfo.state,
        EMAIL: personalInfo.email,
        PHONE: personalInfo.phone,
      };
      await createClientInfo(params);
      // if (result) {
      //   //setProductsInformation(result);
      // }
    } catch (error) {
      console.error("Error handling:", error);
    }
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
  };

  const handleAutofillFromChatbot = (autofillData) => {
    console.log("Autofill Data Received (raw):", autofillData);
    const mappedData = {
      salutation:
        autofillData.Salutation ||
        autofillData.Title ||
        autofillData.salutation ||
        "",

      // Name fields
      first_name:
        autofillData["First Name"] ||
        autofillData.FirstName ||
        autofillData.first_name ||
        "",

      middle_name:
        autofillData["Middle Name"] ||
        autofillData.MiddleName ||
        autofillData.middle_name ||
        "",

      last_name:
        autofillData["Last Name"] ||
        autofillData.LastName ||
        autofillData.last_name ||
        "",

      suffix:
        autofillData.Suffix ||
        autofillData["Name Suffix"] ||
        autofillData.suffix ||
        "",

      birthday: autofillData["Date Of Birth"]
        ? dayjs(autofillData["Date Of Birth"])
        : autofillData.DateOfBirth
          ? dayjs(autofillData.DateOfBirth)
          : autofillData.birthday
            ? dayjs(autofillData.birthday)
            : null,

      age: autofillData.Age || autofillData.age || 0,

      gender: autofillData.Gender
        ? autofillData.Gender.charAt(0).toUpperCase() +
          autofillData.Gender.slice(1).toLowerCase()
        : autofillData.gender
          ? autofillData.gender.charAt(0).toUpperCase() +
            autofillData.gender.slice(1).toLowerCase()
          : "",

      email: autofillData.Email || autofillData.email || "",

      phone:
        autofillData["Phone Number"] ||
        autofillData.PhoneNumber ||
        autofillData.Phone ||
        autofillData.phone ||
        "",

      address:
        autofillData["Residence Address"] ||
        autofillData.ResidenceAddress ||
        autofillData.Address ||
        autofillData.address ||
        "",

      ssn:
        autofillData["SSN/Tax ID"] ||
        autofillData.SSN_TaxID ||
        autofillData["Tax ID"] ||
        autofillData.SSN ||
        autofillData.ssn ||
        "",

      city: autofillData.City || autofillData.city || "",
      state: autofillData.State || autofillData.state || "",

      zip:
        autofillData["ZIP Code"] || autofillData.Zip || autofillData.zip || "",

      clientId: autofillData.ClientId || null,
      clientName: autofillData.ClientName || "",
    };
    setPersonalInfo((prev) => ({ ...prev, ...mappedData }));
  };
  const handleBasicInfo = (info) => {
    setBasicInfo(info);
  };
  const handlePersonalInfoChange = (info) => {
    setPersonalInfo(info);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 2) {
      InsertPersonalInfo();
    }
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }, 100);
  };

  const toggleNavigation = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <>
      <Split
        className="split bg-white"
        sizes={isExpand ? [80, 20] : [100, 0]}
        minSize={isExpand ? [500, 350] : [0, 0]}
        expandToMin={false}
        gutterSize={isExpand ? 10 : 0}
        gutterAlign="center"
        snapOffset={0}
        dragInterval={isExpand ? 1 : 0}
        direction="horizontal"
        cursor={isExpand ? "col-resize" : "default"}
        //=========================
      >
        <div className="side sideBarBox">
          <Typography variant="h6" gutterBottom>
            Illustration
          </Typography>

          <IllustrationHeaderInfo handleBasicInfo={handleBasicInfo} />
          <Box
            sx={{
              bgcolor: "background.paper",
              display: "flex",
              position: "relative",
            }}
          >
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
                  <Tab
                    label="Products"
                    value={2}
                    disabled={
                      selectedState == null || personalInfo.birthday == null
                    }
                  />
                </Tabs>
              )}
            </Box>

            <Box
              ref={scrollContainerRef}
              sx={{
                width: "100%",
                transition: "width 0.3s ease",
                height: "calc(100vh - 250px)",
                overflowY: "auto",
              }}
            >
              <TabPanel value={activeTab} index={1}>
                <IllustrationPersonalInfo
                  handleStateChange={handleStateChange}
                  onPersonalInfoChange={handlePersonalInfoChange}
                  autofillData={personalInfo}
                />
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Box sx={{ minHeight: "calc(100vh - 150px)" }}>
                  <IllustrationProductsInfo
                    selectedState={selectedState}
                    personalInfo={personalInfo}
                  />
                </Box>
              </TabPanel>
            </Box>
          </Box>
          {/* =======Navigation Button======= */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              py: 1,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIosNewIcon />}
              className="!rounded-full"
              onClick={() => setActiveTab((prev) => Math.max(1, prev - 1))}
              disabled={activeTab === 1} // disable when on first tab
            >
              Back
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIosIcon />}
              className="!rounded-full"
              onClick={() => {
                // run InsertPersonalInfo only when going to tab 2
                if (activeTab === 1) {
                  InsertPersonalInfo();
                }
                setActiveTab((prev) => Math.min(2, prev + 1));
              }}
              disabled={selectedState == null || personalInfo.birthday == null}
            >
              Next
            </Button>
          </Box>
        </div>
        <div className={`side mainBox`} style={{ position: "relative" }}>
          <Chatbot
            onFormAutofill={handleAutofillFromChatbot}
            handleChatbotExpand={handleChatbotExpand}
          />
        </div>
      </Split>
    </>
  );
}

export default IllustrationInfoForm;
