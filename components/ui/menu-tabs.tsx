import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface TabItem {
  text: string
  href: string
}

interface ButtonShapeTabsProps {
  tabs: TabItem[]
  onTabSelect?: (tab: TabItem) => void
}

const Tab = ({ 
  text, 
  selected, 
  setSelected, 
  isHovered, 
  setHovered 
}: { 
  text: string; 
  selected: boolean; 
  setSelected: () => void;
  isHovered: boolean;
  setHovered: (hovered: boolean) => void;
}) => {
  return (
    <button
      onClick={setSelected}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${
        selected
          ? ' text-mainDarkBackgroundV1'
          : 'text-mainBackgroundV1 hover:text-mainDarkBackgroundV1'
      } relative rounded-full px-2 py-1 text-xs font-bold uppercase transition-colors duration-200`}
    >
      <span className="relative z-10">{text}</span>
      
      {selected && (
        <motion.span
          layoutId="selectedTab"
          transition={{ 
            type: 'spring', 
            duration: 0.5, 
            bounce: 0.15,
            damping: 20,
            stiffness: 300
          }}
          className="absolute inset-0 z-0 rounded-full bg-mainBackgroundV1"
        />
      )}
      
      {!selected && isHovered && (
        <motion.span
          layoutId="hoverTab"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            type: 'spring', 
            duration: 0.3, 
            bounce: 0.1,
            damping: 25,
            stiffness: 400
          }}
          className="absolute inset-0 z-0 rounded-full bg-mainBackgroundV1"
        />
      )}
    </button>
  )
}

const ButtonShapeTabs = ({ tabs, onTabSelect }: ButtonShapeTabsProps) => {
  const pathname = usePathname()
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  
  // Determine which tab should be selected based on pathname
  const getSelectedTab = () => {
    // Special case for home route
    if (pathname === '/') {
      const homeTab = tabs.find(tab => tab.href === '/')
      return homeTab?.text || ''
    }
    
    // Find tab whose href is included in the current pathname
    const activeTab = tabs.find(tab => {
      if (tab.href === '/') return false // Don't match home for other routes
      return pathname.includes(tab.href)
    })
    
    return activeTab?.text || ''
  }
  
  const selected = getSelectedTab()
  
  return (
    <div className="mb-0 flex flex-wrap items-center gap-2 w-fit">
      {tabs.map((tab) => (
        <Link href={tab.href} key={tab.text} legacyBehavior passHref>
          <a tabIndex={-1} className="relative">
            <Tab
              text={tab.text}
              selected={selected === tab.text}
              isHovered={hoveredTab === tab.text}
              setSelected={() => {
                onTabSelect?.(tab)
              }}
              setHovered={(hovered) => {
                setHoveredTab(hovered ? tab.text : null)
              }}
            />
          </a>
        </Link>
      ))}
    </div>
  )
}

export default ButtonShapeTabs