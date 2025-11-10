import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import environmentsApi from '@/services/api/environments'
import type { EnvironmentType } from '@/types/environments'
import { MyError } from '@/services/api'

export function useEnvironments() {
  const queryClient = useQueryClient()

  const {
    data: environmentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['environments'],
    queryFn: () => environmentsApi.getEnvironments(),
    retry: 2,
  })

  const createEnvironment = useMutation({
    mutationFn: (data: { type: EnvironmentType }) =>
      environmentsApi.createEnvironment(data),
    onSuccess: (_data, variables) => {
      console.log('Environment created successfully:', variables.type)
      // Invalidate and refetch any environment queries
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
    onError: (error: MyError) => {
      console.error('Failed to create environment:', error.message)
    },
  })

  const rotateKeys = useMutation({
    mutationFn: (data: { type: EnvironmentType }) =>
      environmentsApi.rotateKeys(data),
    onSuccess: (_data, variables) => {
      console.log('Keys rotated successfully:', variables.type)
      // Invalidate and refetch any environment queries
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
    onError: (error: MyError) => {
      console.error('Failed to rotate keys:', error.message)
    },
  })

  return {
    environments: (environmentsData as any)?.environments || [],
    isLoading,
    error: error as MyError | null,
    createEnvironment,
    rotateKeys,
  }
}
