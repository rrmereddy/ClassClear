import { useEffect, useState } from "react"
import DataTable from "./DataTable"
import { useAuth } from "@/utils/AuthContext"
const Deadlines = ({ deadlineColumns, deadlinesPerPage, refreshTrigger }) => {

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
  }, [getDeadlines, refreshTrigger])

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={deadlineColumns} data={deadlines} initialPageSize={deadlinesPerPage}/>
    </div>
  )
}

export default Deadlines