
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Clock, UserPlus, Users, Receipt, CreditCard } from 'lucide-react';

interface QuickActionsProps {
  onFindContractor: () => void;
  onAddContractor: () => void;
  onBulkPay?: () => void;
}

const QuickActions = ({ onFindContractor, onAddContractor, onBulkPay }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button 
          variant="outline" 
          className="justify-start gap-2"
          onClick={onAddContractor}
        >
          <UserPlus size={18} />
          Add New Contractor
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start gap-2"
          onClick={onFindContractor}
        >
          <Users size={18} />
          Find Contractor
        </Button>
        
        {onBulkPay && (
          <Button 
            variant="outline" 
            className="justify-start gap-2"
            onClick={onBulkPay}
          >
            <CreditCard size={18} />
            Bulk Pay Contractors
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="justify-start gap-2"
        >
          <FileSpreadsheet size={18} />
          Import Contractors
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start gap-2"
        >
          <Receipt size={18} />
          Generate Invoices
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start gap-2"
        >
          <Clock size={18} />
          Set Payment Schedule
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
