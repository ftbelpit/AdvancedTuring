import "./AddWash.css";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import { registerLocale, setDefaultLocale } from "react-datepicker";
// import pt from "date-fns/locale/pt-BR";
import { format, parse } from "date-fns";

// components
import Message from "../../components/Message";

// hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// redux
import { insertWash,  resetMessage } from "../../slices/washSlice";
import { getWashers } from "../../slices/washerSlice";
import { getUserCars } from "../../slices/carSlice";
import { getHours, getAvailableHours } from "../../slices/hourSlice";

// import {BsFillCalendarCheckFill} from "react-icons/bs"

const AddWash = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const fabricanteParam = params.get("fabricanteParam");
  const modeloParam = params.get("modeloParam");
  const anoParam = params.get("anoParam");
  const washerNameParam = params.get("washerNameParam");
  const washerIdParam = params.get("washerIdParam");
  const dateParam = params.get("dateParam");

  const { loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    washes,
    loading: loadingWash,
    message: messageWash,
    error: errorWash,
  } = useSelector((state) => state.wash);

  const { cars } = useSelector((state) => state.car);
  const { washers } = useSelector((state) => state.washer);
  const { hours } = useSelector((state) => state.hour);

  const [fabricante, setFabricante] = useState(fabricanteParam || "");
  const [modelo, setModelo] = useState(modeloParam || "");
  const [ano, setAno] = useState(anoParam || "");
  const [name, setName] = useState(washerNameParam || "");
  const [date, setDate] = useState(dateParam || "");
  const [hour, setHour] = useState("");

  const newWashForm = useRef();

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  useEffect(() => {
    dispatch(getUserCars(id));
    dispatch(getWashers());
    dispatch(getHours(washerIdParam))
  }, [dispatch, id, washerIdParam]);

  useEffect(() => {
    // Verifique se há uma mensagem de sucesso (messageWash) e navegue para a página de lavagens após 2 segundos
    if (messageWash) {
      setTimeout(() => {
        navigate(`/washes/${userAuth._id}`);
        setFabricante("");
        setModelo("");
        setAno("");
        setName("");
        setDate("");
        setHour("");
      }, 2000); // 2000 milissegundos = 2 segundos
    }
  }, [messageWash, navigate, userAuth._id]);

  useEffect(() => {
    if (name && date) {
      dispatch(getAvailableHours({ washerId: washerIdParam, date: dateParam }));
    }
  }, [dispatch, name, date, dateParam, washerIdParam]);   
    
  // Aqui vêm as alterações para lidar com os horários utilizados
  const filterUsedHours = () => {
    // Filtra os horários já utilizados pelo lavador selecionado
    const usedHours = washes
      .filter((wash) => wash.washerId === washerIdParam && wash.date === dateParam)
      .map((wash) => wash.hour);
  
    return hours.filter((hour) => !usedHours.includes(hour.hour));
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
      washerId: washerIdParam,
    };
  
    dispatch(insertWash(washData));
  
    resetComponentMessage();
  };  

  // registerLocale("pt-BR", pt);
  // setDefaultLocale("pt-BR");

  if (loading) {
    return <p>Carregando...</p>;
  }

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
                  disabled
                >
                  <option value="">Escolha o fabricante do carro</option>
                  {cars.map((car) => (
                    <option key={car._id} value={car.fabricante} >
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
                  disabled
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
                  disabled
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
                  disabled
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
                <input 
                  type="text"
                  onChange={(e) => setDate(e.target.value)}
                  value={date ? format(parse(date, "dd-MM-yyyy", new Date()), "dd/MM/yyyy") : ""}
                  disabled
                />
              </div>
              <div className="add-hour-wash-card">
                <label>Horário</label>
                <select
                  onChange={(e) => setHour(e.target.value)}
                  value={hour || ""}
                >
                  <option>Escolha o horário</option>
                  {hours && hours.length > 0 ? (
                    filterUsedHours().map((hour, index) => (
                      <option key={index} value={hour.hour}>
                        {hour.hour}
                      </option>
                    ))
                  ) : (
                    <option disabled>Nenhum horário encontrado.</option>
                  )}
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

export default AddWash