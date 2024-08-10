import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const AddDeadline = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deadline, setDeadline] = useState({
    courseName: '',
    category: '',
    dueDate: new Date(),
  });
  const [date, setDate] = useState(new Date());

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setDeadline(prev=>({ ...prev, dueDate: date }));
    console.log(deadline);
    setIsDialogOpen(false);
  }
  const handleDialogClose = () => {
    setDeadline({
      courseName: '',
      category: '',
      dueDate: '',
    });
    setDate(new Date());
  }

  const handleCategoryChange = (value) => {
    setDeadline((prev) => ({ ...prev, category: value }));
  };
  const handleDeadlineChange = (e) => {
    setDeadline(prev=>({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) {
        handleDialogClose();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Add Deadline</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Deadline</DialogTitle>
          <DialogDescription>
            Fill in the details of the deadline you want to add.
          </DialogDescription>
        </DialogHeader>
        <form action="submit" onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Input
                id="course"
                placeholder="CSCE-120"
                className="col-span-3"
                name="courseName"
                onChange={handleDeadlineChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
                  <Select onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="Exam">Exam</SelectItem>
                        <SelectItem value="Homework">Homework</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Instructor" className="text-right">
                Date
              </Label>
              <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Deadline</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddDeadline