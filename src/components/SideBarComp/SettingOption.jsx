import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ModeToggle } from "../mode-toggle"
import { LogOut } from "lucide-react"
import { Label } from "@/components/ui/label"

const handleLogOut = () => {
  // Your logout logic here
  console.log("Logging out")
}

const SettingOption = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Settings</DialogTitle>
          <DialogDescription>
            Make changes to your settings here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
            <ModeToggle />
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleLogOut}>
            LogOut
            <LogOut className="ml-2 h-4 w-4" />
          </Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SettingOption
