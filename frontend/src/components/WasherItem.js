import "./WasherItem.css"

import { uploads } from "../utils/config"

// import { Link } from "react-router-dom"


const WasherItem = ({ washer }) => {
  return (
    <div className="photo-item">
      {washer.image && (
        <img src={`${uploads}/washers/${washer.image}`} alt={washer.name} />
      )}
    </div>
  )
}

export default WasherItem