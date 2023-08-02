import "./Times.css";

import { FiDelete } from "react-icons/fi"

import { useEffect, useRef, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { useParams } from "react-router-dom";

import { getWasher } from "../../slices/washerSlice";
import { 
  insertHour, 
  getHours, 
  deleteHour,
  resetMessage
} from "../../slices/hourSlice";

import WasherItem from "../../components/WasherItem";
import Message from "../../components/Message";

const Times = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.authAdmin);
  const { loading } = useSelector((state) => state.admin);

  const {
    washer
  } = useSelector((state) => state.washer);

  const {
    hours,
    loading: loadingHour,
    message: messageHour,
    error: errorHour,
  } = useSelector((state) => state.hour);

  const [showPopup, setShowPopup] = useState(false);
  const [hour, setHour] = useState("");

  const popupRef = useRef(null);

  useEffect(() => {
    dispatch(getWasher(id));
    dispatch(getHours(id))
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (messageHour || deleteHour) {
      dispatch(getHours(id));
    }
  }, [dispatch, id, messageHour]);

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleTime = (e) => {
    e.preventDefault();

    const timeData = {
      hour: hour,
      id: washer._id
    };

    dispatch(insertHour(timeData)); // O washerId já vem da URL

    setHour("");

    resetComponentMessage()
  }

  const handleRateButtonClick = () => {
    setShowPopup(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteHour(id))
    resetComponentMessage()
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="times">
      <h2 className="profile-title">Horários do lavador</h2>
      <div className="washer-times">
        <WasherItem washer={washer} />
        {admin && !showPopup && (
          <button className="add-button" onClick={handleRateButtonClick}>
            Adicionar horários
          </button>
        )}
      </div>
      <div>
        {hours && (
          <>
            {showPopup && (
              <div
                className="overlay-times"
                onClick={(e) => {
                  if (popupRef.current && !popupRef.current.contains(e.target)) {
                    setShowPopup(false);
                  }
                }}
              >
                <div className="popup-times" ref={popupRef}>
                  <div className="popup-content-times">
                    <h2>Adicionar Horários</h2>
                    <form onSubmit={handleTime}>
                      <label>Horário:</label>
                      <input
                        type="text"
                        placeholder="Insira o horário"
                        onChange={(e) => setHour(e.target.value)}
                        value={hour || ""}
                      />
                      <div className="button-container-times">
                        {!loadingHour && <input type="submit" value="Adicionar" />}
                        {loadingHour && <input type="submit" disabled value="Aguarde..." />}
                      </div>     
                      {errorHour && <Message msg={errorHour} type="error" />}
                      {messageHour && <Message msg={messageHour} type="success" />}                
                    </form>
                  </div>
                </div>
              </div>
            )}
            <div className="washer-hours">
              <h3 className="horarios">Segunda a sexta</h3>
              {hours && hours.length > 0 ? (
                hours
                  .slice()
                  .sort((a, b) => a.hour.localeCompare(b.hour))
                  .map((hour, index) => (
                    <div className="time-user" key={index}> {/* Utilizando o índice como chave */}
                      <div className="time-hours">
                        <span className="hours">{hour.hour}</span>
                        <FiDelete onClick={() => handleDelete(hour._id)} />
                      </div>
                    </div>
                  ))
              ) : (
                <p>Nenhum horário encontrado.</p>
              )}
            </div>
          </>
        )}
      </div>
      
    </div>
  );
};

export default Times