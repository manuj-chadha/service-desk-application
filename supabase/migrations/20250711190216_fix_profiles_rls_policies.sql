
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a simpler policy structure that doesn't cause recursion
-- Users can always view their own profile
-- Note: We'll handle admin access through a different approach to avoid recursion

-- Add a policy to allow profile creation during user registration
CREATE POLICY "Enable insert for new user registration" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a security definer function to check if user is admin/agent
-- This bypasses RLS and prevents recursion
CREATE OR REPLACE FUNCTION public.is_admin_or_agent(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role IN ('admin', 'agent')
  );
$$;

-- Update tickets policies to use the new function
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins and agents can update tickets" ON public.tickets;

CREATE POLICY "Users can view their own tickets" ON public.tickets
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = assigned_to OR
    public.is_admin_or_agent(auth.uid())
  );

CREATE POLICY "Admins and agents can update tickets" ON public.tickets
  FOR UPDATE USING (public.is_admin_or_agent(auth.uid()));

-- Update comments policies
DROP POLICY IF EXISTS "Users can view ticket comments" ON public.ticket_comments;

CREATE POLICY "Users can view ticket comments" ON public.ticket_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tickets 
      WHERE id = ticket_id AND (
        user_id = auth.uid() OR 
        assigned_to = auth.uid() OR
        public.is_admin_or_agent(auth.uid())
      )
    )
  );

-- Update attachments policies
DROP POLICY IF EXISTS "Users can view ticket attachments" ON public.ticket_attachments;

CREATE POLICY "Users can view ticket attachments" ON public.ticket_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tickets 
      WHERE id = ticket_id AND (
        user_id = auth.uid() OR 
        assigned_to = auth.uid() OR
        public.is_admin_or_agent(auth.uid())
      )
    )
  );
