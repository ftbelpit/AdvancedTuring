import { api, requestConfig } from "../utils/configCar";

// Insert an hour
const insertHour = async(data, washerId, token_admin) => {
  const config = requestConfig("POST", data, token_admin)

  try {
    const res = await fetch(api + "/hours/washer/" + washerId, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Remover horário de um lavador
const deleteHour = async (id, token_admin) => {
  const config = requestConfig("DELETE", null, token_admin, true);

  try {
    const res = await fetch(api + "/hours/washer/" + id, config);
    const jsonData = await res.json();
    return jsonData;
  } catch (error) {
    console.log(error);
  }
};


// Obter horários de um lavador
const getHours = async (washerId) => {
  const config = requestConfig("GET", null, true);

  try {
    const res = await fetch(api + "/hours/washer/" + washerId, config);
    const jsonData = await res.json();
    return jsonData;
  } catch (error) {
    console.log(error);
  }
}

const getAvailableHours = async (washerId, date) => {
  const config = requestConfig("GET", null, true);

  try {
    const res = await fetch(api + "/hours/washer/available-hours/" + washerId + "/" + date, config);
    const jsonData = await res.json();
    return jsonData;
  } catch (error) {
    console.log(error)
  }
};

const hourService = {
  insertHour,
  deleteHour,
  getHours,
  getAvailableHours
}

export default hourService