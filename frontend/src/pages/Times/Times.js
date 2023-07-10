import "./Times.css";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWasher, resetMessage, times } from "../../slices/washerSlice";
import { useParams } from "react-router-dom";

import WasherItem from "../../components/WasherItem";
import Message from "../../components/Message";

const Times = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const {admin} = useSelector((state) => state.authAdmin)

  const { loading } = useSelector((state) => state.admin);

  const {
    washer,
    loading: loadingWasher,
    message: messageWasher,
    error: errorWasher,
  } = useSelector((state) => state.washer);

  const [showPopup, setShowPopup] = useState(false);
  const [days, setDays] = useState("")
  const [hours, setHours] = useState("")

  const popupRef = useRef(null);

  useEffect(() => {
    dispatch(getWasher(id));
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

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
      setShowPopup(false);
    }, 2000);
  };

  const handleTime = (e) => {
    e.preventDefault();

    const timeData = {
      days: days,
      hours: hours,
      id: washer._id,
    };

    dispatch(times(timeData));

    setDays("")
    setHours("")

    resetComponentMessage();
  };

  const handleRateButtonClick = () => {
    setShowPopup(true);
  };


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
        {washer.times && (
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
                      <label>Dias:</label>
                      <input
                        type="text"
                        placeholder="Insira os dias" 
                        onChange={(e) => setDays(e.target.value)} 
                        value={days || ""}
                      />
                      <label>Horários:</label>
                      <input
                        type="text"
                        placeholder="Insira os horários" 
                        onChange={(e) => setHours(e.target.value)} 
                        value={hours || ""}
                      />
                      <div className="button-container-times">
                        {!loadingWasher && <input type="submit" value="Enviar Avaliação" />}
                        {loadingWasher && <input type="submit" disabled value="Aguarde..." />}
                      </div>
                      {errorWasher && <Message msg={errorWasher} type="error" />}
                      {messageWasher && <Message msg={messageWasher} type="success" />}
                    </form>
                  </div>
                </div>
              </div>
            )}
            <h3 className="horarios">Horários</h3>
            {washer.times.length === 0 && <p>Não há horaŕios...</p>}
            {washer.times.map(( time , index) => (
              time && (
                <div className="time-user" key={`${time._id}-${index}`}>
                  <div className="time-days">
                    <span className="days">Dias de trabalho: {time.days.join(' | ')}</span>
                  </div>
                  <div className="time-hours"> 
                    <span className="hours">Horários disponíveis: {time.hours.join(' | ')}</span>
                  </div>
                </div>
              )
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Times;