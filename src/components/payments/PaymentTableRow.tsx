
import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import StatusBadge, { StatusType } from '@/components/StatusBadge';
import { formatCurrency } from '@/utils/formatCurrency';
import { toast } from '@/components/ui/use-toast';
import { getPaymanService } from '@/services/paymanService';

export interface Payment {
  id: string;
  amount: number;
  payeeId: string;
  payeeName: string;
  payeeEmail: string;
  memo: string;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
}

interface PaymentTableRowProps {
  payment: Payment;
  onRefresh: () => void;
}

const PaymentTableRow = ({ payment, onRefresh }: PaymentTableRowProps) => {
  const handleViewDetails = () => {
    toast({
      title: "Payment Details",
      description: `${formatCurrency(payment.amount)} to ${payment.payeeName}`,
    });
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for payment to ${payment.payeeName} has been downloaded.`,
    });
  };

  const handleRetryPayment = async () => {
    toast({
      title: "Retrying Payment",
      description: `Attempting to retry payment to ${payment.payeeName}.`,
    });
    
    try {
      const service = getPaymanService();
      await service.sendPayment({
        amountDecimal: payment.amount,
        payeeId: payment.payeeId,
        memo: payment.memo || '',
      });
      
      toast({
        title: "Payment Retried",
        description: `Payment to ${payment.payeeName} has been retried successfully.`,
      });
      
      // Refresh the payment list
      onRefresh();
    } catch (error) {
      console.error('Error retrying payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to retry payment',
      });
    }
  };

  return (
    <TableRow key={payment.id}>
      <TableCell>
        <div>
          <div className="font-medium">{payment.payeeName}</div>
          <div className="text-xs text-gray-500 hidden md:block">{payment.payeeEmail}</div>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {formatCurrency(payment.amount)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(payment.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {payment.memo}
      </TableCell>
      <TableCell>
        <StatusBadge status={payment.status} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleViewDetails}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadReceipt}>
              Download receipt
            </DropdownMenuItem>
            {payment.status === 'failed' && (
              <DropdownMenuItem onClick={handleRetryPayment}>
                Retry payment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default PaymentTableRow;
