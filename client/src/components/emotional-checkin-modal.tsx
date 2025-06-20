import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EmotionalCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmotionalCheckinModal({ isOpen, onClose }: EmotionalCheckinModalProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCheckinMutation = useMutation({
    mutationFn: async (checkinData: { confident: number; tookAction: number; readyToConnect: number }) => {
      const response = await apiRequest("POST", "/api/checkins", {
        ...checkinData,
        date: new Date()
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Check-in Complete!",
        description: "Your emotional check-in has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/checkins"] });
      onClose();
      setAnswers({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your check-in. Please try again.",
        variant: "destructive",
      });
    }
  });

  const questions = [
    { id: 'confident', text: 'Are you feeling confident about your dating progress today?' },
    { id: 'tookAction', text: "Did you take action on your AI coach's suggestions yesterday?" },
    { id: 'readyToConnect', text: 'Are you ready to make meaningful connections today?' }
  ];

  const handleAnswer = (questionId: string, answer: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === questions.length) {
      createCheckinMutation.mutate({
        confident: answers.confident,
        tookAction: answers.tookAction,
        readyToConnect: answers.readyToConnect
      });
    }
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold text-gray-900">
            <Heart className="text-pink-500 mr-2 h-5 w-5" />
            Today's Emotional Check-In
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id}>
              <p className="text-gray-700 mb-3">
                {index + 1}. {question.text}
              </p>
              <div className="flex space-x-4">
                <Button
                  onClick={() => handleAnswer(question.id, 1)}
                  className={`flex-1 ${
                    answers[question.id] === 1 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleAnswer(question.id, 0)}
                  className={`flex-1 ${
                    answers[question.id] === 0 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  No
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || createCheckinMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {createCheckinMutation.isPending ? 'Saving...' : 'Complete Check-In'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
