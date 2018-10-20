import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './task.reducer';
import { ITask } from 'app/shared/model/task.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class TaskDetail extends React.Component<ITaskDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { taskEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="todoListApp.task.detail.title">Task</Translate> [<b>{taskEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="todoListApp.task.name">Name</Translate>
              </span>
            </dt>
            <dd>{taskEntity.name}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="todoListApp.task.description">Description</Translate>
              </span>
            </dt>
            <dd>{taskEntity.description}</dd>
            <dt>
              <span id="createDate">
                <Translate contentKey="todoListApp.task.createDate">Create Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={taskEntity.createDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="deadline">
                <Translate contentKey="todoListApp.task.deadline">Deadline</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={taskEntity.deadline} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="status">
                <Translate contentKey="todoListApp.task.status">Status</Translate>
              </span>
            </dt>
            <dd>{taskEntity.status}</dd>
            <dt>
              <Translate contentKey="todoListApp.task.user">User</Translate>
            </dt>
            <dd>{taskEntity.user ? taskEntity.user.login : ''}</dd>
            <dt>
              <Translate contentKey="todoListApp.task.task">Task</Translate>
            </dt>
            <dd>{taskEntity.task ? taskEntity.task.name : ''}</dd>
          </dl>
          <Button tag={Link} to="/apps/task" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/apps/task/${taskEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ task }: IRootState) => ({
  taskEntity: task.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskDetail);
