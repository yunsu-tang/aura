import { Button } from "@/components/ui/button";
import { Heart, Phone, BarChart3, User } from "lucide-react";

interface NavigationProps {
  onEmotionalCheckin: () => void;
  onCoachCall: () => void;
}

export function Navigation({ onEmotionalCheckin, onCoachCall }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">AI Dating Coach</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={onEmotionalCheckin}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Heart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Today's Emotional Check-In</span>
              <span className="sm:hidden">Check-In</span>
            </Button>
            
            <Button
              onClick={onCoachCall}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Phone className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Chat with Your Coach</span>
              <span className="sm:hidden">Chat</span>
            </Button>
            
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Weekly Report</span>
            </Button>
            
            <div className="relative">
              <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
