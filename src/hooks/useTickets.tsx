
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
      console.log('Fetching tickets for user:', user.id);
      
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          ),
          assigned_agent:assigned_to (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch tickets',
          variant: 'destructive',
        });
      } else {
        console.log('Tickets fetched successfully:', data);
        setTickets(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tickets',
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
      console.log('Creating ticket with data:', ticketData);
      const { data, error } = await supabase
        .from('tickets')
        .insert([
          {
            ...ticketData,
            user_id: user.id,
          }
        ])
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .single();

      if (error) {
        console.error('Error creating ticket:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to create ticket',
          variant: 'destructive',
        });
        return { error };
      }

      console.log('Ticket created successfully:', data);
      setTickets(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Ticket created successfully',
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating ticket:', error);
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
      console.log('Updating ticket status:', { ticketId, status, assignedTo });
      
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

      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', ticketId)
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          ),
          assigned_agent:assigned_to (
            full_name,
            email
          )
        `)
        .single();

      if (error) {
        console.error('Error updating ticket:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to update ticket',
          variant: 'destructive',
        });
        return;
      }

      console.log('Ticket updated successfully:', data);
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? data : ticket
      ));

      toast({
        title: 'Success',
        description: 'Ticket updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating ticket:', error);
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
