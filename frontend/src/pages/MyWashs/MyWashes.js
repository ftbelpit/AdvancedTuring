import "./MyWashes.css"

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Message from "../../components/Message";

// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// redux
import { deleteWash, getUserWashes, resetMessage } from "../../slices/washSlice";
import { useParams } from "react-router-dom";
import { getWashers } from "../../slices/washerSlice";

const MyWashes = () => {
  const { id } = useParams()

  const dispatch = useDispatch()

  const currentDate = new Date();

  const { loading } = useSelector((state) => state.user)

  const {
    washes,
    error: errorWash,
    message: messageWash
  } = useSelector((state) => state.wash)

  useEffect(() => {
    dispatch(getUserWashes(id))
    dispatch(getWashers())
  }, [dispatch, id])

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
    <div className="wash-list">
      <div className="profile-title">
        <h2>Minhas lavagens</h2>
      </div>
      {washes && washes.length > 0 && washes.map((wash) => {
      const washDate = new Date(wash.date);
      washDate.setDate(washDate.getDate() + 1); // Adiciona um dia à data

      const dataFormatada = format(washDate, "d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });

        const washDateIsPast = washDate < currentDate; // Verifica se a data da lavagem é passada

        return (
          <div className="wash-card" key={wash._id}>
            <div className="wash-info">
              <span>Lavador</span>
              <p>{wash.washer.name}</p>
            </div>
            <div className="wash-car">
              <span>Carro</span>
              <p>{wash.car.fabricante} {wash.car.modelo}({wash.car.ano})</p>
            </div>
            <div className="wash-div">  
              <div className="wash-price-button">
                {washDateIsPast ? ( // Verifica se a data é passada
                    dataFormatada
                  ) : (
                    <>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(wash._id)}
                      >
                        Desmarcar lavagem
                      </button>
                      <span className="wash-price">
                      R$ {wash.washerPrice}
                      </span>
                    </>
                  )}      
              </div>
              <div className="wash-date-div">
                <span className="wash-date">
                  Hora: {wash.hour} Data: {dataFormatada}  
                </span>
              </div>
            </div>
          </div>
        )
      })}
      {errorWash && <Message msg={errorWash} type="error" />}
      {messageWash && <Message msg={messageWash} type="success" />}
    </div>
  );
};

export default MyWashes