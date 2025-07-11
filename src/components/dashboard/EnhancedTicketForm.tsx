
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, AlertCircle, Clock, Zap, ArrowUp } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';

interface EnhancedTicketFormProps {
  onCancel: () => void;
}

const categories = [
  'Hardware',
  'Software',
  'Network',
  'Account',
  'Email',
  'Security',
  'Other'
];

const priorities = [
  { value: 'low', label: 'Low', icon: Clock, color: 'text-green-600' },
  { value: 'medium', label: 'Medium', icon: AlertCircle, color: 'text-yellow-600' },
  { value: 'high', label: 'High', icon: Zap, color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', icon: ArrowUp, color: 'text-red-600' }
];

export const EnhancedTicketForm: React.FC<EnhancedTicketFormProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTicket } = useTickets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      return;
    }

    setIsSubmitting(true);
    const result = await createTicket(formData);
    
    if (!result?.error) {
      onCancel();
    }
    
    setIsSubmitting(false);
  };

  const selectedPriority = priorities.find(p => p.value === formData.priority);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-foreground">Create New Ticket</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-background border-border"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-foreground font-medium">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue>
                    {selectedPriority && (
                      <div className="flex items-center gap-2">
                        <selectedPriority.icon className={`h-4 w-4 ${selectedPriority.color}`} />
                        {selectedPriority.label}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <priority.icon className={`h-4 w-4 ${priority.color}`} />
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue, including steps to reproduce if applicable"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[120px] bg-background border-border"
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.description || !formData.category}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                'Create Ticket'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
