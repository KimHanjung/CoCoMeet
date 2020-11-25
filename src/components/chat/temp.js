var order = [1, 3, [5, [4, [6]], 9]];
var target = 4;
var result = [target];

var tree = [{id: '1', title: 'N1', parent: 'NULL'},
            {id: '2', title: 'N2', parent: 'NULL'},
            {id: '3', title: 'N3', parent: '2'},
            {id: '4', title: 'N4', parent: '2'},
            {id: '5', title: 'N4', parent: '4'},
            {id: '6', title: 'N4', parent: '4'},
            {id: '7', title: 'N4', parent: '2'},
            {id: '8', title: 'N5', parent: 'NULL'},
];
var level = [1, 2, 3, 4, 5, 6, 7, 8];

console.log(tree.map((cur) => cur.id==='3' ? cur.id='100' : cur.id));

function delBlock(arr, target, result) { // 삭제 할 block의 child로 묶인 배열을 result에 리턴, 삭제 된 order을 arr에 리턴
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

            
function delNode(tree, tree_id) { // tree에는 노드 지워진 상태로 update, 지우는 노드 id들 return
  let deletenodes = [tree_id];
  for(let i=0; i<tree.length; i++) {
    if(deletenodes.includes(tree[i].parent)) 
      deletenodes.push(tree[i].id);
  }
  return deletenodes;
}
let list = delNode(tree, '4');
console.log(list);
let ftree = tree.filter(i=>!list.includes(i.id));
console.log(ftree);

function rearrange(tree, sequence) { // tree들을 sequence 순서대로 재배치한 배열을 return
  let result = [];
  for(let i=0; i<sequence.length; i++) 
    result.push(tree[String(sequence[i])]);
  return result;
}

function getOrder(tree) {
  return tree.reduce((sequence, cur) => {
    sequence.push(cur.id);
    return sequence;
  }, []);
}

let resul = getOrder(tree);
console.log(resul);

let a = [1, 2, 3, 4, 5]

let b = [2, 4];
console.log(b.map(i=>a[i]));
/*

          <button class="w-5 h-5 mx-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline" value={"normal"} onClick={this.handleClick} > 
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" >
            <path d="M54.3,9.4L990,945.1l-44.3,44.3L10,53.8L54.3,9.4z"/><path d="M990,54.9L54.3,990.6L10,946.2L945.7,10.6L990,54.9z"/>
            </svg>
          </button>
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline" value={"bold"} onClick={this.handleClick} >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" >
            <path d="M832.8,561.3c-28.6-40.8-73.5-65.3-130.7-77.6c44.9-16.3,81.7-44.9,102.1-81.7c20.4-32.7,32.7-77.6,32.7-122.5c0-85.8-32.7-155.2-102.1-200.1C665.4,34.5,571.5,10,449,10H126.4v980H498c122.5,0,212.3-28.6,277.7-77.6c65.3-49,98-122.5,98-216.4C873.6,647,861.4,602.1,832.8,561.3z M351,185.6h93.9c53.1,0,89.8,12.3,118.4,28.6c28.6,16.3,40.8,49,40.8,89.8c0,36.7-12.3,65.3-40.8,85.7s-69.4,28.6-122.5,28.6H351V185.6z M608.2,785.8c-24.5,20.4-61.2,28.6-110.3,28.6H351v-245h147h8.2c49,0,85.7,12.3,106.2,32.7S645,655.2,645,696S632.7,765.4,608.2,785.8z"/>
            </svg>
          </button>
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline" value={"line-through"} onClick={this.handleClick} >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
            <path d="M990,493.9v-49H575.8V154.6H718c46.2,0,62.1,30.2,62.1,68.7h48.4V76.6H171.4v146.7h48.4c0-44.6,14.5-68.7,57.8-68.7h146.6v290.3H10v49h414.2v279.4c0,53.5-22.2,76.6-86.6,76.6H323v73.5h349.6v-73.5h-13.7c-67.7,0-83.1-22.4-83.1-76.6V493.9H990z"/>
            </svg>
          </button>
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline" value={"underline"} onClick={this.handleClick} >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
            <path d="M481.7,839.3c196.6-3.1,299.6-121.6,308.7-321.2V10h-72.6v508.1c-9.1,154.3-90.9,251.6-236.1,257.7c-139.2-6-220.7-103.4-235.8-257.7V10h-72.6v508.1C179.4,714.8,285.1,833.2,481.7,839.3z M100.7,917.4V990h798.5v-72.6H100.7z"/>
            </svg>
          </button>
*/