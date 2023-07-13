import "./UserCars.css"

// components
import { useParams } from "react-router-dom"

// hooks
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

// redux
import { getUserCars } from "../../slices/carSlice"
import { getUserDetails } from "../../slices/userSlice"

const UserCars = () => {

  const { id } = useParams()

  const dispatch = useDispatch()

  const { loading } = useSelector((state) => state.user)
  const { cars } = useSelector((state) => state.car)

    // load user data
    useEffect(() => {
      dispatch(getUserDetails(id))
      dispatch(getUserCars(id))
    }, [dispatch, id])


  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div id="profile">
      <div className="profile-title">
        <h2>Carros do usuário</h2>
      </div>
      <div className="users-cars-container">
        {cars && cars.length > 0 ? (
          cars.map((car) => (
            <div className="profile-cars" key={car._id}>
              <div>
                <span className="fabricante">{car.fabricante} </span>
                <span className="modelo">{car.modelo}</span>
                <p className="ano">{car.ano}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum carro encontrado.</p>
        )}
      </div>
    </div>
  )
}
export default UserCars