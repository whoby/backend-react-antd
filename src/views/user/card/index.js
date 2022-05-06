import React, { useState, useEffect, useCallback, useRef } from 'react'
import useDeepEffect from 'use-deep-compare-effect'
import ajax from '@/libs/ajax'
import Search from './search'
import Add from './add'
import Grid from './grid'

const Index = () => {
    let [cardType, setCardType] = useState({})
    let [searchData, setSearchData] = useState({})

    let isUnmounted = useRef(false)

    let getCardType = useCallback(() => {
        ajax.post('/user/card/type', {}, (cardType) => {
            if (!isUnmounted.current) {
                setCardType(cardType)
            }
        })
    }, [])

    useEffect(() => {
        isUnmounted.current = false
        getCardType()
        return () => (isUnmounted.current = true)
    }, [getCardType])

    const onSearchChange = useCallback((searchData) => {
        if (!isUnmounted.current) {
            setSearchData(searchData)
        }
    }, [])

    const onAddSave = () => {
        setSearchData({})
    }

    return (
        <div>
            <Search cardType={cardType} onSearchChange={onSearchChange} />
            <Add cardType={cardType} onAddSave={onAddSave} />
            <Grid cardType={cardType} searchData={searchData} />
        </div>
    )
}

export default Index
