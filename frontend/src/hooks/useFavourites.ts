import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { favouritesApi } from '../api/favourites.api'
import toast from 'react-hot-toast'

export function useFavourites() {
  return useQuery({
    queryKey: ['favourites'],
    queryFn: () => favouritesApi.getAll().then((r) => r.data.data?.favourites ?? []),
  })
}

export function useToggleFavourite() {
  const qc = useQueryClient()
  const { data: favs = [] } = useFavourites()

  const addMutation = useMutation({
    mutationFn: (mealDbId: string) => favouritesApi.add(mealDbId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['favourites'] }); toast.success('Added to favourites') },
    onError: () => toast.error('Could not add to favourites'),
  })

  const removeMutation = useMutation({
    mutationFn: (mealDbId: string) => favouritesApi.remove(mealDbId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['favourites'] }); toast.success('Removed from favourites') },
    onError: () => toast.error('Could not remove from favourites'),
  })

  const isFavourited = (mealDbId: string) =>
    favs.some((f) => f.recipeId.mealDbId === mealDbId)

  const toggle = (mealDbId: string) => {
    if (isFavourited(mealDbId)) {
      removeMutation.mutate(mealDbId)
    } else {
      addMutation.mutate(mealDbId)
    }
  }

  return { toggle, isFavourited, isLoading: addMutation.isPending || removeMutation.isPending }
}
