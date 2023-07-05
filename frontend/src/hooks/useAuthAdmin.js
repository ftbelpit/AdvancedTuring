import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useAuthAdmin = () => {
  const { admin } = useSelector((state) => state.authAdmin)

  const [authAdmin, setAuthAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(admin) {
      setAuthAdmin(true)
    } else {
      setAuthAdmin(false)
    }

    setLoading(false)
  }, [admin])

  return { authAdmin, loading }
}