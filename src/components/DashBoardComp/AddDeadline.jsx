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
import { useToast } from "@/components/ui/use-toast";

const AddDeadline = ({ onAddDeadline }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deadline, setDeadline] = useState({
    courseName: '',
    category: '',
    dueDate: new Date(),
  });
  const [date, setDate] = useState(new Date(2025, 6, 25));

  const { toast } = useToast();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...deadline, dueDate: date };
    
    if (!payload.courseName || !payload.category || !payload.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        style: { borderColor: 'red' } // Custom border color for error
      });
      return;
    }

    const result = await onAddDeadline(payload);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        status: "error",
      });
    } else {
      toast({
        title: "Success",
        description: result.success,
        status: "success",
      });
    }
    setIsDialogOpen(false);
    handleDialogClose();
  }
  const handleDialogClose = () => {
  setDeadline({ courseName: "", category: "", dueDate: new Date() });
  setDate(new Date());
};

  const handleCategoryChange = (value) => {
    setDeadline((prev) => ({ ...prev, category: value }));
  };
  const handleDeadlineChange = (e) => {
    setDeadline(prev=>({ ...prev, [e.target.name]: e.target.value }));
  }
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate); // Update the date state
    setDeadline(prev => ({
      ...prev,
      dueDate: selectedDate, // Also update the deadline's dueDate field
    }));
  };
  


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
                  <Select value={deadline.category} onValueChange={handleCategoryChange}>
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
      defaultMonth={date}
      selected={date}
      onSelect={handleDateChange}
      className="rounded-lg border shadow-sm"
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