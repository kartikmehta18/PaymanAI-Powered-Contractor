
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContractorsHeaderProps {
  onBulkPay: () => void;
  onFindContractor: () => void;
  onAddContractor: () => void;
  isInitialized: boolean;
}

const ContractorsHeader = ({ 
  onBulkPay, 
  onFindContractor, 
  onAddContractor,
  isInitialized
}: ContractorsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contractors</h1>
        <p className="text-gray-500 mt-1">
          Manage your contractors and freelancers
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onBulkPay}
          variant="secondary"
          className="w-full md:w-auto"
          disabled={!isInitialized}
        >
          Bulk Pay
        </Button>
        <Button
          onClick={onFindContractor}
          variant="outline"
          className="w-full md:w-auto"
        >
          Find Contractor
        </Button>
        <Button
          onClick={onAddContractor}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 w-full md:w-auto"
        >
          Add Contractor
        </Button>
      </div>
    </div>
  );
};

export default ContractorsHeader;
