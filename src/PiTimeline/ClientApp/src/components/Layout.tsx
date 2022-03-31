import * as React from 'react';
import { Container } from 'reactstrap';
import LoadingBar from 'react-top-loading-bar';
import NavMenu from './nav/NavMenu';
import { Background } from './Background';
import store from '../store';
import { setLoadingBarProgress } from '../services';

export default class Layout extends React.PureComponent<{}, { children?: React.ReactNode }> {
    public render() {
        const { loadingReducer } = store.getState();
        return (
            <React.Fragment>
                <LoadingBar
                    progress={loadingReducer.progress}
                    onLoaderFinished={() => store.dispatch(setLoadingBarProgress(0))} />
                <NavMenu />
                <Container>
                    {this.props.children}
                </Container>
                <Background />
            </React.Fragment>
        );
    }
}