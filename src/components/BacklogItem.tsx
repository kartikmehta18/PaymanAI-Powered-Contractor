
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import { motion } from "framer-motion";
import { transitions } from '@/lib/animations';

interface BacklogItemProps {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'pending' | 'processing' | 'completed';
  estimatedHours?: number;
  tags: string[];
  onFindContractor?: (id: string) => void;
}

const BacklogItem = ({
  id,
  title,
  description,
  priority,
  status,
  estimatedHours,
  tags,
  onFindContractor
}: BacklogItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const priorityColor = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    low: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  
  return (
    <motion.div
      initial={transitions.fadeIn.initial}
      animate={transitions.fadeIn.animate}
      exit={transitions.fadeIn.exit}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <div className="flex items-center space-x-2">
              <StatusBadge status={status} />
              <Badge className={priorityColor[priority]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-0">
          <div className={`prose prose-sm max-w-none transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
            <p>{description}</p>
          </div>
          
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-100">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {estimatedHours && (
                <div className="mt-4 text-sm text-gray-500">
                  Estimated effort: {estimatedHours} hours
                </div>
              )}
            </motion.div>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-gray-500 mt-2 hover:text-gray-700"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </CardContent>
        
        <CardFooter className="flex justify-end pt-4 pb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Details
          </Button>
          
          {status === 'new' && onFindContractor && (
            <Button 
              size="sm"
              onClick={() => onFindContractor(id)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Find Contractor
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BacklogItem;
