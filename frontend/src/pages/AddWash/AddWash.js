import "./AddWash.css"

// components
import Message from "../../components/Message"

// hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom";

// redux
import { insertWash, resetMessage } from "../../slices/washSlice";
import { getWashers } from "../../slices/washerSlice";
import { getUserCars } from "../../slices/carSlice";

const AddWash = () => {
  const { id } = useParams()

  const dispatch = useDispatch()

  const navigate = useNavigate(); 
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const fabricanteParam = params.get("fabricanteParam");
  const modeloParam = params.get("modeloParam");
  const washerName = params.get("washerName");

  const { loading } = useSelector((state) => state.user)
  const { user: userAuth } = useSelector((state) => state.auth)
  const { 
    loading: loadingWash, 
    message: messageWash,
    error: errorWash
  } = useSelector((state) => state.wash)
 
  const [fabricante, setFabricante] = useState(fabricanteParam || "");
  const [modelo, setModelo] = useState(modeloParam || "");
  const [name, setName] = useState(washerName || "");
  const [date, setDate] = useState("")

  const newWashForm = useRef();

  useEffect(() => {
    dispatch(getUserCars(id))
    dispatch(getWashers())
  }, [dispatch, id])

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
      name,
      date
    };
  
    dispatch(insertWash(washData));
  
    setFabricante("");
    setModelo("");
    setName("");
    setDate("");
  
    resetComponentMessage();
  };

  useEffect(() => {
    if (messageWash) {
      setTimeout(() => {
        navigate(`/washes/${userAuth._id}`);
      }, 2000); // 2000 milliseconds = 2 seconds 
    }
  }, [messageWash, navigate, userAuth._id]);

   
  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="data-car">
      <div className="profile-title">
        <h2>Adicionar lavagem</h2>
      </div>
      {id === userAuth._id && (
        <>
          <div ref={newWashForm}>
            <form id="carForm" onSubmit={submitHandle}>
              <div className="data-card">
                <label>Fabricante</label>
                <input
                  type="text"
                  onChange={(e) => setFabricante(e.target.value)}
                  value={fabricante || ""}
                />
              </div>
              <div className="data-card">
                <label>Modelo</label>
                <input
                  type="text"
                  onChange={(e) => setModelo(e.target.value)}
                  value={modelo || ""}
                />
              </div>
              <div className="data-card">
                <label>Lavador</label>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name || ""}
                />
              </div>
              <div className="data-card">
                <label>Data</label>
                <input
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  value={date || ""}
                />
              </div>
              <div className="add-button">
              {!loadingWash && <input type="submit" value="Agendar" />}
              {loadingWash && (
                <input type="submit" disabled value="Aguarde..." />              
              )}
              </div>
            </form>
          </div>
          {errorWash && <Message msg={errorWash} type="error"/>}
          {messageWash && <Message msg={messageWash} type="success"/>}
        </>
      )}    
    </div>
  );
}

export default AddWash