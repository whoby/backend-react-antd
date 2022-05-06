import React, { useState } from 'react'
import Search from './search'
import Grid from './grid'

const Index = () => {
    const [searchData, setSearchData] = useState({})

    return (
        <>
            <Search onSearchChange={(v) => setSearchData(v)} />
            <Grid searchData={searchData} />
        </>
    )
}

export default Index
