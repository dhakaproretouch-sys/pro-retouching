import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api, { getApiErrorMessage } from '../../lib/api';
import type { ApiResponse, Paginated } from '../../lib/types';

export interface InboxItemBase {
  _id: string;
  createdAt: string;
}

interface UseInboxOptions<T extends InboxItemBase> {
  resource: string;
  queryKey: string;
}

export interface InboxHook<T extends InboxItemBase> {
  items: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  page: number;
  setPage: (page: number) => void;
  status: string;
  setStatus: (status: string) => void;
  search: string;
  setSearch: (search: string) => void;
  selected: T | null;
  setSelected: (item: T | null) => void;
  updateStatus: (id: string, status: string) => void;
  updatingStatus: boolean;
  markRead: (id: string) => void;
  markingRead: boolean;
  remove: (id: string) => void;
  deleting: boolean;
}

/** Shared inbox state: paginated list with status filter, search and mutations. */
export function useInbox<T extends InboxItemBase>({
  resource,
  queryKey,
}: UseInboxOptions<T>): InboxHook<T> {
  const queryClient = useQueryClient();
  const cacheKey = ['admin', 'inbox', queryKey];
  const [page, setPage] = useState(1);
  const [status, setStatusRaw] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<T | null>(null);

  const setStatus = (next: string) => {
    setStatusRaw(next);
    setPage(1);
  };

  const listQuery = useQuery({
    queryKey: [...cacheKey, page, status, search],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (status !== 'all') params.status = status;
      if (search.trim()) params.search = search.trim();
      const res = await api.get<ApiResponse<Paginated<T>>>('/admin/' + resource, { params });
      return res.data.data;
    },
    placeholderData: (previous) => previous,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: cacheKey });

  const statusMutation = useMutation({
    mutationFn: async (vars: { id: string; nextStatus: string }) => {
      await api.patch('/admin/' + resource + '/' + vars.id + '/status', { status: vars.nextStatus });
    },
    onSuccess: () => {
      toast.success('Status updated');
      void invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to update status')),
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch('/admin/messages/' + id + '/read', { isRead: true });
    },
    onSuccess: () => {
      void invalidate();
      void queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to mark as read')),
  });

  const markRead = useCallback((id: string) => markReadMutation.mutate(id), [markReadMutation]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete('/admin/' + resource + '/' + id);
    },
    onSuccess: () => {
      toast.success('Deleted');
      setSelected(null);
      void invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to delete')),
  });

  const data = listQuery.data;

  return {
    items: (data && data.items) || [],
    pagination: (data && data.pagination) || { page: 1, limit: 10, total: 0, pages: 1 },
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: () => void listQuery.refetch(),
    page,
    setPage,
    status,
    setStatus,
    search,
    setSearch,
    selected,
    setSelected,
    updateStatus: (id, nextStatus) => statusMutation.mutate({ id, nextStatus }),
    updatingStatus: statusMutation.isPending,
    markRead,
    markingRead: markReadMutation.isPending,
    remove: (id) => deleteMutation.mutate(id),
    deleting: deleteMutation.isPending,
  };
}
