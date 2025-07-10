
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send } from 'lucide-react';

interface TicketFormProps {
  onSubmit: (ticketData: any) => void;
  onCancel: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.priority && formData.category) {
      onSubmit(formData);
    }
  };

  const categories = [
    'Hardware',
    'Software',
    'Network',
    'Account',
    'Email',
    'Access',
    'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-orange-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-purple-600' }
  ];

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle className="text-xl">Create New Ticket</CardTitle>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium">Ticket Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700 font-medium">Category</Label>
              <Select onValueChange={(value) => handleChange('category', value)} required>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-700 font-medium">Priority Level</Label>
              <Select onValueChange={(value) => handleChange('priority', value)} required>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about the issue, including steps to reproduce, error messages, and any relevant details..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Ticket
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="px-8 h-12"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
