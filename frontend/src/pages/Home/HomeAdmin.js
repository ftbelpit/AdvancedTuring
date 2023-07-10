import "./Home.css"

// components
import WasherItem from "../../components/WasherItem"
import { Link } from "react-router-dom"

// hooks
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

// redux
import { getWashers } from "../../slices/washerSlice"

const HomeAdmin = () => {
  const dispatch = useDispatch()

  const { washers } = useSelector((state) => state.washer)
  const { loading } = useSelector((state) => state.admin)

  // load all washers
  useEffect(() => {
    dispatch(getWashers())
  }, [dispatch])

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div id="home">
       <div className="home-title">
          <h2>Lavadores cadastrados</h2>
      </div>
      {washers.map((washer) => {
        let totalScore = 0;

        washer.assessments.forEach((assessment) => {
          totalScore += parseInt(assessment.score, 10); // ou parseFloat(assessment.score) se for um número de ponto flutuante
        });        

        const averageScore = totalScore / washer.assessments.length;

        return (
          <div className="home-card" key={washer._id}>
            <div className="home-profile">
              <div className="img">
                <WasherItem washer={washer} />
              </div>
              <p className="name">{washer.name}</p>
            </div>
            <div className="home-assets">
              <div className="home-assets-detail">
                <span className="home-note">
                  Nota: {averageScore.toFixed(2)} ({washer.assessments.length} avaliações)
                </span>
                <span className="home-price">R$ {washer.price}</span>
              </div>
              <div className="home-assets-buttons">
                <Link to={`/assessments/${washer._id}`}>
                  <button className="button-assessment">Ver avaliações</button>
                </Link>    
                <Link to={`/times/${washer._id}`}>
                  <button className="button-assessment">Ver horários</button>
                </Link>           
              </div>
            </div>
          </div>
        );
      })}
      <div>
        <Link to="/addwasher">
          <button className="add-button">Cadastrar lavador</button>
        </Link>
      </div>
    </div>
  )
}

export default HomeAdmin