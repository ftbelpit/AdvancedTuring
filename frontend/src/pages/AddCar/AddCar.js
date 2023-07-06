import "./AddCar.css"

// components
import Message from "../../components/Message"

// hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom";

// redux
import { getUserDetails } from "../../slices/userSlice";
import { insertCar, resetMessage } from "../../slices/carSlice";


const AddCar = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { loading } = useSelector((state) => state.user)
  const { user: userAuth } = useSelector((state) => state.auth)
  const { 
    loading: loadingCar, 
    message: messageCar,
    error: errorCar
  } = useSelector((state) => state.car)

  const [fabricante, setFabricante] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");

  const newCarForm = useRef();

  useEffect(() => {
    dispatch(getUserDetails(id))
  }, [dispatch, id])

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const submitHandle = (e) => {
    e.preventDefault();
  
    const carData = {
      fabricante,
      modelo,
      ano,
    };
  
    dispatch(insertCar(carData));
  
    setFabricante("");
    setModelo("");
    setAno("");
  
    resetComponentMessage();
  };  

  useEffect(() => {
    if (messageCar) {
      setTimeout(() => {
        navigate(`/cars/${userAuth._id}`);
      }, 2000); // 2000 milliseconds = 2 seconds 
    }
  }, [messageCar, navigate, userAuth._id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="data-car">
      <div className="profile-title">
        <h2>Adicionar carro</h2>
      </div>
      {id === userAuth._id && (
        <>
          <div ref={newCarForm}>
            <form id="carForm" onSubmit={submitHandle}>
              <div className="data-card">
                <label>Fabricante</label>
                <input
                  type="text"
                  placeholder="Insira um fabricante"
                  onChange={(e) => setFabricante(e.target.value)}
                  value={fabricante || ""}
                />
              </div>
              <div className="data-card">
                <label>Modelo</label>
                <input
                  type="text"
                  placeholder="Insira um modelo"
                  onChange={(e) => setModelo(e.target.value)}
                  value={modelo || ""}
                />
              </div>
              <div className="data-card">
                <label>Ano</label>
                <input
                  type="text"
                  placeholder="Insira um ano"
                  onChange={(e) => setAno(e.target.value)}
                  value={ano || ""}
                />
              </div>
                <div className="add-button">
                {!loadingCar && <input type="submit" value="Cadastrar" />}
                {loadingCar && (
                  <input type="submit" disabled value="Aguarde..." />              
                )}
                </div>
            </form>
          </div>
          {errorCar && <Message msg={errorCar} type="error"/>}
          {messageCar && <Message msg={messageCar} type="success"/>}
        </>
      )}     
    </div>
  );
}

export default AddCar;
