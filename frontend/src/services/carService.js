import { api, requestConfig } from "../utils/configCar";

// Publish an user car
const insertCar = async(data, token) => {
  const config = requestConfig("POST", data, token, true)

  try {
    const res = await fetch(api + "/cars", config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get user cars
const getUserCars = async(id) => {
  const config = requestConfig("GET", null)
  
  try {
    const res = await fetch(api + "/cars/user/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Delete a car
const deleteCar = async(id, token) => {
  const config = requestConfig("DELETE", null, token)

  try {
    const res = await fetch(api + "/cars/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// get a car by id
const getCar = async (id, token) => {
  const config = requestConfig("GET", null, token)

  try {
    const res = await fetch(api + "/cars/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get all cars
const getCars = async(token) => {
  const config = requestConfig("GET", null, token)

  try {
    const res = await fetch(api + "/cars", config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

const carService = {
  insertCar,
  getUserCars,
  deleteCar,
  getCar,
  getCars,
}

export default carService