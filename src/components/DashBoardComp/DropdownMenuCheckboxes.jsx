import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DummyData = [
  {
    id: 1,
    name: "Course 1",
  },
  {
    id: 2,
    name: "Course 2",
  },
  {
    id: 3,
    name: "Course 3",
  },
  {
    id: 4,
    name: "Course 4",
  },
];

const DropdownMenuCheckboxes = () => {
  const initialCheckedItems = DummyData.reduce((acc, course) => {
    acc[course] = true;
    return acc;
  }, {});
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);


  const handleCheckedChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAllCheckedChange = () => {
    const allChecked = Object.values(checkedItems).every((checked) => checked);
    const newCheckedItems = {};
    DummyData.forEach((item) => {
      newCheckedItems[item.id] = !allChecked;
    });
    setCheckedItems(newCheckedItems);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Courses</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuCheckboxItem
          checked={Object.values(checkedItems).every((checked) => checked)}
          onCheckedChange={handleAllCheckedChange}
          onSelect={(e) => e.preventDefault()}
        >
          All Courses
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {DummyData.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.id}
            checked={checkedItems[item.id] || false}
            onCheckedChange={() => handleCheckedChange(item.id)}
            onSelect={(e) => e.preventDefault()}
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuCheckboxes;
