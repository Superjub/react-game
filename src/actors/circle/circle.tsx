import React, { ReactElement } from "react";
import { ReplaySubject, takeUntil, timer } from "rxjs";
import { CircleProps } from "../../states/gameplay/gameplay";
import styles from './circle.module.css';

export class Circle extends React.Component<CircleProps, {}> {

    constructor(props: CircleProps) {
        super(props);
    }

    private onDestroy$: ReplaySubject<boolean> = new ReplaySubject(1);

    public render(): ReactElement {
        return (
            <circle id={this.props.id.toString()} className={styles.circle + ' ' + this.props.colour + '-circle'} cx={this.props.x} cy={this.props.y} r="25" fill={this.props.colour} onClick={this.props.onClick}></circle>
        )
    };

    componentDidMount(): void {
        timer(8000).pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(() => this.props.expired(this.props.colour === 'green', this.props.id));
    }

    componentWillUnmount(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }


};