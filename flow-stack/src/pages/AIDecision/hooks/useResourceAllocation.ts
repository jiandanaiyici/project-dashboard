import { useQuery } from '@umijs/max';
import { queryAnalyzeResourceAllocationService } from '../service';

const useResourceAllocation = ({ projectId }: { projectId?: string }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['resourceAllocation'],
    queryFn: () => queryAnalyzeResourceAllocationService({ projectId }),
  });

  return [data, isFetching, refetch] as const;
};

export default useResourceAllocation;
