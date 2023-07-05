import "./Assessments.css";

import { useEffect, useState } from "react";
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

  const [showForm, setShowForm] = useState(false);
  const [ , setShowButton] = useState(true);
  const [score, setScore] = useState("")
  const [assessment, setAssessment] = useState("")

  useEffect(() => {
    dispatch(getWasher(id));
  }, [dispatch, id]);

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
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
    setShowForm(false);
    setShowButton(true);

    resetComponentMessage();
  };

  const handleRateButtonClick = () => {
    setShowForm(!showForm);
    setShowButton(!showForm);
  };
  
  const handleButtonText = () => {
    if (showForm) {
      return 'Ocultar';
    } else {
      return 'Avaliar';
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="assessments">
      <h2 className="profile-title">Avaliações do Lavador</h2>
      <div className="washer">
        <WasherItem washer={washer} />
        {user && (
          <button className="rate-button" onClick={handleRateButtonClick}>
            {handleButtonText()}
          </button>
        )}
      </div>
      <div>
        {washer.assessments && (
          <>
            {showForm && (
              <div className="form-container">
                <h2>Avaliar Lavador</h2>
                <form onSubmit={handleAssessment}>
                  <label>Nota (0 a 5):</label>
                  <input
                    className="input"
                    type="number"
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
            )}
            <h3>Avaliações: ({washer.assessments.length})</h3>
            {washer.assessments.length === 0 && <p>Não há avaliações...</p>}
            {washer.assessments.map(( assessment , index) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default Assessments;