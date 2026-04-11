'use client';

import { Button } from '@/components/atoms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecules';
import { Download, FileText, Table } from 'lucide-react';

interface GlobalExportButtonProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const GlobalExportButton = ({
  onExportPDF,
  onExportExcel,
  loading = false,
  disabled = false,
  className = '',
}: GlobalExportButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="primary"
          className={`gap-2 w-fit ${className}`}
          disabled={disabled || loading}
        >
          <Download className="h-4 w-4" />
          {loading ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportPDF} disabled={loading}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportExcel} disabled={loading}>
          <Table className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
