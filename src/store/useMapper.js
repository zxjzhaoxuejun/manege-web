import {computed} from 'vue'
import {useStore} from 'vuex'

export function useMapper(mapper,mapFn){
    //获取store
    const store=useStore()
    //获取对应的对象functions:{name:fun1,age:fun2}
    const storeStateFns=mapFn(mapper)

    //对数据进行转换
    const storeState={}
    Object.keys(storeStateFns).forEach(fnkey=>{
        const fn =storeStateFns[fnkey].bind({$store:store})
        console.log(fn)
        storeState[fnkey]=computed(fn)
    })
    return storeState
}