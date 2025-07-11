
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedTicketForm } from './EnhancedTicketForm';
import { EnhancedTicketList } from './EnhancedTicketList';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Plus, Ticket, Clock, CheckCircle, AlertCircle, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTickets } from '@/hooks/useTickets';
import { Profile } from '@/hooks/useProfile';

interface DashboardProps {
  user: any;
  profile: Profile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, profile }) => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { signOut } = useAuth();
  const { tickets, loading } = useTickets();

  // Filter tickets for current user
  const userTickets = tickets.filter(ticket => ticket.user_id === user.id);

  const getTicketStats = () => {
    const total = userTickets.length;
    const open = userTickets.filter(t => t.status === 'open').length;
    const inProgress = userTickets.filter(t => t.status === 'in-progress').length;
    const resolved = userTickets.filter(t => t.status === 'resolved').length;
    
    return { total, open, inProgress, resolved };
  };

  const stats = getTicketStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Ticket className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Service Desk</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-2 text-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">{profile.full_name}</span>
                <Badge variant="secondary" className="text-xs">
                  {profile.role}
                </Badge>
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tickets'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              My Tickets
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome back, {profile.full_name?.split(' ')[0]}!
              </h2>
              <p className="text-muted-foreground">
                Manage your support tickets and track their progress
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    </div>
                    <Ticket className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Open</p>
                      <p className="text-2xl font-bold text-destructive">{stats.open}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                      <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowTicketForm(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Ticket
                </Button>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <EnhancedTicketList tickets={userTickets.slice(0, 5)} />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">My Tickets</h2>
              <Button
                onClick={() => setShowTicketForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <EnhancedTicketList tickets={userTickets} />
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <EnhancedTicketForm onCancel={() => setShowTicketForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
