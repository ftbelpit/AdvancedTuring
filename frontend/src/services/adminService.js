import {api, requestConfig} from "../utils/config"

// Get admin details
const profileAdmin = async(data, token_admin) => {
  const config = requestConfig("GET", data, token_admin)

  try {
    const res = await fetch(api + "/admins/profile_admin", config)
      .then((res) => res.json())
      .catch((err) => err)
    
      return res
  } catch (error) {
    console.log(error)
  }
}

// Update admin details
const updateProfileAdmin = async(data, token_admin) => {
  const config = requestConfig("PUT", data, token_admin, true)

  try {
    const res = await fetch(api + "/admins", config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
      console.log(error)
  }
}

// Get admin details
const getAdminDetails = async (id_admin) => {
  const config = requestConfig("GET")

  try {
    const res = await fetch(api + "/admins/" + id_admin, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
      console.log(error)
  }
}

const adminService = {
  profileAdmin,
  updateProfileAdmin,
  getAdminDetails
}

export default adminService  