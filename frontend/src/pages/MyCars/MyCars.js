import "./MyCars.css"

// components
import Message from "../../components/Message"

// react router
import { Link, useParams } from "react-router-dom"

// hooks
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

// redux
import { deleteCar, getUserCars, resetMessage } from "../../slices/carSlice"
import { getUserDetails } from "../../slices/userSlice"

const MyCars = () => {

  const { id } = useParams()

  const dispatch = useDispatch()

  const { user, loading } = useSelector((state) => state.user)
  const { 
    cars, 
    error: errorCar, 
    message: messageCar 
  } = useSelector((state) => state.car)

  // load user data
  useEffect(() => {
    dispatch(getUserDetails(id))
    dispatch(getUserCars(id))
  }, [dispatch, id])

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleDelete = (id) => {
    dispatch(deleteCar(id))
    resetComponentMessage()
  }

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div id="my-cars">
      <div className="profile-title">
        <h2>Meus Carros</h2>
      </div>
      {cars && cars.length > 0 && cars.map((car) => (
        <div className="card-cars" key={car._id}> 
          <div>
            <span className="fabricante">{car.fabricante} </span> 
            <span className="modelo">{car.modelo}</span>
            <p className="ano">{car.ano}</p>
          </div>
          <div>
            <button className="delete-button" onClick={() => handleDelete(car._id)}>
              Excluir carro
            </button>
          </div>
        </div>  
      ))}
      {errorCar && <Message msg={errorCar} type="error"/>}
      {messageCar && <Message msg={messageCar} type="success"/>}
      <div className="add-button">
        <Link to={`/addcar/${user._id}`}>
          <button>Adicionar carro</button>
        </Link>
      </div>
      
    </div>
  )
}
export default MyCars