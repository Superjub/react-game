import React, { ReactElement } from "react";
import { fromEvent, ReplaySubject, takeUntil } from "rxjs";
import styles from './title.module.css';

interface Props {
    updateState: Function
};

export class TitleScreen extends React.Component<Props, {} > {

    constructor(props: Props) {
        super(props);
    }

    private onDestroy$: ReplaySubject<boolean> = new ReplaySubject(1);

    componentDidMount(): void {
        fromEvent<KeyboardEvent>(document, 'keyup').pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(() => {
            this.props.updateState('gameplay')
        });
    };

    componentWillUnmount(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    public resizeScreen: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        console.log('resize window');
        window.resizeTo(800, 400);
    };

    public render(): ReactElement {
        return (
            <div className={styles.title}>
                <h1><strong>REACT-ionary</strong></h1>
                <div>
                    <h3>Rules:</h3>
                    <ul>
                        <li>Clicking on green circles awards 10 points.</li>
                        <li>Clicking on red circles decrease your lives by 1.</li>
                        <li>Clicking on yellow circles award one life.</li>
                        <li>Leave a red circle alone for too long and it'll disappear.</li>
                        <li>Leave a green circle alone for too long and it'll explode taking away one life.</li>
                    </ul>
                </div>
                <small>Press any key to start.</small>
            </div>
        )
    };


};