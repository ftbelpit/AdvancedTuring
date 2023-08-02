const Hour = require("../models/Hour")
const Washer = require("../models/Washer")
const Wash = require("../models/Wash");

// Add time to a washer
const insertHour = async (req, res) => {
  const { hour } = req.body;
  const washerId = req.params.washerId;
  
  try {
    // Verificar se o lavador existe no banco de dados
    const washer = await Washer.findById(washerId);
    if (!washer) {
      return res.status(404).json({ errors: ["Lavador não encontrado."] });
    }

    // Verificar se o horário já existe para o lavador
    const existingTime = await Hour.findOne({ washerId: washer._id, hour });
    if (existingTime) {
      return res.status(400).json({ errors: ["Este horário já foi adicionado para o lavador."] });
    }
    
    // Criar o novo horário para o lavador
    const newTime = await Hour.create({
      washerId: washer._id,
      hour
    });

    res.status(201).json({
      hour: newTime.hour, // Alteração aqui, enviando somente o atributo "hour" do objeto "newTime"
      message: "Horário adicionado com sucesso!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Houve um problema ao adicionar o horário."] });
  }
}

// Remove time from a washer
const deleteHour = async (req, res) => {
  const { id } = req.params;
  const reqAdmin = req.admin;

  try {
    const hour = await Hour.findOne({ _id: id });

    // Check if wash exists
    if (!hour) {
      return res.status(404).json({ errors: ["Horário não encontrado!"] });
    }

    // Check if wash belongs to user
    if (!reqAdmin) {
      return res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
      });
    }

    await Hour.findOneAndDelete({ _id: id });

    res.status(200).json({
      id: hour._id,
      message: "Horário excluído com sucesso.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: ["Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."],
    });
  }
};

const getHours = async (req, res) => {
  const washerId = req.params.washerId;

  try {
    const hour = await Hour.find({ washerId });

    res.status(200).json(hour);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Houve um problema ao obter os horários do lavador."] });
  }
};

const getAvailableHours = async (req, res) => {
  const { washerId, date } = req.params;

  try {
    // Verificar se o lavador existe no banco de dados
    const washer = await Washer.findById(washerId);
    if (!washer) {
      return res.status(404).json({ errors: ["Lavador não encontrado."] });
    }

    // Obter todos os horários cadastrados para o lavador
    const allHours = await Hour.find({ washerId });

    // Obter todos os agendamentos para o lavador e data especificados
    const bookings = await Wash.find({ washerId, date });

    // Criar um conjunto (Set) com os horários já agendados
    const bookedHoursSet = new Set(bookings.map((booking) => booking.hourId.toString()));

    // Filtrar os horários disponíveis
    const availableHours = allHours.filter((hour) => !bookedHoursSet.has(hour._id.toString()));

    res.status(200).json(availableHours);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Houve um problema ao obter os horários disponíveis."] });
  }
};

module.exports = {
  insertHour,
  deleteHour,
  getHours,
  getAvailableHours
};