import "./Times.css"

import { useEffect, useRef, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { getWasher, resetMessage } from "../../slices/washerSlice";

import { addTimeToWasher } from "../../slices/hoursWasherSlice";

import { useParams } from "react-router-dom";

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
    loading: loadingHoursWasher,
    message: messageHoursWasher,
    error: errorHoursWasher,
  } = useSelector((state) => state.hoursWasher);

  const [showPopup, setShowPopup] = useState(false);
  const [hour, setHour] = useState("");

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

  useEffect(() => {
    if (messageHoursWasher) {
      dispatch(getWasher(id));
    }
  }, [dispatch, id, messageHoursWasher]);

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleTime = (e) => {
    e.preventDefault();

    const timeData = {
      hour: hour,
      washerId: washer._id,
    };

    dispatch(addTimeToWasher(timeData));

    setHour("");

    resetComponentMessage();
    // setShowPopup(false);
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
                      <label>Horários:</label>
                      <input
                        type="text"
                        placeholder="Insira os horários"
                        onChange={(e) => setHour(e.target.value)}
                        value={hour || ""}
                      />
                      <div className="button-container-times">
                        {!loadingHoursWasher && <input type="submit" value="Adicionar" />}
                        {loadingHoursWasher && <input type="submit" disabled value="Aguarde..." />}
                      </div>
                      {errorHoursWasher && <Message msg={errorHoursWasher} type="error" />}
                      {messageHoursWasher && <Message msg={messageHoursWasher} type="success" />}
                    </form>
                  </div>
                </div>
              </div>
            )}
            <h3 className="horarios">Segunda a sexta</h3>
            {hours.length > 0 ? (
              hours.map((hour, index) => (
                <div className="time-user" key={`${hour}-${index}`}>
                  <div className="time-hours">
                    <span className="hours">{hour}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum horário encontrado.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Times