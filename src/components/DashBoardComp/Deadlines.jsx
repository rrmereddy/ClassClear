import DataTable from "./DataTable"
import DeadlineColumn from "./DeadlineColumns"

const DummyData = [
  {
    id: 1,
    category: "Assignment",
    dueDate: "2021-12-31",
  },
  {
    id: 2,
    category: "Quiz",
    dueDate: "2021-12-31",
  },
  {
    id: 3,
    category: "Project",
    dueDate: "2021-12-31",
  },
  {
    id: 4,
    category: "Assignment",
    dueDate: "2021-12-31",
  },
  {
    id: 5,
    category: "Quiz",
    dueDate: "2021-12-31",
  },
  {
    id: 6,
    category: "Project",
    dueDate: "2021-12-31",
  },
  {
    id: 7,
    category: "Assignment",
    dueDate: "2021-12-31",
  },
  {
    id: 8,
    category: "Quiz",
    dueDate: "2021-12-31",
  },
  {
    id: 9,
    category: "Project",
    dueDate: "2021-12-31",
  },
  {
    id: 10,
    category: "Assignment",
    dueDate: "2021-12-31",
  },
  {
    id: 11,
    category: "Quiz",
    dueDate: "2021-12-31",
  },
  {
    id: 12,
    category: "Project",
    dueDate: "2021-12-31",
  },
  {
    id: 13,
    category: "Assignment",
    dueDate: "2021-12-31",
  },
  {
    id: 14,
    category: "Quiz",
    dueDate: "2021-12-31",
  },
  {
    id: 15,
    category: "Project",
    dueDate: "2021-12-31",
  },
  {
    id: 16,
    category: "Assignment",
    dueDate: "2021-12-31",
  },
  {
    id: 17,
    category: "Quiz",
    dueDate: "2022-7-31",
  },
  {
    id: 18,
    category: "Project",
    dueDate: "2022-8-31",
  },
  {
    id: 19,
    category: "Assignment",
    dueDate: "2022-9-31",
  },
  {
    id: 20,
    category: "Quiz",
    dueDate: "2022-10-31",
  },
  {
    id: 21,
    category: "Project",
    dueDate: "2022-11-31",
  },
  {
    id: 22,
    category: "Assignment",
    dueDate: "2022-12-31",
  },
];

const Deadlines = () => {
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={DeadlineColumn} data={DummyData} />
    </div>
  )
}

export default Deadlines