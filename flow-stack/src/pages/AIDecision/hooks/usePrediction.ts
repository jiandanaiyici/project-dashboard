import { useQuery } from '@tanstack/react-query';
import { queryPredictRisksService } from '../service';

const usePrediction = () => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['prediction'],
    queryFn: () => queryPredictRisksService(),
  });

  return [data, isFetching, refetch] as const;
};

export default usePrediction;
