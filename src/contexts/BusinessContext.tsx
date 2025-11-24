import React, { createContext, useContext, useState, useEffect } from 'react'
import { useBusinesses } from '@/hooks/businesses'
import type { BusinessType } from '@/types/businesses'

interface BusinessContextType {
  currentBusiness: BusinessType | null
  setCurrentBusiness: (business: BusinessType | null) => void
  businesses: BusinessType[]
  isLoading: boolean
  switchBusiness: (businessId: string) => void
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined,
)

const STORAGE_KEY = 'orion_current_business_id'

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { businesses, isLoading } = useBusinesses()
  const [currentBusiness, setCurrentBusinessState] = useState<BusinessType | null>(null)

  // Initialize current business from localStorage or default to first business
  useEffect(() => {
    if (isLoading || businesses.length === 0) return

    const storedBusinessId = localStorage.getItem(STORAGE_KEY)

    if (storedBusinessId) {
      // Try to find the stored business
      const stored = businesses.find((b) => b.id === storedBusinessId)
      if (stored) {
        setCurrentBusinessState(stored)
        return
      }
    }

    // Fallback to first business
    if (businesses.length > 0) {
      setCurrentBusinessState(businesses[0])
      localStorage.setItem(STORAGE_KEY, businesses[0].id)
    }
  }, [businesses, isLoading])

  const setCurrentBusiness = (business: BusinessType | null) => {
    setCurrentBusinessState(business)
    if (business) {
      localStorage.setItem(STORAGE_KEY, business.id)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const switchBusiness = (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId)
    if (business) {
      setCurrentBusiness(business)
    }
  }

  return (
    <BusinessContext.Provider
      value={{
        currentBusiness,
        setCurrentBusiness,
        businesses,
        isLoading,
        switchBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusinessContext() {
  const context = useContext(BusinessContext)
  if (context === undefined) {
    throw new Error('useBusinessContext must be used within a BusinessProvider')
  }
  return context
}
