import React, { Component } from 'react'
import ajax from 'libs/ajax'
import Search from './search'
import Add from './add'
import Grid from './grid'


class Index extends Component {
    state = {
        cardType: {},
        searchData: {}
    }

    componentWillMount() {
        this.mounted = true
    }

    componentDidMount() {
        ajax.post('/user/card/type', {}, (res) => {
            if (this.mounted) {
                this.setState({
                    cardType: res
                })
            }
        })
    }

    componentWillUnmount() {
        this.mounted = false
    }

    onSearchChange = (data) => {
        if (this.mounted) {
            this.setState({ searchData: data })
        }
    }

    onAddSave = () => {
        this.setState({
            searchData: {}
        })
    }

    render() {
        return (
            <div>
                <Search cardType={this.state.cardType} onSearchChange={this.onSearchChange} />
                <Add cardType={this.state.cardType} onAddSave={this.onAddSave} />
                <Grid cardType={this.state.cardType} searchData={this.state.searchData} />
            </div>
        )
    }
}

export default Index
