import { useQuery } from '@umijs/max';
import { queryAnalyzeReleaseReadinessService } from '../service';

/**
 * 发布就绪度数据
 */
const useReadinessData = () => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['analyzeReleaseReadiness'],
    queryFn: queryAnalyzeReleaseReadinessService,
  });

  return [data, isFetching, refetch] as const;
};

export default useReadinessData;
