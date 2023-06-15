export function assetIsDefined<T>(val: T): asserts val is NonNullable<T>{
    if(!val){
        throw Error("asset is not defined"+val);
    }
}