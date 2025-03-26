
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatusBadge, { StatusType } from '@/components/StatusBadge';
import { motion } from 'framer-motion';
import { transitions } from '@/lib/animations';
import { Contractor } from './contractors/ContractorInterface';
import { Checkbox } from '@/components/ui/checkbox';

interface ContractorCardProps {
  contractor: Contractor;
  onPay: () => Promise<void> | void;
  onActivate?: () => Promise<void> | void;
  onDeactivate?: () => Promise<void> | void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

const ContractorCard = ({ 
  contractor, 
  onPay, 
  onActivate, 
  onDeactivate, 
  selectable = false,
  selected = false,
  onToggleSelect
}: ContractorCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const initials = contractor.name.split(' ').map(n => n[0]).join('');
  
  // Create star rating (for demo purposes - using random rating between 3-5)
  const rating = 3 + Math.floor(Math.random() * 2);
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
      ★
    </span>
  ));
  
  // Map contractor status to StatusBadge status type
  const getStatusType = (): StatusType => {
    switch(contractor.status) {
      case 'active': return 'available';
      case 'pending': return 'pending';
      case 'inactive': return 'inactive';
      default: return 'inactive';
    }
  };
  
  return (
    <motion.div
      initial={transitions.fadeIn.initial}
      animate={transitions.fadeIn.animate}
      exit={transitions.fadeIn.exit}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className={`overflow-hidden transition-all duration-300 ${isHovering ? 'shadow-md' : ''}`}>
        <CardHeader className="pb-2 flex flex-row items-center gap-4">
          {selectable && (
            <Checkbox
              checked={selected}
              onCheckedChange={onToggleSelect}
              className="mr-2"
              id={`select-${contractor.id}`}
            />
          )}
          
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src={contractor.imageUrl} alt={contractor.name} />
            <AvatarFallback className="bg-blue-100 text-blue-800">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{contractor.name}</h3>
              <StatusBadge status={getStatusType()} />
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm text-gray-500">{contractor.email}</div>
              <div className="text-sm font-medium">${contractor.rate}/hr</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex text-xs">{stars}</div>
            <div className="text-xs text-gray-500">{Math.floor(Math.random() * 10) + 1} projects</div>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {contractor.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs bg-gray-100">
                {skill}
              </Badge>
            ))}
            {contractor.skills.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-gray-100">
                +{contractor.skills.length - 4} more
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          {contractor.status === 'active' && (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button 
                onClick={onPay}
                className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                size="sm"
              >
                Pay Contractor
              </Button>
              
              {onDeactivate && (
                <Button 
                  variant="outline" 
                  className="text-sm"
                  size="sm"
                  onClick={onDeactivate}
                >
                  Deactivate
                </Button>
              )}
            </div>
          )}
          
          {contractor.status === 'pending' && (
            <div className="grid grid-cols-2 gap-2 w-full">
              {onActivate && (
                <Button 
                  variant="outline" 
                  className="text-sm"
                  size="sm"
                  onClick={onActivate}
                >
                  Approve
                </Button>
              )}
              
              <Button 
                onClick={onPay}
                className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                size="sm"
              >
                Pay & Approve
              </Button>
            </div>
          )}
          
          {contractor.status === 'inactive' && onActivate && (
            <Button 
              variant="outline" 
              className="w-full text-sm"
              size="sm"
              onClick={onActivate}
            >
              Reactivate Contractor
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContractorCard;
