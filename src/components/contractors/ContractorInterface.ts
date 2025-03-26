
// Define contractor interface to be used across components
export interface Contractor {
  id: string;
  name: string;
  email: string;
  skills: string[];
  rate: number;
  status: 'active' | 'pending' | 'inactive';
  imageUrl: string;
}

// Define contractor list props to include selection functionality
export interface ContractorListProps {
  contractors: Contractor[];
  searchTerm: string;
  onPay: (contractor: Contractor) => Promise<void>;
  onActivate?: (contractor: Contractor) => Promise<void>;
  onDeactivate?: (contractor: Contractor) => Promise<void>;
  selectable?: boolean;
  selectedContractors?: string[];
  onToggleSelect?: (contractorId: string) => void;
}
