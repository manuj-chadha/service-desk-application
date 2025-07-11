
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminTicketList } from './AdminTicketList';
import { UserManagement } from './UserManagement';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Settings, 
  Users, 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  LogOut, 
  User,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Profile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  user: any;
  profile: Profile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, profile }) => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { signOut } = useAuth();

  // Mock data for demo
  useEffect(() => {
    const mockTickets = [
      {
        id: 'T001',
        title: 'Password Reset Request',
        description: 'Unable to access email account, need password reset',
        priority: 'medium',
        category: 'Account',
        status: 'open',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        userId: 'user1',
        userName: 'John Doe',
        assignedTo: null
      },
      {
        id: 'T002',
        title: 'Software Installation Issue',
        description: 'Cannot install required software on workstation',
        priority: 'high',
        category: 'Software',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        userId: 'user2',
        userName: 'Jane Smith',
        assignedTo: 'Admin User'
      },
      {
        id: 'T003',
        title: 'Network Connectivity Problem',
        description: 'Internet connection keeps dropping intermittently',
        priority: 'urgent',
        category: 'Network',
        status: 'open',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        userId: 'user3',
        userName: 'Mike Johnson',
        assignedTo: null
      }
    ];

    const mockUsers = [
      { id: 'user1', name: 'John Doe', email: 'john@company.com', status: 'active', ticketCount: 3 },
      { id: 'user2', name: 'Jane Smith', email: 'jane@company.com', status: 'active', ticketCount: 1 },
      { id: 'user3', name: 'Mike Johnson', email: 'mike@company.com', status: 'active', ticketCount: 2 }
    ];

    setTickets(mockTickets);
    setUsers(mockUsers);
  }, []);

  const handleUpdateTicketStatus = (ticketId: string, newStatus: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
        : ticket
    ));
    
    toast({
      title: "Ticket Updated",
      description: `Ticket ${ticketId} status changed to ${newStatus}`,
    });
  };

  const handleAssignTicket = (ticketId: string, assignee: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, assignedTo: assignee, updatedAt: new Date().toISOString() }
        : ticket
    ));
    
    toast({
      title: "Ticket Assigned",
      description: `Ticket ${ticketId} assigned to ${assignee}`,
    });
  };

  const getTicketStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in-progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const urgent = tickets.filter(t => t.priority === 'urgent').length;
    
    return { total, open, inProgress, resolved, urgent };
  };

  const stats = getTicketStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-destructive w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Settings className="h-5 w-5 text-destructive-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Badge variant="destructive">Administrator</Badge>
              <div className="flex items-center gap-2 text-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">{profile.full_name || user.email}</span>
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

      {/* Admin Navigation */}
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
              All Tickets
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              User Management
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Tickets</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <Ticket className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Open</p>
                      <p className="text-3xl font-bold">{stats.open}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">In Progress</p>
                      <p className="text-3xl font-bold">{stats.inProgress}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Resolved</p>
                      <p className="text-3xl font-bold">{stats.resolved}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Urgent</p>
                      <p className="text-3xl font-bold">{stats.urgent}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    High Priority Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminTicketList
                    tickets={tickets.filter(t => t.priority === 'high' || t.priority === 'urgent')}
                    onUpdateStatus={handleUpdateTicketStatus}
                    onAssignTicket={handleAssignTicket}
                    compact={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant="outline">{user.ticketCount} tickets</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">All Tickets</h2>
              <div className="flex gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <AdminTicketList
                  tickets={tickets}
                  onUpdateStatus={handleUpdateTicketStatus}
                  onAssignTicket={handleAssignTicket}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">User Management</h2>
            <UserManagement users={users} />
          </div>
        )}
      </main>
    </div>
  );
};
