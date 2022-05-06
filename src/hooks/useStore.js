import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'

export default (name) => {
    return useContext(MobXProviderContext)[name]
}
