
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaymentTableRow, { Payment } from './PaymentTableRow';

interface PaymentTableProps {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const PaymentTable = ({ payments, isLoading, error, onRefresh }: PaymentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payee</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="hidden md:table-cell">Memo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-gray-500">
              Loading payments...
            </TableCell>
          </TableRow>
        )}
        
        {!isLoading && error && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-red-500">
              {error}
            </TableCell>
          </TableRow>
        )}
        
        {!isLoading && !error && payments.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-gray-500">
              No payments found
            </TableCell>
          </TableRow>
        )}
        
        {!isLoading && !error && payments.length > 0 && payments.map((payment) => (
          <PaymentTableRow 
            key={payment.id} 
            payment={payment} 
            onRefresh={onRefresh}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default PaymentTable;
