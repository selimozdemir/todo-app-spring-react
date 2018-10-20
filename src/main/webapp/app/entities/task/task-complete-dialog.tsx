import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITask } from 'app/shared/model/task.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, completeEntity } from './task.reducer';

export interface ITaskCompleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class TaskCompleteDialog extends React.Component<ITaskCompleteDialogProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  confirmComplete = event => {
    this.props.completeEntity(this.props.taskEntity.id);
    this.handleClose(event);
  };

  handleClose = event => {
    event.stopPropagation();
    this.props.history.goBack();
  };

  render() {
    const { taskEntity } = this.props;
    return (
      <Modal isOpen toggle={this.handleClose}>
        <ModalHeader toggle={this.handleClose}>
          <Translate contentKey="entity.complete.title">Confirm complete operation</Translate>
        </ModalHeader>
        <ModalBody id="todoListApp.task.complete.question">
          <Translate contentKey="todoListApp.task.complete.question" interpolate={{ id: taskEntity.id }}>
            Are you sure you want to complete this Task?
          </Translate>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.handleClose}>
            <FontAwesomeIcon icon="ban" />
            &nbsp;
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button id="jhi-confirm-complete-task" color="info" onClick={this.confirmComplete}>
            <FontAwesomeIcon icon="trash" />
            &nbsp;
            <Translate contentKey="entity.action.complete">Complete</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = ({ task }: IRootState) => ({
  taskEntity: task.entity
});

const mapDispatchToProps = { getEntity, completeEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskCompleteDialog);
