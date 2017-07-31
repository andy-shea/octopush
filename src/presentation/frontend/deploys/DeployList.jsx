import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import DeployRow from './DeployRow';
import PageLoader from '../ui/PageLoader';
import {deployPagination, pageLoader} from './DeployList.css';

function renderPaginationControl(deploys, {totalPages, page}, loadDeploys) {
  if (!deploys || totalPages === 1) return null;
  return (
    <nav className={deployPagination}>
      <ReactPaginate initialPage={page - 1} pageCount={totalPages} marginPagesDisplayed={2}
        pageRangeDisplayed={5} onPageChange={loadDeploys} disableInitialCallback/>
    </nav>
  );
}

function DeployList({isLoading, pagination, deploys, users, toggleDeployDetails, stack, loadDeploys}) {
  if (stack) {
    return (
      <div>
        {isLoading
          ? <PageLoader className={pageLoader}/>
          : (
            <div>
              {deploys && deploys.sort((thisDeploy, thatDeploy) => thatDeploy.id - thisDeploy.id).map(deploy =>
                <DeployRow key={deploy.id} deploy={deploy} user={users[deploy.id]} diff={stack.diff} toggleDeployDetails={toggleDeployDetails}/>
              )}
            </div>
          )
        }
        {renderPaginationControl(deploys, pagination, loadDeploys)}
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
