import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Navigation } from "@/components/navigation";
import { LeadCard } from "@/components/lead-card";

import { CoachCallModal } from "@/components/coach-call-modal";
import { apiRequest } from "@/lib/queryClient";
import { Lead } from "@shared/schema";
import { Filter, Heart, Hammer, Skull, Flame } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const STAGES = [
  { id: 'loyal', name: 'Loyal', icon: Heart, color: 'from-green-500 to-emerald-500' },
  { id: 'labor', name: 'Labor', icon: Hammer, color: 'from-yellow-500 to-orange-500' },
  { id: 'lust', name: 'Lust', icon: Flame, color: 'from-red-500 to-pink-500' },
  { id: 'dead', name: 'DEAD (Exes)', icon: Skull, color: 'from-gray-600 to-gray-700' }
];

export default function Dashboard() {
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("roi");

  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const updateLeadStageMutation = useMutation({
    mutationFn: async ({ leadId, stage, position }: { leadId: number; stage: string; position: number }) => {
      const response = await apiRequest("PATCH", `/api/leads/${leadId}/stage`, { stage, position });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    }
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const leadId = parseInt(draggableId);
    
    if (source.droppableId !== destination.droppableId) {
      updateLeadStageMutation.mutate({
        leadId,
        stage: destination.droppableId,
        position: destination.index
      });
    }
  };



  const getFilteredAndSortedLeads = () => {
    let filteredLeads = leads;
    
    if (filterStage !== "all") {
      filteredLeads = leads.filter(lead => lead.stage === filterStage);
    }

    return filteredLeads.sort((a, b) => {
      switch (sortBy) {
        case "roi":
          return b.emotionalROI - a.emotionalROI;
        case "lastContact":
          return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const getLeadsByStage = (stageId: string) => {
    const filteredLeads = getFilteredAndSortedLeads();
    return filteredLeads.filter(lead => lead.stage === stageId);
  };

  const getStageCount = (stageId: string) => {
    return leads.filter(lead => lead.stage === stageId).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          onCoachCall={() => setShowCoachModal(true)}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onCoachCall={() => setShowCoachModal(true)}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">Lead Dashboard</h2>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {leads.length} Active Leads
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="loyal">Loyal</SelectItem>
                <SelectItem value="labor">Labor</SelectItem>
                <SelectItem value="lust">Lust</SelectItem>
                <SelectItem value="dead">DEAD</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roi">Sort by ROI</SelectItem>
                <SelectItem value="lastContact">Last Contact</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {STAGES.map((stage) => {
              const StageIcon = stage.icon;
              const stageLeads = getLeadsByStage(stage.id);
              
              return (
                <div key={stage.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className={`bg-gradient-to-r ${stage.color} p-4`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-lg flex items-center">
                        <StageIcon className="mr-2 h-5 w-5" />
                        {stage.name}
                      </h3>
                      <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {getStageCount(stage.id)}
                      </span>
                    </div>
                  </div>
                  
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-4 space-y-4 min-h-96 ${
                          snapshot.isDraggingOver ? 'bg-gray-50' : ''
                        }`}
                      >
                        {stageLeads.map((lead, index) => (
                          <Draggable
                            key={lead.id}
                            draggableId={lead.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={snapshot.isDragging ? 'rotate-3' : ''}
                              >
                                <LeadCard
                                  lead={lead}
                                  onClick={() => {}}
                                  isDragging={snapshot.isDragging}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Modals */}
      <CoachCallModal 
        isOpen={showCoachModal} 
        onClose={() => setShowCoachModal(false)} 
      />
      

    </div>
  );
}
