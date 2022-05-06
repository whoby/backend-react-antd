import React, { Component } from 'react'
import Search from './search'
import Grid from './grid'

class Index extends Component {
    state = {
        searchData: {}
    }

    onSearchChange = data => {
        this.setState({ searchData: data })
    }

    render() {
        return (
            <div>
                <Search onSearchChange={this.onSearchChange} />
                <Grid searchData={this.state.searchData} />
            </div>
        )
    }
}

export default Index
