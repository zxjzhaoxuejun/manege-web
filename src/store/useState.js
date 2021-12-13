import {mapState,createNamespacedHelpers,mapGetters} from 'vuex'
import {useMapper} from './useMapper'

export function useState(moduleName,mapper){
    let mapperFn=mapState
    if(typeof moduleName==='string'&&moduleName.length>0){
        mapperFn=createNamespacedHelpers(moduleName).mapState
    }
    return useMapper(mapper,mapperFn)
}

export function useGetters(moduleName,mapper){
    let mapperFn=mapGetters
    if(typeof moduleName==='string'&&moduleName.length>0){
        mapperFn=createNamespacedHelpers(moduleName).mapGetters
    }
    return useMapper(mapper,mapperFn)
}