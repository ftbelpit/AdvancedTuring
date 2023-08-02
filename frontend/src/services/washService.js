import { api, requestConfig } from "../utils/configCar";

// Publish an user wash
const insertWash = async(data, token) => {
  const config = requestConfig("POST", data, token, true)

  try {
    const res = await fetch(api + "/washes", config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get user washes
const getUserWashes = async(id, token) => {
  const config = requestConfig("GET", null, token)
  
  try {
    const res = await fetch(api + "/washes/user/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get washer washes
const getWasherWashes = async(id) => {
  const config = requestConfig("GET", null)
  
  try {
    const res = await fetch(api + "/washes/washer/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Delete a wash
const deleteWash = async (id) => {
  const config = requestConfig("DELETE", null);

  try {
    const res = await fetch(api + "/washes/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};


// get a wash by id
const getWash = async (id, token) => {
  const config = requestConfig("GET", null, token)

  try {
    const res = await fetch(api + "/washes/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get all washes
const getWashes = async(token_admin) => {
  const config = requestConfig("GET", null, token_admin)

  try {
    const res = await fetch(api + "/washes", config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

const washService = {
  insertWash,
  getUserWashes,
  getWasherWashes,
  deleteWash,
  getWash,
  getWashes
}

export default washService