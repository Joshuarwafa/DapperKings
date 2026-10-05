import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

// Journal filters live in the URL (?q=&category=&tag=&month=&page=) so results are shareable.
export function useJournalFilters() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onList = pathname === '/journal'

  const filters = {
    query: params.get('q') || '',
    category: params.get('category'),
    tag: params.get('tag'),
    month: params.get('month'),
  }
  const page = Math.max(1, Number(params.get('page')) || 1)

  const update = (changes) => {
    const next = new URLSearchParams(onList ? params : undefined)
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
    const qs = next.toString()
    // From an article, go to the list; on the list, just update the URL
    navigate(`/journal${qs ? `?${qs}` : ''}`, { replace: onList, state: { keepScroll: onList } })
  }

  const setFilter = (key, value) => {
    const param = key === 'query' ? 'q' : key
    // Clicking the active category/tag/month again turns it off
    const nextValue = key === 'query' ? value : filters[key] === value ? null : value
    update({ [param]: nextValue, page: null })
  }

  return {
    filters,
    page,
    setFilter,
    setPage: (n) => update({ page: n > 1 ? String(n) : null }),
    clearFilters: () => navigate('/journal', { replace: onList, state: { keepScroll: onList } }),
  }
}
