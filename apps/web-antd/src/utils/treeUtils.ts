type Fn = (node: any, parentNode?: any) => any;

interface TreeHelperConfig {
  id: string;
  parentId: string;
  children: string;
}
// 默认配置
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  parentId: 'parentId',
  children: 'children',
};

// 获取配置。  Object.assign 从一个或多个源对象复制到目标对象
const getConfig = (config: Partial<TreeHelperConfig>) =>
  Object.assign({}, DEFAULT_CONFIG, config);

/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
export function eachTree(treeDatas: any[], callBack: Fn, parentNode = {}) {
  treeDatas.forEach((element) => {
    const newNode = callBack(element, parentNode) || element;
    if (element.children) {
      eachTree(element.children, callBack, newNode);
    }
  });
}

/**
 * 树形结构需要存在id、parentId、name字段
 * 高性能树形结构查找（包含父节点）
 * @param {Array} tree - 树形结构数组
 * @param {string} filterText - 筛选文本
 * @param {boolean} includeSubtrees - 是否包含子树
 * @returns {Array} 筛选结果（包含父节点）返回树形结构
 */
export function optimizedFindNodesWithParents(
  tree: any[],
  filterText: string,
  idKey = 'id',
  parentKey = 'parentId',
  childrenKey = 'children',
  includeSubtrees = true,
) {
  if (!tree || tree.length === 0) return [];

  // 构建节点映射表（ID -> 节点） - O(n) 预处理
  const nodeMap = new Map();
  const rootNodes = [];

  // 迭代遍历构建映射表
  const queue = [...tree];
  while (queue.length > 0) {
    const node = queue.shift();
    nodeMap.set(node[idKey], node);

    // 记录根节点
    if (node[parentKey] === 0) {
      rootNodes.push(node);
    }

    // 将子节点加入队列
    if (node[childrenKey] && node[childrenKey].length > 0) {
      queue.push(...node[childrenKey]);
    }
  }

  // 结果集合（使用Set避免重复）
  const resultSet = new Set();
  // 需要添加的父节点ID集合
  const parentIdsToAdd = new Set();

  // 使用BFS查找匹配节点 - O(n)
  const searchQueue = [...tree];
  while (searchQueue.length > 0) {
    const node = searchQueue.shift();

    // 检查是否匹配
    if (node.name.includes(filterText)) {
      resultSet.add(node[idKey]);

      // 收集所有层级的父节点ID
      let parentId = node[parentKey];
      while (parentId !== 0) {
        if (!resultSet.has(parentId)) {
          parentIdsToAdd.add(parentId);
        }
        const parentItem = nodeMap.get(parentId);
        parentId = parentItem ? (parentItem[parentKey] ?? 0) : 0;
        // parentId = nodeMap.get(parentId)?.parentId ?? 0;
      }
    }

    // 将子节点加入搜索队列
    if (includeSubtrees && node[childrenKey] && node[childrenKey].length > 0) {
      searchQueue.push(...node[childrenKey]);
    }
  }

  // 添加所有需要的父节点 - O(m)，m为父节点数量
  parentIdsToAdd.forEach((parentId) => {
    const parentNode = nodeMap.get(parentId);
    if (parentNode) {
      resultSet.add(parentId);
    }
  });

  // 构建最终结果数组并复制节点（延迟复制）
  const result: any[] = [];
  resultSet.forEach((nodeId) => {
    const originalNode = nodeMap.get(nodeId);
    if (originalNode) {
      // 浅复制节点
      const nodeCopy = { ...originalNode };

      // 处理子节点
      if (!includeSubtrees || parentIdsToAdd.has(nodeId)) {
        // 对于父节点或不需要子树的情况，清空子节点
        nodeCopy[childrenKey] = [];
      } else if (includeSubtrees && originalNode[childrenKey]) {
        // 递归复制子树（仅包含结果中的节点）
        nodeCopy[childrenKey] = originalNode[childrenKey]
          .filter((child: any) => resultSet.has(child[idKey]))
          .map((child: any) => {
            const childCopy = { ...child };
            // 递归处理子节点的子节点
            if (child[childrenKey]) {
              childCopy[childrenKey] = child[childrenKey]
                .filter((grandChild: any) => resultSet.has(grandChild[idKey]))
                .map((grandChild: any) => ({ ...grandChild }));
            }
            return childCopy;
          });
      }

      result.push(nodeCopy);
    }
  });

  return buildTree(result);
}

