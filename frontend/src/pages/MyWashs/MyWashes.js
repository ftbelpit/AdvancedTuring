import "./MyWashes.css"

import { format, addDays, isWeekend } from 'date-fns';
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

  const getWeekdayDate = (weekday) => {
    const currentDate = new Date();
    let date = addDays(currentDate, 1); // Começa a busca a partir de amanhã

    while (isWeekend(date) || date.getDay() !== weekday) {
      date = addDays(date, 1); // Incrementa um dia até encontrar o próximo dia útil
    }

    return date;
  };

  if (loading) {
    return <p>Carregando...</p>
  }

  const currentDate = new Date(); // Definir currentDate aqui

  return (
    <div className="wash-list">
      <div className="profile-title">
        <h2>Minhas lavagens</h2>
      </div>
      {washes && washes.length > 0 && washes.map((wash) => {
        const washDay = wash.day;
        const washDate = getWeekdayDate(washDay);

        const dataFormatada = format(washDate, "d 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        });

        const washDateIsPast = washDate < currentDate;

        return (
          <div className="wash-card" key={wash._id}>
            <div className="wash-info">
              <span>Lavador</span>
              <span>{wash.washer.name}</span>
            </div>
            <div className="wash-car">
              <span>Carro</span>
              <span>{wash.car.fabricante} {wash.car.modelo}</span>
            </div>
            <div className="wash-price-date">
              <span className="wash-price">R$ {wash.washerPrice}</span>
              <span className="wash-date">
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
                    {dataFormatada}
                  </>
                )}
              </span>
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