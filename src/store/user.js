import { observable, action } from 'mobx'

class UserStore {
    @observable userName

    constructor() {
        this.userName = window.sessionStorage.getItem('userName') || 'admin'
    }

    @action.bound
    saveUserName(data) {
        this.userName = data
        window.sessionStorage.setItem('userName', data)
    }
}

const userStore = new UserStore()

export { userStore }
