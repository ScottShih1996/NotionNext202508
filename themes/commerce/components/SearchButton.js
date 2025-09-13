import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useRef } from 'react'

const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })

/**
 * 搜索按钮
 * @returns
 */
export default function SearchButton(props) {
  const { locale } = useGlobal()
  const router = useRouter()
  const searchModal = useRef(null)

  function handleSearch() {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      router.push('/search')
    }
  }

  return (
    <>
      <div
        onClick={handleSearch}
        title={locale.NAV.SEARCH}
        alt={locale.NAV.SEARCH}
        className='flex justify-center items-center w-7 h-7 cursor-pointer transform hover:scale-105 duration-200 dark:text-gray-200 mr-1 flex text-lg space-x-4 font-serif'
      >         
        <i className='fa-solid fa-magnifying-glass' /> <p class="list-inline-item">搜尋</p>
      </div>
      <AlgoliaSearchModal cRef={searchModal} {...props} />
    </>
  )
}
