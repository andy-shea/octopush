import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import DeployRow from './DeployRow';
import PageLoader from '../ui/PageLoader';

const DeployPagination = styled.nav`
  margin-top: 2em;
  user-select: none;

  & ul {
    display: inline-block;
    margin-left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-weight: bold;
  }

  & li {
    display: inline-block;
    margin: 0 0.5em;
    width: 2em;
    height: 2em;
    line-height: 1.8em;
    overflow: hidden;
  }

  & a:focus {
    outline: none;
  }

  & li.selected {
    border: 1px solid var(--color-grey-10);
    background: var(--color-white);
  }

  & li.disabled {
    color: var(--color-grey-30);
  }

  & li:not(.disabled) {
    cursor: pointer;
  }
`;

const DeployPageLoader = styled(PageLoader)`
  margin: 5em auto 7em;
`;

function renderPaginationControl(deploys, {totalPages, page}, loadDeploys) {
  if (!deploys || totalPages <= 1) return null;
  return (
    <DeployPagination>
      <ReactPaginate initialPage={page - 1} pageCount={totalPages} marginPagesDisplayed={2}
        pageRangeDisplayed={5} onPageChange={loadDeploys} disableInitialCallback/>
    </DeployPagination>
  );
}

function DeployList({isLoading, pagination, deploys, users, toggleDeployDetails, stack, loadDeploys}) {
  if (stack) {
    return (
      <React.Fragment>
        {isLoading
          ? <DeployPageLoader/>
          : (
            deploys && deploys.sort((thisDeploy, thatDeploy) => thatDeploy.id - thisDeploy.id).map(deploy =>
              <DeployRow key={deploy.id} deploy={deploy} user={users[deploy.id]} diff={stack.diff} toggleDeployDetails={toggleDeployDetails}/>
            )
          )
        }
        {pagination && renderPaginationControl(deploys, pagination, loadDeploys)}
      </React.Fragment>
    );
  }
  if (isLoading) return <DeployPageLoader/>;
  return null;
}

DeployList.propTypes = {
  toggleDeployDetails: PropTypes.func.isRequired,
  stack: PropTypes.object,
  pagination: PropTypes.object,
  isLoading: PropTypes.bool,
  loadDeploys: PropTypes.func,
  users: PropTypes.object,
  deploys: PropTypes.array
};

export default DeployList;
