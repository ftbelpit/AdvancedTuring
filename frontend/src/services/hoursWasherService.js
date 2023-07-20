import { api, requestConfig } from "../utils/config";

const addTimeToWasher = async(data, token_admin) => {
  const config = requestConfig("POST", data, token_admin, true)

  try {
    const res = await fetch(api + "/hoursWashers", config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

const removeTimeFromWasher = async (data, washerId, token_admin) => {
  const config = requestConfig("DELETE", data, token_admin);

  try {
    const res = await fetch(api + `/hoursWashers/` + washerId, config);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return { errors: ["Erro ao remover horário do lavador."] };
  }
};

const hoursWasherService = {
  addTimeToWasher,
  removeTimeFromWasher,
};

export default hoursWasherService