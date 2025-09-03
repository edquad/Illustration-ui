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
import { createProduct, updateProduct } from "../../queries/AdminQueries";

const ProductForm = ({ open, onClose, onSuccess, product = null, mode = "create" }) => {
  const [formData, setFormData] = useState({
    PRODUCT: "",
    IS_ACTIVE: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        PRODUCT: product.PRODUCT || "",
        IS_ACTIVE: product.IS_ACTIVE ?? true,
      });
    } else {
      setFormData({
        PRODUCT: "",
        IS_ACTIVE: true,
      });
    }
    setError("");
  }, [product, mode, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.PRODUCT.trim()) {
      setError("Product name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "create") {
        await createProduct(formData);
      } else {
        await updateProduct(product.PRODUCT_ID, formData);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      setError(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === "create" ? "Add New Product" : "Edit Product"}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            fullWidth
            variant="outlined"
            value={formData.PRODUCT}
            onChange={(e) => handleChange("PRODUCT", e.target.value)}
            disabled={loading}
            required
            sx={{ mb: 2 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.IS_ACTIVE}
                onChange={(e) => handleChange("IS_ACTIVE", e.target.checked)}
                disabled={loading}
              />
            }
            label="Active"
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Saving..." : (mode === "create" ? "Add Product" : "Update Product")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;