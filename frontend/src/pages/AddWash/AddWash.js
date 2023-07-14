import "./AddWash.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import pt from "date-fns/locale/pt-BR";

// components
import Message from "../../components/Message";

// hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// redux
import { insertWash, resetMessage } from "../../slices/washSlice";
import { getWashers } from "../../slices/washerSlice";
import { getUserCars } from "../../slices/carSlice";

import { BsFillCalendarCheckFill } from "react-icons/bs";

const AddWash = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const fabricanteParam = params.get("fabricanteParam");
  const modeloParam = params.get("modeloParam");
  const anoParam = params.get("anoParam");
  const washerId = params.get("washerId");
  const washerName = params.get("washerName");

  const { loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    loading: loadingWash,
    message: messageWash,
    error: errorWash,
  } = useSelector((state) => state.wash);

  const { cars } = useSelector((state) => state.car);
  const { washers } = useSelector((state) => state.washer);

  const [fabricante, setFabricante] = useState(fabricanteParam || "");
  const [modelo, setModelo] = useState(modeloParam || "");
  const [ano, setAno] = useState(anoParam || "");
  const [name, setName] = useState(washerName || "");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [scheduled, setScheduled] = useState(false);

  const newWashForm = useRef();

  useEffect(() => {
    dispatch(getUserCars(id));
    dispatch(getWashers());
  }, [dispatch, id]);

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const submitHandle = (e) => {
    e.preventDefault();
  
    const washData = {
      fabricante,
      modelo,
      ano,
      name,
      date,
      hour,
      washerId,
    };
  
    if (isWeekend(date) || isPastDate(date)) {
      // Ignora a submissão se a data for inválida
      return;
    }
  
    dispatch(insertWash(washData))
      .then(() => {
        setScheduled(true);
        resetComponentMessage();
      })
      .catch((error) => {
        // Lidar com erros durante o agendamento
        console.log(error);
      });
  
    setFabricante("");
    setModelo("");
    setAno("");
    setName("");
    setDate("");
    setHour("");
  };  

  useEffect(() => {
    if (messageWash) {
      setTimeout(() => {
        navigate(`/washes/${userAuth._id}`);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  }, [messageWash, navigate, userAuth._id]);

  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 representa domingo, 6 representa sábado
  };

  // Função para verificar se uma data é anterior à data atual
  const isPastDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Define a hora atual como 00:00:00 para considerar apenas a data
    return date < today;
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  registerLocale("pt-BR", pt);
  setDefaultLocale("pt-BR");

  return (
    <div className="add-wash">
      <div className="profile-title">
        <h2>Adicionar lavagem</h2>
      </div>
      {id === userAuth._id && (
        <>
          <div ref={newWashForm}>
            <form id="add-washForm" onSubmit={submitHandle}>
              <div className="add-wash-card">
                <label>Fabricante</label>
                <select
                  onChange={(e) => {
                    setFabricante(e.target.value);
                  }}
                  value={fabricante || ""}
                >
                  <option value="">Escolha o fabricante do carro</option>
                  {cars.map((car) => (
                    <option key={car._id} value={car.fabricante}>
                      {car.fabricante.charAt(0).toUpperCase() +
                        car.fabricante.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-wash-card">
                <label>Modelo</label>
                <select
                  onChange={(e) => setModelo(e.target.value)}
                  value={modelo || ""}
                >
                  <option>Escolha o modelo do carro</option>
                  {cars.map((car) => (
                    <option key={car._id} value={car.modelo}>
                      {car.modelo.charAt(0).toUpperCase() + car.modelo.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-wash-card">
                <label>Ano</label>
                <select
                  onChange={(e) => setAno(e.target.value)}
                  value={ano || ""}
                >
                  <option>Escolha o ano do carro</option>
                  {cars.map((car) => (
                    <option key={car._id} value={car.ano}>
                      {car.ano}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-wash-card">
                <label>Lavador</label>
                <select
                  onChange={(e) => setName(e.target.value)}
                  value={name || ""}
                >
                  <option>Escolha o lavador</option>
                  {washers.map((washer) => (
                    <option key={washer._id} value={washer.name}>
                      {washer.name.charAt(0).toUpperCase() + washer.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-wash-card">
                <label>Data</label>
                <div className="date-input">
                  <DatePicker
                    placeholderText="Escolha a data"
                    selected={date}
                    onChange={(date) => {
                      setDate(date);
                      setHour(""); // Limpar o horário ao selecionar uma nova data
                    }}
                    minDate={new Date()}
                    filterDate={(date) => !isWeekend(date)}
                    dateFormat="dd/MM/yyyy"
                  />
                  <BsFillCalendarCheckFill className="date-icon" />
                </div>
              </div>
              <div className="add-wash-card">
                <label>Horário</label>
                <select
                  onChange={(e) => setHour(e.target.value)}
                  value={hour || ""}
                >
                  <option>Escolha o horário</option>
                  {washers.map((washer) => {
                    if (washer._id === washerId) {
                      const selectedWasher = washers.find((w) => w._id === washerId);
                      if (selectedWasher && selectedWasher.times) {
                        const unavailableHours = selectedWasher?.washes
                          ?.filter((wash) => wash.date === date)
                          ?.map((wash) => wash.hour);

                          const availableTimes = selectedWasher.times
                          .filter((time) => !unavailableHours?.includes(time.hour) || (hour && time.hour !== hour))
                          .map((time, index) => (
                            <option key={`${time.hour}-${index}`} value={time.hour}>
                              {time.hour}
                            </option>
                          ))                       
                        if (availableTimes.length === 0) {
                          return (
                            <option key="unavailable" disabled>
                              Nenhum horário disponível
                            </option>
                          );
                        }

                        return availableTimes;
                      }
                    }
                    return null;
                  })}
                </select>
              </div>
              <div className="add-button">
                {!loadingWash && <input type="submit" value="Agendar" />}
                {loadingWash && <input type="submit" disabled value="Aguarde..." />}
              </div>
            </form>
          </div>
          {errorWash && <Message msg={errorWash} type="error" />}
          {messageWash && <Message msg={messageWash} type="success" />}
        </>
      )}
    </div>
  );
};

export default AddWash;
