import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lead } from "@shared/schema";
import { Bot, Lightbulb, Calendar, Heart, AlertTriangle } from "lucide-react";

interface AiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

export function AiDetailModal({ isOpen, onClose, lead }: AiDetailModalProps) {
  const getStageSpecificContent = (stage: string) => {
    switch (stage) {
      case 'lust':
        return {
          conversationStarters: [
            `"That coffee shop we went to has become my new favorite spot. What's yours?"`,
            `"I've been thinking about our conversation about [shared interest]. Have you tried...?"`,
            `"Quick question: are you more of a weekend adventure or cozy night in person?"`
          ],
          dateIdeas: [
            "Wine tasting at a local vineyard (builds on her interest in food & drink)",
            "Art gallery opening (creates conversation opportunities)",
            "Cooking class together (interactive and fun)"
          ],
          escalation: [
            "Share a meaningful personal story to create deeper connection",
            "Ask about her dreams and aspirations",
            "Create inside jokes based on your shared experiences"
          ],
          redFlags: [
            "Taking too long to respond without explanation",
            "Avoiding making concrete plans",
            "Not reciprocating personal sharing"
          ]
        };
      case 'labor':
        return {
          conversationStarters: [
            `"I know you've been busy, but I wanted to check in and see how you're doing"`,
            `"No pressure, but I saw this and thought of you..."`,
            `"Hope your week is going well. Take care of yourself"`
          ],
          dateIdeas: [
            "Low-pressure coffee meeting during her lunch break",
            "Simple walk in the park (no commitment pressure)",
            "Casual group activity with mutual friends"
          ],
          escalation: [
            "Focus on being a consistent, reliable presence",
            "Show genuine interest in her life without being pushy",
            "Demonstrate your value through actions, not words"
          ],
          redFlags: [
            "Continued flakiness without valid reasons",
            "Only reaching out when she needs something",
            "Showing interest in other people publicly"
          ]
        };
      case 'loyal':
        return {
          conversationStarters: [
            `"I've been thinking about how much I enjoy our time together"`,
            `"What's something new you'd like us to try together?"`,
            `"I feel like we have something really special"`
          ],
          dateIdeas: [
            "Weekend getaway to a romantic destination",
            "Couples cooking class or wine tasting",
            "Meaningful experiences like concerts or shows"
          ],
          escalation: [
            "Discuss future plans and shared goals",
            "Introduce her to important people in your life",
            "Plan memorable experiences that deepen your bond"
          ],
          redFlags: [
            "Pulling back from intimacy or connection",
            "Avoiding conversations about the future",
            "Showing less interest in spending time together"
          ]
        };
      default:
        return {
          conversationStarters: ["Archive this lead and focus on active prospects"],
          dateIdeas: ["No further action recommended"],
          escalation: ["Learn from this experience for future relationships"],
          redFlags: ["Lead is archived - focus energy elsewhere"]
        };
    }
  };

  const content = getStageSpecificContent(lead.stage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold text-gray-900">
            <Bot className="text-indigo-600 mr-2 h-5 w-5" />
            AI Dating Prompts for {lead.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Lightbulb className="mr-2 h-4 w-4" />
              Conversation Starters
            </h4>
            <ul className="space-y-2 text-blue-800">
              {content.conversationStarters.map((starter, index) => (
                <li key={index}>• {starter}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Date Ideas
            </h4>
            <ul className="space-y-2 text-green-800">
              {content.dateIdeas.map((idea, index) => (
                <li key={index}>• {idea}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              Emotional Escalation
            </h4>
            <ul className="space-y-2 text-purple-800">
              {content.escalation.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Red Flags to Watch
            </h4>
            <ul className="space-y-2 text-orange-800">
              {content.redFlags.map((flag, index) => (
                <li key={index}>• {flag}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Mark as Read & Implement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
