import { useEns } from '@app/utils/EnsProvider'
import { useQuery } from 'wagmi'

export const useGetFuseData = (name: string, skip?: any) => {
  const { ready, getFuses } = useEns()

  const {
    data: fuseData,
    isLoading,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(['getFuseData', name], () => getFuses(name), {
    enabled: ready && !skip && name !== '',
  })

  return {
    fuseData,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
