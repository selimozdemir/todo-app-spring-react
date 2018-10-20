import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntities as getTasks } from 'app/entities/task/task.reducer';
import { getEntity, updateEntity, createEntity, reset } from './task.reducer';
import { ITask } from 'app/shared/model/task.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITaskUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ITaskUpdateState {
  isNew: boolean;
  userId: string;
  taskId: string;
  parentId: string;
}

export class TaskUpdate extends React.Component<ITaskUpdateProps, ITaskUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      userId: '0',
      taskId: '0',
      parentId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getUsers();
    this.props.getTasks();
  }

  saveEntity = (event, errors, values) => {
    values.createDate = new Date(values.createDate);
    values.deadline = new Date(values.deadline);

    if (errors.length === 0) {
      const { taskEntity } = this.props;
      const entity = {
        ...taskEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/apps/task');
  };

  render() {
    const { taskEntity, users, tasks, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="todoListApp.task.home.createOrEditLabel">
              <Translate contentKey="todoListApp.task.home.createOrEditLabel">Create or edit a Task</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : taskEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="task-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    <Translate contentKey="todoListApp.task.name">Name</Translate>
                  </Label>
                  <AvField id="task-name" type="text" name="name" />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="description">
                    <Translate contentKey="todoListApp.task.description">Description</Translate>
                  </Label>
                  <AvField id="task-description" type="text" name="description" />
                </AvGroup>
                {!isNew ? (
                  <AvGroup>
                    <Label id="createDateLabel" for="createDate">
                      <Translate contentKey="todoListApp.task.createDate">Create Date</Translate>
                    </Label>
                    <AvInput
                      id="task-createDate"
                      type="datetime-local"
                      className="form-control"
                      name="createDate"
                      readOnly
                      value={isNew ? null : convertDateTimeFromServer(this.props.taskEntity.createDate)}
                    />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="deadlineLabel" for="deadline">
                    <Translate contentKey="todoListApp.task.deadline">Deadline</Translate>
                  </Label>
                  <AvInput
                    id="task-deadline"
                    type="datetime-local"
                    className="form-control"
                    name="deadline"
                    value={isNew ? null : convertDateTimeFromServer(this.props.taskEntity.deadline)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel">
                    <Translate contentKey="todoListApp.task.status">Status</Translate>
                  </Label>
                  <AvInput
                    id="task-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && taskEntity.status) || 'INPROGRESS'}
                  >
                    <option value="INPROGRESS">
                      <Translate contentKey="todoListApp.Status.INPROGRESS" />
                    </option>
                    <option value="COMPLETED">
                      <Translate contentKey="todoListApp.Status.COMPLETED" />
                    </option>
                    <option value="EXPIRED">
                      <Translate contentKey="todoListApp.Status.EXPIRED" />
                    </option>
                  </AvInput>
                </AvGroup>
                {/*<AvGroup>*/}
                {/*<Label for="user.id">*/}
                {/*<Translate contentKey="todoListApp.task.user">User</Translate>*/}
                {/*</Label>*/}
                {/*<AvInput id="task-user" type="select" className="form-control" name="user.id">*/}
                {/*<option value="" key="0" />*/}
                {/*{users*/}
                {/*? users.map(otherEntity => (*/}
                {/*<option value={otherEntity.id} key={otherEntity.id}>*/}
                {/*{otherEntity.id}*/}
                {/*</option>*/}
                {/*))*/}
                {/*: null}*/}
                {/*</AvInput>*/}
                {/*</AvGroup>*/}
                <AvGroup>
                  <Label for="task.id">
                    <Translate contentKey="todoListApp.task.task">Task</Translate>
                  </Label>
                  <AvInput id="task-task" type="select" className="form-control" name="task.id">
                    <option value="" key="0" />
                    {tasks
                      ? tasks.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/apps/task" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  tasks: storeState.task.entities,
  taskEntity: storeState.task.entity,
  loading: storeState.task.loading,
  updating: storeState.task.updating,
  updateSuccess: storeState.task.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getTasks,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskUpdate);
