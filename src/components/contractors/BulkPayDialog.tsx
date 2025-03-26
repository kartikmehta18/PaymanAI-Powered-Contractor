
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BulkPayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bulkAmount: string;
  setBulkAmount: (amount: string) => void;
  bulkMemo: string;
  setBulkMemo: (memo: string) => void;
  selectedContractors: string[];
  handleBulkPay: () => Promise<void>;
}

const BulkPayDialog = ({
  open,
  onOpenChange,
  bulkAmount,
  setBulkAmount,
  bulkMemo,
  setBulkMemo,
  selectedContractors,
  handleBulkPay
}: BulkPayDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Pay Contractors</DialogTitle>
          <DialogDescription>
            Pay multiple contractors with a single transaction. Select contractors from the list.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (USD)</label>
            <Input
              placeholder="100.00"
              value={bulkAmount}
              onChange={(e) => setBulkAmount(e.target.value)}
              type="number"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Memo (Optional)</label>
            <Textarea
              placeholder="Payment for June services"
              value={bulkMemo}
              onChange={(e) => setBulkMemo(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Selected Contractors: {selectedContractors.length}</label>
            <p className="text-xs text-gray-500">
              {selectedContractors.length === 0 
                ? "No contractors selected. Please select contractors from the list."
                : `Total payment: $${(parseFloat(bulkAmount || "0") * selectedContractors.length).toFixed(2)}`
              }
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleBulkPay}
            disabled={selectedContractors.length === 0 || !bulkAmount || parseFloat(bulkAmount) <= 0}
          >
            Process Bulk Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPayDialog;
