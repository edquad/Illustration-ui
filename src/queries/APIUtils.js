export async function getRequest(endpoint) {
  const response = await fetch(endpoint);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to GET data from ${endpoint}`);
  }

  return response.json();
}

export async function postRequest(endpoint, data) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to POST data to ${endpoint}`);
  }
  return response.json();
}

export async function putRequest(endpoint, data) {
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to PUT data to ${endpoint}`);
  }
  return response.json();
}

export async function deleteRequest(
  endpoint,
  params,
  customHeaders = {}
) {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to Delete data to ${endpoint}`);
  }

  return response.json();
}