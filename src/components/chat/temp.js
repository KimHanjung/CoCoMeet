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

console.log(level.indexOf(1));

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