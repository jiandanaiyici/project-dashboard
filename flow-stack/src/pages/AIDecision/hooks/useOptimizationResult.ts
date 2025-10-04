import { useMutation, useQuery } from '@umijs/max';
import { generateOptimizationRecommendationsService } from '../service';

/**
 * 生成资源优化建议
 * @param projectId 项目ID
 * @returns [optimizationResult, isPending, mutate]
 */
const useOptimizationResult = ({ projectId }: { projectId?: string }) => {
  const { data, isPending, mutate } = useMutation({
    mutationKey: ['optimizationResult', projectId],
    mutationFn: () => generateOptimizationRecommendationsService({ projectId }),
  });

  return [data, isPending, mutate] as const;
};

export default useOptimizationResult;
