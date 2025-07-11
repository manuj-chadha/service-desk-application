
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin' | 'agent';
  department?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // For now, create a mock profile from user data until database is set up
      console.log('Creating mock profile for user:', user.email);
      const mockProfile: Profile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        role: user.email === 'admin@test.com' ? 'admin' : 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(mockProfile);
    } catch (error: any) {
      console.error('Error creating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // For now, just update local state until database is set up
      if (profile) {
        const updatedProfile = {
          ...profile,
          ...updates,
          updated_at: new Date().toISOString()
        };
        setProfile(updatedProfile);
        
        toast({
          title: 'Success',
          description: 'Profile updated successfully (mock)',
        });
      }

      return { data: profile, error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  };
}
