
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  user_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  assigned_agent?: {
    full_name: string;
    email: string;
  };
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTickets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // For now, create mock tickets until database is set up
      console.log('Creating mock tickets for user:', user.email);
      const mockTickets: Ticket[] = [
        {
          id: 'mock-1',
          title: 'Sample Support Ticket',
          description: 'This is a sample ticket to demonstrate the system.',
          status: 'open',
          priority: 'medium',
          category: 'General',
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profiles: {
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || ''
          }
        }
      ];
      
      setTickets(mockTickets);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tickets (using mock data)',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: {
    title: string;
    description: string;
    priority: string;
    category: string;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // For now, create mock ticket until database is set up
      const newTicket: Ticket = {
        id: `mock-${Date.now()}`,
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority as 'low' | 'medium' | 'high' | 'urgent',
        category: ticketData.category,
        status: 'open',
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || ''
        }
      };

      setTickets(prev => [newTicket, ...prev]);
      toast({
        title: 'Success',
        description: 'Ticket created successfully (mock)',
      });

      return { data: newTicket, error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create ticket',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string, assignedTo?: string) => {
    try {
      const updates: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (assignedTo) {
        updates.assigned_to = assignedTo;
      }

      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      // Update local state for mock data
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, ...updates }
          : ticket
      ));

      toast({
        title: 'Success',
        description: 'Ticket updated successfully (mock)',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update ticket',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    tickets,
    loading,
    createTicket,
    updateTicketStatus,
    refetch: fetchTickets,
  };
}
