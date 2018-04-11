import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from './howell-redux';
// 1. connect
// mapStateToProps --- state => state
// mapDispatchToProps --- {addGun}
const connect = (
  mapStateToProps = state => state,
  mapDispatchToProps = {}
) => Comp =>
  class ConnectComponent extends React.Component {
    static contextTypes = {
      store: PropTypes.object
    };
    constructor(props, context) {
      super(props, context);
      this.state = {
        props: {}
      };
      this.store = context.store;
    }
    componentDidMount() {
      this.store.subscribe(() => this.update());
      this.update();
    }
    update() {
      const stateProps = mapStateToProps(this.store.getState());
      const dispatchProps = bindActionCreators(
        mapDispatchToProps,
        this.store.dispatch
      );

      this.setState({
        props: {
          ...this.state.props,
          ...stateProps,
          ...dispatchProps
        }
      });
    }
    render() {
      return <Comp {...this.state.props} />;
    }
  };

class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      props: {}
    };
    this.store = props.store;
  }
  getChildContext() {
    return { store: this.store };
  }
  render() {
    return this.props.children;
  }
}

export { connect, Provider };
