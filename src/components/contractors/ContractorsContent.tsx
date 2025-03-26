
import React from 'react';
import ContractorSearch from '@/components/contractors/ContractorSearch';
import ContractorList from '@/components/contractors/ContractorList';
import QuickActions from '@/components/contractors/QuickActions';
import { Contractor } from '@/components/contractors/ContractorInterface';

interface ContractorsContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  contractors: Contractor[];
  loading: boolean;
  onPay: (contractor: Contractor) => Promise<void>;
  onActivate: (contractor: Contractor) => Promise<void>;
  onDeactivate: (contractor: Contractor) => Promise<void>;
  bulkPayOpen: boolean;
  selectedContractors: string[];
  onToggleSelect: (contractorId: string) => void;
  onFindContractor: () => void;
  onAddContractor: () => void;
  onBulkPay: () => void;
}

const ContractorsContent = ({
  searchTerm,
  setSearchTerm,
  contractors,
  loading,
  onPay,
  onActivate,
  onDeactivate,
  bulkPayOpen,
  selectedContractors,
  onToggleSelect,
  onFindContractor,
  onAddContractor,
  onBulkPay
}: ContractorsContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-6">
        <ContractorSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading contractors...</p>
          </div>
        ) : (
          <ContractorList 
            contractors={contractors} 
            searchTerm={searchTerm} 
            onPay={onPay}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            selectable={bulkPayOpen}
            selectedContractors={selectedContractors}
            onToggleSelect={onToggleSelect}
          />
        )}
      </div>
      
      <QuickActions 
        onFindContractor={onFindContractor} 
        onAddContractor={onAddContractor}
        onBulkPay={onBulkPay}
      />
    </div>
  );
};

export default ContractorsContent;
