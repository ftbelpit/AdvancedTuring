import "./MyWashes.css"

import { format, parse, getHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Message from "../../components/Message";

// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// redux
import { deleteWash, getUserWashes, resetMessage } from "../../slices/washSlice";
import { Link, useParams } from "react-router-dom";
import { getWashers } from "../../slices/washerSlice";

const MyWashes = () => {
  const { id } = useParams()

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

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, "d 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  };

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="wash-list">
      <div className="profile-title">
        <h2>Minhas lavagens</h2>
      </div>
      <div className="wash-container">
        {washes && washes.length > 0 ? ( 
          washes.map((wash) => {
            const washDate = parse(wash.date, 'dd-MM-yyyy', new Date());
            const washTime = getHours(parse(wash.hour, 'HH:mm', new Date()));
          
            // Combine date and time to get the full datetime of the wash
            const washDateTime = new Date(washDate);
            washDateTime.setHours(washTime);
          
            // Check if the wash datetime is in the past
            const washIsPast = washDateTime > currentDate;

            const dataFormatada = formatDate(wash.date);
            
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
              <div className="wash-price-button">
                {washIsPast ? ( // Verifica se a data é passada
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
                ) : (
                  <>
                    <span className="wash-price">
                    R$ {wash.washerPrice}
                    </span>
                  </>
                )}      
              </div>
              <span className="wash-date">  
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