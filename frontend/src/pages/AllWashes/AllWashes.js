import "./AllWashes.css"

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Message from "../../components/Message";

// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// redux
import { deleteWash, getWashes, resetMessage } from "../../slices/washSlice";
import { Link } from "react-router-dom";
import { getWashers } from "../../slices/washerSlice";

const MyWashes = () => {
  const dispatch = useDispatch()

  const currentDate = new Date();

  const { userAuth } = useSelector((state) => state.auth)

  const { loading } = useSelector((state) => state.user)

  const {
    washes,
    error: errorWash,
    message: messageWash
  } = useSelector((state) => state.wash)

  useEffect(() => {
    dispatch(getWashes())
    dispatch(getWashers())
  }, [dispatch])

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleDelete = (id) => {
    dispatch(deleteWash(id))
    resetComponentMessage()
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="washes-list">
      <div className="profile-title">
        <h2>Minhas lavagens</h2>
      </div>
      <div className="washes-container">
        {washes && washes.length > 0 ? ( 
          washes.map((wash) => {
        const washDate = new Date(wash.date);
        const washTime = wash.hour.split(":");
        const washDateTime = new Date(washDate.getFullYear(), washDate.getMonth(), washDate.getDate(), washTime[0], washTime[1]);

        const dataFormatada = format(washDate, "d 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        });

        const washIsPast = washDateTime > currentDate;  

          return (
            <div className="washes-card" key={wash._id}>
              <div className="washes-user">
                <span>Usuário</span>
                <p>{wash.userName}</p>
              </div>
              <div className="washes-info">
                <span>Lavador</span>
                <p>{wash.washer.name}</p>
              </div>
              <div className="washes-car">
                <span>Carro</span>
                <p>{wash.car.fabricante} {wash.car.modelo}({wash.car.ano})</p>
              </div>
              <div className="washes-price-button">
                {washIsPast ? ( // Verifica se a data é passada
                  <>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(wash._id)}
                    >
                      Desmarcar lavagem
                    </button>
                    <span className="washes-price">
                      R$ {wash.washerPrice}
                    </span>
                  </>
                ) : (
                  <>
                    <button
                      className="mark-button" 
                    >
                      Lavagem concluída
                    </button>
                    <span className="washes-price">
                    R$ {wash.washerPrice}
                    </span>
                  </>
                )}      
              </div>
              <span className="washes-date">  
                {dataFormatada} às {wash.hour}
              </span>
            </div>
          )
        })
        ) : (
          <p className="click">
            Nenhuma lavagem encontrada. <Link to={`/${userAuth?._id ?? ""}`}>Clique aqui</Link> para agendar.
          </p>
        )}
      </div>
      {errorWash && <Message msg={errorWash} type="error" />}
      {messageWash && <Message msg={messageWash} type="success" />}
    </div>
  );
};

export default MyWashes