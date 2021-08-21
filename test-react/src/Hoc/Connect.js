import React, { Component } from 'react';

function Connect(Com, someThing) {
    return class WrappedComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                num: 1
            };
        }

        handleChange() {
            console.log(someThing)
            this.setState({ num: this.state.num + 1 });
        }

        render() {
            return (
                <Com
                    num={ this.state.num }
                    handleChange={ () => this.handleChange() }
                    { ...this.props }
                />
            );
        }
    }
}

export default Connect