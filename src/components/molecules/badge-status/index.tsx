import { Badge, badgeVariants } from '@/components/atoms';
import { VariantProps } from 'class-variance-authority';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  draft: { label: 'Draft', variant: 'outline' },
  'pending-l1': { label: 'Pending L1', variant: 'warning' },
  'pending-l2': { label: 'Pending L2', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'outlinePrimary' },
  assigned: { label: 'Assigned', variant: 'default' },
  'in-progress': { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'outlinePrimary' },
  finished: { label: 'Finished', variant: 'ocean' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  cancelled: { label: 'Cancelled', variant: 'dark' },
  scheduled: { label: 'Scheduled', variant: 'secondary' },
  'driver-checked-in': { label: 'Driver Checked In', variant: 'default' },
  'no-show': { label: 'No Show', variant: 'destructive' },
  merged: { label: 'Merged', variant: 'outlinePrimary' },
  // Resource statuses
  available: { label: 'Available', variant: 'outlinePrimary' },
  'in-use': { label: 'In Use', variant: 'warning' },
  maintenance: { label: 'Maintenance', variant: 'dark' },
  retired: { label: 'Retired', variant: 'outline' },
  'on-trip': { label: 'On Trip', variant: 'ocean' },
  'off-duty': { label: 'Off Duty', variant: 'outlineOcean' },
  // Finance statuses
  pending: { label: 'Pending', variant: 'warning' },
  verified: { label: 'Verified', variant: 'info' },
  reimbursed: { label: 'Reimbursed', variant: 'outlineInfo' },
  submitted: { label: 'Submitted', variant: 'warning' },
  posted: { label: 'Posted', variant: 'info' },
  paid: { label: 'Paid', variant: 'outlinePrimary' },
  // RealtimeStatus labels (for direct display)
  Idle: { label: 'Idle', variant: 'outlinePrimary' },
  OnDuty: { label: 'On Duty', variant: 'default' },
  OnLeave: { label: 'On Leave', variant: 'warning' },
  Inactive: { label: 'Inactive', variant: 'dark' },
  'waiting-external-approve': { label: 'Cost Review', variant: 'warning' },
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || { label: status, variant: 'secondary' as BadgeVariant };

  return (
    <Badge variant={config.variant} className={className}>
      {label || config.label}
    </Badge>
  );
};
