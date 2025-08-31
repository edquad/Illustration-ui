import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import MygaResultsDisplay from "../components/illustration/MygaResultsDisplay";
import FiaResultsDisplay from "../components/illustration/FiaResultsDisplay";
import FiaForm from "../components/illustration/FiaForm";

function Illustration() {
  const [productType, setProductType] = useState("myga");
  const [formData, setFormData] = useState({
    premium: 50000,
    birthday: dayjs().subtract(45, "year"),
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
    birthday: dayjs().subtract(45, "year"),
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

  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    if (productType === "myga") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      setFiaFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleProductTypeChange = (newProductType) => {
    setProductType(newProductType);
    setCalculationResult(null); // Clear previous results
    setError(null);
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentFormData = productType === "myga" ? formData : fiaFormData;
      const apiEndpoint =
        productType === "myga"
          ? "http://localhost:3010/api/illustration/myga-calc"
          : "http://localhost:3010/api/illustration/fia-calc";

      const requestData = {
        ...currentFormData,
        birthday: currentFormData.birthday.format("YYYY-MM-DD"),
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setCalculationResult(result);
    } catch (err) {
      console.error("Calculation error:", err);
      setError(err.message || "An error occurred during calculation");
    } finally {
      setLoading(false);
    }
  };

  const currentFormData = productType === "myga" ? formData : fiaFormData;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Insurance Illustration Calculator
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              {/* Product Type Selection */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Product Type"
                  value={productType}
                  onChange={(e) => handleProductTypeChange(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="myga">
                    MYGA (Multi-Year Guaranteed Annuity)
                  </MenuItem>
                  <MenuItem value="fia">FIA (Fixed Index Annuity)</MenuItem>
                </TextField>
              </Grid>

              {/* Common Fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Premium Amount"
                  type="number"
                  value={currentFormData.premium}
                  onChange={(e) =>
                    handleInputChange(
                      "premium",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  fullWidth
                  InputProps={{
                    startAdornment: "$",
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date of Birth"
                  value={currentFormData.birthday}
                  onChange={(newValue) =>
                    handleInputChange("birthday", newValue)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="First Term (Years)"
                  type="number"
                  value={currentFormData.first_term}
                  onChange={(e) =>
                    handleInputChange(
                      "first_term",
                      parseInt(e.target.value) || 0
                    )
                  }
                  fullWidth
                />
              </Grid>

              {productType === "myga" && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Second Term (Years)"
                    type="number"
                    value={currentFormData.second_term}
                    onChange={(e) =>
                      handleInputChange(
                        "second_term",
                        parseInt(e.target.value) || 0
                      )
                    }
                    fullWidth
                  />
                </Grid>
              )}

              {/* Withdrawal Options */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Withdrawal Type"
                  value={currentFormData.withdrawal_type}
                  onChange={(e) =>
                    handleInputChange("withdrawal_type", e.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value="none">No Withdrawals</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </TextField>
              </Grid>

              {currentFormData.withdrawal_type !== "none" && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Withdrawal Amount"
                      type="number"
                      value={currentFormData.withdrawal_amount}
                      onChange={(e) =>
                        handleInputChange(
                          "withdrawal_amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      fullWidth
                      InputProps={{
                        startAdornment:
                          currentFormData.withdrawal_type === "percentage"
                            ? "%"
                            : "$",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Withdrawal From Year"
                      type="number"
                      value={currentFormData.withdrawal_from_year}
                      onChange={(e) =>
                        handleInputChange(
                          "withdrawal_from_year",
                          parseInt(e.target.value) || 0
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Withdrawal To Year"
                      type="number"
                      value={currentFormData.withdrawal_to_year}
                      onChange={(e) =>
                        handleInputChange(
                          "withdrawal_to_year",
                          parseInt(e.target.value) || 0
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                </>
              )}

              {/* FIA-Specific Fields */}
              {productType === "fia" && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Index Allocation Settings
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="PTP W Cap Rate"
                      type="number"
                      value={currentFormData.ptp_w_cap_rate}
                      onChange={(e) =>
                        handleInputChange(
                          "ptp_w_cap_rate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      fullWidth
                      inputProps={{ step: 0.01, min: 0, max: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="S&P 500 Participation Rate"
                      type="number"
                      value={currentFormData.ptp_w_participation_rate_500}
                      onChange={(e) =>
                        handleInputChange(
                          "ptp_w_participation_rate_500",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      fullWidth
                      inputProps={{ step: 0.01, min: 0, max: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="MARC5 Participation Rate"
                      type="number"
                      value={currentFormData.ptp_w_participation_rate_marc5}
                      onChange={(e) =>
                        handleInputChange(
                          "ptp_w_participation_rate_marc5",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      fullWidth
                      inputProps={{ step: 0.01, min: 0, max: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="TCA Participation Rate"
                      type="number"
                      value={currentFormData.ptp_w_participation_rate_tca}
                      onChange={(e) =>
                        handleInputChange(
                          "ptp_w_participation_rate_tca",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      fullWidth
                      inputProps={{ step: 0.01, min: 0, max: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fixed Interest Account Rate"
                      type="number"
                      value={currentFormData.fixed_interest_account}
                      onChange={(e) =>
                        handleInputChange(
                          "fixed_interest_account",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      fullWidth
                      inputProps={{ step: 0.01, min: 0, max: 1 }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  disabled={loading}
                  size="large"
                  fullWidth
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Calculating...
                    </>
                  ) : (
                    `Calculate ${productType.toUpperCase()} Illustration`
                  )}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results Display */}
        {calculationResult && (
          <Box sx={{ mt: 3 }}>
            {productType === "myga" ? (
              <MygaResultsDisplay
                data={calculationResult}
                clientData={formData}
              />
            ) : (
              <FiaResultsDisplay
                data={calculationResult}
                clientData={fiaFormData}
              />
            )}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}

export default Illustration;
