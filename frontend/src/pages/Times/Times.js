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

  const { admin } = useSelector((state) => state.authAdmin);
  const { loading } = useSelector((state) => state.admin);

  const {
    washer,
    loading: loadingWasher,
    message: messageWasher,
    error: errorWasher,
  } = useSelector((state) => state.washer);

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
    if (messageWasher) {
      // Atualiza o estado washer com os novos dados após a adição do horário
      dispatch(getWasher(id));
    }
  }, [dispatch, id, messageWasher]);

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleTime = (e) => {
    e.preventDefault();

    const timeData = {
      hour: hour,
      id: washer._id,
    };

    dispatch(times(timeData));

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
        {washer.hour && (
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
                        {!loadingWasher && <input type="submit" value="Adicionar" />}
                        {loadingWasher && <input type="submit" disabled value="Aguarde..." />}
                      </div>
                      {errorWasher && <Message msg={errorWasher} type="error" />}
                      {messageWasher && <Message msg={messageWasher} type="success" />}
                    </form>
                  </div>
                </div>
              </div>
            )}
            <h3 className="horarios">Segunda a sexta</h3>
            {washer.hour && washer.hour.length > 0 ? (
              [...washer.hour] // Cria uma cópia do array original
                .sort((a, b) => parseInt(a, 10) - parseInt(b, 10)) // Ordena os horários do menor ao maior
                .map((hour, index) => (
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