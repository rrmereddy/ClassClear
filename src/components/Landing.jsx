import { Link } from "react-router-dom"

const Landing = () => {
  return (
    <div className="flex items-center justify-center h-full">
        <Link to="/signup" className="p-2 m-2 bg-blue-500 text-white rounded">Sign Up</Link>
    </div>
  )
}

export default Landing