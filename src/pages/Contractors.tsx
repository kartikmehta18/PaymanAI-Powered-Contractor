
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { transitions } from '@/lib/animations';
import { toast } from '@/components/ui/use-toast';
import AddContractor from '@/components/AddContractor';
import ContractorsHeader from '@/components/contractors/ContractorsHeader';
import ContractorsContent from '@/components/contractors/ContractorsContent';
import BulkPayDialog from '@/components/contractors/BulkPayDialog';
import { useContractors } from '@/hooks/useContractors';
import { useBulkPay } from '@/hooks/useBulkPay';

const Contractors = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addContractorOpen, setAddContractorOpen] = useState<boolean>(false);
  
  const {
    contractors,
    loading,
    selectedContractors,
    isInitialized,
    handleAddContractor,
    handlePay,
    handleActivateContractor,
    handleDeactivateContractor,
    toggleContractorSelection,
    clearSelectedContractors
  } = useContractors();
  
  const {
    bulkPayOpen,
    setBulkPayOpen,
    bulkAmount,
    setBulkAmount,
    bulkMemo,
    setBulkMemo,
    handleBulkPay
  } = useBulkPay(contractors, selectedContractors, clearSelectedContractors, isInitialized);
  
  const handleFindContractor = () => {
    setSearchTerm('');
    toast({
      title: "Find Contractor",
      description: "Searching for contractors based on skills and availability...",
    });
    
    // Simulate a search delay
    setTimeout(() => {
      toast({
        title: "Search Complete",
        description: `Found ${contractors.length} contractors matching your criteria.`,
      });
    }, 1500);
  };
  
  return (
    <Layout>
      <motion.div
        initial={transitions.fadeIn.initial}
        animate={transitions.fadeIn.animate}
        exit={transitions.fadeIn.exit}
        className="py-6"
      >
        <div className="flex flex-col gap-6 md:gap-8">
          <ContractorsHeader 
            onBulkPay={() => setBulkPayOpen(true)}
            onFindContractor={handleFindContractor}
            onAddContractor={() => setAddContractorOpen(true)}
            isInitialized={isInitialized}
          />
          
          <ContractorsContent 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            contractors={contractors}
            loading={loading}
            onPay={handlePay}
            onActivate={handleActivateContractor}
            onDeactivate={handleDeactivateContractor}
            bulkPayOpen={bulkPayOpen}
            selectedContractors={selectedContractors}
            onToggleSelect={toggleContractorSelection}
            onFindContractor={handleFindContractor}
            onAddContractor={() => setAddContractorOpen(true)}
            onBulkPay={() => setBulkPayOpen(true)}
          />
        </div>
      </motion.div>
      
      <AddContractor
        open={addContractorOpen}
        onOpenChange={setAddContractorOpen}
        onSave={handleAddContractor}
      />
      
      <BulkPayDialog
        open={bulkPayOpen}
        onOpenChange={setBulkPayOpen}
        bulkAmount={bulkAmount}
        setBulkAmount={setBulkAmount}
        bulkMemo={bulkMemo}
        setBulkMemo={setBulkMemo}
        selectedContractors={selectedContractors}
        handleBulkPay={handleBulkPay}
      />
    </Layout>
  );
};

export default Contractors;
