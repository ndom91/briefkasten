import { useState, useEffect } from 'react'

export default function Breadcrumbs({ breadcrumbs }) {
  const [currentBreadcrumb, setCurrentBreadcrumb] = useState(breadcrumbs)

  useEffect(() => {
    if (!breadcrumbs) {
      const path = window.location.pathname.trim().split('/').filter(Boolean)
      if (!path.length) {
        setCurrentBreadcrumb([
          {
            name: 'Dashboard',
            icon: `<svg className="h-4 w-4 shrink-0 fill-gray-500" aria-hidden="true" viewBox="0 0 256 256" > <path d="M184,32H72A16,16,0,0,0,56,48V224a8.1,8.1,0,0,0,4.1,7,7.6,7.6,0,0,0,3.9,1,7.9,7.9,0,0,0,4.2-1.2L128,193.4l59.7,37.4a8.3,8.3,0,0,0,8.2.2,8.1,8.1,0,0,0,4.1-7V48A16,16,0,0,0,184,32Z"></path> </svg>`,
          },
          {
            name: 'Bookmarks',
            icon: `<svg class="h-4 w-4 shrink-0 fill-gray-500" aria-hidden="true" viewBox="0 0 256 256"> <path d="M200,32H163.7a47.8,47.8,0,0,0-71.4,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32.1,32.1,0,0,1,32,32H96A32.1,32.1,0,0,1,128,32Z"></path> </svg>`,
          },
        ])
      } else {
        setCurrentBreadcrumb(path)
      }
    }
  }, [breadcrumbs])

  return (
    <nav aria-label="breadcrumb" className="hidden lg:block">
      <ul className="flex space-x-3 text-sm font-medium">
        {currentBreadcrumb?.map((breadcrumb, i) => (
          <li key={breadcrumb.name} className="flex items-center space-x-3">
            {i !== 0 && (
              <div
                aria-hidden="true"
                className="h-4 w-px rotate-12 rounded-full bg-gray-300"
              />
            )}
            <div className="flex items-center space-x-1 text-gray-800">
              {breadcrumb.icon ? (
                <svg
                  className="h-4 w-4 shrink-0 fill-gray-500"
                  dangerouslySetInnerHTML={{ __html: breadcrumb.icon }}
                />
              ) : null}
              <span>{breadcrumb.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  )
}
