
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertCircle, Zap, ArrowUp, User, Calendar } from 'lucide-react';
import { Ticket } from '@/hooks/useTickets';
import { formatDistanceToNow } from 'date-fns';

interface EnhancedTicketListProps {
  tickets: Ticket[];
}

const priorityConfig = {
  low: { icon: Clock, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Low' },
  medium: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Medium' },
  high: { icon: Zap, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'High' },
  urgent: { icon: ArrowUp, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Urgent' }
};

const statusConfig = {
  open: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Open' },
  'in-progress': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'In Progress' },
  resolved: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Resolved' },
  closed: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Closed' }
};

export const EnhancedTicketList: React.FC<EnhancedTicketListProps> = ({ tickets }) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No tickets yet</h3>
        <p className="text-muted-foreground">Create your first ticket to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig];
        const status = statusConfig[ticket.status as keyof typeof statusConfig];
        const PriorityIcon = priority.icon;

        return (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
                    {ticket.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {ticket.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge className={priority.color}>
                    <PriorityIcon className="w-3 h-3 mr-1" />
                    {priority.label}
                  </Badge>
                  <Badge className={status.color}>
                    {status.label}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{ticket.profiles?.full_name || 'Unknown User'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                
                <div className="text-xs px-3 py-1 bg-muted rounded-full">
                  #{ticket.id.slice(0, 8)}
                </div>
              </div>

              {ticket.assigned_agent && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Assigned to:</span>
                    <span className="font-medium text-foreground">
                      {ticket.assigned_agent.full_name}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
