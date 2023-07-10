import "./AllWashes.css"

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Message from "../../components/Message";

// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect  } from "react";

// redux
import { getWashes, getUserWashes, deleteWash } from "../../slices/washSlice";
import { useParams } from "react-router-dom";
import { getWashers } from "../../slices/washerSlice";

const AllWashes = () => {
  const { id } = useParams()

  const dispatch = useDispatch()

  // const currentDate = new Date();

  const { loading } = useSelector((state) => state.user)

  const { 
    washes, 
    error: errorWash, 
    message: messageWash 
  } = useSelector((state) => state.wash)

  useEffect(() => {
    dispatch(getUserWashes(id))
    dispatch(getWashers())
    dispatch(getWashes())
  }, [dispatch, id]) 

  const handleDelete = (id) => {
    dispatch(deleteWash(id))
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="washes-list">
      <div className="profile-title">
        <h2>Todas as lavagens</h2>
      </div>
      {washes && washes.length > 0 && washes.map((wash) => {
      const washDate = new Date(wash.date);
      washDate.setDate(washDate.getDate() + 1); // Adiciona um dia à data

      const dataFormatada = format(washDate, "d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });

      // const washDateIsPast = washDate < currentDate; // Verifica se a data da lavagem é passada

        return (
          <div className="washes-card" key={wash._id}>
            <div className="washes-info">
              <span>Lavador</span>
              <span>{wash.washer.name}</span>
            </div>
            <div className="washes-car">
              <span>Carro</span>
              <span>{wash.car.fabricante} {wash.car.modelo}</span>
            </div>
            <div className="washes-price-date">
              {/* <div className="washes-mark">
                <button className="success">Lavagem concluída</button>
                <button className="failed">Lavagem cancelada</button>
              </div> */}
              {/* <div className="washes-details"> */}
                <span className="washes-price">R$ {wash.washerPrice}</span>
                <span className="washes-date">{dataFormatada}</span>
                <button onClick={() => handleDelete(wash._id)}>deletar</button>
              {/* </div> */}
            </div>
          </div>
        )
      })}
      {errorWash && <Message msg={errorWash} type="error"/>}
      {messageWash && <Message msg={messageWash} type="success"/>}
    </div>
  );
};

export default AllWashes