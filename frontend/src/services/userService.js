import {api, requestConfig} from "../utils/config"

// Get user details
const profile = async(data, token) => {
  const config = requestConfig("GET", data, token)

  try {
    const res = await fetch(api + "/users/profile", config)
      .then((res) => res.json())
      .catch((err) => err)
    
      return res
  } catch (error) {
    console.log(error)
  }
}

// Get user details
const getUserDetails = async (id) => {
  const config = requestConfig("GET")

  try {
    const res = await fetch(api + "/users/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
      console.log(error)
  }
}

// Get all users
const getUsers = async(token) => {
  const config = requestConfig("GET", null, token)

  try {
    const res = await fetch(api + "/users", config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

const userService = {
  profile,
  getUserDetails,
  getUsers
}

export default userService  