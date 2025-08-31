import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
} from "@mui/material";

function FiaForm({ onCalculate, loading }) {
  const [formData, setFormData] = useState({
    // Client Information
    age: "",
    gender: "Male",
    state: "CA",

    // Product Terms
    premium: "",
    productTerm: "10",

    // Index Allocations (must total 100%)
    sp500Allocation: "25",
    nasdaqAllocation: "25",
    russellAllocation: "25",
    fixedAllocation: "25",

    // GLWB Options
    hasGlwb: false,
    glwbAge: "",

    // Withdrawal Configuration
    withdrawalStartAge: "",
    withdrawalAmount: "",
    withdrawalFrequency: "Annual",
  });

  const [allocationError, setAllocationError] = useState("");

  // Calculate total allocation percentage
  const totalAllocation = useMemo(() => {
    const sp500 = parseFloat(formData.sp500Allocation) || 0;
    const nasdaq = parseFloat(formData.nasdaqAllocation) || 0;
    const russell = parseFloat(formData.russellAllocation) || 0;
    const fixed = parseFloat(formData.fixedAllocation) || 0;
    return sp500 + nasdaq + russell + fixed;
  }, [
    formData.sp500Allocation,
    formData.nasdaqAllocation,
    formData.russellAllocation,
    formData.fixedAllocation,
  ]);

  // Validate allocation percentages
  useEffect(() => {
    if (totalAllocation !== 100 && totalAllocation > 0) {
      setAllocationError(
        `Total allocation is ${totalAllocation}%. Must equal 100%.`
      );
    } else {
      setAllocationError("");
    }
  }, [totalAllocation]);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (totalAllocation !== 100) {
      setAllocationError(
        "Total allocation must equal 100% before calculating."
      );
      return;
    }

    // Validate required fields
    if (!formData.age || !formData.premium) {
      alert("Please fill in all required fields.");
      return;
    }

    onCalculate(formData);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          FIA Illustration Calculator
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Client Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Client Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleInputChange("age")}
                required
                inputProps={{ min: 18, max: 85 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={handleInputChange("gender")}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={handleInputChange("state")}
              />
            </Grid>
          </Grid>

          {/* Product Terms */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Product Terms
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Initial Premium"
                type="number"
                value={formData.premium}
                onChange={handleInputChange("premium")}
                required
                inputProps={{ min: 1000 }}
                InputProps={{
                  startAdornment: "$",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Product Term (Years)</InputLabel>
                <Select
                  value={formData.productTerm}
                  onChange={handleInputChange("productTerm")}
                  label="Product Term (Years)"
                >
                  <MenuItem value="7">7 Years</MenuItem>
                  <MenuItem value="10">10 Years</MenuItem>
                  <MenuItem value="14">14 Years</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Index Allocations */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Index Allocations
          </Typography>
          {allocationError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {allocationError}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="S&P 500 (%)"
                type="number"
                value={formData.sp500Allocation}
                onChange={handleInputChange("sp500Allocation")}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="NASDAQ (%)"
                type="number"
                value={formData.nasdaqAllocation}
                onChange={handleInputChange("nasdaqAllocation")}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Russell 2000 (%)"
                type="number"
                value={formData.russellAllocation}
                onChange={handleInputChange("russellAllocation")}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Fixed Account (%)"
                type="number"
                value={formData.fixedAllocation}
                onChange={handleInputChange("fixedAllocation")}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
          </Grid>
          <Typography
            variant="body2"
            color={totalAllocation === 100 ? "success.main" : "error.main"}
            sx={{ mt: 1 }}
          >
            Total Allocation: {totalAllocation}%{" "}
            {totalAllocation === 100 ? "✓" : "(Must equal 100%)"}
          </Typography>

          {/* GLWB Options */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            GLWB Options
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hasGlwb}
                    onChange={handleSwitchChange("hasGlwb")}
                  />
                }
                label="Include GLWB (Guaranteed Lifetime Withdrawal Benefit)"
              />
            </Grid>
            {formData.hasGlwb && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GLWB Start Age"
                  type="number"
                  value={formData.glwbAge}
                  onChange={handleInputChange("glwbAge")}
                  inputProps={{ min: parseInt(formData.age) || 18, max: 85 }}
                />
              </Grid>
            )}
          </Grid>

          {/* Withdrawal Configuration */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Withdrawal Configuration (Optional)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Withdrawal Start Age"
                type="number"
                value={formData.withdrawalStartAge}
                onChange={handleInputChange("withdrawalStartAge")}
                inputProps={{ min: parseInt(formData.age) || 18, max: 85 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Annual Withdrawal Amount"
                type="number"
                value={formData.withdrawalAmount}
                onChange={handleInputChange("withdrawalAmount")}
                InputProps={{
                  startAdornment: "$",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Withdrawal Frequency</InputLabel>
                <Select
                  value={formData.withdrawalFrequency}
                  onChange={handleInputChange("withdrawalFrequency")}
                  label="Withdrawal Frequency"
                >
                  <MenuItem value="Annual">Annual</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || totalAllocation !== 100}
            sx={{ mt: 2 }}
          >
            {loading ? "Calculating..." : "Calculate FIA Illustration"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FiaForm;
