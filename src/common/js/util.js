/**
 * 解析url参数
 * @example ?id=123&a=c
 * @return obj{id:123,a:b}
 * @author:SheldonYee
 */
export function urlParser(){
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if(arr){
        arr.forEach((item)=>{
            let tempArr = item.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        })
    }
    return obj;
}