/**
 * 通过ID和parentId数组生成树形结构
 * @param {Array} items - 包含id和parentId的对象数组
 * @param {string} idKey - ID字段名，默认为'id'
 * @param {string} parentKey - 父ID字段名，默认为'parentId'
 * @param {string} childrenKey - 子节点字段名，默认为'children'
 * @returns {Array} 树形结构数组
 */
export function buildTree(
  items: any[],
  idKey = 'id',
  parentKey = 'parentId',
  childrenKey = 'children',
) {
  // 创建ID到节点的映射表
  const idToNodeMap = new Map();

  // 第一步：将所有节点存入映射表
  items.forEach((item) => {
    // 创建节点的浅拷贝并添加children数组
    const node = { ...item, [childrenKey]: [] };
    idToNodeMap.set(item[idKey], node);
  });

  // 存储根节点
  const rootNodes: any[] = [];

  // 第二步：构建树结构
  items.forEach((item) => {
    const node = idToNodeMap.get(item[idKey]);

    // 处理根节点（parentId为0或不存在的节点）
    if (
      item[parentKey] === 0 ||
      !item[parentKey] ||
      !idToNodeMap.has(item[parentKey])
    ) {
      rootNodes.push(node);
    } else {
      // 将节点添加到其父节点的children数组中
      const parentNode = idToNodeMap.get(item[parentKey]);
      if (parentNode) {
        parentNode[childrenKey].push(node);
      }
    }
  });
  return rootNodes;
}

/**
 * 树形结构转换为列表结构
 * @param tree 树结构
 * @param config 配置
 * @returns
 */
export function treeToList<T = any>(
  tree: any,
  config: Partial<TreeHelperConfig> = {},
): T {
  if (!tree) {
    return [] as any;
  }
  config = getConfig(config);
  const { children } = config;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}

export function findParentNode(
  tree: any,
  childId: any,
  idKey = 'id',
  parentKey = 'parentId',
) {
  if (!tree) {
    return null;
  }

  // 1. 找到子节点
  const childNode = tree.find((node: any) => node[idKey] === childId);
  if (!childNode) {
    return null; // 子节点不存在
  }

  // 2. 获取 parentId
  const parentId = childNode[parentKey];

  // 3. 查找父节点
  const parentNode = tree.find((node: any) => node[idKey] === parentId);
  return parentNode || null; // 返回父节点或 null（如果不存在）
}

/**
 * 递归设置节点状态
 * @param tree
 * @param keysToCheck
 * @param checked
 */
export function setNodesChecked(
  tree: any,
  checkKeys: any[],
  checked: boolean,
  checkedKey = 'checked',
  idKey = 'id',
) {
  tree.forEach((node: any) => {
    if (checkKeys && checkKeys.length > 0) {
      if (checkKeys.includes(node[idKey])) {
        node[checkedKey] = checked;
      }
    } else {
      node[checkedKey] = checked;
    }
    if (node.children) {
      setNodesChecked(node.children, checkKeys, checked, checkedKey, idKey);
    }
  });
}

export function findRootNodeById(
  nodes: any,
  targetId: any,
  targetKey = 'id',
  parentKey = 'parentId',
  childrenKey = 'children',
) {
  for (const node of nodes) {
    // 如果找到匹配ID且是根节点
    if (node[targetKey] === targetId && node[parentKey] === null) {
      return node;
    }

    // 递归检查子节点
    if (node[childrenKey] && node[childrenKey].length > 0) {
      const found: any = findRootNodeById(node[childrenKey], targetId);
      if (found) return found;
    }
  }
  return null;
}

// 查找指定节点的函数
export function findNode(nodes: any, targetId: any) {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found: any = findNode(node.children, targetId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// 递归查找根节点的函数
export function findRootFromNode(
  node: any,
  tree: any,
  parentKey = 'parentId',
  level = 0,
  levelNum = 0,
) {
  if (
    !node[parentKey] ||
    node[parentKey] === null ||
    node[parentKey] === 0 ||
    node[parentKey] === '0'
  ) {
    return node; // 当前节点就是根节点
  }

  // 找到父节点
  const parentNode = findNode(tree, node[parentKey]);
  if (!parentNode) {
    throw new Error(`父节点 ${node[parentKey]} 不存在`);
  }
  levelNum++;
  if (level > 0 && level === levelNum) {
    return parentNode;
  }

  // 递归向上查找
  return findRootFromNode(parentNode, tree, parentKey, level, levelNum);
}
