import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from "@mui/material";

const WithdrawalTypeForm = ({ open, onClose, onSubmit, withdrawalType, mode, loading }) => {
  const [formData, setFormData] = useState({
    WITHDRAWAL_TYPE_VALUE: "",
    IS_ACTIVE: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && withdrawalType) {
      setFormData({
        WITHDRAWAL_TYPE_VALUE: withdrawalType.WITHDRAWAL_TYPE_VALUE || "",
        IS_ACTIVE: withdrawalType.IS_ACTIVE !== undefined ? withdrawalType.IS_ACTIVE : true,
      });
    } else {
      setFormData({
        WITHDRAWAL_TYPE_VALUE: "",
        IS_ACTIVE: true,
      });
    }
    setErrors({});
  }, [mode, withdrawalType, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.WITHDRAWAL_TYPE_VALUE.trim()) {
      newErrors.WITHDRAWAL_TYPE_VALUE = "Withdrawal type value is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === "create" ? "Add New Withdrawal Type" : "Edit Withdrawal Type"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Withdrawal Type Value"
            fullWidth
            variant="outlined"
            value={formData.WITHDRAWAL_TYPE_VALUE}
            onChange={(e) => handleChange("WITHDRAWAL_TYPE_VALUE", e.target.value)}
            error={!!errors.WITHDRAWAL_TYPE_VALUE}
            helperText={errors.WITHDRAWAL_TYPE_VALUE}
            disabled={loading}
          />
          {mode === "edit" && (
            <FormControlLabel
              control={
                <Switch
                  checked={formData.IS_ACTIVE}
                  onChange={(e) => handleChange("IS_ACTIVE", e.target.checked)}
                  disabled={loading}
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WithdrawalTypeForm;