
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, User, AlertCircle, CheckCircle, PlayCircle, UserPlus } from 'lucide-react';

interface AdminTicketListProps {
  tickets: any[];
  onUpdateStatus: (ticketId: string, status: string) => void;
  onAssignTicket: (ticketId: string, assignee: string) => void;
  compact?: boolean;
}

export const AdminTicketList: React.FC<AdminTicketListProps> = ({ 
  tickets, 
  onUpdateStatus, 
  onAssignTicket, 
  compact = false 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in-progress':
        return <PlayCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-between mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Tickets Found</h3>
        <p className="text-gray-500">All tickets are resolved or no tickets match the filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {ticket.title}
                  </h3>
                  <Badge variant="outline" className="text-xs font-medium">
                    {ticket.id}
                  </Badge>
                </div>
                
                {!compact && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {ticket.description}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{ticket.userName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Created: {formatDate(ticket.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Category: {ticket.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 items-end">
                <Badge className={`${getPriorityColor(ticket.priority)} border`}>
                  {ticket.priority.toUpperCase()}
                </Badge>
                
                <Badge className={`${getStatusColor(ticket.status)} border flex items-center gap-1`}>
                  {getStatusIcon(ticket.status)}
                  {ticket.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <Select
                  value={ticket.status}
                  onValueChange={(value) => onUpdateStatus(ticket.id, value)}
                >
                  <SelectTrigger className="w-36 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Assign to:</span>
                <Select
                  value={ticket.assignedTo || ""}
                  onValueChange={(value) => onAssignTicket(ticket.id, value)}
                >
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue placeholder="Select admin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin User">Admin User</SelectItem>
                    <SelectItem value="Support Team">Support Team</SelectItem>
                    <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {ticket.assignedTo && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserPlus className="h-4 w-4" />
                  <span>Assigned to: {ticket.assignedTo}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
