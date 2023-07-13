import "./Assessments.css";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWasher, resetMessage, assessments } from "../../slices/washerSlice";
import { useParams } from "react-router-dom";

import WasherItem from "../../components/WasherItem";
import Message from "../../components/Message";

const Assessments = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const {user} = useSelector((state) => state.auth)

  const { loading } = useSelector((state) => state.user);

  const {
    washer,
    loading: loadingWasher,
    message: messageWasher,
    error: errorWasher,
  } = useSelector((state) => state.washer);

  const [showPopup, setShowPopup] = useState(false);
  const [score, setScore] = useState("")
  const [assessment, setAssessment] = useState("")

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

  const handleAssessment = (e) => {
    e.preventDefault();

    const assessmentData = {
      score: score,
      assessment: assessment,
      id: washer._id,
    };

    dispatch(assessments(assessmentData));

    setScore("")
    setAssessment("")

    resetComponentMessage();
  };

  const handleRateButtonClick = () => {
    setShowPopup(true);
  };


  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="assessments">
      <h2 className="profile-title">Avaliações do Lavador</h2>
      <div className="washer">
        <WasherItem washer={washer} />
        {user && !showPopup && (
          <button className="rate-button" onClick={handleRateButtonClick}>
            Avaliar
          </button>
        )}
      </div>
      <div>
        {washer.assessments && (
          <>
            {showPopup && (
              <div
                className="overlay"
                onClick={(e) => {
                  if (popupRef.current && !popupRef.current.contains(e.target)) {
                    setShowPopup(false);
                  }
                }}
              >
                <div className="popup" ref={popupRef}>
                  <div className="popup-content">
                    <h2>Avaliar Lavador</h2>
                    <form onSubmit={handleAssessment}>
                      <label>Nota (0 a 5):</label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Insira a sua nota" 
                        onChange={(e) => setScore(e.target.value)} 
                        value={score || ""}
                      />
                      <label>Avaliação:</label>
                      <textarea
                        className="textarea"
                        maxLength={200}
                        placeholder="Insira a sua avaliação" 
                        onChange={(e) => setAssessment(e.target.value)} 
                        value={assessment || ""}
                      />
                      <div className="button-container">
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
            <div className="assessments-container">
              <h3>Avaliações: ({washer.assessments.length})</h3>
              {washer.assessments.length === 0 && <p>Não há avaliações...</p>}
              {washer.assessments.map(( assessment, index) => (
                assessment && (
                  <div className="assessment-user" key={`${assessment._id}-${index}`}>
                    <div className="assessment-info">
                      <span className="name">Nome do usuário: {assessment.userName}</span>
                      <span className="score">Nota: {assessment.score}</span>
                      <span className="assessment">Avaliação: {assessment.assessment}</span>
                    </div>
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Assessments;