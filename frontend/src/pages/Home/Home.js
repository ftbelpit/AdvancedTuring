import "./Home.css";

import DatePicker from "react-datepicker";

import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

import { BsFillCalendarCheckFill } from "react-icons/bs"

// hooks
import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// redux
import { getUserCars } from "../../slices/carSlice";
import { getWashers, resetMessage } from "../../slices/washerSlice";

import { useParams, useNavigate, Link } from "react-router-dom";

import WasherItem from "../../components/WasherItem";

const formatDateToDDMMYYYY = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("name");
  const [selectedCar, setSelectedCar] = useState(null);
  const [date, setDate] = useState("")

  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.user);
  const { washers } = useSelector((state) => state.washer);
  const { cars } = useSelector((state) => state.car);

  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate()

  const popupRef = useRef(null);

  useEffect(() => {
    dispatch(getUserCars(id));
    dispatch(getWashers());
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowDatePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleWashButtonClick = (washerName, washerId) => {
    if (!selectedCar || !date) {
      setShowPopup(true);
    } else {
      const { fabricante, modelo, ano } = selectedCar;

      const formattedDate = formatDateToDDMMYYYY(new Date(date));
  
      // Combinar os parâmetros em uma única string
      const params = `fabricanteParam=${encodeURIComponent(fabricante)}&modeloParam=${encodeURIComponent(modelo)}&anoParam=${encodeURIComponent(ano)}&washerNameParam=${encodeURIComponent(washerName)}&washerIdParam=${encodeURIComponent(washerId)}&dateParam=${encodeURIComponent(formattedDate)}`;
  
      resetComponentMessage();
  
      // Redirecionar para a página AddWash com os parâmetros combinados
      navigate(`/addwash/${user._id}?${params}`);
    }
  }  

  registerLocale("pt-BR", ptBR);

  const closePopup = () => {
    setShowPopup(false);
    setShowDatePopup(false);
  };

  const handleDateButtonClick = () => {
    setShowDatePopup(true);
  };
  
  const handleSelectOrder = (e) => {
    const order = e.target.value;
    setSelectedOrder(order);
  };

  const calculateAverageScore = (assessments) => {
    if (assessments.length === 0) {
      return 0;
    }
  
    const totalScore = assessments.reduce(
      (accumulator, assessment) => accumulator + assessment.score,
      0
    );
  
    return totalScore / assessments.length;
  };

  const orderedWashers = useMemo(() => {
    const washersCopy = [...washers];
  
    switch (selectedOrder) {
      case "name":
        washersCopy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "score":
        washersCopy.sort((a, b) => {
          const averageScoreA = calculateAverageScore(a.assessments);
          const averageScoreB = calculateAverageScore(b.assessments);
          return averageScoreB - averageScoreA;
        });
        break;
      case "assessments":
        washersCopy.sort((a, b) => b.assessments.length - a.assessments.length);
        break;
      case "price":
        washersCopy.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
  
    return washersCopy;
  }, [washers, selectedOrder]);

  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 representa domingo, 6 representa sábado
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="home">
      <div className="home-title">
        <h2>Lavadores disponíveis próximos de você...</h2>
      </div>
      <div className="home-options">
        <div className="select">
          <span>Lavar:</span>
          <select
            className="select-car"
            onChange={(e) => {
              const selectedCarId = e.target.value;
              const selectedCar = cars.find((car) => car._id === selectedCarId);

              setSelectedCar(selectedCar);
            }}
            onClick={handleDateButtonClick}
          >
            <option>Selecione um carro</option>
            {cars &&
              cars.length > 0 &&
              cars.map((car) => (
                <option
                  key={car._id}
                  value={car._id}
                  className="select-button"
                >
                  {car.fabricante} {car.modelo} {car.ano}
                </option>
              ))}
          </select>
        </div>
        {selectedCar && (
          <>
          {showDatePopup && (
            <div
              className="overlay-date"
              onClick={(e) => {
                if (popupRef.current && !popupRef.current.contains(e.target)) {
                  setShowPopup(false);
                }
              }}
            >
              <div className="popup-date" ref={popupRef}>
                <div className="popup-content-date">
                  <h2>Adicionar Data</h2>
                    <span>Escolha a data da lavagem:</span>
                    <div className="date-input">
                      <div>
                        <DatePicker
                          placeholderText="dd/mm/aaaa"
                          selected={date}
                          onChange={(date) => setDate(date)}
                          minDate={new Date()}
                          filterDate={(date) => !isWeekend(date)}
                          dateFormat="dd/MM/yyyy" // Atualizado para o formato "dd-MM-yyyy"
                          locale="pt-BR"
                        />
                        <BsFillCalendarCheckFill className="date-icon" />
                      </div>
                      <div className="button-date">
                        <button onClick={closePopup}>Escolher lavador</button>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          )}    
          </> 
        )}
        <div className="select2">
          <span>Ordenar por:</span>
          <select
            className="select-ordem"
            onChange={handleSelectOrder}
            value={selectedOrder}
          >
            <option value="assessments">Avaliações</option>
            <option value="name">Nome</option>
            <option value="score">Nota</option>
            <option value="price">Preço</option>
          </select>
        </div>
      </div>
      {showPopup && (
        <>
          <div className="overlay-home"></div>
          <div className="popup-home">
            <p>Por favor, selecione um carro antes de escolher o lavador.</p>
            <button onClick={closePopup}>Fechar</button>
          </div>
        </>
      )}
      {orderedWashers.map((washer) => {
        let totalScore = 0;

        washer.assessments.forEach((assessment) => {
          totalScore += parseInt(assessment.score, 10); // ou parseFloat(assessment.score) se for um número de ponto flutuante
        });        

        const averageScore = totalScore / washer.assessments.length;

        return (
          <div className="home-card" key={washer._id}>
            <div className="home-profile">
              <div className="img">
                <WasherItem washer={washer} />
              </div>
              <p className="name">{washer.name}</p>
            </div>
            <div className="home-assets">
              <div className="home-assets-detail">
                <span className="home-note">
                  Nota: {averageScore.toFixed(2)} ({washer.assessments.length} avaliações)
                </span>
                <span className="home-price">R$ {washer.price}</span>
              </div>
              <div className="home-assets-buttons">
                <Link to={`/assessments/${washer._id}`}>
                  <button className="button-assessment">Ver avaliações</button>
                </Link>
                <button
                  type="submit"
                  className="button-wash"
                  onClick={() => handleWashButtonClick(washer.name, washer._id)}
                >
                  Lavar meu carro
                </button>
              </div>
            </div>
          </div>
        );
      })}

    </div>
  );
};

export default Home