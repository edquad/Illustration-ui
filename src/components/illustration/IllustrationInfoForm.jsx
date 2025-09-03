import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import TabPanel from "./TabPanel";
import IllustrationPersonalInfo from "./IllustrationPersonalInfo";
import IllustrationHeaderInfo from "./IllustrationHeaderInfo";
import IllustrationProductsInfo from "./IllustrationProductsInfo";
import Chatbot from "../chatbot/chatbot";
import dayjs from "dayjs";
import { createClientInfo } from "../../queries/IllustrationQueries";
function IllustrationInfoForm() {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedState, setSelectedState] = useState(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const scrollContainerRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPersonalLoader, setshowPersonalLoader] = useState(false);
  const [showProductsLoader, setshowProductsLoader] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  // const [selectedClient, setSelectedClient] = useState(null);
  //==================================
  const [basicInfo, setBasicInfo] = useState({
    Agent_Name: "",
    Illustration_Number: "",
    llustration_Date: "",
  });
  // Add personal information state
  const [personalInfo, setPersonalInfo] = useState({
    Agent_Name: "",
    Illustration_Number: "",
    llustration_Date: "",
    Salutation: "",
    first_name: "",
    last_name: "",
    birthday: null,
    age: 0,
  });
  //console.log("selectedState", selectedState);
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
  // Enhanced validation function to check current form values
  // More robust validation function
  const validatePersonalInfo = () => {
    const missingFields = [];

    // Debug current values
    console.log("Current validation values:", {
      personalInfo,
      selectedState,
      age: personalInfo?.age,
      ageType: typeof personalInfo?.age,
    });

    // Check age with multiple conditions
    const age = personalInfo?.age;
    if (
      !age ||
      age === 0 ||
      age === "" ||
      age === null ||
      age === undefined ||
      isNaN(Number(age)) ||
      Number(age) <= 0
    ) {
      missingFields.push("Age");
    }

    // Check state with multiple conditions
    if (
      !selectedState ||
      selectedState === null ||
      selectedState === undefined ||
      selectedState === "" ||
      selectedState.trim() === ""
    ) {
      missingFields.push("State");
    }

    if (missingFields.length > 0) {
      const message = `Please select ${missingFields.join(" and ")} before proceeding to the product page.`;
      setValidationMessage(message);
      setShowValidationAlert(true);

      // Also log for debugging
      console.log("Validation failed:", {
        missingFields,
        personalInfo,
        selectedState,
      });

      return false;
    }

    console.log("Validation passed");
    return true;
  };

  // Enhanced scroll detection with improved validation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (isTransitioning) return;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // scrolling down
      if (e.deltaY > 0 && activeTab === 1) {
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
        if (isAtBottom && validatePersonalInfo()) {
          setshowProductsLoader(true);
          setIsTransitioning(true);
          setActiveTab(2);
          InsertPersonalInfo();
          setTimeout(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = 0;
            }
            setshowProductsLoader(false);
            setIsTransitioning(false);
          }, 3000);
        }
      }

      // scrolling up
      if (e.deltaY < 0 && activeTab === 2) {
        const isAtTop = scrollTop <= 5;
        if (isAtTop) {
          setshowPersonalLoader(true);
          setIsTransitioning(true);
          setActiveTab(1);
          setSelectedState(null);
          setPersonalInfo({
            first_name: "",
            last_name: "",
            birthday: null,
            age: 0,
          });
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const c = scrollContainerRef.current;
              c.scrollTop = c.scrollHeight - c.clientHeight - 50;
            }
            setshowPersonalLoader(false);
            setIsTransitioning(false);
          }, 3000);
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [activeTab, isTransitioning, personalInfo, selectedState]);

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

    // if (mappedData.clientId) {
    //   setSelectedClient(mappedData.clientId);
    // }
  };
  const handleBasicInfo = (info) => {
    setBasicInfo(info);
  };
  const handlePersonalInfoChange = (info) => {
    setPersonalInfo(info);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setIsTransitioning(true);
    if (newValue === 2) {
      InsertPersonalInfo();
    }
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
        setIsTransitioning(false);
      }
    }, 100);
  };

  const toggleNavigation = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleCloseValidationAlert = () => {
    setShowValidationAlert(false);
  };

  return (
    <Paper sx={{ p: 2, height: "calc(100vh - 100px)" }}>
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
            flexGrow: 1,
            width: isNavVisible ? "calc(100vw - 300px)" : "calc(100vw - 120px)",
            transition: "width 0.3s ease",
            height: "calc(100vh - 220px)",
            overflowY: "auto",
          }}
        >
          {/* {(showPersonalLoader || showProductsLoader) && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: "25%",
                width: "60%",
                zIndex: 10,
              }}
            >
              <LinearProgress />
            </Box>
          )} */}
          <TabPanel value={activeTab} index={1}>
            <IllustrationPersonalInfo
              handleStateChange={handleStateChange}
              onPersonalInfoChange={handlePersonalInfoChange}
              autofillData={personalInfo}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ minHeight: "calc(100vh - 150px)", pb: 4 }}>
              <IllustrationProductsInfo
                selectedState={selectedState}
                personalInfo={personalInfo}
              />
            </Box>
          </TabPanel>
        </Box>
      </Box>

      {/* Validation Alert */}
      <Snackbar
        open={showValidationAlert}
        autoHideDuration={4000}
        onClose={handleCloseValidationAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseValidationAlert}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {validationMessage}
        </Alert>
      </Snackbar>
      <Chatbot onFormAutofill={handleAutofillFromChatbot} />
    </Paper>
  );
}

export default IllustrationInfoForm;
