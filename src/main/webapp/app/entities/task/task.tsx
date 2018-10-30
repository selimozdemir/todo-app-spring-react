import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import {
  Translate,
  translate,
  ICrudSearchAction,
  ICrudGetAllAction,
  TextFormat,
  getSortState,
  IPaginationBaseState,
  getPaginationItemsNumber,
  JhiPagination
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './task.reducer';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

const Child = ({ task, index, match, depth }) => {
  if (Array.isArray(task.parents)) {
    return (
      <React.Fragment>
        <Template task={task} i={index} match={match} depth={depth} />
        {task.parents.map((node, i) => {
          return <Child task={node} key={i + index} index={i} match={match} depth={depth + 1} />;
        })}
      </React.Fragment>
    );
  }

  return null;
};

const Template = ({ task, i, match, depth }) => {
  return (
    <tr key={`entity-${i}`}>
      <td>
        <Button tag={Link} to={`${match.url}/${task.id}`} color="link" size="sm">
          {task.id}
        </Button>
      </td>
      <td>{'--> '.repeat(depth) + task.name}</td>
      <td>{task.description}</td>
      <td>
        <TextFormat type="date" value={task.createDate} format={APP_DATE_FORMAT} />
      </td>
      <td>
        <TextFormat type="date" value={task.deadline} format={APP_DATE_FORMAT} />
      </td>
      <td>
        <Translate contentKey={`todoListApp.Status.${task.status}`} />
      </td>
      <td>{task.user ? task.user.login : ''}</td>
      <td>{task.task ? <Link to={`task/${task.task.id}`}>{task.task.name}</Link> : ''}</td>
      <td className="text-right">
        <div className="btn-group flex-btn-group-container">
          {task.status === 'INPROGRESS' ? (
            <Button tag={Link} to={`${match.url}/${task.id}/complete`} color="success" size="sm">
              <FontAwesomeIcon icon="check" />{' '}
              <span className="d-none d-md-inline">
                <Translate contentKey="entity.action.complete">Complete</Translate>
              </span>
            </Button>
          ) : null}
          <Button tag={Link} to={`${match.url}/${task.id}`} color="info" size="sm">
            <FontAwesomeIcon icon="eye" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.view">View</Translate>
            </span>
          </Button>
          <Button tag={Link} to={`${match.url}/${task.id}/edit`} color="primary" size="sm">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
          <Button tag={Link} to={`${match.url}/${task.id}/delete`} color="danger" size="sm">
            <FontAwesomeIcon icon="trash" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.delete">Delete</Translate>
            </span>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export interface ITaskProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface ITaskState extends IPaginationBaseState {
  search: string;
}

export class Task extends React.Component<ITaskProps, ITaskState> {
  state: ITaskState = {
    search: '',
    ...getSortState(this.props.location, ITEMS_PER_PAGE)
  };

  componentDidMount() {
    this.getEntities();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  };

  clear = () => {
    this.props.getEntities();
    this.setState({
      search: ''
    });
  };

  handleSearch = event => this.setState({ search: event.target.value });

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.sortEntities()
    );
  };

  sortEntities() {
    this.getEntities();
    this.props.history.push(`${this.props.location.pathname}?page=${this.state.activePage}&sort=${this.state.sort},${this.state.order}`);
  }

  handlePagination = activePage => this.setState({ activePage }, () => this.sortEntities());

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  render() {
    const { taskList, match, totalItems } = this.props;
    return (
      <div>
        <h2 id="task-heading">
          <Translate contentKey="todoListApp.task.home.title">Tasks</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="todoListApp.task.home.createLabel">Create new Task</Translate>
          </Link>
        </h2>
        <Row>
          <Col sm="12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput
                    type="text"
                    name="search"
                    value={this.state.search}
                    onChange={this.handleSearch}
                    placeholder={translate('todoListApp.task.home.search')}
                  />
                  <Button className="input-group-addon">
                    <FontAwesomeIcon icon="search" />
                  </Button>
                  <Button type="reset" className="input-group-addon" onClick={this.clear}>
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                </InputGroup>
              </AvGroup>
            </AvForm>
          </Col>
        </Row>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={this.sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('name')}>
                  <Translate contentKey="todoListApp.task.name">Name</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('description')}>
                  <Translate contentKey="todoListApp.task.description">Description</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('createDate')}>
                  <Translate contentKey="todoListApp.task.createDate">Create Date</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('deadline')}>
                  <Translate contentKey="todoListApp.task.deadline">Deadline</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('status')}>
                  <Translate contentKey="todoListApp.task.status">Status</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="todoListApp.task.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="todoListApp.task.task">Task</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.search
                ? taskList.map((task, i) => <Template key={i} task={task} i={i} match={match} depth={0} />)
                : taskList.filter(task => !task.task).map((task, i) => <Child task={task} key={i} index={i} match={match} depth={0} />)}
            </tbody>
          </Table>
        </div>
        <Row className="justify-content-center">
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, this.state.itemsPerPage)}
            activePage={this.state.activePage}
            onSelect={this.handlePagination}
            maxButtons={5}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ task }: IRootState) => ({
  taskList: task.entities,
  totalItems: task.totalItems
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);
