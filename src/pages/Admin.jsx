import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  TextField,
  FormControlLabel,
  Switch,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import ProductForm from "../components/admin/ProductForm";
import WithdrawalTypeForm from "../components/admin/WithdrawalTypeForm";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getAllTerms,
  createTerm,
  updateTerm,
  deleteTerm,
  toggleTermStatus,
  getAllWithdrawalTypes,
  createWithdrawalType,
  updateWithdrawalType,
  deleteWithdrawalType,
  toggleWithdrawalTypeStatus,
} from "../queries/AdminQueries";

const Admin = () => {
  // Product state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Term state
  const [terms, setTerms] = useState([]);
  const [termDialogOpen, setTermDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [termFormData, setTermFormData] = useState({
    TERM_DETAILS_VALUE: "",
    IS_ACTIVE: true,
  });

  // Withdrawal Type state
  const [withdrawalTypes, setWithdrawalTypes] = useState([]);
  const [withdrawalTypeFormOpen, setWithdrawalTypeFormOpen] = useState(false);
  const [selectedWithdrawalType, setSelectedWithdrawalType] = useState(null);
  const [withdrawalTypeFormMode, setWithdrawalTypeFormMode] = useState("create");
  const [withdrawalTypeDeleteDialogOpen, setWithdrawalTypeDeleteDialogOpen] = useState(false);
  const [withdrawalTypeToDelete, setWithdrawalTypeToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Product functions
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllProducts(); // Access token automatically included!
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      setActionLoading("create");
      await createProduct(productData);
      fetchProducts();
      setFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      setActionLoading("update");
      await updateProduct(selectedProduct.PRODUCT_ID, productData);
      fetchProducts();
      setFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setActionLoading(productToDelete?.PRODUCT_ID);
      await deleteProduct(productToDelete.PRODUCT_ID);
      fetchProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleProductStatus = async (product) => {
    try {
      setActionLoading(product.PRODUCT_ID);
      await toggleProductStatus(product.PRODUCT_ID, {
        isActive: !product.IS_ACTIVE,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error toggling product status:", error);
      setError("Failed to update product status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = (productData) => {
    if (formMode === "create") {
      handleCreateProduct(productData);
    } else {
      handleUpdateProduct(productData);
    }
  };

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Term functions
  const fetchTerms = async () => {
    try {
      const response = await getAllTerms();
      setTerms(response.data || response);
    } catch (error) {
      console.error("Error fetching terms:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch terms",
        severity: "error",
      });
    }
  };

  const handleCreateTerm = async () => {
    try {
      await createTerm(termFormData);
      setSnackbar({
        open: true,
        message: "Term created successfully",
        severity: "success",
      });
      fetchTerms();
      handleTermDialogClose();
    } catch (error) {
      console.error("Error creating term:", error);
      setSnackbar({
        open: true,
        message: "Failed to create term",
        severity: "error",
      });
    }
  };

  const handleUpdateTerm = async () => {
    try {
      await updateTerm(editingTerm.TERM_DETAILS_ID, termFormData);
      setSnackbar({
        open: true,
        message: "Term updated successfully",
        severity: "success",
      });
      fetchTerms();
      handleTermDialogClose();
    } catch (error) {
      console.error("Error updating term:", error);
      setSnackbar({
        open: true,
        message: "Failed to update term",
        severity: "error",
      });
    }
  };

  const handleDeleteTerm = async (termId) => {
    try {
      setActionLoading(termId);
      await deleteTerm(termId);
      setSnackbar({
        open: true,
        message: "Term deleted successfully",
        severity: "success",
      });
      fetchTerms();
    } catch (error) {
      console.error("Error deleting term:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete term",
        severity: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleTermStatus = async (term) => {
    try {
      setActionLoading(term.TERM_DETAILS_ID);
      await toggleTermStatus(term.TERM_DETAILS_ID, { isActive: !term.IS_ACTIVE });
      setSnackbar({
        open: true,
        message: "Term status updated successfully",
        severity: "success",
      });
      fetchTerms();
    } catch (error) {
      console.error("Error toggling term status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update term status",
        severity: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditTerm = (term) => {
    setEditingTerm(term);
    setTermFormData({
      TERM_DETAILS_VALUE: term.TERM_DETAILS_VALUE,
      IS_ACTIVE: term.IS_ACTIVE,
    });
    setTermDialogOpen(true);
  };

  const handleAddTerm = () => {
    setEditingTerm(null);
    setTermFormData({ TERM_DETAILS_VALUE: "", IS_ACTIVE: true });
    setTermDialogOpen(true);
  };

  const handleTermDialogClose = () => {
    setTermDialogOpen(false);
    setEditingTerm(null);
    setTermFormData({ TERM_DETAILS_VALUE: "", IS_ACTIVE: true });
  };

  const handleTermSubmit = () => {
    if (editingTerm) {
      handleUpdateTerm();
    } else {
      handleCreateTerm();
    }
  };

  // Withdrawal Type functions
  const fetchWithdrawalTypes = async () => {
    try {
      const response = await getAllWithdrawalTypes();
      setWithdrawalTypes(response.data || response);
    } catch (error) {
      console.error("Error fetching withdrawal types:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch withdrawal types",
        severity: "error",
      });
    }
  };

  const handleCreateWithdrawalType = async (withdrawalTypeData) => {
    try {
      setActionLoading("create");
      await createWithdrawalType(withdrawalTypeData);
      setSnackbar({
        open: true,
        message: "Withdrawal type created successfully",
        severity: "success",
      });
      fetchWithdrawalTypes();
      setWithdrawalTypeFormOpen(false);
      setSelectedWithdrawalType(null);
    } catch (error) {
      console.error("Error creating withdrawal type:", error);
      setSnackbar({
        open: true,
        message: "Failed to create withdrawal type",
        severity: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateWithdrawalType = async (withdrawalTypeData) => {
    try {
      setActionLoading("update");
      await updateWithdrawalType(selectedWithdrawalType.WITHDRAWAL_TYPE_ID, withdrawalTypeData);
      setSnackbar({
        open: true,
        message: "Withdrawal type updated successfully",
        severity: "success",
      });
      fetchWithdrawalTypes();
      setWithdrawalTypeFormOpen(false);
      setSelectedWithdrawalType(null);
    } catch (error) {
      console.error("Error updating withdrawal type:", error);
      setSnackbar({
        open: true,
        message: "Failed to update withdrawal type",
        severity: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteWithdrawalType = async () => {
    try {
      setActionLoading(withdrawalTypeToDelete?.WITHDRAWAL_TYPE_ID);
      await deleteWithdrawalType(withdrawalTypeToDelete.WITHDRAWAL_TYPE_ID);
      setSnackbar({
        open: true,
        message: "Withdrawal type deleted successfully",
        severity: "success",
      });
      fetchWithdrawalTypes();
      setWithdrawalTypeDeleteDialogOpen(false);
      setWithdrawalTypeToDelete(null);
    } catch (error) {
      console.error("Error deleting withdrawal type:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete withdrawal type",
        severity: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleWithdrawalTypeStatus = async (withdrawalType) => {
    try {
      setActionLoading(withdrawalType.WITHDRAWAL_TYPE_ID);
      await toggleWithdrawalTypeStatus(withdrawalType.WITHDRAWAL_TYPE_ID, !withdrawalType.IS_ACTIVE);
      setSnackbar({
        open: true,
        message: "Withdrawal type status updated successfully",
        severity: "success",
      });
      fetchWithdrawalTypes();
    } catch (error) {
      console.error("Error toggling withdrawal type status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update withdrawal type status",
        severity: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditWithdrawalType = (withdrawalType) => {
    setSelectedWithdrawalType(withdrawalType);
    setWithdrawalTypeFormMode("edit");
    setWithdrawalTypeFormOpen(true);
  };

  const handleAddWithdrawalType = () => {
    setSelectedWithdrawalType(null);
    setWithdrawalTypeFormMode("create");
    setWithdrawalTypeFormOpen(true);
  };

  const handleWithdrawalTypeFormClose = () => {
    setWithdrawalTypeFormOpen(false);
    setSelectedWithdrawalType(null);
  };

  const handleWithdrawalTypeFormSubmit = (withdrawalTypeData) => {
    if (withdrawalTypeFormMode === "create") {
      handleCreateWithdrawalType(withdrawalTypeData);
    } else {
      handleUpdateWithdrawalType(withdrawalTypeData);
    }
  };

  const openWithdrawalTypeDeleteDialog = (withdrawalType) => {
    setWithdrawalTypeToDelete(withdrawalType);
    setWithdrawalTypeDeleteDialogOpen(true);
  };

  const closeWithdrawalTypeDeleteDialog = () => {
    setWithdrawalTypeDeleteDialogOpen(false);
    setWithdrawalTypeToDelete(null);
  };

  useEffect(() => {
    fetchProducts();
    fetchTerms();
    fetchWithdrawalTypes();
  }, []);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 3, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Product Management Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Product Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          ADD PRODUCT
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.PRODUCT_ID}>
                  <TableCell>{product.PRODUCT_ID}</TableCell>
                  <TableCell>{product.PRODUCT}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.IS_ACTIVE ? "Active" : "Inactive"}
                      color={product.IS_ACTIVE ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(product.CREATED_AT).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(product.UPDATED_AT).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleToggleProductStatus(product)}
                      color={product.IS_ACTIVE ? "success" : "error"}
                      disabled={actionLoading === product.PRODUCT_ID}
                    >
                      {product.IS_ACTIVE ? <ToggleOn /> : <ToggleOff />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditProduct(product)}
                      color="primary"
                      disabled={actionLoading === product.PRODUCT_ID}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteDialog(product)}
                      color="error"
                      disabled={actionLoading === product.PRODUCT_ID}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Product Form Dialog */}
      <ProductForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        mode={formMode}
        loading={actionLoading === "create" || actionLoading === "update"}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{productToDelete?.PRODUCT_NAME}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteProduct}
            color="error"
            variant="contained"
            disabled={actionLoading === productToDelete?.PRODUCT_ID}
          >
            {actionLoading === productToDelete?.PRODUCT_ID ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Terms Management Section */}
      <Paper sx={{ p: 2, mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Term Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTerm}
          >
            ADD TERM
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Term Details Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {terms.map((term) => (
                <TableRow key={term.TERM_DETAILS_ID}>
                  <TableCell>{term.TERM_DETAILS_ID}</TableCell>
                  <TableCell>{term.TERM_DETAILS_VALUE}</TableCell>
                  <TableCell>
                    <Chip
                      label={term.IS_ACTIVE ? "Active" : "Inactive"}
                      color={term.IS_ACTIVE ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(term.CREATED_AT).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(term.UPDATED_AT).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleToggleTermStatus(term)}
                      color={term.IS_ACTIVE ? "success" : "error"}
                      disabled={actionLoading === term.TERM_DETAILS_ID}
                    >
                      {term.IS_ACTIVE ? <ToggleOn /> : <ToggleOff />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditTerm(term)}
                      color="primary"
                      disabled={actionLoading === term.TERM_DETAILS_ID}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteTerm(term.TERM_DETAILS_ID)}
                      color="error"
                      disabled={actionLoading === term.TERM_DETAILS_ID}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Withdrawal Type Management Section */}
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Withdrawal Type Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddWithdrawalType}
          >
            ADD WITHDRAWAL TYPE
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Withdrawal Type Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawalTypes.map((withdrawalType) => (
                <TableRow key={withdrawalType.WITHDRAWAL_TYPE_ID}>
                  <TableCell>{withdrawalType.WITHDRAWAL_TYPE_ID}</TableCell>
                  <TableCell>{withdrawalType.WITHDRAWAL_TYPE_VALUE}</TableCell>
                  <TableCell>
                    <Chip
                      label={withdrawalType.IS_ACTIVE ? "Active" : "Inactive"}
                      color={withdrawalType.IS_ACTIVE ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(withdrawalType.CREATED_AT).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(withdrawalType.UPDATED_AT).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleToggleWithdrawalTypeStatus(withdrawalType)}
                      color={withdrawalType.IS_ACTIVE ? "success" : "error"}
                      disabled={actionLoading === withdrawalType.WITHDRAWAL_TYPE_ID}
                    >
                      {withdrawalType.IS_ACTIVE ? <ToggleOn /> : <ToggleOff />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditWithdrawalType(withdrawalType)}
                      color="primary"
                      disabled={actionLoading === withdrawalType.WITHDRAWAL_TYPE_ID}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openWithdrawalTypeDeleteDialog(withdrawalType)}
                      color="error"
                      disabled={actionLoading === withdrawalType.WITHDRAWAL_TYPE_ID}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Withdrawal Type Form Dialog */}
      <WithdrawalTypeForm
        open={withdrawalTypeFormOpen}
        mode={withdrawalTypeFormMode}
        withdrawalType={selectedWithdrawalType}
        onSubmit={handleWithdrawalTypeFormSubmit}
        onClose={handleWithdrawalTypeFormClose}
        loading={actionLoading === "create" || actionLoading === "update"}
      />

      {/* Withdrawal Type Delete Confirmation Dialog */}
      <Dialog
        open={withdrawalTypeDeleteDialogOpen}
        onClose={closeWithdrawalTypeDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the withdrawal type "{withdrawalTypeToDelete?.WITHDRAWAL_TYPE_VALUE}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWithdrawalTypeDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteWithdrawalType}
            color="error"
            variant="contained"
            disabled={actionLoading === withdrawalTypeToDelete?.WITHDRAWAL_TYPE_ID}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Term Dialog */}
      <Dialog open={termDialogOpen} onClose={handleTermDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTerm ? "Edit Term" : "Add New Term"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Term Details Value"
            fullWidth
            variant="outlined"
            value={termFormData.TERM_DETAILS_VALUE}
            onChange={(e) =>
              setTermFormData({
                ...termFormData,
                TERM_DETAILS_VALUE: e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={termFormData.IS_ACTIVE}
                onChange={(e) =>
                  setTermFormData({
                    ...termFormData,
                    IS_ACTIVE: e.target.checked,
                  })
                }
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTermDialogClose}>Cancel</Button>
          <Button
            onClick={handleTermSubmit}
            variant="contained"
            disabled={!termFormData.TERM_DETAILS_VALUE.trim()}
          >
            {editingTerm ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Admin;