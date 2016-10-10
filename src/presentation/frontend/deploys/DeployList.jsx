import React, {PropTypes} from 'react';
import ReactPaginate from 'react-paginate';
import DeployRow from './DeployRow';
import PageLoader from '../ui/PageLoader';
import {deployPagination, pageLoader} from './DeployList.css';

function DeployList({isLoading, pagination, deploys, users, toggleDeployDetails, stack, loadDeploys}) {
  if (stack) {
    const paginationControl = (deploys && pagination.totalPages > 0) ? (
      <nav className={deployPagination}>
        <ReactPaginate pageNum={pagination.totalPages} marginPagesDisplayed={2} pageRangeDisplayed={5} clickCallback={loadDeploys}/>
      </nav>
    ) : null;
    return (
      <div>
        {isLoading ?
            <PageLoader className={pageLoader}/> :
            <div>
              {deploys && deploys.sort((thisDeploy, thatDeploy) => thatDeploy.id - thisDeploy.id).map(deploy =>
                <DeployRow key={deploy.id} deploy={deploy} user={users[deploy.id]} diff={stack.diff} toggleDeployDetails={toggleDeployDetails}/>
              )}
            </div>
        }
        {paginationControl}
      </div>
    );
  }
  if (isLoading) return <PageLoader className={pageLoader}/>;
  return <div/>;
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
