import DropdownMenuCheckboxes from './DropdownMenuCheckboxes'
import DeadlineTabs from './DeadlineTabs'

const Deadlines = () => {
  return (
    <div className=''>
      <div className='absolute left-6 top-6'>
        <DropdownMenuCheckboxes />
      </div>
      <div className='absolute top-15 left-10'>
        <DeadlineTabs />
      </div>
    </div>
  )
}

export default Deadlines