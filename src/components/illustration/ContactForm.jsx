import React, { useEffect, useState } from "react";

import LockClockIcon from "@mui/icons-material/LockClock";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Grid,
  Radio,
  Avatar,
  Select,
  Button,
  Checkbox,
  MenuItem,
  FormLabel,
  TextField,
  InputLabel,
  Typography,
  RadioGroup,
  FormControl,
  ListItemText,
  OutlinedInput,
  FormControlLabel,
} from "@mui/material";
import {
  getStates,
  getTermDetails,
  getWithdrawalTypeDetails,
  getTaxQualificationDetails,
  getStateProductAvailability,
  getFiaAllocation,
} from "../../queries/IllustrationQueries";
/**
 * @typedef {Object} Contact
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [gender]
 * @property {string} [dateOfBirth]
 * @property {string} [email]
 * @property {number} [phone]
 * @property {number} [age]
 * @property {string} [jurisdiction]
 * @property {string} [state]
 * @property {number} [premium]
 * @property {string} [firstTerm]
 * @property {string} [secondTerm]
 * @property {string} [taxQualification]
 * @property {string} [withdrawalType]
 * @property {string} [lineofBusiness]
 * @property {string} [productType]
 * @property {string} [products]
 * @property {number} [pointToPointWithCapRate]
 * @property {number} [participationRateSP]
 * @property {number} [participationRateMARC5]
 * @property {number} [participationRate]
 * @property {number} [fixedInterestAccount]
 * @property {number} [glwbActivationAge]
 * @property {string} [jointIndicator]
 */

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function ContactForm() {
  const [stateList, setStateList] = useState([]);
  const [termList, setTermList] = useState([]);
  const [withdrawalTypeList, setWithdrawalTypeList] = useState([]);
  const [taxQualificationList, setTaxQualificationList] = useState([]);
  const [stateProductAvailabilityList, setStateProductAvailabilityList] =
    useState([]);
  const [fiaAllocationList, setFiaAllocationList] = useState([]);
  const [personName, setPersonName] = useState([]);
  const [showGLWB, setShowGLWB] = useState(false);

  const handleMultipleChange = (event) => {
    const value = event.target.value;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  const handleBookmark = async () => {
    try {
      const [
        states,
        terms,
        withdrawalTypes,
        taxQualifications,
        stateProducts,
        fiaAllocations,
      ] = await Promise.all([
        getStates(),
        getTermDetails(),
        getWithdrawalTypeDetails(),
        getTaxQualificationDetails(),
        getStateProductAvailability(),
        getFiaAllocation(),
      ]);

      setStateList(states || []);
      setTermList(terms || []);
      setWithdrawalTypeList(withdrawalTypes || []);
      setTaxQualificationList(taxQualifications || []);
      setStateProductAvailabilityList(stateProducts || []);
      setFiaAllocationList(fiaAllocations || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleBookmark();
  }, []);

  return (
    <>
      <Box sx={{ height: "calc(100vh - 235px)", overflowY: "auto", mb: 1 }}>
        {/* Financial Information */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{ p: 4, mb: 3 }}
          className="bg-white text-neutral-600 rounded-md border border-stone-300"
        >
          <Grid size={12}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Avatar>
                <AttachMoneyIcon />
              </Avatar>
              <Typography variant="h6" className="textColor mb-0">
                Financial Information
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 2, lg: 6 }}>
            <FormControl variant="outlined" sx={{ mb: 1 }} fullWidth>
              <InputLabel id="FirstTerm-label">First Term</InputLabel>
              <Select
                label="First Term"
                value={""}
                // onChange={handleChange("firstTerm")}
              >
                {termList.map((state) => (
                  <MenuItem
                    key={state.TERM_DETAILS_VALUE}
                    value={state.TERM_DETAILS_VALUE}
                  >
                    {state.TERM_DETAILS_VALUE}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 2, lg: 6 }}>
            <FormControl variant="outlined" sx={{ mb: 1 }} fullWidth>
              <InputLabel id="SecondTerm-label">Second Term</InputLabel>
              <Select
                label="Second Term"
                value={""}
                // onChange={handleChange("secondTerm")}
              >
                {termList.map((state) => (
                  <MenuItem
                    key={state.TERM_DETAILS_VALUE}
                    value={state.TERM_DETAILS_VALUE}
                  >
                    {state.TERM_DETAILS_VALUE}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 2, lg: 6 }}>
            <TextField
              label="Premium"
              variant="outlined"
              type="number"
              fullWidth
              sx={{ mb: 1 }}
              value={""}
              // onChange={handleChange("premium")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2, lg: 6 }}>
            <FormControl variant="outlined" sx={{ mb: 1 }} fullWidth>
              <InputLabel id="TaxQualification-label">
                Tax Qualification
              </InputLabel>
              <Select
                label="Tax Qualification"
                value={""}
                // onChange={handleChange("taxQualification")}
              >
                {taxQualificationList.map((tax) => (
                  <MenuItem
                    key={tax.TAX_QUALIFICATION_VALUE}
                    value={tax.TAX_QUALIFICATION_VALUE}
                  >
                    {tax.TAX_QUALIFICATION_VALUE}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* FIA Allocation */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{ p: 4, mb: 3 }}
          className="bg-white text-neutral-600 rounded-md border border-stone-300"
        >
          <Grid size={12}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Avatar>
                <LockClockIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" className="textColor mb-0">
                  Fixed Index Annuity (FIA) Allocation
                </Typography>
                <small>
                  Specify the allocation percentages for each investment option.
                  The total must equal 100%.
                </small>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="FIA_Allocation">(FIA) Allocation</InputLabel>
              <Select
                label="(FIA) Allocation"
                multiple
                value={personName}
                onChange={handleMultipleChange}
                input={<OutlinedInput label="(FIA) Allocation" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {fiaAllocationList.map((name) => (
                  <MenuItem
                    key={name.FIA_ALLOCATION_VALUE}
                    value={name.FIA_ALLOCATION_VALUE}
                  >
                    <Checkbox
                      checked={personName.includes(name.FIA_ALLOCATION_VALUE)}
                    />
                    <ListItemText primary={name.FIA_ALLOCATION_VALUE} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <TextField
              label="PTP w/ Participation Rate S&P 500 (%)"
              variant="outlined"
              type="number"
              fullWidth
              sx={{ mb: 1 }}
              value={Contact.participationRateSP ?? ""}
              // onChange={handleChange("participationRateSP")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <TextField
              label="PTP w/ Participation Rate MARC5 (%)"
              variant="outlined"
              type="number"
              fullWidth
              sx={{ mb: 1 }}
              value={Contact.participationRateMARC5 ?? ""}
              onChange={handleChange("participationRateMARC5")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <TextField
              label="Fixed Interest Account (%)"
              variant="outlined"
              type="number"
              fullWidth
              sx={{ mb: 1 }}
              value={Contact.fixedInterestAccount ?? ""}
              onChange={handleChange("fixedInterestAccount")}
            />
          </Grid>
        </Grid>

        {/* GLWB Section */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{ p: 4, my: 3 }}
          className="bg-white text-neutral-600 rounded-md border border-stone-300"
        >
          <Grid size={12}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Avatar>
                <LockClockIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" className="textColor mb-0">
                  Guaranteed Lifetime Withdrawal Benefit (GLWB)
                </Typography>
                <small>Configure GLWB options for this client.</small>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showGLWB}
                  onChange={(e) => setShowGLWB(e.target.checked)}
                />
              }
              label="Enable GLWB"
            />
          </Grid>

          {showGLWB && (
            <>
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TextField
                  label="GLWB Activation Age"
                  variant="outlined"
                  type="number"
                  fullWidth
                  sx={{ mb: 1 }}
                  value={Contact.glwbActivationAge ?? ""}
                  // onChange={handleChange("glwbActivationAge")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Joint Indicator</FormLabel>
                  <RadioGroup
                    value={Contact.jointIndicator ?? ""}
                    // onChange={handleChange("jointIndicator")}
                    row
                  >
                    <FormControlLabel
                      value="Single"
                      control={<Radio />}
                      label="Single"
                    />
                    <FormControlLabel
                      value="Joint"
                      control={<Radio />}
                      label="Joint"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* Create & Calculate Button */}
      <Box
        sx={{ p: 2, textAlign: "center", bgcolor: "#fff" }}
        className="rounded-md border border-stone-300 shadow-lg"
      >
        <Button
          size="large"
          variant="contained"
          className="!rounded-full"
          endIcon={<ArrowForwardIosIcon />}
        >
          Create & Calculate
        </Button>
      </Box>
    </>
  );
}

export default ContactForm;
