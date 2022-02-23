import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './nav/NavMenu';
import { Background } from './Background';

export default class Layout extends React.PureComponent<{}, { children?: React.ReactNode }> {
    public render() {
        return (
            <React.Fragment>
                <NavMenu />
                <Container>
                    {this.props.children}
                </Container>
                <Background />
            </React.Fragment>
        );
    }
}