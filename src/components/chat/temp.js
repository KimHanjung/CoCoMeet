var order = [1, 3, [5, [4, [6]], 9]];
var target = 4;
var result = [target];

function delBlock(arr, target, result) { // 삭제 할 block의 child로 묶인 배열을 리턴
    for(let i=0;i<arr.length;i++) {
        if(Array.isArray(arr[i])){
            delBlock(arr[i], target, result);
            if(Array.isArray(arr[i]) && !arr[i].length)
                arr.splice(i, 1);
        }
        else if(arr[i]===target){
            if(Array.isArray(arr[i+1])){
                result.push(arr[i+1])
                arr.splice(i, 2);
            }
            else
                arr.splice(i, 1);
        }
    }
}


function flat(arr) { // nested array를 flatten array로 변환
    return arr.reduce(
      (acc, val) =>
        Array.isArray(val) ? acc.concat(flat(val)) : acc.concat(val),
      [],
    );
  }

console.log('order: ', order);
delBlock(order, target, result);
console.log('target: ', target);
console.log('delete nodes: ', result);
console.log('flat version: ', flat(result));
console.log('deleted order: ', order);