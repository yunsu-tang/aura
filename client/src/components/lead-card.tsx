import { Lead } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
  isDragging?: boolean;
}

export function LeadCard({ lead, onClick, isDragging }: LeadCardProps) {
  const getROIColor = (roi: number) => {
    if (roi >= 80) return "bg-green-500";
    if (roi >= 60) return "bg-yellow-500";
    if (roi >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const formatLastContact = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const isDeadStage = lead.stage === 'dead';

  return (
    <div className={`
      bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer
      ${isDragging ? 'shadow-lg' : ''}
      ${isDeadStage ? 'opacity-75' : ''}
    `}>
      <div className="flex items-start space-x-3 mb-3">
        <div className="flex-shrink-0">
          {lead.profilePhoto ? (
            <img
              src={lead.profilePhoto}
              alt={lead.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {lead.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{lead.name}</h4>
              <p className="text-sm text-gray-500">
                Last contact: {formatLastContact(lead.lastContact)}
              </p>
            </div>
            <div className={`${getROIColor(lead.emotionalROI)} text-white px-2 py-1 rounded-full text-xs font-medium flex-shrink-0`}>
              {lead.emotionalROI} ROI
            </div>
          </div>
        </div>
      </div>
      
      {lead.lastMessage && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            <strong>Last message:</strong> {lead.lastMessage}
          </p>
        </div>
      )}
      
      {lead.aiSuggestion && (
        <div className={`
          border rounded-lg p-3 mb-3
          ${isDeadStage 
            ? 'bg-gray-100 border-gray-200' 
            : 'bg-blue-50 border-blue-200'
          }
        `}>
          <p className={`text-sm font-medium mb-1 flex items-center
            ${isDeadStage ? 'text-gray-600' : 'text-blue-800'}
          `}>
            <Bot className="mr-1 h-3 w-3" />
            {isDeadStage ? 'Note:' : 'Suggestion:'}
          </p>
          <p className={`text-sm ${isDeadStage ? 'text-gray-500' : 'text-blue-700'}`}>
            {lead.aiSuggestion}
          </p>
        </div>
      )}
      

    </div>
  );
}
