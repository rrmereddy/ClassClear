import { useEffect, useState } from "react"
import DataTable from "./DataTable"
import { useAuth } from "@/utils/AuthContext"
import DeadlineColumn from "./DeadlineColumns"

const Deadlines = ({ rowsPerPage }) => {

  const { getDeadlines } = useAuth()
  const [deadlines, setDeadlines] = useState([])

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const deadlinesData = await getDeadlines()
        setDeadlines(deadlinesData)
      } catch (error) {
        console.error('Error fetching deadlines:', error)
      }
    }
    fetchDeadlines()
  }, [getDeadlines])

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={DeadlineColumn} data={deadlines} initialPageSize={rowsPerPage} />
    </div>
  )
}

export default Deadlines