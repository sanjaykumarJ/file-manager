import React, { useContext, useEffect, Fragment, useState } from 'react'
import TreeDataContext from './context'
import Tree from 'react-ui-tree';
import styled from "styled-components";
import Icon from "react-icons-kit";
import { folder } from "react-icons-kit/feather/folder";
import { file } from "react-icons-kit/feather/file";
import { folderPlus } from "react-icons-kit/feather/folderPlus";
import { fileMinus } from 'react-icons-kit/feather/fileMinus'
import { filePlus } from "react-icons-kit/feather/filePlus";
import { folderMinus } from 'react-icons-kit/feather/folderMinus';
import { edit2 } from 'react-icons-kit/feather/edit2'
import deepdash from "deepdash";
import _ from "lodash";
deepdash(_);

export const TreeView = () => {
  const context = useContext(TreeDataContext);
  const [showActions, setShowActions] = useState({});
  const { state, dispatch } = context;
  const getData = () => {
    fetch('data.json'
      , {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        dispatch({ type: 'LOAD_TREE', payload: myJson });
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const renderNode = node => {
    const Toolbar = styled.div`
  position: relative;
  display: flex;
  color: #d8e0f0;
  z-index: +1;
  /*border: 1px solid white;*/
  padding-bottom: 4px;
  i {
    margin-right: 5px;
    cursor: pointer;
  }
  i :hover {
    color: #d8e0f0;
  }
`;

    const FloatLeft = styled.span`
  padding-left: 4px;
  width: 100%;
`;

    const renderFileFolderToolbar = (isFolder, caption) => (
      <Toolbar>
        <FloatLeft>
          <Fragment>
            <Icon icon={isFolder ? folder : file} />
            <span onMouseEnter={() => setShowActions(node)}>{caption}</span>
            {(showActions.id === node.id) && renderActionButtons(node, isFolder)}
          </Fragment>
        </FloatLeft>
      </Toolbar>
    );

    const isFolder = node.children;

    return (
      <div>
        { renderFileFolderToolbar(isFolder, node.module)}
      </div>
    );
  };

  const handleChange = tree => {
    dispatch({ type: 'LOAD_TREE', payload: tree })
  }

  const renderActionButtons = (node, isFolder) => {
    return (<div className={'action-panel'}>
      {isFolder ? (<div><Icon
        title="New file"
        icon={filePlus}
        onClick={() => addItem("file", node)}
      /> <Icon
          title="New Folder"
          icon={folderPlus}
          onClick={() => addItem("folder", node)}
        /> <Icon
          title="New Folder"
          icon={folderMinus}
          onClick={() => deleteFromTree(node.id)}
        /></div>) : <Fragment>
        <Icon
          title="New file"
          icon={edit2}
          onClick={() => addItem("file", node)}
        />
        <Icon
          title="File Minus"
          icon={fileMinus}
          onClick={() => deleteFromTree(node.id)}
        />
      </Fragment>}
    </div>)
  }

  const addItem = (itemType, active) => {
    const tree = state.treeData;
    const newItem =
      itemType === "folder"
        ? {
          id: `root-${Date.now()}`,
          module: `New ${itemType}`,
          children: [],
          collapsed: false
        }
        : { id: `${Date.now()}`, leaf: true, module: `New ${itemType}` };

    const newTree = _.mapDeep(tree, (item) => {
      const cloneItem = Object.assign({}, item);
      if (cloneItem) {
        if (cloneItem.id === active.id && cloneItem.children) {
          // folder
          cloneItem.children.push(newItem);
        }
      }
      return cloneItem;
    });

    dispatch({ type: 'LOAD_TREE', payload: JSON.parse(JSON.stringify(newTree)) })
  };

  function deleteFromTree(id) {
    const o = state.treeData;
    function getNode(a, i) {
      if (a.id === id) {
        index = i;
        return true;
      }
      if (Array.isArray(a.children) && a.children.some(getNode)) {
        if (~index) {
          a.children.splice(index, 1);
          index = -1;
        }
        return true;
      }
    }

    var index = -1;
    [o].some(getNode);
  }

  return (
    <div className='tree'>{state.treeData && <Tree
      paddingLeft={20}
      tree={state.treeData}
      onChange={handleChange}
      renderNode={renderNode}
    />}</div>
  )
}