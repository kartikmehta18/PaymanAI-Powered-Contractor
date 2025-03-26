
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ContractorCard from '@/components/ContractorCard';
import { Contractor, ContractorListProps } from './ContractorInterface';
import { motion } from 'framer-motion';
import { transitions } from '@/lib/animations';

const ContractorList = ({ 
  contractors, 
  searchTerm, 
  onPay,
  onActivate,
  onDeactivate,
  selectable = false,
  selectedContractors = [],
  onToggleSelect
}: ContractorListProps) => {
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>(contractors);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    // Filter contractors based on search term and active tab
    let filtered = contractors;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (contractor) =>
          contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contractor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contractor.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    
    if (activeTab !== 'all') {
      filtered = filtered.filter((contractor) => contractor.status === activeTab);
    }
    
    setFilteredContractors(filtered);
  }, [searchTerm, contractors, activeTab]);

  return (
    <motion.div
      initial={transitions.fadeIn.initial}
      animate={transitions.fadeIn.animate}
      exit={transitions.fadeIn.exit}
    >
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {filteredContractors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-gray-500">
                  No contractors found. Try adjusting your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContractors.map((contractor) => (
              <ContractorCard 
                key={contractor.id} 
                contractor={contractor} 
                onPay={() => onPay(contractor)}
                onActivate={onActivate ? () => onActivate(contractor) : undefined}
                onDeactivate={onDeactivate ? () => onDeactivate(contractor) : undefined}
                selectable={selectable}
                selected={selectedContractors.includes(contractor.id)}
                onToggleSelect={onToggleSelect ? () => onToggleSelect(contractor.id) : undefined}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-6">
          {filteredContractors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-gray-500">
                  No active contractors found.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContractors.map((contractor) => (
              <ContractorCard 
                key={contractor.id} 
                contractor={contractor} 
                onPay={() => onPay(contractor)}
                onActivate={onActivate ? () => onActivate(contractor) : undefined}
                onDeactivate={onDeactivate ? () => onDeactivate(contractor) : undefined}
                selectable={selectable}
                selected={selectedContractors.includes(contractor.id)}
                onToggleSelect={onToggleSelect ? () => onToggleSelect(contractor.id) : undefined}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-6">
          {filteredContractors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-gray-500">
                  No pending contractors found.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContractors.map((contractor) => (
              <ContractorCard 
                key={contractor.id} 
                contractor={contractor} 
                onPay={() => onPay(contractor)}
                onActivate={onActivate ? () => onActivate(contractor) : undefined}
                onDeactivate={onDeactivate ? () => onDeactivate(contractor) : undefined}
                selectable={selectable}
                selected={selectedContractors.includes(contractor.id)}
                onToggleSelect={onToggleSelect ? () => onToggleSelect(contractor.id) : undefined}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="inactive" className="space-y-6">
          {filteredContractors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-gray-500">
                  No inactive contractors found.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContractors.map((contractor) => (
              <ContractorCard 
                key={contractor.id} 
                contractor={contractor} 
                onPay={() => onPay(contractor)}
                onActivate={onActivate ? () => onActivate(contractor) : undefined}
                onDeactivate={onDeactivate ? () => onDeactivate(contractor) : undefined}
                selectable={selectable}
                selected={selectedContractors.includes(contractor.id)}
                onToggleSelect={onToggleSelect ? () => onToggleSelect(contractor.id) : undefined}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ContractorList;
