import { getRequest, postRequest, putRequest, deleteRequest } from "./APIUtils";
import config from "../models/common/AppConfig";

// Get all products
export async function getAllProducts() {
  try {
    const response = await getRequest(`${config.baseURL}api/admin/products`);
    return response;
  } catch (error) {
    throw error;
  }
}

// Get product by ID
export async function getProductById(id) {
  try {
    const response = await getRequest(`${config.baseURL}api/admin/products/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

// Create new product
export async function createProduct(productData) {
  try {
    const response = await postRequest(
      `${config.baseURL}api/admin/products`,
      productData
    );
    return response;
  } catch (error) {
    throw error;
  }
}

// Update product
export async function updateProduct(id, productData) {
  try {
    const response = await putRequest(
      `${config.baseURL}api/admin/products/${id}`,
      productData
    );
    return response;
  } catch (error) {
    throw error;
  }
}

// Delete product
export async function deleteProduct(id) {
  try {
    const response = await deleteRequest(
      `${config.baseURL}api/admin/products/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

// Toggle product status
export async function toggleProductStatus(id, isActive) {
  try {
    const response = await putRequest(
      `${config.baseURL}api/admin/products/${id}/toggle-status`,
      { isActive }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

// Term API functions
export const getAllTerms = async () => {
  return await getRequest(`${config.baseURL}api/admin/terms`);
};

export const getTermById = async (id) => {
  return await getRequest(`${config.baseURL}api/admin/terms/${id}`);
};

export const createTerm = async (termData) => {
  return await postRequest(`${config.baseURL}api/admin/terms`, termData);
};

export const updateTerm = async (id, termData) => {
  return await putRequest(`${config.baseURL}api/admin/terms/${id}`, termData);
};

export const deleteTerm = async (id) => {
  return await deleteRequest(`${config.baseURL}api/admin/terms/${id}`);
};

export const toggleTermStatus = async (id, isActive) => {
  return await putRequest(`${config.baseURL}api/admin/terms/${id}/toggle-status`, { isActive });
};