import { api, requestConfig } from "../utils/config";

// Insert an washer
const insertWasher = async(data, token_admin) => {
  const config = requestConfig("POST", data, token_admin, true)

  try {
    const res = await fetch(api + "/washers", config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// get a washer by id
const getWasher = async (id) => {
  const config = requestConfig("GET", null)

  try {
    const res = await fetch(api + "/washers/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get all washers
const getWashers = async() => {
  const config = requestConfig("GET", null)

  try {
    const res = await fetch(api + "/washers", config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// add assessment to a washer
const assessments = async(data, id, token) => {
  const config = requestConfig("PUT", data, token)

  try {
    const res = await fetch(api + "/washers/assessments/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

const washerService = {
  insertWasher,
  getWasher,
  getWashers,
  assessments
}

export default washerService