import { getRequest, postRequest, deleteRequest } from "./APIUtils";
import config from "../models/common/AppConfig";

export async function getStates() {
  try {
    const response = await getRequest(
      `${config.baseURL}api/illustration/states`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getTermDetails() {
  try {
    const response = await getRequest(
      `${config.baseURL}api/clients/term-details`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getTaxQualificationDetails() {
  try {
    const response = await getRequest(
      `${config.baseURL}api/clients/tax-qualification-details`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getWithdrawalTypeDetails() {
  try {
    const response = await getRequest(
      `${config.baseURL}api/clients/withdrawal-type-details`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getStateProductAvailability(params) {
  if (params != null) {
    try {
      const response = await postRequest(
        `${config.baseURL}api/clients/state-product-availability`,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  return null;
}

export async function getFiaAllocation() {
  try {
    const response = await getRequest(
      `${config.baseURL}api/clients/fia-allocation`
    );
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getMYGACalc(params) {
  if (params != null) {
    try {
      const response = await postRequest(
        `${config.baseURL}api/illustration/myga-calc`,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  return null;
}
export async function getFIACalc(params) {
  if (params != null) {
    try {
      const response = await postRequest(
        `${config.baseURL}api/illustration/fia-calc`,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  return null;
}

export async function createClientInfo(params) {
  console.log("My_params", params);
  if (params != null) {
    try {
      const response = await postRequest(
        `${config.baseURL}api/clients/client-info`,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  return null;
}