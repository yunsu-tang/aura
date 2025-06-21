import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";

interface CoachCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CoachCallModal({ isOpen, onClose }: CoachCallModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="text-white h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Calling Your AI Coach...</h3>
          <p className="text-gray-600 mb-6">Your personalized coaching session is starting</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2"><strong>Today's Focus:</strong></p>
            <p className="text-sm text-gray-600">
              How to read his signals, when to pull back vs. lean in, and building genuine connection without chasing.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              End Call
            </Button>
            <Button
              onClick={onClose}
              variant="destructive"
              className="flex-1"
            >
              <PhoneOff className="mr-2 h-4 w-4" />
              Hang Up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
