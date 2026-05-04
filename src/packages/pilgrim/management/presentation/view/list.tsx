'use client';

import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { Skeleton } from '@/components/atoms/skeleton';
import { StatusBadge } from '@/components/molecules/badge-status';
import { DialogDrawer } from '@/components/molecules/dialog-drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecules/dropdown-menu';
import { InputTextSearch } from '@/components/molecules/input/search';
import { DataTable } from '@/components/templates/datatable';
import { EmptyState } from '@/components/templates/empty-state';
import { ROUTES } from '@/shared/constants/routes';
import { UserAvatar } from '@/components/molecules/user-avatar';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash, User, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { IFamilyMember } from '../../domain/member';
import { useManagementController } from '../controller';
import { MemberDetailView } from './detail';

export const ManagementListView = () => {
  const t = useTranslations('PilgrimManagement');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberIdToDelete, setMemberIdToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { useMembers, useDeleteMember, useMemberDetail } = useManagementController();
  const {
    members,
    pageCount,
    isPending: isLoading,
    isFetching,
  } = useMembers({
    page: pageIndex + 1,
    limit: pageSize,
    search: search || undefined,
  });
  const deleteMutation = useDeleteMember();
  const { data: memberDetailRes, isLoading: isLoadingDetail } = useMemberDetail(selectedMemberId);
  const memberDetail = memberDetailRes?.data;

  const memberToDelete = useMemo(
    () => members.find((m) => m.id === memberIdToDelete),
    [members, memberIdToDelete],
  );

  const handleDelete = () => {
    if (memberIdToDelete) {
      deleteMutation.mutate(memberIdToDelete, {
        onSuccess: () => setMemberIdToDelete(null),
      });
    }
  };

  const columns = useMemo<ColumnDef<IFamilyMember>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: t('fullName'),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <UserAvatar
              name={row.original.fullName}
              src={row.original?.selfieUrl}
              seed={row.original.id}
              className="size-8"
              fallbackClassName="text-xs"
            />
            <span className="font-medium">{row.original.fullName || '—'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'relation',
        header: t('relation'),
        cell: ({ row }) => (
          <span className="text-muted-foreground font-medium">
            {row.original.relation ? t(`relations.${row.original.relation}`) : '—'}
          </span>
        ),
      },
      {
        accessorKey: 'isComplete',
        header: t('status'),
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.isComplete ? 'approved' : 'pending'}
            label={row.original.isComplete ? t('memberComplete') : t('memberIncomplete')}
          />
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="transparent" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedMemberId(row.original.id)}>
                <Eye className="mr-2 h-4 w-4" />
                {t('viewDetail')}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${ROUTES.PILGRIM.FAMILY.FORM}?id=${row.original.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t('edit')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-danger-default focus:text-danger-default"
                onClick={() => setMemberIdToDelete(row.original.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [t],
  );

  const onSearchChange = useCallback((val?: string) => {
    setSearch(val || '');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const onPaginationChange = useCallback(setPagination, []);

  const table = useReactTable({
    data: members,
    columns,
    pageCount,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoading || (isFetching && members.length === 0)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('familyGroup')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('familyGroupDescription')}</p>
        </div>
        <div>
          <Button href={ROUTES.PILGRIM.FAMILY.FORM} size="md">
            <UserPlus size={18} />
            <span>{t('addMember')}</span>
          </Button>
        </div>
      </div>

      <div className="lg:hidden">
        <InputTextSearch
          placeholder={t('searchPlaceholder')}
          search={search}
          setSearch={(val) => {
            setSearch(val || '');
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          delayDebounce={1000}
        />
      </div>

      {members.length === 0 && !search ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          action={
            <Button href={ROUTES.PILGRIM.FAMILY.FORM} size="md" className="w-fit">
              <UserPlus size={18} />
              <span>{t('addMember')}</span>
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden lg:block lg:p-0.5">
            <DataTable
              table={table}
              columns={columns}
              loading={isLoading}
              searchKey="fullName"
              searchPlaceholder={t('searchPlaceholder')}
              onSearchChange={onSearchChange}
              delayDebounce={1000}
              emptyTitle={t('emptyTitle')}
              emptyDescription={t('emptyDescription')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {members.map((m: IFamilyMember) => (
              <Card
                key={m.id}
                className="p-4 hover:border-primary-default/20 transition-all cursor-pointer group"
                onClick={() => setSelectedMemberId(m.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground truncate">{m.fullName || '—'}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {m.relation ? t(`relations.${m.relation}`) : '—'}
                    </p>
                  </div>
                  <StatusBadge
                    status={m.isComplete ? 'approved' : 'pending'}
                    label={m.isComplete ? t('memberComplete') : t(`memberIncomplete`)}
                  />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary-default/10 flex items-center justify-center text-primary-default">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-gray-400">
                      {m.passportNumber || '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="transparent"
                      size="icon"
                      className="h-9 w-9 text-gray-400 hover:text-primary-default"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={`${ROUTES.PILGRIM.FAMILY.FORM}?id=${m.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="transparent"
                      size="icon"
                      className="h-9 w-9 text-gray-400 hover:text-danger-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMemberIdToDelete(m.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <MemberDetailView
        member={memberDetail || null}
        isLoading={isLoadingDetail}
        isOpen={!!selectedMemberId}
        onClose={() => setSelectedMemberId(null)}
      />

      <DialogDrawer
        open={!!memberIdToDelete}
        setOpen={(open) => !open && setMemberIdToDelete(null)}
        title={t('deleteConfirmTitle')}
        submitButton={t('deleteConfirmButton')}
        submitButtonClassName="bg-danger-default! border-danger-default! text-white!"
        onCancel={() => setMemberIdToDelete(null)}
        onSubmit={handleDelete}
        submitting={deleteMutation.isPending}
        disabledSubmitButton={false}
      >
        <p className="text-center">
          {t('deleteConfirmDescription', { name: memberToDelete?.fullName || '' })}
        </p>
      </DialogDrawer>
    </div>
  );
};
