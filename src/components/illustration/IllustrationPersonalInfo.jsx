import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Grid,
  Avatar,
  Divider,
  MenuItem,
  TextField,
  Typography,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import IllustrationField from "../../config/IllustrationField.json";
import contactListData from "../../config/contactListData.json";
import {
  getStates,
  getStateProductAvailability,
} from "../../queries/IllustrationQueries";

// ✅ Define field categories

function IllustrationPersonalInfo({
  handleStateChange,
  onPersonalInfoChange,
  autofillData,
}) {
  const [formData, setFormData] = useState({});
  const [statesList, setStatesList] = useState([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  // Add validation error state
  const [validationErrors, setValidationErrors] = useState({});
  //   const [productsInformation, setProductsInformation] = useState([]);

  // Add all validation functions inside the component
  const validateSSN = (ssn) => {
    // Remove all non-digit characters
    const cleanSSN = ssn.replace(/\D/g, "");

    // Check if it's exactly 9 digits
    if (cleanSSN.length !== 9) {
      return "SSN must be 9 digits";
    }

    // Check for invalid patterns
    if (
      cleanSSN === "000000000" ||
      cleanSSN === "123456789" ||
      cleanSSN.startsWith("000") ||
      cleanSSN.startsWith("666") ||
      cleanSSN.startsWith("9")
    ) {
      return "Invalid SSN format";
    }

    return null; // Valid
  };

  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    // Check if it's exactly 10 digits
    if (cleanPhone.length !== 10) {
      return "Phone number must be 10 digits";
    }

    // Check if area code starts with 0 or 1
    if (cleanPhone.startsWith("0") || cleanPhone.startsWith("1")) {
      return "Invalid area code";
    }

    return null; // Valid
  };

  const validateEmail = (email) => {
    if (!email) return null; // Allow empty email if not required

    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    // Check for common invalid patterns
    if (email.includes("..") || email.startsWith(".") || email.endsWith(".")) {
      return "Invalid email format";
    }

    return null; // Valid
  };

  const validateAge = (age) => {
    if (!age) return null; // Allow empty age

    const numAge = parseInt(age);
    if (isNaN(numAge) || numAge < 0 || numAge > 150) {
      return "Please enter a valid age (0-150)";
    }

    return null; // Valid
  };

  // Format SSN with dashes
  const formatSSN = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length >= 6) {
      return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3, 5)}-${cleanValue.slice(5, 9)}`;
    } else if (cleanValue.length >= 3) {
      return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3)}`;
    }
    return cleanValue;
  };

  // Format phone number
  const formatPhoneNumber = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length >= 7) {
      return `(${cleanValue.slice(0, 3)}) ${cleanValue.slice(3, 6)}-${cleanValue.slice(6, 10)}`;
    } else if (cleanValue.length >= 3) {
      return `(${cleanValue.slice(0, 3)}) ${cleanValue.slice(3)}`;
    }
    return cleanValue;
  };

  // Filter numeric input for age
  const filterNumericInput = (value) => {
    return value.replace(/[^0-9]/g, "");
  };

  useEffect(() => {
    if (autofillData) {
      const mapped = {
        Salutation: autofillData.salutation || "",
        "First Name": autofillData.first_name || "",
        "Middle Name": autofillData.middle_name || "",
        "Last Name": autofillData.last_name || "",
        Suffix: autofillData.suffix || "",
        "Date Of Birth": autofillData.birthday
          ? dayjs(autofillData.birthday)
          : null,
        Age: autofillData.age || 0,
        Gender: autofillData.gender
          ? autofillData.gender.charAt(0).toUpperCase() +
            autofillData.gender.slice(1).toLowerCase()
          : "",
        "SSN/Tax ID": autofillData.ssn ? formatSSN(autofillData.ssn) : "",
        Email: autofillData.email || "",
        "Phone Number": autofillData.phone || "",
        "Residence Address": autofillData.address || "",
        State: autofillData.state || "",
        "ZIP Code": autofillData.zip || "",
      };

      const nameParts = [
        mapped.Salutation,
        mapped["First Name"],
        mapped["Middle Name"],
        mapped["Last Name"],
        mapped.Suffix,
      ].filter((part) => part && part.trim() !== "");
      mapped["Full Name"] = nameParts.join(" ");

      setFormData((prev) => ({ ...prev, ...mapped }));

      //  Match existing client from contactListData
      if (autofillData.clientId) {
        const matchedClient = contactListData.find(
          (c) => c.ClientId === autofillData.clientId
        );
        if (matchedClient) {
          setSelectedClient(matchedClient);
        }
      } else if (autofillData.clientName) {
        const matchedClient = contactListData.find(
          (c) =>
            c.FullName?.toLowerCase() === autofillData.clientName.toLowerCase()
        );
        if (matchedClient) {
          setSelectedClient(matchedClient);
        }
      }
    }
  }, [autofillData]);

  const handleStates = async () => {
    try {
      const result = await getStates();
      if (result) {
        setStatesList(result);
      }
    } catch (error) {
      console.error("Error handling:", error);
    }
  };

  const handleAddressModalOpen = () => {
    // Pre-populate modal with existing address if available
    const currentAddress = formData["Residence Address"] || "";
    if (currentAddress) {
      // Try to parse existing address (basic parsing)
      const parts = currentAddress.split(", ");
      setAddressFormData({
        street: parts[0] || "",
        city: parts[1] || "",
        state: parts[2] || "",
        zipCode: parts[3] || "",
      });
    } else {
      // Reset form if no existing address
      setAddressFormData({
        street: "",
        city: "",
        state: "",
        zipCode: "",
      });
    }
    setAddressModalOpen(true);
  };

  const handleAddressModalClose = () => {
    setAddressModalOpen(false);
  };

  const handleAddressModalSave = () => {
    // Combine address parts into a single string
    const addressParts = [
      addressFormData.street,
      addressFormData.city,
      addressFormData.state,
      addressFormData.zipCode,
    ].filter((part) => part && part.trim() !== "");

    const fullAddress = addressParts.join(", ");

    // Update the residence address field
    const updatedFormData = {
      ...formData,
      "Residence Address": fullAddress,
    };
    setFormData(updatedFormData);

    // Also update the main State field if a state was selected in the address
    if (addressFormData.state) {
      updatedFormData["State"] = addressFormData.state;
      setFormData(updatedFormData);
      // Trigger product availability check for the selected state
      handleProductAvailability(addressFormData.state);
      handleStateChange(addressFormData.state);
    }

    setAddressModalOpen(false);
  };

  const handleAddressFieldChange = (field, value) => {
    setAddressFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (label, newValue) => {
    let processedValue = newValue;
    let error = null;

    // Handle SSN validation and formatting
    if (label === "SSN/Tax ID") {
      processedValue = formatSSN(newValue);
      error = validateSSN(newValue);
    }

    // Handle Phone Number validation and formatting
    if (label === "Phone Number") {
      processedValue = formatPhoneNumber(newValue);
      error = validatePhoneNumber(newValue);
    }

    // Handle Email validation
    if (label === "Email") {
      error = validateEmail(newValue);
    }

    // Handle Age validation and numeric filtering
    if (label === "Age") {
      processedValue = filterNumericInput(newValue);
      error = validateAge(processedValue);
    }

    // Update validation errors
    setValidationErrors((prev) => ({
      ...prev,
      [label]: error,
    }));

    const updatedFormData = {
      ...formData,
      [label]: processedValue,
    };

    // Auto-generate Full Name when name-related fields change
    if (
      ["Salutation", "First Name", "Middle Name", "Last Name"].includes(label)
    ) {
      const salutation =
        label === "Salutation"
          ? processedValue
          : updatedFormData["Salutation"] || "";
      const firstName =
        label === "First Name"
          ? processedValue
          : updatedFormData["First Name"] || "";
      const middleName =
        label === "Middle Name"
          ? processedValue
          : updatedFormData["Middle Name"] || "";
      const lastName =
        label === "Last Name"
          ? processedValue
          : updatedFormData["Last Name"] || "";

      // Combine all name parts, filtering out empty values
      const nameParts = [salutation, firstName, middleName, lastName].filter(
        (part) => part && part.trim() !== ""
      );
      updatedFormData["Full Name"] = nameParts.join(" ");
    }

    // Auto-calculate date of birth when age is entered
    if (label === "Age" && processedValue && !error) {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - parseInt(processedValue);
      const calculatedBirthDate = dayjs(`${birthYear}-01-01`);
      updatedFormData["Date Of Birth"] = calculatedBirthDate;
    }

    setFormData(updatedFormData);

    // Calculate age if date of birth is provided (PRESERVING EXISTING FUNCTIONALITY)
    let age = 0;
    if (updatedFormData["Date Of Birth"]) {
      const today = new Date();
      const birthDate = new Date(updatedFormData["Date Of Birth"]);
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      // Update age field when date of birth changes (but not when age field itself changes to avoid infinite loop)
      if (label === "Date Of Birth") {
        updatedFormData["Age"] = age;
        setFormData(updatedFormData);
      }
    }

    // Pass personal info to parent

    if (onPersonalInfoChange) {
      const personalInfoToSend = {
        salutation: updatedFormData["Salutation"] || "",
        first_name: updatedFormData["First Name"] || "",
        middle_name: updatedFormData["Middle Name"] || "",
        last_name: updatedFormData["Last Name"] || "",
        full_name: updatedFormData["Full Name"] || "",
        suffix: updatedFormData["Suffix"] || "",
        birthday: updatedFormData["Date Of Birth"] || null,
        age: updatedFormData["Age"] || 0,
        gender: updatedFormData["Gender"] || "",
        ssn: updatedFormData["SSN/Tax ID"] || "",
        email: updatedFormData["Email"] || "",
        phone: updatedFormData["Phone Number"] || "",
        address: updatedFormData["Residence Address"] || "",
        state: updatedFormData["State"] || "",
        zip: updatedFormData["ZIP Code"] || "",
      };
      onPersonalInfoChange(personalInfoToSend);
    }
  };
  const handleProductAvailability = async (stateCode) => {
    try {
      const params = {
        stateCode: stateCode,
      };
      const result = await getStateProductAvailability(params);
      if (result) {
        // setProductsInformation(result);
      }
    } catch (error) {
      console.error("Error handling:", error);
    }
  };
  const selectOptions = {
    Salutation: ["Mr.", "Mrs.", "Ms.", "Dr."],
    Suffix: ["Jr.", "Sr.", "II", "III"],
    Gender: ["Male", "Female", "Other"],
  };

  const handleExistingClientChange = (event, selectedClient) => {
    if (selectedClient) {
      const fieldToDataKeyMap = {
        Salutation: "Salutation",
        "First Name": "FirstName",
        "Middle Name": "MiddleName",
        "Last Name": "LastName",
        Suffix: "Suffix",
        "Full Name": "FullName",
        Gender: "Gender",
        "Date Of Birth": "DateOfBirth",
        Age: "Age",
        "SSN/Tax ID": "SSN_TaxID",
        Email: "Email",
        "Phone Number": "PhoneNumber",
        "Residence Address": "ResidenceAddress", // ✅ fix
        State: "State",
        "ZIP Code": "ZipCode", // in case you add later
      };

      const updatedData = {};
      for (const [fieldLabel, dataKey] of Object.entries(fieldToDataKeyMap)) {
        if (selectedClient[dataKey] !== undefined) {
          if (fieldLabel === "Date Of Birth" && selectedClient[dataKey]) {
            updatedData[fieldLabel] = dayjs(selectedClient[dataKey]);
          } else if (fieldLabel === "State") {
            const matchedState = statesList.find(
              (s) =>
                s.STATE_CODE === selectedClient[dataKey] ||
                s.STATE_NAME === selectedClient[dataKey]
            );
            updatedData[fieldLabel] = matchedState
              ? matchedState.STATE_CODE
              : selectedClient[dataKey];
          } else {
            updatedData[fieldLabel] = selectedClient[dataKey];
          }
        }
      }

      // ✅ Autofill all fields
      setFormData((prev) => ({ ...prev, ...updatedData }));

      if (updatedData["State"]) {
        handleProductAvailability(updatedData["State"]);
        handleStateChange(updatedData["State"]);
      }

      if (onPersonalInfoChange) {
        const personalInfoToSend = {
          salutation: updatedData["Salutation"] || "",
          first_name: updatedData["First Name"] || "",
          middle_name: updatedData["Middle Name"] || "",
          last_name: updatedData["Last Name"] || "",
          suffix: updatedData["Suffix"] || "",
          birthday: updatedData["Date Of Birth"] || null,
          age: updatedData["Age"] || null,
          gender: updatedData["Gender"] || "",
          ssn: updatedData["SSN/Tax ID"] || "",
          email: updatedData["Email"] || "",
          phone: updatedData["Phone Number"] || "",
          address: updatedData["Residence Address"] || "",
          state: updatedData["State"] || "",
        };
        onPersonalInfoChange(personalInfoToSend);
      }
    } else {
      setFormData({});
    }
  };

  //==========================
  // const handleExistingClientChange = (event, selectedClient) => {
  //   if (selectedClient) {
  //     const fieldToDataKeyMap = {
  //       Salutation: "Salutation",
  //       "First Name": "FirstName",
  //       "Middle Name": "MiddleName",
  //       "Last Name": "LastName",
  //       Suffix: "Suffix",
  //       "Full Name": "FullName",
  //       Gender: "Gender",
  //       "Date Of Birth": "DateOfBirth",
  //       Age: "Age",
  //       "SSN/Tax ID": "SSN_TaxID",
  //       Email: "Email",
  //       "Phone Number": "PhoneNumber",
  //       "Residence Address": "ResidenceAddress",
  //       State: "State", // 🔹 special handling below
  //     };

  //     const updatedData = {};
  //     for (const [fieldLabel, dataKey] of Object.entries(fieldToDataKeyMap)) {
  //       if (selectedClient[dataKey] !== undefined) {
  //         if (fieldLabel === "Date Of Birth" && selectedClient[dataKey]) {
  //           updatedData[fieldLabel] = dayjs(selectedClient[dataKey]);
  //         } else if (fieldLabel === "State") {
  //           const matchedState = statesList.find(
  //             (s) =>
  //               s.STATE_CODE === selectedClient[dataKey] ||
  //               s.STATE_NAME === selectedClient[dataKey]
  //           );
  //           updatedData[fieldLabel] = matchedState
  //             ? matchedState.STATE_CODE
  //             : selectedClient[dataKey];
  //         } else {
  //           updatedData[fieldLabel] = selectedClient[dataKey];
  //         }
  //       }
  //     }
  //     setFormData(updatedData);
  //     if (updatedData["State"]) {
  //       handleProductAvailability(updatedData["State"]);
  //       handleStateChange(updatedData["State"]);
  //     }
  //     if (onPersonalInfoChange) {
  //       const personalInfoToSend = {
  //         first_name: updatedData["First Name"] || "",
  //         last_name: updatedData["Last Name"] || "",
  //         birthday: updatedData["Date Of Birth"] || null,
  //         age: updatedData["Age"] || null,
  //       };
  //       onPersonalInfoChange(personalInfoToSend);
  //     }
  //   } else {
  //     setFormData({});
  //   }
  // };
  const renderField = (field) => {
    // Special handling for the Residence Address field
    if (field.label === "Residence Address") {
      return (
        <>
          <TextField
            fullWidth
            size="small"
            label={field.label}
            required={field.required}
            value={formData[field.label] ?? ""}
            onClick={handleAddressModalOpen}
            InputProps={{
              readOnly: true,
              style: { cursor: "pointer" },
            }}
            placeholder="Click to enter address details"
          />

          <Dialog
            open={addressModalOpen}
            onClose={handleAddressModalClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Enter Address Details</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Street Address"
                      value={addressFormData.street}
                      onChange={(e) =>
                        handleAddressFieldChange("street", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="City"
                      value={addressFormData.city}
                      onChange={(e) =>
                        handleAddressFieldChange("city", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={statesList}
                      getOptionLabel={(option) => option.STATE_NAME || ""}
                      value={
                        statesList.find(
                          (state) =>
                            state.STATE_CODE === addressFormData.state ||
                            state.STATE_NAME === addressFormData.state
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        const stateCode = newValue ? newValue.STATE_CODE : "";
                        handleAddressFieldChange("state", stateCode);
                        // Also update the main State field immediately
                        if (stateCode) {
                          handleInputChange("State", stateCode);
                          handleProductAvailability(stateCode);
                          handleStateChange(stateCode);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="State" size="small" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="ZIP Code"
                      value={addressFormData.zipCode}
                      onChange={(e) =>
                        handleAddressFieldChange("zipCode", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddressModalClose}>Cancel</Button>
              <Button onClick={handleAddressModalSave} variant="contained">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
    }

    // Special handling for the State field to use statesList
    if (field.label === "State") {
      return (
        <Autocomplete
          options={statesList}
          getOptionLabel={(option) => option.STATE_NAME || ""}
          value={
            statesList.find(
              (state) => state.STATE_CODE === formData[field.label]
            ) || null
          }
          onChange={(event, newValue) => {
            const stateCode = newValue ? newValue.STATE_CODE : "";
            handleInputChange(field.label, stateCode);
            if (stateCode) {
              handleProductAvailability(stateCode);
              handleStateChange(stateCode);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={field.label}
              required={field.required}
              size="small"
            />
          )}
        />
      );
    }

    switch (field.fieldType) {
      case "TextField":
        // Special handling for SSN, Phone Number, Email, and Age fields with validation
        if (
          field.label === "SSN/Tax ID" ||
          field.label === "Phone Number" ||
          field.label === "Email" ||
          field.label === "Age"
        ) {
          let helperText = "";
          let inputProps = {};

          if (field.label === "SSN/Tax ID") {
            helperText = validationErrors[field.label] || "Format: XXX-XX-XXXX";
            inputProps.maxLength = 11;
          } else if (field.label === "Phone Number") {
            helperText =
              validationErrors[field.label] || "Format: (XXX) XXX-XXXX";
            inputProps.maxLength = 14;
          } else if (field.label === "Email") {
            helperText =
              validationErrors[field.label] || "Enter a valid email address";
          } else if (field.label === "Age") {
            helperText =
              validationErrors[field.label] || "Numbers only (0-150)";
            inputProps.maxLength = 3;
          }

          return (
            <TextField
              fullWidth
              size="small"
              label={field.label}
              type={field.label === "Email" ? "email" : "text"}
              required={field.required}
              value={formData[field.label] ?? ""}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
              disabled={field.label === "Full Name"}
              error={!!validationErrors[field.label]}
              helperText={helperText}
              inputProps={inputProps}
            />
          );
        }

        return (
          <TextField
            fullWidth
            size="small"
            label={field.label}
            type={field.type}
            required={field.required}
            value={formData[field.label] ?? ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            disabled={field.label === "Full Name"}
          />
        );
      case "TextArea":
        return (
          <TextField
            fullWidth
            size="small"
            label={field.label}
            multiline
            rows={3}
            required={field.required}
            value={formData[field.label] ?? ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
          />
        );
      case "SelectBox":
        return (
          <TextField
            select
            fullWidth
            size="small"
            label={field.label}
            required={field.required}
            value={formData[field.label] ?? ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
          >
            {selectOptions[field.label]?.map((option, idx) => (
              <MenuItem key={idx} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      case "DatePicker":
        return (
          <DatePicker
            label={field.label}
            format="MM/DD/YYYY"
            value={formData[field.label] ?? null}
            onChange={(newDate) => {
              handleInputChange(field.label, newDate);
              if (field.label === "Date Of Birth" && newDate) {
                const age = dayjs().diff(newDate, "year");
                handleInputChange("Age", age);
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                required: field.required,
              },
            }}
          />
        );
      default:
        return null;
    }
  };
  // ✅ Define field categories
  const fieldCategories = {
    "Personal Information": [
      "Salutation",
      "First Name",
      "Middle Name",
      "Last Name",
      "Suffix",
      "Full Name",
      "Gender",
      "Date Of Birth",
      "Age",
      "SSN/Tax ID",
    ],
    "Address Details": ["Residence Address", "State"],
    "Contact Information": ["Email", "Phone Number"],
  };

  // ✅ Icons for categories
  const categoryIcons = {
    "Personal Information": <PersonIcon sx={{ color: "#ffffff" }} />,
    "Contact Information": <LocalPhoneIcon sx={{ color: "#ffffff" }} />,
    "Address Details": <HomeIcon sx={{ color: "#ffffff" }} />,
  };

  useEffect(() => {
    handleStates();
  }, []);
  return (
    <>
      <Box
        sx={{
          width: "100%",
          pt: 2,
          // pb: 4,
          // minHeight: "calc(100vh - 250px)",
        }}
      >
        <Autocomplete
          disablePortal
          options={contactListData}
          value={selectedClient}
          getOptionLabel={(option) => option.FullName || ""}
          //onChange={handleExistingClientChange}
          onChange={(event, newValue) => {
            setSelectedClient(newValue);
            handleExistingClientChange(event, newValue);
          }}
          sx={{ width: 500, mb: 2 }}
          renderInput={(params) => (
            <TextField {...params} label="Existing Client" size="small" />
          )}
        />

        <Divider>
          <Chip label="OR" size="small" />
        </Divider>
        {/* ========================== */}

        {Object.entries(fieldCategories).map(([category, labels]) => (
          <Box key={category} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  p: 1,
                  mr: 1,
                  width: 40,
                  height: 40,
                  bgcolor: "#129fd4",
                }}
              >
                {categoryIcons[category]}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#585858",
                  wordBreak: "break-all",
                }}
              >
                {category}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {labels.map((label) => {
                const field = IllustrationField.find((f) => f.label === label);
                return (
                  field && (
                    <Grid
                      key={field.label}
                      sx={{ mb: 2 }}
                      size={{ xs: 12, md: 6, lg: 4, xl: 3 }}
                    >
                      {renderField(field)}
                    </Grid>
                  )
                );
              })}
            </Grid>
          </Box>
        ))}
        {/* Add extra space at bottom to ensure scroll detection */}
        {/* <Box sx={{ height: 150 }} /> */}
      </Box>
    </>
  );
}

export default IllustrationPersonalInfo;
