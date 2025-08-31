import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Alert,
  Paper,
  Radio,
  Avatar,
  Button,
  Slider,
  Select,
  Divider,
  Tooltip,
  Checkbox,
  MenuItem,
  FormLabel,
  TextField,
  RadioGroup,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  ListItemText,
  OutlinedInput,
  FormControlLabel,
} from "@mui/material";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MygaResultsDisplay from "./MygaResultsDisplay";
import FiaResultsDisplay from "./FiaResultsDisplay";
import {
  getFIACalc,
  getMYGACalc,
  getTermDetails,
  getFiaAllocation,
  getWithdrawalTypeDetails,
  getStateProductAvailability,
} from "../../queries/IllustrationQueries";
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
const MAX = 100000;
const MIN = 25000;
const MAX_COMPARE = 4;

const marks = [
  {
    value: MIN,
    label: `$${MIN}`,
  },
  {
    value: MAX,
    label: `$${MAX}`,
  },
];
const createNewGrid = (id) => ({
  id,
  val: MIN,
  productType: "",
  firstTerm: "",
  secondTerm: "",
  withdrawalType: "",
  withdrawalAmount: "",
  withdrawalFromYear: "",
  withdrawalToYear: "",
  withdrawalFrequency: "",
  guaranteePeriod: "",
  fiaAllocation: [],
  isGLWB: false,
  glwbActivationAge: "",
  jointIndicator: "",
});
function IllustrationProductsInfo({ selectedState, personalInfo }) {
  const [termList, setTermList] = useState([]);
  const [withdrawalList, setWithdrawalList] = useState([]);
  const [fullViewIndex, setFullViewIndex] = useState(null);
  const [productsInformation, setProductsInformation] = useState([]);
  const [fiaAllocationList, setFiaAllocationList] = useState([]);
  const [compareGrids, setCompareGrids] = useState([createNewGrid(1)]);
  const [calculationEnabled, setCalculationEnabled] = useState({});
  const [formData, setFormData] = useState({
    premium: 50000,
    birthday: personalInfo?.birthday || dayjs().subtract(45, "year"),
    first_name: personalInfo?.first_name || "",
    last_name: personalInfo?.last_name || "",
    first_term: 5,
    second_term: 5,
    withdrawal_type: "none",
    withdrawal_amount: 0,
    withdrawal_from_year: 6,
    withdrawal_to_year: 10,
    frequency: 12,
  });
  // FIA-specific form data
  const [fiaFormData, setFiaFormData] = useState({
    premium: 50000,
    birthday: personalInfo?.birthday || dayjs().subtract(45, "year"),
    first_name: personalInfo?.first_name || "",
    last_name: personalInfo?.last_name || "",
    first_term: 10,
    second_term: 0,
    withdrawal_type: "none",
    withdrawal_amount: 0,
    withdrawal_from_year: 6,
    withdrawal_to_year: 10,
    frequency: 12,
    ptp_w_cap_rate: 0.06,
    ptp_w_participation_rate_500: 0.85,
    ptp_w_participation_rate_marc5: 0.8,
    ptp_w_participation_rate_tca: 0.75,
    fixed_interest_account: 0.03,
    glwb: false,
    glwb_activation_age: 65,
    joint_indicator: false,
  });
  //=================================================

  //=================================

  const handleFullView = (index) => {
    setFullViewIndex((prev) => (prev === index ? null : index)); // toggle
  };
  const handleAddCompareGrid = () => {
    setCompareGrids((prev) => {
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, createNewGrid(prev.length + 1)];
    });
  };

  const handleDeleteCompareGrid = (index) => {
    setCompareGrids((prev) => {
      const newGrids = prev.filter((_, i) => i !== index);
      return newGrids.length > 0 ? newGrids : [createNewGrid(1)];
    });
  };
  const handleGridChange = (index, field, value) => {
    setCompareGrids((prev) =>
      prev.map((grid, i) => (i === index ? { ...grid, [field]: value } : grid))
    );
    
    // If product type is being changed, disable auto-calculation until Calculate is clicked again
    if (field === 'productType') {
      setCalculationEnabled(prev => ({
        ...prev,
        [index]: false
      }));
    }
  };
  const handleFIAAllocationChange = (index, event) => {
    const {
      target: { value },
    } = event;

    setCompareGrids((prev) =>
      prev.map((grid, i) => {
        if (i !== index) return grid;
        const selected = typeof value === "string" ? value.split(",") : value;
        const updated = selected.map((name) => {
          const existing = grid.fiaAllocation.find(
            (item) => item.name === name
          );
          return existing || { name, value: 0 };
        });

        return { ...grid, fiaAllocation: updated };
      })
    );
  };

  //======================
  const handleProductAvailability = async () => {
    try {
      const params = {
        stateCode: selectedState,
      };
      const result = await getStateProductAvailability(params);
      if (result) {
        console.log("My_result", result);
        setProductsInformation(result);
      }
    } catch (error) {
      console.error("Error handling:", error);
    }
  };
  const handleterm = async () => {
    try {
      const result = await getTermDetails();
      if (result) {
        setTermList(result);
      }
    } catch (error) {
      console.error("Error handling:", error);
    }
  };
  const handleWithdrawalType = async () => {
    try {
      const result = await getWithdrawalTypeDetails();
      if (result) {
        setWithdrawalList(result);
      }
    } catch (error) {
      console.error("Error handling:", error);
    }
  };
  const patchFIAData = async (index) => {
    try {
      const grid = compareGrids[index];

      // Convert fia_allocation array to individual allocation fields
      const allocationMap = {};
      grid.fiaAllocation.forEach((allocation) => {
        const value = Number(allocation.value) || 0;
        switch (allocation.name) {
          case "Point-to-Point with Cap Rate (%)":
          case "PTP w/ Cap Rate (%)":
            allocationMap.ptp_w_cap_rate = value;
            break;
          case "PTP w/ Participation Rate S&P 500 (%)":
          case "Point-to-Point with Participation Rate S&P 500 (%)":
            allocationMap.ptp_w_participation_rate_500 = value;
            break;
          case "PTP w/ Participation Rate MARC5 (%)":
          case "Point-to-Point with Participation Rate MARC5 (%)":
            allocationMap.ptp_w_participation_rate_marc5 = value;
            break;
          case "PTP w/ Participation Rate TCA (%)":
          case "Point-to-Point with Participation Rate TCA (%)":
            allocationMap.ptp_w_participation_rate_tca = value;
            break;
          case "Fixed Interest Account (%)":
            allocationMap.fixed_interest_account = value;
            break;
          default:
            console.warn(`Unknown allocation type: ${allocation.name}`);
        }
      });

      const params = {
        premium: grid.val,
        birthday: dayjs().subtract(45, "year"),
        first_term: grid.firstTerm || 0,
        second_term: grid.secondTerm || 0,
        withdrawal_type: grid.withdrawalType || "none",
        withdrawal_amount: Number(grid.withdrawalAmount) || 0,
        withdrawal_from_year: Number(grid.withdrawalFromYear) || 0,
        withdrawal_to_year: Number(grid.withdrawalToYear) || 0,
        frequency: grid.withdrawalFrequency || "None",
        // Add individual allocation fields instead of fia_allocation array
        ptp_w_cap_rate: allocationMap.ptp_w_cap_rate || 0,
        ptp_w_participation_rate_500:
          allocationMap.ptp_w_participation_rate_500 || 0,
        ptp_w_participation_rate_marc5:
          allocationMap.ptp_w_participation_rate_marc5 || 0,
        ptp_w_participation_rate_tca:
          allocationMap.ptp_w_participation_rate_tca || 0,
        fixed_interest_account: allocationMap.fixed_interest_account || 0,
        glwb: grid.isGLWB,
        glwb_activation_age: Number(grid.glwbActivationAge) || 0,
        joint_indicator: grid.jointIndicator === "Joint",
      };
      console.log("FIA_Final_Params", params);
      const result = await getFIACalc(params);
      if (result) {
        // Update individual grid's calculation result instead of shared state
        const updatedGrids = [...compareGrids];
        updatedGrids[index] = {
          ...updatedGrids[index],
          calculationResult: result,
        };
        setCompareGrids(updatedGrids);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const patchMYGAData = async (index) => {
    try {
      const grid = compareGrids[index];
      const params = {
        premium: grid.val,
        birthday: dayjs().subtract(45, "year"),
        first_term: grid.firstTerm || 0,
        second_term: grid.secondTerm || 0,
        withdrawal_type: grid.withdrawalType || "none",
        withdrawal_amount: Number(grid.withdrawalAmount) || 0,
        withdrawal_from_year: Number(grid.withdrawalFromYear) || 0,
        withdrawal_to_year: Number(grid.withdrawalToYear) || 0,
        frequency: grid.withdrawalFrequency || "None",
        fia_allocation:
          grid.fiaAllocation?.map((a) => ({
            name: a.name,
            value: Number(a.value) || 0,
          })) || [],
        glwb: grid.isGLWB,
        glwb_activation_age: Number(grid.glwbActivationAge) || 0,
        joint_indicator: grid.jointIndicator === "Joint",
      };
      console.log("MYGA_FinalParams", params);
      const result = await getMYGACalc(params);
      if (result) {
        // Update individual grid's calculation result instead of shared state
        const updatedGrids = [...compareGrids];
        updatedGrids[index] = {
          ...updatedGrids[index],
          calculationResult: result,
        };
        setCompareGrids(updatedGrids);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCalculate = async (index) => {
    const grid = compareGrids[index];

    // Convert to lowercase for comparison
    const productType = grid.productType.toLowerCase();

    if (productType === "myga") {
      patchMYGAData(index);
    } else if (productType === "fia") {
      patchFIAData(index);
    } else {
      console.error("Product type not selected", grid.productType);
      alert("Please select a product type before calculating");
      return;
    }
    
    // Enable auto-calculation for this grid after first manual calculation
    setCalculationEnabled(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleFiaAllocation = async () => {
    try {
      const result = await getFiaAllocation();
      if (result) {
        setFiaAllocationList(result);
      }
    } catch (error) {
      console.error("Error handling:", error);
    }
  };

  useEffect(() => {
    handleProductAvailability();
  }, [selectedState]);
  useEffect(() => {
    handleterm();
    handleFiaAllocation();
    handleWithdrawalType();
  }, []);

  useEffect(() => {
    if (personalInfo) {
      console.log("PersonalInfo received in ProductsInfo:", personalInfo);
      setFormData((prev) => ({
        ...prev,
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        birthday: personalInfo.birthday || prev.birthday,
      }));
      setFiaFormData((prev) => ({
        ...prev,
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        birthday: personalInfo.birthday || prev.birthday,
      }));
    }
  }, [personalInfo]);

  // Add debounced effect for automatic calculation (only when enabled)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      compareGrids.forEach((grid, index) => {
        // Only auto-calculate if:
        // 1. Calculation has been enabled for this grid (Calculate button was clicked)
        // 2. Grid has a value and product type
        if (calculationEnabled[index] && grid.val && grid.productType) {
          const productType = grid.productType.toLowerCase();
          if (productType === "myga") {
            patchMYGAData(index);
          } else if (productType === "fia") {
            patchFIAData(index);
          }
        }
      });
    }, 1000); // 1 second delay after user stops scrolling

    return () => clearTimeout(timeoutId);
  }, [compareGrids.map(grid => grid.val), calculationEnabled]);
  //=======================
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Products Illustration
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            className="!rounded-full"
            onClick={handleAddCompareGrid}
            disabled={compareGrids.length === 4}
            startIcon={<AddIcon />}
          >
            Compare
          </Button>
          {compareGrids.length > 1 && <Avatar>{compareGrids.length}</Avatar>}
        </Box>
      </Box>
      <Box
        sx={{
          height: "calc(100vh - 315px)",
          overflow: "auto",
          width: "100%",
        }}
      >
        <Grid container spacing={3} style={{ flexWrap: "nowrap" }}>
          {compareGrids.map((grid, index) => {
            if (fullViewIndex !== null && fullViewIndex !== index) return null;
            return (
              <Grid
                key={grid.id}
                sx={{ mb: 2, px: 1 }}
                // size={{ xs: 12, md: 12 / compareGrids.length }}
                size={{
                  xs: 12,
                  md: fullViewIndex === index ? 12 : 12 / compareGrids.length,
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    pt: 0,
                    transition: "all 0.3s ease",
                    minHeight: `${compareGrids.length <= 2 && fullViewIndex === index && "calc(100vh - 330px)"}`,
                    overflowY: "auto",
                    position: "relative",
                    height: "calc(100vh - 320px)",
                  }}
                >
                  {/* Header with Delete */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      position: "sticky",
                      top: 0,
                      bgcolor: "#f3f3f3",
                      zIndex: 5,
                      p: 1,
                    }}
                  >
                    <div>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "500",
                          color: "#6b6b6b",
                          mb: 0,
                        }}
                      >
                        Products{" "}
                        <span className="textColor">{grid.productType}</span> -
                        Option {String.fromCharCode(65 + index)}
                      </Typography>
                    </div>
                    <div>
                      {compareGrids.length > 1 && (
                        <>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteCompareGrid(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={
                              fullViewIndex === index ? "Minimize" : "Full View"
                            }
                          >
                            <IconButton
                              size="small"
                              className="!ml-2"
                              onClick={() => handleFullView(index)}
                            >
                              {fullViewIndex === null ? (
                                <ZoomOutMapIcon />
                              ) : (
                                <FullscreenExitIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </Box>

                  <Grid container spacing={3}>
                    {/* === Left Column === */}
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <FormControl variant="outlined" sx={{ mb: 0 }} fullWidth>
                        <InputLabel id="lineofBusiness-label">
                          Products Type
                        </InputLabel>
                        <Select
                          size="small"
                          label="Products Type"
                          value={grid.productType}
                          onChange={(e) =>
                            handleGridChange(
                              index,
                              "productType",
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          {[
                            ...new Set(
                              productsInformation.map((p) => p.PRODUCT)
                            ),
                          ].map((product) => (
                            <MenuItem key={product} value={product}>
                              {product}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <FormControl variant="outlined" sx={{ mb: 0 }} fullWidth>
                        <InputLabel id="FirstTerm-label">First Term</InputLabel>
                        <Select
                          size="small"
                          label="First Term"
                          value={grid.firstTerm}
                          onChange={(e) =>
                            handleGridChange(index, "firstTerm", e.target.value)
                          }
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
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <FormControl variant="outlined" sx={{ mb: 0 }} fullWidth>
                        <InputLabel id="SecondTerm-label">
                          Second Term
                        </InputLabel>
                        <Select
                          size="small"
                          label="Second Term"
                          value={grid.secondTerm}
                          onChange={(e) =>
                            handleGridChange(
                              index,
                              "secondTerm",
                              e.target.value
                            )
                          }
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
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <FormControl variant="outlined" sx={{ mb: 0 }} fullWidth>
                        <InputLabel id="WithdrawalType-label">
                          Withdrawal Type
                        </InputLabel>
                        <Select
                          size="small"
                          label="Withdrawal Type"
                          value={grid.withdrawalType}
                          onChange={(e) =>
                            handleGridChange(
                              index,
                              "withdrawalType",
                              e.target.value
                            )
                          }
                        >
                          {withdrawalList.map((state) => (
                            <MenuItem
                              key={state.WITHDRAWAL_TYPE_ID}
                              value={state.WITHDRAWAL_TYPE_VALUE}
                            >
                              {state.WITHDRAWAL_TYPE_VALUE}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <TextField
                        fullWidth
                        sx={{ mb: 0 }}
                        label="Withdrawal Amount"
                        type="number"
                        size="small"
                        value={grid.withdrawalAmount}
                        onChange={(e) =>
                          handleGridChange(
                            index,
                            "withdrawalAmount",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Withdrawal Fron Year"
                        type="number"
                        size="small"
                        sx={{ mb: 0 }}
                        value={grid.withdrawalFromYear}
                        onChange={(e) =>
                          handleGridChange(
                            index,
                            "withdrawalFromYear",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Withdrawal To Year"
                        type="number"
                        size="small"
                        sx={{ mb: 0 }}
                        value={grid.withdrawalToYear}
                        onChange={(e) =>
                          handleGridChange(
                            index,
                            "withdrawalToYear",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel id="withdrawalFrequency-label">
                          Withdrawal Frequency
                        </InputLabel>
                        <Select
                          size="small"
                          label="Withdrawal Frequency"
                          value={grid.withdrawalFrequency}
                          onChange={(e) =>
                            handleGridChange(
                              index,
                              "withdrawalFrequency",
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value={"Monthly"}>Monthly</MenuItem>

                          <MenuItem value={"Quarterly"}>Quarterly</MenuItem>
                          <MenuItem value={"Half Yearly"}>Half Yearly</MenuItem>
                          <MenuItem value={"Yearly"}>Yearly</MenuItem>
                          <MenuItem value={"None"}>None</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <Box sx={{ mb: 0, px: 5 }}>
                        <Slider
                          marks={marks}
                          step={10}
                          min={MIN}
                          max={MAX}
                          value={grid.val}
                          onChange={(e) =>
                            handleGridChange(
                              index,
                              "val",
                              Number(e.target.value)
                            )
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Initial Contribution"
                        value={grid.val}
                        size="small"
                        sx={{ mb: 0 }}
                        onChange={(e) =>
                          handleGridChange(index, "val", Number(e.target.value))
                        }
                        type="number"
                        inputProps={{ min: MIN, max: MAX }}
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md:
                          compareGrids.length === 2 && fullViewIndex !== index
                            ? 6
                            : compareGrids.length > 2 && fullViewIndex !== index
                              ? 12
                              : 3,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Guarantee Period"
                        sx={{ mb: 0 }}
                        size="small"
                        value={grid.guaranteePeriod}
                        onChange={(e) =>
                          handleGridChange(
                            index,
                            "guaranteePeriod",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    {grid.productType === "FIA" && (
                      <>
                        {/* ===Fixed Index Annuity (FIA) Allocation==== */}
                        <Grid size={12}>
                          <Grid container spacing={3}>
                            <Grid size={6}>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  className="textColor mb-0"
                                >
                                  Fixed Index Annuity (FIA) Allocation
                                </Typography>
                                <small>
                                  Specify the allocation percentages for each
                                  investment option. The total must equal 100%.
                                </small>
                              </Box>
                            </Grid>
                            <Grid size={6}>
                              {(() => {
                                const total = grid.fiaAllocation.reduce(
                                  (sum, item) => sum + Number(item.value || 0),
                                  0
                                );
                                const isValid = total === 100;
                                return (
                                  <>
                                    <Alert
                                      sx={{ p: 1, py: 0 }}
                                      severity={isValid ? "success" : "error"}
                                    >
                                      Total Allocation: {total.toFixed(2)}%
                                      <small className="block">
                                        {isValid
                                          ? "Perfect! Allocation equals 100%."
                                          : "Must equal 100.00%"}
                                      </small>
                                    </Alert>
                                  </>
                                );
                              })()}
                            </Grid>
                            <Grid
                              size={{
                                xs: 12,
                                md:
                                  compareGrids.length === 2 &&
                                  fullViewIndex !== index
                                    ? 6
                                    : compareGrids.length > 2 &&
                                        fullViewIndex !== index
                                      ? 12
                                      : 6,
                              }}
                            >
                              <FormControl fullWidth>
                                <InputLabel id="FIA_Allocation">
                                  (FIA) Allocation
                                </InputLabel>
                                <Select
                                  label="(FIA) Allocation"
                                  multiple
                                  size="small"
                                  value={grid.fiaAllocation.map(
                                    (item) => item.name
                                  )}
                                  onChange={(e) =>
                                    handleFIAAllocationChange(index, e)
                                  }
                                  input={
                                    <OutlinedInput label="(FIA) Allocation" />
                                  }
                                  renderValue={(selected) =>
                                    selected.join(", ")
                                  }
                                  MenuProps={MenuProps}
                                >
                                  {fiaAllocationList.map((item) => (
                                    <MenuItem
                                      key={item.FIA_ALLOCATION_VALUE}
                                      value={item.FIA_ALLOCATION_VALUE}
                                    >
                                      <Checkbox
                                        checked={grid.fiaAllocation.some(
                                          (fa) =>
                                            fa.name ===
                                            item.FIA_ALLOCATION_VALUE
                                        )}
                                      />
                                      <ListItemText
                                        primary={item.FIA_ALLOCATION_VALUE}
                                      />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            {grid.fiaAllocation.map((alloc, idx) => (
                              <Grid
                                size={{
                                  xs: 12,
                                  md:
                                    compareGrids.length === 2 &&
                                    fullViewIndex !== index
                                      ? 6
                                      : compareGrids.length > 2 &&
                                          fullViewIndex !== index
                                        ? 12
                                        : 6,
                                }}
                                key={alloc.name}
                              >
                                <TextField
                                  fullWidth
                                  type="number"
                                  size="small"
                                  label={`${alloc.name}`}
                                  value={alloc.value}
                                  onChange={(e) => {
                                    const newVal = Number(e.target.value);
                                    setCompareGrids((prev) =>
                                      prev.map((g, gi) =>
                                        gi === index
                                          ? {
                                              ...g,
                                              fiaAllocation:
                                                g.fiaAllocation.map((fa, fi) =>
                                                  fi === idx
                                                    ? { ...fa, value: newVal }
                                                    : fa
                                                ),
                                            }
                                          : g
                                      )
                                    );
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                        {/* ===Fixed Index Annuity (FIA) Allocation==== */}
                        <Grid size={12}>
                          <Grid container spacing={3}>
                            <Grid
                              size={{
                                xs: 12,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  className="textColor mb-0"
                                >
                                  Guaranteed Lifetime Withdrawal Benefit (GLWB)
                                </Typography>
                                <small>
                                  Configure GLWB options for this client.
                                </small>
                              </Box>
                            </Grid>

                            <Grid
                              size={{
                                xs: 12,
                                md:
                                  compareGrids.length === 2 &&
                                  fullViewIndex !== index
                                    ? 6
                                    : compareGrids.length > 2 &&
                                        fullViewIndex !== index
                                      ? 12
                                      : 3,
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={grid.isGLWB}
                                    // onChange={(e) => setIsGLWB(e.target.checked)}
                                    onChange={(e) =>
                                      handleGridChange(
                                        index,
                                        "isGLWB",
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label="Enable GLWB"
                              />
                            </Grid>
                            {grid.isGLWB && (
                              <>
                                <Grid
                                  size={{
                                    xs: 12,
                                    md:
                                      compareGrids.length === 2 &&
                                      fullViewIndex !== index
                                        ? 6
                                        : compareGrids.length > 2 &&
                                            fullViewIndex !== index
                                          ? 12
                                          : 3,
                                  }}
                                >
                                  <TextField
                                    label="GLWB Activation Age"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                    value={grid.glwbActivationAge}
                                    onChange={(e) =>
                                      handleGridChange(
                                        index,
                                        "glwbActivationAge",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid
                                  size={{
                                    xs: 12,
                                    md:
                                      compareGrids.length === 2 &&
                                      fullViewIndex !== index
                                        ? 6
                                        : compareGrids.length > 2 &&
                                            fullViewIndex !== index
                                          ? 12
                                          : 3,
                                  }}
                                >
                                  <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">
                                      Joint Indicator
                                    </FormLabel>
                                    <RadioGroup
                                      row
                                      aria-labelledby="demo-row-radio-buttons-group-label"
                                      name="row-radio-buttons-group"
                                    >
                                      <FormControlLabel
                                        value="Single"
                                        control={
                                          <Radio
                                            onChange={(e) =>
                                              handleGridChange(
                                                index,
                                                "jointIndicator",
                                                e.target.value
                                              )
                                            }
                                          />
                                        }
                                        label="Single"
                                      />
                                      <FormControlLabel
                                        value="Joint"
                                        control={
                                          <Radio
                                            onChange={(e) =>
                                              handleGridChange(
                                                index,
                                                "jointIndicator",
                                                e.target.value
                                              )
                                            }
                                          />
                                        }
                                        label="Joint"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  {/* =====BUTTON Create & Calculate==== */}
                  <Box>
                    <Box sx={{ p: 1, textAlign: "center" }}>
                      <Button
                        size="large"
                        variant="contained"
                        className="!rounded-full"
                        endIcon={<ArrowForwardIosIcon />}
                        onClick={() => handleCalculate(index)}
                      >
                        Create & Calculate
                      </Button>
                    </Box>
                  </Box>

                  {grid.calculationResult && (
                    <Box sx={{ mt: 3 }}>
                      {grid.productType === "MYGA" ? (
                        <MygaResultsDisplay
                          data={grid.calculationResult}
                          clientData={formData}
                        />
                      ) : (
                        <FiaResultsDisplay
                          data={grid.calculationResult}
                          clientData={fiaFormData}
                        />
                      )}
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}

export default IllustrationProductsInfo;
