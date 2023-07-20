const HoursWasher = require("../models/HoursWasher");
const Washer = require("../models/Washer");

// Add time to a washer
const addTimeToWasher = async (req, res) => {
  const { hour } = req.body;
  const washerId = req.params.washerId; // Obtemos o washerId dos parâmetros de URL

  try {
    // Verificar se o lavador existe no banco de dados
    const washer = await Washer.findById(washerId);
    if (!washer) {
      return res.status(404).json({ errors: ["Lavador não encontrado."] });
    }

    // Verificar se o horário já existe para o lavador
    const existingTime = await HoursWasher.findOne({ washerId: washer._id, hour });
    if (existingTime) {
      return res.status(400).json({ errors: ["Este horário já foi adicionado para o lavador."] });
    }

    // Criar o novo horário para o lavador
    const newTime = await HoursWasher.create({
      washerId: washer._id,
      hour
    });

    res.status(201).json({
      hour: newTime,
      message: "Horário adicionado com sucesso!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Houve um problema ao adicionar o horário."] });
  }
}

// Remove time from a washer
const removeTimeFromWasher = async (req, res) => {
  const { hour } = req.body;
  const { washerId } = req.params;

  try {
    // Verificar se o horário existe no banco de dados para o lavador
    const existingTime = await HoursWasher.findOne({ washerId, hour });

    if (!existingTime) {
      return res.status(404).json({ errors: [`O horário ${hour} não foi encontrado na lista`] });
    }

    // Remover o horário do lavador
    await existingTime.remove();

    res.status(200).json({
      hour: existingTime.hour,
      message: "Horário removido com sucesso!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Houve um problema ao remover o horário."] });
  }
};

const getHoursWasher = async (req, res) => {
  const { washerId } = req.params;

  try {
    const hours = await HoursWasher.find({ washerId });

    res.status(200).json(hours);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Houve um problema ao obter os horários do lavador."] });
  }
};

module.exports = {
  addTimeToWasher,
  removeTimeFromWasher,
  getHoursWasher
};
