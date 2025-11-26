import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import environmentsApi from '@/services/api/environments'
import type { EnvironmentType } from '@/types/environments'
import { MyError } from '@/services/api'

interface UseEnvironmentsProps {
  businessId: string
}

export function useEnvironments({ businessId }: UseEnvironmentsProps) {
  const queryClient = useQueryClient()

  const {
    data: environmentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['environments', businessId],
    queryFn: () => environmentsApi.getEnvironments(businessId),
    retry: 2,
    enabled: !!businessId,
  })

  const createEnvironment = useMutation({
    mutationFn: (data: { type: EnvironmentType; businessID: string }) =>
      environmentsApi.createEnvironment(data),
    onSuccess: (_data, variables) => {
      console.log('Environment created successfully:', variables.type)
      // Invalidate and refetch environment queries for this business
      queryClient.invalidateQueries({ queryKey: ['environments', businessId] })
    },
    onError: (error: MyError) => {
      console.error('Failed to create environment:', error.message)
    },
  })

  const rotateKeys = useMutation({
    mutationFn: (data: { type: EnvironmentType; businessID: string }) =>
      environmentsApi.rotateKeys(data),
    onSuccess: (_data, variables) => {
      console.log('Keys rotated successfully:', variables.type)
      // Invalidate and refetch environment queries for this business
      queryClient.invalidateQueries({ queryKey: ['environments', businessId] })
    },
    onError: (error: MyError) => {
      console.error('Failed to rotate keys:', error.message)
    },
  })

  return {
    environments: environmentsData?.environments || [],
    isLoading,
    error: error as MyError | null,
    createEnvironment,
    rotateKeys,
  }
}
